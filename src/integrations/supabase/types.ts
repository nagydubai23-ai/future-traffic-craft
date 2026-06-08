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
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      blog_posts: {
        Row: {
          author: string | null
          body_ar: string | null
          body_en: string | null
          canonical_url: string | null
          category: string | null
          created_at: string
          excerpt: string | null
          faqs: Json | null
          id: string
          image_url: string | null
          is_published: boolean
          keywords: string | null
          meta_description: string | null
          meta_title: string | null
          og_image: string | null
          published_at: string | null
          reading_minutes: number | null
          slug: string
          title_ar: string
          title_en: string | null
          updated_at: string
        }
        Insert: {
          author?: string | null
          body_ar?: string | null
          body_en?: string | null
          canonical_url?: string | null
          category?: string | null
          created_at?: string
          excerpt?: string | null
          faqs?: Json | null
          id?: string
          image_url?: string | null
          is_published?: boolean
          keywords?: string | null
          meta_description?: string | null
          meta_title?: string | null
          og_image?: string | null
          published_at?: string | null
          reading_minutes?: number | null
          slug: string
          title_ar: string
          title_en?: string | null
          updated_at?: string
        }
        Update: {
          author?: string | null
          body_ar?: string | null
          body_en?: string | null
          canonical_url?: string | null
          category?: string | null
          created_at?: string
          excerpt?: string | null
          faqs?: Json | null
          id?: string
          image_url?: string | null
          is_published?: boolean
          keywords?: string | null
          meta_description?: string | null
          meta_title?: string | null
          og_image?: string | null
          published_at?: string | null
          reading_minutes?: number | null
          slug?: string
          title_ar?: string
          title_en?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      cities: {
        Row: {
          body: string | null
          compliance_info: string | null
          created_at: string
          display_order: number
          faqs: Json
          hero_description: string | null
          hero_title: string | null
          id: string
          image_url: string | null
          is_published: boolean
          keywords: string | null
          meta_description: string | null
          meta_title: string | null
          name_ar: string
          name_en: string | null
          og_image: string | null
          seo_content_ar: string | null
          seo_content_en: string | null
          slug: string
          updated_at: string
        }
        Insert: {
          body?: string | null
          compliance_info?: string | null
          created_at?: string
          display_order?: number
          faqs?: Json
          hero_description?: string | null
          hero_title?: string | null
          id?: string
          image_url?: string | null
          is_published?: boolean
          keywords?: string | null
          meta_description?: string | null
          meta_title?: string | null
          name_ar: string
          name_en?: string | null
          og_image?: string | null
          seo_content_ar?: string | null
          seo_content_en?: string | null
          slug: string
          updated_at?: string
        }
        Update: {
          body?: string | null
          compliance_info?: string | null
          created_at?: string
          display_order?: number
          faqs?: Json
          hero_description?: string | null
          hero_title?: string | null
          id?: string
          image_url?: string | null
          is_published?: boolean
          keywords?: string | null
          meta_description?: string | null
          meta_title?: string | null
          name_ar?: string
          name_en?: string | null
          og_image?: string | null
          seo_content_ar?: string | null
          seo_content_en?: string | null
          slug?: string
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          company: string | null
          created_at: string
          email: string | null
          full_name: string | null
          id: string
          phone: string | null
          updated_at: string
        }
        Insert: {
          company?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id: string
          phone?: string | null
          updated_at?: string
        }
        Update: {
          company?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          phone?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      projects: {
        Row: {
          city_id: string | null
          created_at: string
          description: string | null
          id: string
          image_url: string | null
          is_published: boolean
          location: string
          service: string
          service_id: string | null
          slug: string | null
          title: string
          title_ar: string | null
          title_en: string | null
          updated_at: string
        }
        Insert: {
          city_id?: string | null
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          is_published?: boolean
          location: string
          service: string
          service_id?: string | null
          slug?: string | null
          title: string
          title_ar?: string | null
          title_en?: string | null
          updated_at?: string
        }
        Update: {
          city_id?: string | null
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          is_published?: boolean
          location?: string
          service?: string
          service_id?: string | null
          slug?: string | null
          title?: string
          title_ar?: string | null
          title_en?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "projects_city_id_fkey"
            columns: ["city_id"]
            isOneToOne: false
            referencedRelation: "cities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "projects_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "services"
            referencedColumns: ["id"]
          },
        ]
      }
      quote_attachments: {
        Row: {
          created_at: string
          file_name: string | null
          file_url: string
          id: string
          request_id: string
        }
        Insert: {
          created_at?: string
          file_name?: string | null
          file_url: string
          id?: string
          request_id: string
        }
        Update: {
          created_at?: string
          file_name?: string | null
          file_url?: string
          id?: string
          request_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "quote_attachments_request_id_fkey"
            columns: ["request_id"]
            isOneToOne: false
            referencedRelation: "quote_requests"
            referencedColumns: ["id"]
          },
        ]
      }
      quote_requests: {
        Row: {
          city: string
          city_id: string | null
          client_id: string | null
          company: string | null
          created_at: string
          details: string
          district: string | null
          email: string
          file_names: string[]
          id: string
          is_read: boolean
          name: string
          phone: string
          service: string
          service_id: string | null
          status: Database["public"]["Enums"]["quote_status"]
          updated_at: string
        }
        Insert: {
          city: string
          city_id?: string | null
          client_id?: string | null
          company?: string | null
          created_at?: string
          details: string
          district?: string | null
          email: string
          file_names?: string[]
          id?: string
          is_read?: boolean
          name: string
          phone: string
          service: string
          service_id?: string | null
          status?: Database["public"]["Enums"]["quote_status"]
          updated_at?: string
        }
        Update: {
          city?: string
          city_id?: string | null
          client_id?: string | null
          company?: string | null
          created_at?: string
          details?: string
          district?: string | null
          email?: string
          file_names?: string[]
          id?: string
          is_read?: boolean
          name?: string
          phone?: string
          service?: string
          service_id?: string | null
          status?: Database["public"]["Enums"]["quote_status"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "quote_requests_city_id_fkey"
            columns: ["city_id"]
            isOneToOne: false
            referencedRelation: "cities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "quote_requests_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "services"
            referencedColumns: ["id"]
          },
        ]
      }
      services: {
        Row: {
          benefits: Json
          body: string | null
          content_ar: string | null
          content_en: string | null
          created_at: string
          description_ar: string | null
          description_en: string | null
          display_order: number
          faqs: Json
          hero_description: string | null
          icon: string | null
          icon_name: string | null
          id: string
          is_published: boolean
          keywords: string | null
          meta_description: string | null
          meta_title: string | null
          og_image: string | null
          process_steps: Json
          short_description: string | null
          slug: string
          title_ar: string
          title_en: string | null
          updated_at: string
        }
        Insert: {
          benefits?: Json
          body?: string | null
          content_ar?: string | null
          content_en?: string | null
          created_at?: string
          description_ar?: string | null
          description_en?: string | null
          display_order?: number
          faqs?: Json
          hero_description?: string | null
          icon?: string | null
          icon_name?: string | null
          id?: string
          is_published?: boolean
          keywords?: string | null
          meta_description?: string | null
          meta_title?: string | null
          og_image?: string | null
          process_steps?: Json
          short_description?: string | null
          slug: string
          title_ar: string
          title_en?: string | null
          updated_at?: string
        }
        Update: {
          benefits?: Json
          body?: string | null
          content_ar?: string | null
          content_en?: string | null
          created_at?: string
          description_ar?: string | null
          description_en?: string | null
          display_order?: number
          faqs?: Json
          hero_description?: string | null
          icon?: string | null
          icon_name?: string | null
          id?: string
          is_published?: boolean
          keywords?: string | null
          meta_description?: string | null
          meta_title?: string | null
          og_image?: string | null
          process_steps?: Json
          short_description?: string | null
          slug?: string
          title_ar?: string
          title_en?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      site_settings: {
        Row: {
          key: string
          updated_at: string
          value: string | null
        }
        Insert: {
          key: string
          updated_at?: string
          value?: string | null
        }
        Update: {
          key?: string
          updated_at?: string
          value?: string | null
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
      app_role: "admin" | "editor" | "user" | "client"
      quote_status: "pending" | "under_review" | "quote_sent" | "completed"
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
      app_role: ["admin", "editor", "user", "client"],
      quote_status: ["pending", "under_review", "quote_sent", "completed"],
    },
  },
} as const
