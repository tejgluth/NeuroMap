export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  __InternalSupabase: {
    PostgrestVersion: "14.4"
  }
  public: {
    Tables: {
      favorites: {
        Row: {
          created_at: string
          place_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          place_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          place_id?: string
          user_id?: string
        }
        Relationships: []
      }
      places: {
        Row: {
          address: string
          best_times_to_visit: string[] | null
          category_id: Database["public"]["Enums"]["category_id"]
          common_triggers: string[] | null
          created_at: string
          helpful_accommodations: string[] | null
          id: string
          is_published: boolean
          lat: number
          lng: number
          name: string
          parent_tips: string[] | null
          seed_crowdedness: number | null
          seed_elevators: number | null
          seed_lighting: number | null
          seed_navigation: number | null
          seed_noise: number | null
          seed_overall: number | null
          seed_parking: number | null
          seed_staff_hospitality: number | null
          seed_stairs: number | null
          sensory_overview: string | null
          short_description: string
          slug: string
          updated_at: string
        }
        Insert: {
          address: string
          best_times_to_visit?: string[] | null
          category_id: Database["public"]["Enums"]["category_id"]
          common_triggers?: string[] | null
          created_at?: string
          helpful_accommodations?: string[] | null
          id?: string
          is_published?: boolean
          lat: number
          lng: number
          name: string
          parent_tips?: string[] | null
          seed_crowdedness?: number | null
          seed_elevators?: number | null
          seed_lighting?: number | null
          seed_navigation?: number | null
          seed_noise?: number | null
          seed_overall?: number | null
          seed_parking?: number | null
          seed_staff_hospitality?: number | null
          seed_stairs?: number | null
          sensory_overview?: string | null
          short_description?: string
          slug: string
          updated_at?: string
        }
        Update: {
          address?: string
          best_times_to_visit?: string[] | null
          category_id?: Database["public"]["Enums"]["category_id"]
          common_triggers?: string[] | null
          created_at?: string
          helpful_accommodations?: string[] | null
          id?: string
          is_published?: boolean
          lat?: number
          lng?: number
          name?: string
          parent_tips?: string[] | null
          seed_crowdedness?: number | null
          seed_elevators?: number | null
          seed_lighting?: number | null
          seed_navigation?: number | null
          seed_noise?: number | null
          seed_overall?: number | null
          seed_parking?: number | null
          seed_staff_hospitality?: number | null
          seed_stairs?: number | null
          sensory_overview?: string | null
          short_description?: string
          slug?: string
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          display_name: string
          id: string
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          display_name?: string
          id: string
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          display_name?: string
          id?: string
          updated_at?: string
        }
        Relationships: []
      }
      review_reports: {
        Row: {
          created_at: string
          id: string
          reason: string
          review_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          reason: string
          review_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          reason?: string
          review_id?: string
          user_id?: string
        }
        Relationships: []
      }
      reviews: {
        Row: {
          child_age_range: Database["public"]["Enums"]["child_age_range"] | null
          created_at: string
          display_name: string
          id: string
          is_hidden: boolean
          is_seed: boolean
          place_id: string
          rating_crowdedness: number | null
          rating_elevators: number | null
          rating_lighting: number | null
          rating_navigation: number | null
          rating_noise: number | null
          rating_overall: number | null
          rating_parking: number | null
          rating_staff_hospitality: number | null
          rating_stairs: number | null
          recommend: Database["public"]["Enums"]["yes_no"] | null
          review_text: string
          tags: Database["public"]["Enums"]["tag_id"][] | null
          updated_at: string
          user_id: string | null
          visit_time: Database["public"]["Enums"]["visit_time"] | null
        }
        Insert: {
          child_age_range?: Database["public"]["Enums"]["child_age_range"] | null
          created_at?: string
          display_name?: string
          id?: string
          is_hidden?: boolean
          is_seed?: boolean
          place_id: string
          rating_crowdedness?: number | null
          rating_elevators?: number | null
          rating_lighting?: number | null
          rating_navigation?: number | null
          rating_noise?: number | null
          rating_overall?: number | null
          rating_parking?: number | null
          rating_staff_hospitality?: number | null
          rating_stairs?: number | null
          recommend?: Database["public"]["Enums"]["yes_no"] | null
          review_text: string
          tags?: Database["public"]["Enums"]["tag_id"][] | null
          updated_at?: string
          user_id?: string | null
          visit_time?: Database["public"]["Enums"]["visit_time"] | null
        }
        Update: {
          child_age_range?: Database["public"]["Enums"]["child_age_range"] | null
          created_at?: string
          display_name?: string
          id?: string
          is_hidden?: boolean
          is_seed?: boolean
          place_id?: string
          rating_crowdedness?: number | null
          rating_elevators?: number | null
          rating_lighting?: number | null
          rating_navigation?: number | null
          rating_noise?: number | null
          rating_overall?: number | null
          rating_parking?: number | null
          rating_staff_hospitality?: number | null
          rating_stairs?: number | null
          recommend?: Database["public"]["Enums"]["yes_no"] | null
          review_text?: string
          tags?: Database["public"]["Enums"]["tag_id"][] | null
          updated_at?: string
          user_id?: string | null
          visit_time?: Database["public"]["Enums"]["visit_time"] | null
        }
        Relationships: []
      }
    }
    Views: {
      place_rating_summaries: {
        Row: {
          avg_crowdedness: number | null
          avg_elevators: number | null
          avg_lighting: number | null
          avg_navigation: number | null
          avg_noise: number | null
          avg_overall: number | null
          avg_parking: number | null
          avg_staff_hospitality: number | null
          avg_stairs: number | null
          community_review_count: number | null
          place_id: string | null
          review_count: number | null
          slug: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      get_places_with_ratings: {
        Args: Record<PropertyKey, never>
        Returns: {
          address: string
          avg_crowdedness: number | null
          avg_elevators: number | null
          avg_lighting: number | null
          avg_navigation: number | null
          avg_noise: number | null
          avg_overall: number | null
          avg_parking: number | null
          avg_staff_hospitality: number | null
          avg_stairs: number | null
          best_times_to_visit: string[] | null
          category_id: Database["public"]["Enums"]["category_id"]
          common_triggers: string[] | null
          community_review_count: number
          helpful_accommodations: string[] | null
          id: string
          lat: number
          lng: number
          name: string
          parent_tips: string[] | null
          review_count: number
          seed_crowdedness: number | null
          seed_elevators: number | null
          seed_lighting: number | null
          seed_navigation: number | null
          seed_noise: number | null
          seed_overall: number | null
          seed_parking: number | null
          seed_staff_hospitality: number | null
          seed_stairs: number | null
          sensory_overview: string | null
          short_description: string
          slug: string
        }[]
      }
    }
    Enums: {
      category_id:
        | "restaurant"
        | "cafe"
        | "park"
        | "beach"
        | "entertainment"
        | "retail"
        | "salon"
        | "doctor"
        | "dentist"
        | "tutoring"
        | "service"
      child_age_range: "0–3" | "4–7" | "8–12" | "13–17" | "18+"
      tag_id:
        | "quiet_morning"
        | "staff_supportive"
        | "crowded_after_school"
        | "bright_lights"
        | "easy_parking"
        | "predictable_layout"
        | "sensory_tools_helped"
        | "long_wait_time"
        | "music_overhead"
        | "strong_smells"
      visit_time: "Morning" | "Midday" | "Afternoon" | "Evening"
      yes_no: "yes" | "no"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

// App-friendly row aliases
export type PlaceRow = Database["public"]["Tables"]["places"]["Row"]
export type ProfileRow = Database["public"]["Tables"]["profiles"]["Row"]
export type ReviewRow = Database["public"]["Tables"]["reviews"]["Row"]
export type FavoriteRow = Database["public"]["Tables"]["favorites"]["Row"]
export type ReviewReportRow = Database["public"]["Tables"]["review_reports"]["Row"]

export type ReviewInsert = Database["public"]["Tables"]["reviews"]["Insert"]
export type ProfileUpdate = Database["public"]["Tables"]["profiles"]["Update"]

export type PlacesWithRatingsRow =
  Database["public"]["Functions"]["get_places_with_ratings"]["Returns"][number]
