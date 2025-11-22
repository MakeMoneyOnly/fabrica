export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: '13.0.5'
  }
  public: {
    Tables: {
      analytics_events: {
        Row: {
          created_at: string | null
          event_data: Json | null
          event_type: string
          id: string
          ip_address: unknown
          referrer: string | null
          session_id: string | null
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          event_data?: Json | null
          event_type: string
          id?: string
          ip_address?: unknown
          referrer?: string | null
          session_id?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          event_data?: Json | null
          event_type?: string
          id?: string
          ip_address?: unknown
          referrer?: string | null
          session_id?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'analytics_events_user_id_fkey'
            columns: ['user_id']
            isOneToOne: false
            referencedRelation: 'users'
            referencedColumns: ['id']
          },
        ]
      }
      download_links: {
        Row: {
          created_at: string | null
          download_count: number | null
          expires_at: string
          id: string
          max_downloads: number | null
          order_id: string | null
          product_id: string | null
          token: string
        }
        Insert: {
          created_at?: string | null
          download_count?: number | null
          expires_at: string
          id?: string
          max_downloads?: number | null
          order_id?: string | null
          product_id?: string | null
          token: string
        }
        Update: {
          created_at?: string | null
          download_count?: number | null
          expires_at?: string
          id?: string
          max_downloads?: number | null
          order_id?: string | null
          product_id?: string | null
          token?: string
        }
        Relationships: [
          {
            foreignKeyName: 'download_links_order_id_fkey'
            columns: ['order_id']
            isOneToOne: false
            referencedRelation: 'orders'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'download_links_product_id_fkey'
            columns: ['product_id']
            isOneToOne: false
            referencedRelation: 'products'
            referencedColumns: ['id']
          },
        ]
      }
      moderation_flags: {
        Row: {
          actioned_at: string | null
          actioned_by: string | null
          admin_notes: string | null
          created_at: string | null
          flagged_by: string | null
          id: string
          reason: string
          status: string | null
          target_id: string
          target_type: string
        }
        Insert: {
          actioned_at?: string | null
          actioned_by?: string | null
          admin_notes?: string | null
          created_at?: string | null
          flagged_by?: string | null
          id?: string
          reason: string
          status?: string | null
          target_id: string
          target_type: string
        }
        Update: {
          actioned_at?: string | null
          actioned_by?: string | null
          admin_notes?: string | null
          created_at?: string | null
          flagged_by?: string | null
          id?: string
          reason?: string
          status?: string | null
          target_id?: string
          target_type?: string
        }
        Relationships: [
          {
            foreignKeyName: 'moderation_flags_actioned_by_fkey'
            columns: ['actioned_by']
            isOneToOne: false
            referencedRelation: 'users'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'moderation_flags_flagged_by_fkey'
            columns: ['flagged_by']
            isOneToOne: false
            referencedRelation: 'users'
            referencedColumns: ['id']
          },
        ]
      }
      orders: {
        Row: {
          amount: number
          booking_datetime: string | null
          booking_timezone: string | null
          created_at: string | null
          creator_id: string | null
          currency: string | null
          customer_email: string
          customer_name: string
          customer_phone: string | null
          id: string
          ip_address: unknown
          metadata: Json | null
          order_number: string
          paid_at: string | null
          payment_provider: string
          payment_provider_id: string | null
          payment_status: string | null
          product_id: string | null
          refunded_at: string | null
          updated_at: string | null
          user_agent: string | null
        }
        Insert: {
          amount: number
          booking_datetime?: string | null
          booking_timezone?: string | null
          created_at?: string | null
          creator_id?: string | null
          currency?: string | null
          customer_email: string
          customer_name: string
          customer_phone?: string | null
          id?: string
          ip_address?: unknown
          metadata?: Json | null
          order_number?: string
          paid_at?: string | null
          payment_provider: string
          payment_provider_id?: string | null
          payment_status?: string | null
          product_id?: string | null
          refunded_at?: string | null
          updated_at?: string | null
          user_agent?: string | null
        }
        Update: {
          amount?: number
          booking_datetime?: string | null
          booking_timezone?: string | null
          created_at?: string | null
          creator_id?: string | null
          currency?: string | null
          customer_email?: string
          customer_name?: string
          customer_phone?: string | null
          id?: string
          ip_address?: unknown
          metadata?: Json | null
          order_number?: string
          paid_at?: string | null
          payment_provider?: string
          payment_provider_id?: string | null
          payment_status?: string | null
          product_id?: string | null
          refunded_at?: string | null
          updated_at?: string | null
          user_agent?: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'orders_creator_id_fkey'
            columns: ['creator_id']
            isOneToOne: false
            referencedRelation: 'users'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'orders_product_id_fkey'
            columns: ['product_id']
            isOneToOne: false
            referencedRelation: 'products'
            referencedColumns: ['id']
          },
        ]
      }
      products: {
        Row: {
          booking_type: string | null
          calendar_settings: Json | null
          cover_image_url: string | null
          created_at: string | null
          creator_id: string | null
          currency: string | null
          description: string | null
          duration_minutes: number | null
          external_url: string | null
          file_size: number | null
          file_type: string | null
          file_url: string | null
          id: string
          price: number | null
          revenue_total: number | null
          sales_count: number | null
          status: string | null
          title: string
          type: string
          updated_at: string | null
          views_count: number | null
        }
        Insert: {
          booking_type?: string | null
          calendar_settings?: Json | null
          cover_image_url?: string | null
          created_at?: string | null
          creator_id?: string | null
          currency?: string | null
          description?: string | null
          duration_minutes?: number | null
          external_url?: string | null
          file_size?: number | null
          file_type?: string | null
          file_url?: string | null
          id?: string
          price?: number | null
          revenue_total?: number | null
          sales_count?: number | null
          status?: string | null
          title: string
          type: string
          updated_at?: string | null
          views_count?: number | null
        }
        Update: {
          booking_type?: string | null
          calendar_settings?: Json | null
          cover_image_url?: string | null
          created_at?: string | null
          creator_id?: string | null
          currency?: string | null
          description?: string | null
          duration_minutes?: number | null
          external_url?: string | null
          file_size?: number | null
          file_type?: string | null
          file_url?: string | null
          id?: string
          price?: number | null
          revenue_total?: number | null
          sales_count?: number | null
          status?: string | null
          title?: string
          type?: string
          updated_at?: string | null
          views_count?: number | null
        }
        Relationships: [
          {
            foreignKeyName: 'products_creator_id_fkey'
            columns: ['creator_id']
            isOneToOne: false
            referencedRelation: 'users'
            referencedColumns: ['id']
          },
        ]
      }
      referral_commissions: {
        Row: {
          amount: number
          created_at: string | null
          id: string
          paid_at: string | null
          period_end: string
          period_start: string
          referral_id: string | null
          status: string | null
        }
        Insert: {
          amount: number
          created_at?: string | null
          id?: string
          paid_at?: string | null
          period_end: string
          period_start: string
          referral_id?: string | null
          status?: string | null
        }
        Update: {
          amount?: number
          created_at?: string | null
          id?: string
          paid_at?: string | null
          period_end?: string
          period_start?: string
          referral_id?: string | null
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'referral_commissions_referral_id_fkey'
            columns: ['referral_id']
            isOneToOne: false
            referencedRelation: 'referrals'
            referencedColumns: ['id']
          },
        ]
      }
      referrals: {
        Row: {
          commission_rate: number | null
          created_at: string | null
          id: string
          referred_user_id: string | null
          referrer_id: string | null
          status: string | null
          total_earned: number | null
        }
        Insert: {
          commission_rate?: number | null
          created_at?: string | null
          id?: string
          referred_user_id?: string | null
          referrer_id?: string | null
          status?: string | null
          total_earned?: number | null
        }
        Update: {
          commission_rate?: number | null
          created_at?: string | null
          id?: string
          referred_user_id?: string | null
          referrer_id?: string | null
          status?: string | null
          total_earned?: number | null
        }
        Relationships: [
          {
            foreignKeyName: 'referrals_referred_user_id_fkey'
            columns: ['referred_user_id']
            isOneToOne: false
            referencedRelation: 'users'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'referrals_referrer_id_fkey'
            columns: ['referrer_id']
            isOneToOne: false
            referencedRelation: 'users'
            referencedColumns: ['id']
          },
        ]
      }
      storefront_settings: {
        Row: {
          created_at: string | null
          custom_css: string | null
          domain_forwarding: string | null
          id: string
          primary_color: string | null
          seo_description: string | null
          seo_title: string | null
          show_fabrica_badge: boolean | null
          theme_name: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          custom_css?: string | null
          domain_forwarding?: string | null
          id?: string
          primary_color?: string | null
          seo_description?: string | null
          seo_title?: string | null
          show_fabrica_badge?: boolean | null
          theme_name?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          custom_css?: string | null
          domain_forwarding?: string | null
          id?: string
          primary_color?: string | null
          seo_description?: string | null
          seo_title?: string | null
          show_fabrica_badge?: boolean | null
          theme_name?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'storefront_settings_user_id_fkey'
            columns: ['user_id']
            isOneToOne: true
            referencedRelation: 'users'
            referencedColumns: ['id']
          },
        ]
      }
      users: {
        Row: {
          avatar_url: string | null
          bio: string | null
          clerk_user_id: string
          created_at: string | null
          email: string
          full_name: string | null
          id: string
          phone: string | null
          referral_code: string
          referred_by: string | null
          social_links: Json | null
          subscription_current_period_end: string | null
          subscription_plan: string | null
          subscription_status: string | null
          telebirr_account: string | null
          telebirr_verified: boolean | null
          trial_ends_at: string | null
          updated_at: string | null
          username: string | null
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          clerk_user_id: string
          created_at?: string | null
          email: string
          full_name?: string | null
          id?: string
          phone?: string | null
          referral_code?: string
          referred_by?: string | null
          social_links?: Json | null
          subscription_current_period_end?: string | null
          subscription_plan?: string | null
          subscription_status?: string | null
          telebirr_account?: string | null
          telebirr_verified?: boolean | null
          trial_ends_at?: string | null
          updated_at?: string | null
          username?: string | null
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          clerk_user_id?: string
          created_at?: string | null
          email?: string
          full_name?: string | null
          id?: string
          phone?: string | null
          referral_code?: string
          referred_by?: string | null
          social_links?: Json | null
          subscription_current_period_end?: string | null
          subscription_plan?: string | null
          subscription_status?: string | null
          telebirr_account?: string | null
          telebirr_verified?: boolean | null
          trial_ends_at?: string | null
          updated_at?: string | null
          username?: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'users_referred_by_fkey'
            columns: ['referred_by']
            isOneToOne: false
            referencedRelation: 'users'
            referencedColumns: ['id']
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      calculate_referral_commissions: {
        Args: { p_period_end: string; p_period_start: string }
        Returns: Json
      }
      create_user_with_referral: {
        Args: {
          p_clerk_user_id: string
          p_email: string
          p_full_name?: string
          p_phone?: string
          p_referred_by_code?: string
        }
        Returns: Json
      }
      generate_order_number: { Args: never; Returns: string }
      generate_referral_code: { Args: never; Returns: string }
      is_admin: { Args: never; Returns: boolean }
      process_payment: {
        Args: {
          p_amount: number
          p_order_id: string
          p_payment_provider_id: string
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, '__InternalSupabase'>

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, 'public'>]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema['Tables'] & DefaultSchema['Views'])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Views'])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Views'])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema['Tables'] & DefaultSchema['Views'])
    ? (DefaultSchema['Tables'] & DefaultSchema['Views'])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema['Tables']
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables']
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
    ? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema['Tables']
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables']
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
    ? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema['Enums']
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions['schema']]['Enums']
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions['schema']]['Enums'][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema['Enums']
    ? DefaultSchema['Enums'][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema['CompositeTypes']
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes']
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes'][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema['CompositeTypes']
    ? DefaultSchema['CompositeTypes'][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
