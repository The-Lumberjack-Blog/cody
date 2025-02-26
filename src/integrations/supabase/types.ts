export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      api_keys: {
        Row: {
          created_at: string
          key: string
          name: string
        }
        Insert: {
          created_at?: string
          key: string
          name: string
        }
        Update: {
          created_at?: string
          key?: string
          name?: string
        }
        Relationships: []
      }
      assistant_config: {
        Row: {
          assistant_id: string
          created_at: string
          id: string
          instructions: string
          name: string
        }
        Insert: {
          assistant_id: string
          created_at?: string
          id?: string
          instructions: string
          name: string
        }
        Update: {
          assistant_id?: string
          created_at?: string
          id?: string
          instructions?: string
          name?: string
        }
        Relationships: []
      }
      chat_sessions: {
        Row: {
          assistant_id: string | null
          assistant_response: string | null
          created_at: string
          id: string
          thread_id: string | null
          user_input: string | null
        }
        Insert: {
          assistant_id?: string | null
          assistant_response?: string | null
          created_at?: string
          id?: string
          thread_id?: string | null
          user_input?: string | null
        }
        Update: {
          assistant_id?: string | null
          assistant_response?: string | null
          created_at?: string
          id?: string
          thread_id?: string | null
          user_input?: string | null
        }
        Relationships: []
      }
      cody: {
        Row: {
          apikey: boolean
          created_at: string
          email: string
          id: string
          ip_address: string
          paid: boolean
        }
        Insert: {
          apikey?: boolean
          created_at?: string
          email: string
          id?: string
          ip_address: string
          paid?: boolean
        }
        Update: {
          apikey?: boolean
          created_at?: string
          email?: string
          id?: string
          ip_address?: string
          paid?: boolean
        }
        Relationships: []
      }
      credit_transactions: {
        Row: {
          amount: number
          created_at: string
          id: string
          profile_id: string
          stripe_payment_id: string | null
          type: string
        }
        Insert: {
          amount: number
          created_at?: string
          id?: string
          profile_id: string
          stripe_payment_id?: string | null
          type: string
        }
        Update: {
          amount?: number
          created_at?: string
          id?: string
          profile_id?: string
          stripe_payment_id?: string | null
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "credit_transactions_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      customers: {
        Row: {
          affiliate: string | null
          can_contact: boolean | null
          "card[bin]": string | null
          "card[expiry_month]": string | null
          "card[expiry_year]": string | null
          "card[type]": string | null
          "card[visual]": string | null
          currency: string | null
          "custom_fields[Discord username]": string | null
          "custom_fields[I'm already on the Lumberjack Discord]": boolean | null
          "Discord username": string | null
          discover_fee_charged: boolean | null
          dispute_won: boolean | null
          disputed: boolean | null
          email: string | null
          full_name: string | null
          gumroad_fee: number | null
          "I'm already on the Lumberjack Discord": boolean | null
          id: number
          ip_country: string | null
          is_gift_receiver_purchase: boolean | null
          offer_code: string | null
          order_number: number | null
          permalink: string | null
          price: number | null
          product_id: string | null
          product_name: string | null
          product_permalink: string | null
          purchaser_id: number | null
          quantity: number | null
          referrer: string | null
          refunded: boolean | null
          resource_name: string | null
          sale_id: string | null
          sale_timestamp: string | null
          seller_id: string | null
          short_product_id: string | null
          test: boolean | null
          "url_params[_gl]": string | null
          welcome_sent: boolean | null
        }
        Insert: {
          affiliate?: string | null
          can_contact?: boolean | null
          "card[bin]"?: string | null
          "card[expiry_month]"?: string | null
          "card[expiry_year]"?: string | null
          "card[type]"?: string | null
          "card[visual]"?: string | null
          currency?: string | null
          "custom_fields[Discord username]"?: string | null
          "custom_fields[I'm already on the Lumberjack Discord]"?:
            | boolean
            | null
          "Discord username"?: string | null
          discover_fee_charged?: boolean | null
          dispute_won?: boolean | null
          disputed?: boolean | null
          email?: string | null
          full_name?: string | null
          gumroad_fee?: number | null
          "I'm already on the Lumberjack Discord"?: boolean | null
          id?: number
          ip_country?: string | null
          is_gift_receiver_purchase?: boolean | null
          offer_code?: string | null
          order_number?: number | null
          permalink?: string | null
          price?: number | null
          product_id?: string | null
          product_name?: string | null
          product_permalink?: string | null
          purchaser_id?: number | null
          quantity?: number | null
          referrer?: string | null
          refunded?: boolean | null
          resource_name?: string | null
          sale_id?: string | null
          sale_timestamp?: string | null
          seller_id?: string | null
          short_product_id?: string | null
          test?: boolean | null
          "url_params[_gl]"?: string | null
          welcome_sent?: boolean | null
        }
        Update: {
          affiliate?: string | null
          can_contact?: boolean | null
          "card[bin]"?: string | null
          "card[expiry_month]"?: string | null
          "card[expiry_year]"?: string | null
          "card[type]"?: string | null
          "card[visual]"?: string | null
          currency?: string | null
          "custom_fields[Discord username]"?: string | null
          "custom_fields[I'm already on the Lumberjack Discord]"?:
            | boolean
            | null
          "Discord username"?: string | null
          discover_fee_charged?: boolean | null
          dispute_won?: boolean | null
          disputed?: boolean | null
          email?: string | null
          full_name?: string | null
          gumroad_fee?: number | null
          "I'm already on the Lumberjack Discord"?: boolean | null
          id?: number
          ip_country?: string | null
          is_gift_receiver_purchase?: boolean | null
          offer_code?: string | null
          order_number?: number | null
          permalink?: string | null
          price?: number | null
          product_id?: string | null
          product_name?: string | null
          product_permalink?: string | null
          purchaser_id?: number | null
          quantity?: number | null
          referrer?: string | null
          refunded?: boolean | null
          resource_name?: string | null
          sale_id?: string | null
          sale_timestamp?: string | null
          seller_id?: string | null
          short_product_id?: string | null
          test?: boolean | null
          "url_params[_gl]"?: string | null
          welcome_sent?: boolean | null
        }
        Relationships: []
      }
      documents: {
        Row: {
          content: string | null
          embedding: string | null
          id: number
          metadata: Json | null
        }
        Insert: {
          content?: string | null
          embedding?: string | null
          id?: number
          metadata?: Json | null
        }
        Update: {
          content?: string | null
          embedding?: string | null
          id?: number
          metadata?: Json | null
        }
        Relationships: []
      }
      n8n_chat_histories: {
        Row: {
          id: number
          message: Json
          session_id: string
        }
        Insert: {
          id?: number
          message: Json
          session_id: string
        }
        Update: {
          id?: number
          message?: Json
          session_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          credits: number
          first_name: string | null
          id: string
          is_discord_member: boolean | null
          last_name: string | null
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          credits?: number
          first_name?: string | null
          id: string
          is_discord_member?: boolean | null
          last_name?: string | null
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          credits?: number
          first_name?: string | null
          id?: string
          is_discord_member?: boolean | null
          last_name?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      recovery: {
        Row: {
          attempt: boolean | null
          created_at: string
          date: string | null
          email: string | null
          id: number
        }
        Insert: {
          attempt?: boolean | null
          created_at?: string
          date?: string | null
          email?: string | null
          id?: number
        }
        Update: {
          attempt?: boolean | null
          created_at?: string
          date?: string | null
          email?: string | null
          id?: number
        }
        Relationships: []
      }
      specgen_estimates: {
        Row: {
          created_at: string
          est: number | null
          id: number
          spec_id: number | null
          step: string | null
        }
        Insert: {
          created_at?: string
          est?: number | null
          id?: number
          spec_id?: number | null
          step?: string | null
        }
        Update: {
          created_at?: string
          est?: number | null
          id?: number
          spec_id?: number | null
          step?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_spec_id"
            columns: ["spec_id"]
            isOneToOne: false
            referencedRelation: "specgen_raw"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "specgen_estimates_spec_id_fkey"
            columns: ["spec_id"]
            isOneToOne: false
            referencedRelation: "specgen_raw"
            referencedColumns: ["id"]
          },
        ]
      }
      specgen_prompts: {
        Row: {
          created_at: string
          id: number
          prompt: string | null
          type: string | null
        }
        Insert: {
          created_at?: string
          id?: number
          prompt?: string | null
          type?: string | null
        }
        Update: {
          created_at?: string
          id?: number
          prompt?: string | null
          type?: string | null
        }
        Relationships: []
      }
      specgen_raw: {
        Row: {
          artifact_notes: string | null
          created_at: string
          created_by: string | null
          difficulty: number | null
          future_scope: string | null
          id: number
          ito: string | null
          name: string | null
          project_brief: string | null
          requirements: string | null
          scale: number | null
          scope: string | null
          summary: string | null
          technical_spec: string | null
          tmm: string | null
          user_story: string | null
        }
        Insert: {
          artifact_notes?: string | null
          created_at?: string
          created_by?: string | null
          difficulty?: number | null
          future_scope?: string | null
          id?: number
          ito?: string | null
          name?: string | null
          project_brief?: string | null
          requirements?: string | null
          scale?: number | null
          scope?: string | null
          summary?: string | null
          technical_spec?: string | null
          tmm?: string | null
          user_story?: string | null
        }
        Update: {
          artifact_notes?: string | null
          created_at?: string
          created_by?: string | null
          difficulty?: number | null
          future_scope?: string | null
          id?: number
          ito?: string | null
          name?: string | null
          project_brief?: string | null
          requirements?: string | null
          scale?: number | null
          scope?: string | null
          summary?: string | null
          technical_spec?: string | null
          tmm?: string | null
          user_story?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "specgen_raw_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      thoughts: {
        Row: {
          characters: number | null
          created_at: string
          id: number
          thoughts: string | null
        }
        Insert: {
          characters?: number | null
          created_at?: string
          id?: number
          thoughts?: string | null
        }
        Update: {
          characters?: number | null
          created_at?: string
          id?: number
          thoughts?: string | null
        }
        Relationships: []
      }
      workflow: {
        Row: {
          category_id: string | null
          created_at: string | null
          created_by: string | null
          creator_avatar: string
          creator_name: string
          icon_urls: string[]
          id: string
          paid_or_free: string
          workflow_description: string
          workflow_name: string
          workflow_url: string
        }
        Insert: {
          category_id?: string | null
          created_at?: string | null
          created_by?: string | null
          creator_avatar: string
          creator_name: string
          icon_urls: string[]
          id?: string
          paid_or_free: string
          workflow_description: string
          workflow_name: string
          workflow_url: string
        }
        Update: {
          category_id?: string | null
          created_at?: string | null
          created_by?: string | null
          creator_avatar?: string
          creator_name?: string
          icon_urls?: string[]
          id?: string
          paid_or_free?: string
          workflow_description?: string
          workflow_name?: string
          workflow_url?: string
        }
        Relationships: [
          {
            foreignKeyName: "workflow_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "workflow_categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "workflow_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      workflow_categories: {
        Row: {
          category_url: string
          created_at: string | null
          full_url: string | null
          id: string
          name: string | null
          total_count_extracted: number | null
        }
        Insert: {
          category_url: string
          created_at?: string | null
          full_url?: string | null
          id?: string
          name?: string | null
          total_count_extracted?: number | null
        }
        Update: {
          category_url?: string
          created_at?: string | null
          full_url?: string | null
          id?: string
          name?: string | null
          total_count_extracted?: number | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      binary_quantize:
        | {
            Args: {
              "": string
            }
            Returns: unknown
          }
        | {
            Args: {
              "": unknown
            }
            Returns: unknown
          }
      halfvec_avg: {
        Args: {
          "": number[]
        }
        Returns: unknown
      }
      halfvec_out: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      halfvec_send: {
        Args: {
          "": unknown
        }
        Returns: string
      }
      halfvec_typmod_in: {
        Args: {
          "": unknown[]
        }
        Returns: number
      }
      hnsw_bit_support: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      hnsw_halfvec_support: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      hnsw_sparsevec_support: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      hnswhandler: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      ivfflat_bit_support: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      ivfflat_halfvec_support: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      ivfflathandler: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      l2_norm:
        | {
            Args: {
              "": unknown
            }
            Returns: number
          }
        | {
            Args: {
              "": unknown
            }
            Returns: number
          }
      l2_normalize:
        | {
            Args: {
              "": string
            }
            Returns: string
          }
        | {
            Args: {
              "": unknown
            }
            Returns: unknown
          }
        | {
            Args: {
              "": unknown
            }
            Returns: unknown
          }
      match_documents: {
        Args: {
          query_embedding: string
          match_count?: number
          filter?: Json
        }
        Returns: {
          id: number
          content: string
          metadata: Json
          similarity: number
        }[]
      }
      sparsevec_out: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      sparsevec_send: {
        Args: {
          "": unknown
        }
        Returns: string
      }
      sparsevec_typmod_in: {
        Args: {
          "": unknown[]
        }
        Returns: number
      }
      vector_avg: {
        Args: {
          "": number[]
        }
        Returns: string
      }
      vector_dims:
        | {
            Args: {
              "": string
            }
            Returns: number
          }
        | {
            Args: {
              "": unknown
            }
            Returns: number
          }
      vector_norm: {
        Args: {
          "": string
        }
        Returns: number
      }
      vector_out: {
        Args: {
          "": string
        }
        Returns: unknown
      }
      vector_send: {
        Args: {
          "": string
        }
        Returns: string
      }
      vector_typmod_in: {
        Args: {
          "": unknown[]
        }
        Returns: number
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

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
