import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const quoteSchema = z.object({
  roomId: z.string().uuid(),
  checkIn: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  checkOut: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  addonIds: z.array(z.string().uuid()).max(20).default([]),
});

const bookingSchema = quoteSchema.extend({
  adults: z.number().int().min(1).max(2),
  children: z.number().int().min(0).max(2),
  guestName: z.string().trim().min(2).max(100),
  guestEmail: z.string().trim().email().max(255),
  guestPhone: z.string().trim().min(6).max(40),
  guestCountry: z.string().trim().max(80).optional().or(z.literal("")),
  arrivalTime: z.string().trim().max(40).optional().or(z.literal("")),
  specialRequests: z.string().trim().max(1000).optional().or(z.literal("")),
});

export type Quote = {
  nights: number;
  pricePerNight: number;
  roomTotal: number;
  addons: { id: string; name: string; price: number; priceType: string; total: number }[];
  addonsTotal: number;
  taxRate: number;
  taxes: number;
  total: number;
  available: boolean;
};

export const getQuote = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => quoteSchema.parse(input))
  .handler(async ({ data }): Promise<Quote> => {
    const { buildQuote } = await import("./booking.server");
    return buildQuote(data);
  });

export const createBooking = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => bookingSchema.parse(input))
  .handler(async ({ data }) => {
    const { placeBooking } = await import("./booking.server");
    return placeBooking(data);
  });

export const lookupBooking = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) =>
    z
      .object({
        reference: z.string().trim().min(4).max(24),
        email: z.string().trim().email().max(255),
      })
      .parse(input),
  )
  .handler(async ({ data }) => {
    const { findBooking } = await import("./booking.server");
    return findBooking(data.reference, data.email);
  });

export const cancelBooking = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) =>
    z
      .object({
        reference: z.string().trim().min(4).max(24),
        email: z.string().trim().email().max(255),
      })
      .parse(input),
  )
  .handler(async ({ data }) => {
    const { cancelGuestBooking } = await import("./booking.server");
    return cancelGuestBooking(data.reference, data.email);
  });
