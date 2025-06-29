"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Gamepad2, Trophy, DollarSign, Users, Star, Edit, TrendingUp, Target, LogOut } from "lucide-react"
import { useAuth } from "@/contexts/AuthContext"
import { supabase, type Registration } from "@/lib/supabase"

interface GameResult {
  id: string
  room_id: string
  position: number
  prize_amount: number
  created_at: string
  game_rooms: {
    title: string
    game: string
    max_players: number
  }
}

export default function ProfilePage() {
  const { user, profile, signOut } = useAuth()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("overview")
  const [recentGames, setRecentGames] = useState<Registration[]>([])
  const [gameResults, setGameResults] = useState<GameResult[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) {
      router.push("/login")
      return
    }
    fetchUserData()
  }, [user])

  const fetchUserData = async () => {
    if (!user) return

    try {
      // Fetch recent registrations
      const { data: registrations, error: regError } = await supabase
        .from("registrations")
        .select(`
          *,
          game_rooms (
            title,
            game,
            max_players,
            start_date,
            start_time
          )
        `)
        .eq("user_id", user.id)
        .order("registered_at", { ascending: false })
        .limit(5)

      if (regError) throw regError
      setRecentGames(registrations || [])

      // Fetch game results
      const { data: results, error: resultsError } = await supabase
        .from("game_results")
        .select(`
          *,
          game_rooms (
            title,
            game,
            max_players
          )
        `)
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(10)

      if (resultsError) throw resultsError
      setGameResults(results || [])
    } catch (error) {
      console.error("Error fetching user data:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleSignOut = async () => {
    await signOut()
    router.push("/")
  }

  if (!user || !profile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    )
  }

  const achievements = [
    {
      name: "First Victory",
      description: "Win your first game",
      earned: profile.games_won > 0,
    },
    {
      name: "Big Winner",
      description: "Earn $1000+ in total",
      earned: profile.total_earnings >= 1000,
    },
    {
      name: "Consistent Player",
      description: "Play 50+ games",
      earned: profile.games_played >= 50,
    },
    {
      name: "Tournament Master",
      description: "Win 25+ games",
      earned: profile.games_won >= 25,
    },
    {
      name: "High Roller",
      description: "Join a $100+ entry fee game",
      earned: recentGames.some((game) => game.payment_amount >= 100),
    },
  ]

  const winRate = profile.games_played > 0 ? ((profile.games_won / profile.games_played) * 100).toFixed(1) : 0

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      {/* Navigation */}
      <nav className="bg-black/20 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center space-x-2">
              <Gamepad2 className="h-8 w-8 text-purple-400" />
              <span className="text-2xl font-bold text-white">GameArena</span>
            </Link>
            <div className="hidden md:flex items-center space-x-6">
              <Link href="/" className="text-white hover:text-purple-300 transition-colors">
                Home
              </Link>
              <Link href="/create-room" className="text-white hover:text-purple-300 transition-colors">
                Create Room
              </Link>
              <Link href="/profile" className="text-purple-400 font-semibold">
                Profile
              </Link>
              <Link href="/my-registrations" className="text-white hover:text-purple-300 transition-colors">
                My Games
              </Link>
            </div>
            <Button
              onClick={handleSignOut}
              variant="outline"
              className="border-white/20 text-white hover:bg-white/10 bg-transparent"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Profile Header */}
        <div className="bg-white/10 backdrop-blur-md rounded-lg border border-white/20 p-6 mb-8">
          <div className="flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-6">
            <Avatar className="h-24 w-24">
              <AvatarImage src={profile.avatar_url || "/placeholder.svg"} alt={profile.username} />
              <AvatarFallback className="bg-purple-600 text-white text-2xl">
                {profile.username.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1 text-center md:text-left">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-white mb-2">{profile.username}</h1>
                  <p className="text-gray-300 mb-2">{user.email}</p>
                  <div className="flex items-center justify-center md:justify-start space-x-4 text-sm text-gray-400">
                    <span>Level {profile.level}</span>
                    <span>•</span>
                    <span>{profile.rank} Rank</span>
                    <span>•</span>
                    <span>Joined {new Date(profile.created_at).toLocaleDateString()}</span>
                  </div>
                </div>
                <Button className="mt-4 md:mt-0 bg-purple-600 hover:bg-purple-700">
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Profile
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white/10 backdrop-blur-md border-white/20">
            <CardContent className="p-6 text-center">
              <DollarSign className="h-8 w-8 text-green-400 mx-auto mb-2" />
              <h3 className="text-2xl font-bold text-white">${profile.total_earnings}</h3>
              <p className="text-gray-300">Total Earnings</p>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur-md border-white/20">
            <CardContent className="p-6 text-center">
              <Trophy className="h-8 w-8 text-yellow-400 mx-auto mb-2" />
              <h3 className="text-2xl font-bold text-white">{profile.games_won}</h3>
              <p className="text-gray-300">Games Won</p>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur-md border-white/20">
            <CardContent className="p-6 text-center">
              <Target className="h-8 w-8 text-blue-400 mx-auto mb-2" />
              <h3 className="text-2xl font-bold text-white">{winRate}%</h3>
              <p className="text-gray-300">Win Rate</p>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur-md border-white/20">
            <CardContent className="p-6 text-center">
              <Users className="h-8 w-8 text-purple-400 mx-auto mb-2" />
              <h3 className="text-2xl font-bold text-white">{profile.games_played}</h3>
              <p className="text-gray-300">Games Played</p>
            </CardContent>
          </Card>
        </div>

        {/* Tabs Section */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="bg-white/10 border-white/20">
            <TabsTrigger value="overview" className="data-[state=active]:bg-purple-600">
              Overview
            </TabsTrigger>
            <TabsTrigger value="games" className="data-[state=active]:bg-purple-600">
              Recent Games
            </TabsTrigger>
            <TabsTrigger value="achievements" className="data-[state=active]:bg-purple-600">
              Achievements
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-white/10 backdrop-blur-md border-white/20">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <TrendingUp className="h-5 w-5 mr-2" />
                    Performance Overview
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Total Registrations</span>
                    <span className="text-white font-semibold">{recentGames.length}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Total Earnings</span>
                    <span className="text-green-400 font-semibold">${profile.total_earnings}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Best Finish</span>
                    <span className="text-yellow-400 font-semibold">
                      {gameResults.length > 0 ? `${Math.min(...gameResults.map((r) => r.position))} Place` : "N/A"}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Current Level</span>
                    <span className="text-white font-semibold">Level {profile.level}</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/10 backdrop-blur-md border-white/20">
                <CardHeader>
                  <CardTitle className="text-white">Recent Activity</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {recentGames.slice(0, 4).map((game, index) => (
                    <div key={game.id} className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                      <span className="text-gray-300 text-sm">Joined {game.game_rooms?.title || "Tournament"}</span>
                    </div>
                  ))}
                  {recentGames.length === 0 && <div className="text-gray-400 text-sm">No recent activity</div>}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="games" className="space-y-4">
            {loading ? (
              <div className="text-center text-white">Loading...</div>
            ) : recentGames.length === 0 ? (
              <Card className="bg-white/10 backdrop-blur-md border-white/20">
                <CardContent className="p-8 text-center">
                  <Gamepad2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-white text-lg mb-2">No Games Yet</h3>
                  <p className="text-gray-300 mb-4">You haven't joined any tournaments yet.</p>
                  <Link href="/">
                    <Button className="bg-purple-600 hover:bg-purple-700">Browse Tournaments</Button>
                  </Link>
                </CardContent>
              </Card>
            ) : (
              recentGames.map((game) => (
                <Card key={game.id} className="bg-white/10 backdrop-blur-md border-white/20">
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between space-y-4 md:space-y-0">
                      <div className="flex-1">
                        <h3 className="text-white font-semibold text-lg">{game.game_rooms?.title}</h3>
                        <p className="text-gray-300">{game.game_rooms?.game}</p>
                        <div className="flex items-center space-x-4 mt-2 text-sm text-gray-400">
                          <span>{new Date(game.registered_at).toLocaleDateString()}</span>
                          <span>•</span>
                          <span>{game.game_rooms?.max_players} players max</span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <Badge
                          className={
                            game.payment_status === "completed"
                              ? "bg-green-500"
                              : game.payment_status === "pending"
                                ? "bg-yellow-500"
                                : "bg-red-500"
                          }
                        >
                          {game.payment_status}
                        </Badge>
                        <div className="text-right">
                          <p className="text-green-400 font-semibold">${game.payment_amount}</p>
                          <p className="text-gray-400 text-sm">Entry Fee</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>

          <TabsContent value="achievements" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {achievements.map((achievement, index) => (
                <Card
                  key={index}
                  className={`bg-white/10 backdrop-blur-md border-white/20 ${achievement.earned ? "ring-2 ring-yellow-400" : ""}`}
                >
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-4">
                      <div className={`p-3 rounded-full ${achievement.earned ? "bg-yellow-400" : "bg-gray-600"}`}>
                        <Star className={`h-6 w-6 ${achievement.earned ? "text-black" : "text-gray-400"}`} />
                      </div>
                      <div className="flex-1">
                        <h3 className={`font-semibold ${achievement.earned ? "text-white" : "text-gray-400"}`}>
                          {achievement.name}
                        </h3>
                        <p className="text-gray-400 text-sm">{achievement.description}</p>
                      </div>
                      {achievement.earned && <Badge className="bg-yellow-400 text-black">Earned</Badge>}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
