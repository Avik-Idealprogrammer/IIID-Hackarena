import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Types
export interface Profile {
  id: string
  username: string
  full_name?: string
  avatar_url?: string
  total_earnings: number
  games_won: number
  games_played: number
  level: number
  rank: string
  created_at: string
  updated_at: string
}

export interface GameRoom {
  id: string
  title: string
  description?: string
  game: string
  entry_fee: number
  max_players: number
  current_players: number
  prize_pool: number
  start_date: string
  start_time: string
  difficulty: "Beginner" | "Intermediate" | "Expert"
  rules?: string
  status: "open" | "full" | "started" | "completed" | "cancelled"
  host_id: string
  created_at: string
  updated_at: string
  profiles?: Profile
}

export interface Registration {
  id: string
  user_id: string
  room_id: string
  payment_status: "pending" | "completed" | "failed" | "refunded"
  payment_amount: number
  payment_id?: string
  registered_at: string
  game_rooms?: GameRoom
}
