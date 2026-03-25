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
      pomo_sessions: {
        Row: {
          id: string
          user_id: string
          task_id: string | null
          type: string
          planned_duration: number
          actual_duration: number
          status: string
          started_at: string
          created_at: string
        }
        Insert: {
          id: string
          user_id: string
          task_id?: string | null
          type: string
          planned_duration: number
          actual_duration: number
          status: string
          started_at: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          task_id?: string | null
          type?: string
          planned_duration?: number
          actual_duration?: number
          status?: string
          started_at?: string
          created_at?: string
        }
        Relationships: []
      }
      session_interruptions: {
        Row: {
          id: string
          session_id: string
          interrupted_at: string
          resumed_at: string | null
          duration: number
          cause: string
        }
        Insert: {
          id?: string
          session_id: string
          interrupted_at: string
          resumed_at?: string | null
          duration: number
          cause: string
        }
        Update: {
          id?: string
          session_id?: string
          interrupted_at?: string
          resumed_at?: string | null
          duration?: number
          cause?: string
        }
        Relationships: []
      }
    }
    Views: {
      view_session_fqs: {
        Row: {
          session_id: string
          user_id: string
          task_id: string | null
          type: string
          status: string
          started_at: string
          planned_duration: number
          actual_duration: number
          pause_count: number
          total_pause_duration: number
          fqs_score: number
        }
        Insert: Record<string, never>
        Update: Record<string, never>
        Relationships: []
      }
    }
    Functions: {
      get_peak_flow_times: {
        Args: { p_user_id: string }
        Returns: {
          day_of_week: number
          hour_of_day: number
          high_focus_count: number
          avg_fqs: number
        }[]
      }
      get_distraction_leakage: {
        Args: { p_user_id: string; p_days?: number }
        Returns: {
          task_name: string
          total_focus_hours: number
          total_leakage_hours: number
          leakage_ratio: number
        }[]
      }
      get_fatigue_curve: {
        Args: { p_user_id: string; p_days?: number }
        Returns: {
          daily_sequence_number: number
          total_sessions: number
          abandoned_sessions: number
          abandon_rate: number
        }[]
      }
    }
    Enums: {
      [key: string]: any
    }
    CompositeTypes: {
      [key: string]: any
    }
  }
}
