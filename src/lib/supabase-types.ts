export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      appointments: {
        Row: {
          appointment_time: string
          client_name: string | null
          created_at: string
          created_by: string | null
          id: number
        }
        Insert: {
          appointment_time: string
          client_name?: string | null
          created_at?: string
          created_by?: string | null
          id?: number
        }
        Update: {
          appointment_time?: string
          client_name?: string | null
          created_at?: string
          created_by?: string | null
          id?: number
        }
        Relationships: []
      }
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
