import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { siteContentQuery } from "@/lib/queries";
import { Reveal } from "@/components/site/Reveal";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export const Route = createFileRoute("/faq")({
  loader: ({ context }) => {
    context.queryClient.ensureQueryData(siteContentQuery);
  },
  head: () => ({
    meta: [
      { title: "Frequently asked questions — Markoni AI Stay" },
      { name: "description", content: "Check-in times, airport distance, cancellations, pets, longer stays and how booking works at Markoni AI Stay." },
      { property: "og:title", content: "Frequently asked questions — Markoni AI Stay" },
      { property: "og:description", content: "Everything guests usually ask before booking." },
      { property: "og:url", content: "/faq" },
    ],
    links: [{ rel: "canonical", href: "/faq" }],
  }),
  component: FaqPage,
});

function FaqPage() {
  const { data } = useSuspenseQuery(siteContentQuery);
  return (
    <div className="shell max-w-4xl pb-24 pt-36">
      <Reveal>
        <p className="eyebrow">Good to know</p>
        <h1 className="mt-5 font-display text-5xl sm:text-6xl">Questions, answered.</h1>
      </Reveal>
      <Accordion type="single" collapsible className="mt-14">
        {data.faqs.map((faq) => (
          <AccordionItem key={faq.question} value={faq.question}>
            <AccordionTrigger className="text-left font-display text-xl">{faq.question}</AccordionTrigger>
            <AccordionContent className="text-sm text-muted-foreground">{faq.answer}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
