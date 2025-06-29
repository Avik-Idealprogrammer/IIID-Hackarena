"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Gamepad2, Trophy, Users, DollarSign, Search, LogOut, MessageCircle, Store, Award } from "lucide-react"
import { useAuth } from "@/contexts/AuthContext"
import { getGameRooms, type GameRoom } from "@/lib/localStorage"

export default function HomePage() {
  const { user, profile, signOut } = useAuth()
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedGame, setSelectedGame] = useState("all")
  const [gameRooms, setGameRooms] = useState<GameRoom[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const rooms = getGameRooms()
    setGameRooms(rooms.filter((room) => room.status === "open"))
    setLoading(false)
  }, [])

  const filteredRooms = gameRooms.filter((room) => {
    const matchesSearch =
      room.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      room.game.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesGame = selectedGame === "all" || room.game === selectedGame
    return matchesSearch && matchesGame
  })

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Beginner":
        return "bg-green-500"
      case "Intermediate":
        return "bg-yellow-500"
      case "Expert":
        return "bg-red-500"
      default:
        return "bg-gray-500"
    }
  }

  const handleJoinRoom = (roomId: string) => {
    if (!user) {
      router.push("/login")
      return
    }
    router.push(`/register-room/${roomId}`)
  }

  const handleSignOut = async () => {
    await signOut()
    router.push("/")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      {/* Navigation */}
      <nav className="bg-black/20 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <Gamepad2 className="h-8 w-8 text-purple-400" />
              <span className="text-2xl font-bold text-white">GameArena</span>
            </div>
            <div className="hidden md:flex items-center space-x-6">
              <Link href="/" className="text-white hover:text-purple-300 transition-colors">
                Home
              </Link>
              {user && (
                <>
                  <Link href="/create-room" className="text-white hover:text-purple-300 transition-colors">
                    Create Room
                  </Link>
                  <Link href="/profile" className="text-white hover:text-purple-300 transition-colors">
                    Profile
                  </Link>
                  <Link href="/my-registrations" className="text-white hover:text-purple-300 transition-colors">
                    My Games
                  </Link>
                  <Link href="/leaderboard" className="text-white hover:text-purple-300 transition-colors">
                    <Award className="h-4 w-4 inline mr-1" />
                    Leaderboard
                  </Link>
                  <Link href="/community" className="text-white hover:text-purple-300 transition-colors">
                    <MessageCircle className="h-4 w-4 inline mr-1" />
                    Community
                  </Link>
                  <Link href="/store" className="text-white hover:text-purple-300 transition-colors">
                    <Store className="h-4 w-4 inline mr-1" />
                    Store
                  </Link>
                </>
              )}
            </div>
            <div className="flex items-center space-x-4">
              {user ? (
                <div className="flex items-center space-x-4">
                  <span className="text-white">Welcome, {profile?.username}</span>
                  <Button
                    onClick={handleSignOut}
                    variant="outline"
                    className="border-purple-400 text-purple-400 hover:bg-purple-400 hover:text-white bg-transparent"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Sign Out
                  </Button>
                </div>
              ) : (
                <>
                  <Link href="/login">
                    <Button
                      variant="outline"
                      className="border-purple-400 text-purple-400 hover:bg-purple-400 hover:text-white bg-transparent"
                    >
                      Login
                    </Button>
                  </Link>
                  <Link href="/signup">
                    <Button className="bg-purple-600 hover:bg-purple-700 text-white">Sign Up</Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative py-20 px-4 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
            Compete. Win. <span className="text-purple-400">Earn.</span>
          </h1>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Join competitive gaming rooms, pay entry fees, and win massive prizes. Show your skills and climb to the
            top!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {user ? (
              <Link href="/create-room">
                <Button size="lg" className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3">
                  Create Room
                </Button>
              </Link>
            ) : (
              <Link href="/signup">
                <Button size="lg" className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3">
                  Get Started
                </Button>
              </Link>
            )}
            <Button
              size="lg"
              variant="outline"
              className="border-white text-white hover:bg-white hover:text-purple-900 px-8 py-3 bg-transparent"
            >
              Browse Rooms
            </Button>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="py-12 px-4">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="bg-white/10 backdrop-blur-md rounded-lg p-6">
              <Trophy className="h-12 w-12 text-yellow-400 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-white mb-2">$50,000+</h3>
              <p className="text-gray-300">Total Prizes Won</p>
            </div>
          </div>
          <div className="text-center">
            <div className="bg-white/10 backdrop-blur-md rounded-lg p-6">
              <Users className="h-12 w-12 text-blue-400 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-white mb-2">10,000+</h3>
              <p className="text-gray-300">Active Players</p>
            </div>
          </div>
          <div className="text-center">
            <div className="bg-white/10 backdrop-blur-md rounded-lg p-6">
              <Gamepad2 className="h-12 w-12 text-purple-400 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-white mb-2">500+</h3>
              <p className="text-gray-300">Games Hosted Daily</p>
            </div>
          </div>
        </div>
      </div>

      {/* Game Rooms Section */}
      <div className="py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-white mb-8 text-center">Active Game Rooms</h2>

          {/* Search and Filter */}
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search rooms or games..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-white/10 border-white/20 text-white placeholder-gray-400"
              />
            </div>
            <select
              value={selectedGame}
              onChange={(e) => setSelectedGame(e.target.value)}
              className="px-4 py-2 bg-white/10 border border-white/20 rounded-md text-white"
            >
              <option value="all">All Games</option>
              <option value="Fortnite">Fortnite</option>
              <option value="Counter-Strike 2">Counter-Strike 2</option>
              <option value="Rocket League">Rocket League</option>
              <option value="Valorant">Valorant</option>
            </select>
          </div>

          {/* Room Cards */}
          {loading ? (
            <div className="text-center text-white">Loading game rooms...</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredRooms.map((room) => (
                <Card
                  key={room.id}
                  className="bg-white/10 backdrop-blur-md border-white/20 hover:bg-white/15 transition-all duration-300"
                >
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-white text-lg">{room.title}</CardTitle>
                        <CardDescription className="text-gray-300">{room.game}</CardDescription>
                      </div>
                      <Badge className={`${getDifficultyColor(room.difficulty)} text-white`}>{room.difficulty}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center space-x-2">
                        <DollarSign className="h-4 w-4 text-green-400" />
                        <span className="text-white font-semibold">${room.entry_fee}</span>
                        <span className="text-gray-400">entry</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Trophy className="h-4 w-4 text-yellow-400" />
                        <span className="text-white font-semibold">${room.prize_pool}</span>
                        <span className="text-gray-400">prize</span>
                      </div>
                    </div>

                    <div className="flex justify-between items-center">
                      <div className="flex items-center space-x-2">
                        <Users className="h-4 w-4 text-blue-400" />
                        <span className="text-white">
                          {room.current_players}/{room.max_players}
                        </span>
                      </div>
                      <span className="text-gray-400 text-sm">by {room.host_username}</span>
                    </div>

                    <div className="text-gray-400 text-sm">
                      Starts: {new Date(`${room.start_date} ${room.start_time}`).toLocaleString()}
                    </div>

                    <Button
                      onClick={() => handleJoinRoom(room.id)}
                      className="w-full bg-purple-600 hover:bg-purple-700 text-white"
                      disabled={room.current_players >= room.max_players}
                    >
                      {room.current_players >= room.max_players ? "Room Full" : `Join Room - $${room.entry_fee}`}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
