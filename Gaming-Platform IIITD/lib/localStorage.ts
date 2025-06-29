// Local storage utilities and dummy data
export interface Profile {
  id: string
  username: string
  email: string
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
  host_username?: string
  created_at: string
  updated_at: string
}

export interface Registration {
  id: string
  user_id: string
  room_id: string
  payment_status: "pending" | "completed" | "failed" | "refunded"
  payment_amount: number
  payment_id?: string
  registered_at: string
  game_room?: GameRoom
}

export interface ChatMessage {
  id: string
  user_id: string
  username: string
  message: string
  timestamp: string
  room_id?: string
}

export interface StoreItem {
  id: string
  name: string
  description: string
  price: number
  category: "gear" | "skins" | "accessories" | "merchandise"
  image_url: string
  in_stock: boolean
}

export interface LeaderboardEntry {
  id: string
  username: string
  total_earnings: number
  games_won: number
  games_played: number
  win_rate: number
  rank: string
  avatar_url?: string
}

// Initialize dummy data
export const initializeDummyData = () => {
  if (!localStorage.getItem("gamerooms")) {
    const dummyRooms: GameRoom[] = [
      {
        id: "1",
        title: "Battle Royale Championship",
        description: "Epic Fortnite tournament with massive prizes",
        game: "Fortnite",
        entry_fee: 25,
        max_players: 20,
        current_players: 15,
        prize_pool: 375,
        start_date: "2024-02-15",
        start_time: "20:00",
        difficulty: "Expert",
        rules: "No teaming, no stream sniping",
        status: "open",
        host_id: "host1",
        host_username: "ProGamer123",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: "2",
        title: "CS2 Tournament",
        description: "Competitive Counter-Strike 2 matches",
        game: "Counter-Strike 2",
        entry_fee: 15,
        max_players: 16,
        current_players: 8,
        prize_pool: 120,
        start_date: "2024-02-16",
        start_time: "18:30",
        difficulty: "Intermediate",
        rules: "Standard competitive rules",
        status: "open",
        host_id: "host2",
        host_username: "ESportsMaster",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: "3",
        title: "Rocket League 3v3",
        description: "Fast-paced car soccer action",
        game: "Rocket League",
        entry_fee: 10,
        max_players: 6,
        current_players: 4,
        prize_pool: 40,
        start_date: "2024-02-15",
        start_time: "19:00",
        difficulty: "Beginner",
        rules: "Fair play only",
        status: "open",
        host_id: "host3",
        host_username: "CarBallPro",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    ]
    localStorage.setItem("gamerooms", JSON.stringify(dummyRooms))
  }

  if (!localStorage.getItem("leaderboard")) {
    const dummyLeaderboard: LeaderboardEntry[] = [
      {
        id: "1",
        username: "ProGamer123",
        total_earnings: 5420,
        games_won: 45,
        games_played: 67,
        win_rate: 67.2,
        rank: "Diamond",
        avatar_url: "/placeholder.svg?height=50&width=50",
      },
      {
        id: "2",
        username: "ESportsMaster",
        total_earnings: 4890,
        games_won: 38,
        games_played: 52,
        win_rate: 73.1,
        rank: "Diamond",
        avatar_url: "/placeholder.svg?height=50&width=50",
      },
      {
        id: "3",
        username: "GameChampion",
        total_earnings: 3750,
        games_won: 32,
        games_played: 48,
        win_rate: 66.7,
        rank: "Gold",
        avatar_url: "/placeholder.svg?height=50&width=50",
      },
      {
        id: "4",
        username: "SkillMaster",
        total_earnings: 3200,
        games_won: 28,
        games_played: 45,
        win_rate: 62.2,
        rank: "Gold",
        avatar_url: "/placeholder.svg?height=50&width=50",
      },
      {
        id: "5",
        username: "TourneyKing",
        total_earnings: 2890,
        games_won: 25,
        games_played: 42,
        win_rate: 59.5,
        rank: "Silver",
        avatar_url: "/placeholder.svg?height=50&width=50",
      },
    ]
    localStorage.setItem("leaderboard", JSON.stringify(dummyLeaderboard))
  }

  if (!localStorage.getItem("store_items")) {
    const dummyStore: StoreItem[] = [
      {
        id: "1",
        name: "Gaming Headset Pro",
        description: "Professional gaming headset with 7.1 surround sound",
        price: 199.99,
        category: "gear",
        image_url: "/placeholder.svg?height=200&width=200",
        in_stock: true,
      },
      {
        id: "2",
        name: "Mechanical Keyboard RGB",
        description: "Cherry MX switches with RGB backlighting",
        price: 149.99,
        category: "gear",
        image_url: "/placeholder.svg?height=200&width=200",
        in_stock: true,
      },
      {
        id: "3",
        name: "Dragon Skin - AK47",
        description: "Legendary weapon skin for CS2",
        price: 89.99,
        category: "skins",
        image_url: "/placeholder.svg?height=200&width=200",
        in_stock: true,
      },
      {
        id: "4",
        name: "GameArena T-Shirt",
        description: "Official GameArena merchandise",
        price: 29.99,
        category: "merchandise",
        image_url: "/placeholder.svg?height=200&width=200",
        in_stock: true,
      },
      {
        id: "5",
        name: "Gaming Mouse Pad XL",
        description: "Extra large mouse pad for gaming",
        price: 39.99,
        category: "accessories",
        image_url: "/placeholder.svg?height=200&width=200",
        in_stock: true,
      },
      {
        id: "6",
        name: "Neon Gloves",
        description: "Glowing gloves skin for Valorant",
        price: 24.99,
        category: "skins",
        image_url: "/placeholder.svg?height=200&width=200",
        in_stock: false,
      },
    ]
    localStorage.setItem("store_items", JSON.stringify(dummyStore))
  }

  if (!localStorage.getItem("chat_messages")) {
    const dummyMessages: ChatMessage[] = [
      {
        id: "1",
        user_id: "user1",
        username: "ProGamer123",
        message: "Anyone up for some Fortnite scrims?",
        timestamp: new Date(Date.now() - 300000).toISOString(),
      },
      {
        id: "2",
        user_id: "user2",
        username: "ESportsMaster",
        message: "Just won my CS2 tournament! 🏆",
        timestamp: new Date(Date.now() - 240000).toISOString(),
      },
      {
        id: "3",
        user_id: "user3",
        username: "GameChampion",
        message: "Looking for teammates for the upcoming Valorant tournament",
        timestamp: new Date(Date.now() - 180000).toISOString(),
      },
      {
        id: "4",
        user_id: "user4",
        username: "SkillMaster",
        message: "New gaming gear arrived! Ready to dominate 💪",
        timestamp: new Date(Date.now() - 120000).toISOString(),
      },
    ]
    localStorage.setItem("chat_messages", JSON.stringify(dummyMessages))
  }
}

// Storage utilities
export const getGameRooms = (): GameRoom[] => {
  const rooms = localStorage.getItem("gamerooms")
  return rooms ? JSON.parse(rooms) : []
}

export const saveGameRoom = (room: GameRoom) => {
  const rooms = getGameRooms()
  rooms.push(room)
  localStorage.setItem("gamerooms", JSON.stringify(rooms))
}

export const getCurrentUser = (): Profile | null => {
  const user = localStorage.getItem("current_user")
  return user ? JSON.parse(user) : null
}

export const setCurrentUser = (user: Profile | null) => {
  if (user) {
    localStorage.setItem("current_user", JSON.stringify(user))
  } else {
    localStorage.removeItem("current_user")
  }
}

export const getRegistrations = (userId: string): Registration[] => {
  const registrations = localStorage.getItem("registrations")
  const allRegistrations: Registration[] = registrations ? JSON.parse(registrations) : []
  return allRegistrations.filter((reg) => reg.user_id === userId)
}

export const saveRegistration = (registration: Registration) => {
  const registrations = localStorage.getItem("registrations")
  const allRegistrations: Registration[] = registrations ? JSON.parse(registrations) : []
  allRegistrations.push(registration)
  localStorage.setItem("registrations", JSON.stringify(allRegistrations))
}

export const getLeaderboard = (): LeaderboardEntry[] => {
  const leaderboard = localStorage.getItem("leaderboard")
  return leaderboard ? JSON.parse(leaderboard) : []
}

export const getStoreItems = (): StoreItem[] => {
  const items = localStorage.getItem("store_items")
  return items ? JSON.parse(items) : []
}

export const getChatMessages = (): ChatMessage[] => {
  const messages = localStorage.getItem("chat_messages")
  return messages ? JSON.parse(messages) : []
}

export const saveChatMessage = (message: ChatMessage) => {
  const messages = getChatMessages()
  messages.push(message)
  localStorage.setItem("chat_messages", JSON.stringify(messages))
}
