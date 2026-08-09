export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.15"
  }
  public: {
    Tables: {
      addons: {
        Row: {
          description: string | null
          id: string
          is_active: boolean
          name: string
          price: number
          price_type: string
          sort_order: number
        }
        Insert: {
          description?: string | null
          id?: string
          is_active?: boolean
          name: string
          price?: number
          price_type?: string
          sort_order?: number
        }
        Update: {
          description?: string | null
          id?: string
          is_active?: boolean
          name?: string
          price?: number
          price_type?: string
          sort_order?: number
        }
        Relationships: []
      }
      amenities: {
        Row: {
          category: string
          icon: string | null
          id: string
          is_available: boolean
          name: string
          sort_order: number
        }
        Insert: {
          category: string
          icon?: string | null
          id?: string
          is_available?: boolean
          name: string
          sort_order?: number
        }
        Update: {
          category?: string
          icon?: string | null
          id?: string
          is_available?: boolean
          name?: string
          sort_order?: number
        }
        Relationships: []
      }
      booking_addons: {
        Row: {
          addon_id: string | null
          booking_id: string
          id: string
          name: string
          price: number
          quantity: number
        }
        Insert: {
          addon_id?: string | null
          booking_id: string
          id?: string
          name: string
          price?: number
          quantity?: number
        }
        Update: {
          addon_id?: string | null
          booking_id?: string
          id?: string
          name?: string
          price?: number
          quantity?: number
        }
        Relationships: [
          {
            foreignKeyName: "booking_addons_addon_id_fkey"
            columns: ["addon_id"]
            isOneToOne: false
            referencedRelation: "addons"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "booking_addons_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
        ]
      }
      bookings: {
        Row: {
          addons_total: number
          adults: number
          arrival_time: string | null
          check_in: string
          check_out: string
          children: number
          created_at: string
          guest_country: string | null
          guest_email: string
          guest_name: string
          guest_phone: string
          id: string
          nights: number
          payment_status: string
          reference: string
          room_id: string
          room_total: number
          special_requests: string | null
          status: string
          taxes: number
          total: number
          updated_at: string
        }
        Insert: {
          addons_total?: number
          adults?: number
          arrival_time?: string | null
          check_in: string
          check_out: string
          children?: number
          created_at?: string
          guest_country?: string | null
          guest_email: string
          guest_name: string
          guest_phone: string
          id?: string
          nights: number
          payment_status?: string
          reference: string
          room_id: string
          room_total?: number
          special_requests?: string | null
          status?: string
          taxes?: number
          total?: number
          updated_at?: string
        }
        Update: {
          addons_total?: number
          adults?: number
          arrival_time?: string | null
          check_in?: string
          check_out?: string
          children?: number
          created_at?: string
          guest_country?: string | null
          guest_email?: string
          guest_name?: string
          guest_phone?: string
          id?: string
          nights?: number
          payment_status?: string
          reference?: string
          room_id?: string
          room_total?: number
          special_requests?: string | null
          status?: string
          taxes?: number
          total?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "bookings_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "rooms"
            referencedColumns: ["id"]
          },
        ]
      }
      contact_messages: {
        Row: {
          created_at: string
          email: string
          id: string
          is_read: boolean
          message: string
          name: string
          phone: string | null
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          is_read?: boolean
          message: string
          name: string
          phone?: string | null
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          is_read?: boolean
          message?: string
          name?: string
          phone?: string | null
        }
        Relationships: []
      }
      faqs: {
        Row: {
          answer: string
          id: string
          is_published: boolean
          question: string
          sort_order: number
        }
        Insert: {
          answer: string
          id?: string
          is_published?: boolean
          question: string
          sort_order?: number
        }
        Update: {
          answer?: string
          id?: string
          is_published?: boolean
          question?: string
          sort_order?: number
        }
        Relationships: []
      }
      gallery_images: {
        Row: {
          alt: string | null
          category: string
          id: string
          sort_order: number
          url: string
        }
        Insert: {
          alt?: string | null
          category?: string
          id?: string
          sort_order?: number
          url: string
        }
        Update: {
          alt?: string | null
          category?: string
          id?: string
          sort_order?: number
          url?: string
        }
        Relationships: []
      }
      highlights: {
        Row: {
          description: string | null
          icon: string | null
          id: string
          sort_order: number
          title: string
        }
        Insert: {
          description?: string | null
          icon?: string | null
          id?: string
          sort_order?: number
          title: string
        }
        Update: {
          description?: string | null
          icon?: string | null
          id?: string
          sort_order?: number
          title?: string
        }
        Relationships: []
      }
      house_rules: {
        Row: {
          id: string
          label: string
          sort_order: number
          value: string
        }
        Insert: {
          id?: string
          label: string
          sort_order?: number
          value: string
        }
        Update: {
          id?: string
          label?: string
          sort_order?: number
          value?: string
        }
        Relationships: []
      }
      inclusions: {
        Row: {
          category: string
          id: string
          item: string
          sort_order: number
        }
        Insert: {
          category: string
          id?: string
          item: string
          sort_order?: number
        }
        Update: {
          category?: string
          id?: string
          item?: string
          sort_order?: number
        }
        Relationships: []
      }
      nearby_places: {
        Row: {
          category: string
          description: string | null
          distance: string | null
          id: string
          map_url: string | null
          name: string
          sort_order: number
          travel_time: string | null
        }
        Insert: {
          category: string
          description?: string | null
          distance?: string | null
          id?: string
          map_url?: string | null
          name: string
          sort_order?: number
          travel_time?: string | null
        }
        Update: {
          category?: string
          description?: string | null
          distance?: string | null
          id?: string
          map_url?: string | null
          name?: string
          sort_order?: number
          travel_time?: string | null
        }
        Relationships: []
      }
      property_information: {
        Row: {
          group_name: string
          key: string
          label: string
          sort_order: number
          value: string | null
        }
        Insert: {
          group_name?: string
          key: string
          label: string
          sort_order?: number
          value?: string | null
        }
        Update: {
          group_name?: string
          key?: string
          label?: string
          sort_order?: number
          value?: string | null
        }
        Relationships: []
      }
      reviews: {
        Row: {
          body: string
          guest_name: string
          id: string
          is_published: boolean
          rating: number
          reviewed_on: string | null
          sort_order: number
          source: string | null
          stay_type: string | null
        }
        Insert: {
          body: string
          guest_name: string
          id?: string
          is_published?: boolean
          rating?: number
          reviewed_on?: string | null
          sort_order?: number
          source?: string | null
          stay_type?: string | null
        }
        Update: {
          body?: string
          guest_name?: string
          id?: string
          is_published?: boolean
          rating?: number
          reviewed_on?: string | null
          sort_order?: number
          source?: string | null
          stay_type?: string | null
        }
        Relationships: []
      }
      room_amenities: {
        Row: {
          amenity_id: string
          room_id: string
        }
        Insert: {
          amenity_id: string
          room_id: string
        }
        Update: {
          amenity_id?: string
          room_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "room_amenities_amenity_id_fkey"
            columns: ["amenity_id"]
            isOneToOne: false
            referencedRelation: "amenities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "room_amenities_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "rooms"
            referencedColumns: ["id"]
          },
        ]
      }
      room_images: {
        Row: {
          alt: string | null
          id: string
          room_id: string
          sort_order: number
          url: string
        }
        Insert: {
          alt?: string | null
          id?: string
          room_id: string
          sort_order?: number
          url: string
        }
        Update: {
          alt?: string | null
          id?: string
          room_id?: string
          sort_order?: number
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: "room_images_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "rooms"
            referencedColumns: ["id"]
          },
        ]
      }
      rooms: {
        Row: {
          bathroom: string | null
          bed_type: string | null
          created_at: string
          description: string | null
          hero_image: string | null
          id: string
          is_active: boolean
          max_guests: number
          name: string
          price_per_night: number
          room_size: string | null
          slug: string
          sort_order: number
          tagline: string | null
          updated_at: string
          view_note: string | null
        }
        Insert: {
          bathroom?: string | null
          bed_type?: string | null
          created_at?: string
          description?: string | null
          hero_image?: string | null
          id?: string
          is_active?: boolean
          max_guests?: number
          name: string
          price_per_night?: number
          room_size?: string | null
          slug: string
          sort_order?: number
          tagline?: string | null
          updated_at?: string
          view_note?: string | null
        }
        Update: {
          bathroom?: string | null
          bed_type?: string | null
          created_at?: string
          description?: string | null
          hero_image?: string | null
          id?: string
          is_active?: boolean
          max_guests?: number
          name?: string
          price_per_night?: number
          room_size?: string | null
          slug?: string
          sort_order?: number
          tagline?: string | null
          updated_at?: string
          view_note?: string | null
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "staff"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "staff"],
    },
  },
} as const
