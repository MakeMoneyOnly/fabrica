// Auto-generated Supabase types will be generated here once local Supabase is running
// Run: npx supabase gen types typescript --local > src/types/supabase.ts

export type Database = {
  public: {
    Tables: {
      // Database tables will be defined here
      // This is a placeholder until Supabase local environment is fully running
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

export type Tables<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Row']
export type Enums<T extends keyof Database['public']['Enums']> = Database['public']['Enums'][T]
