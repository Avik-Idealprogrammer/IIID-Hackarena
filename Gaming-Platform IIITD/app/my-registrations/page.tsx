"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Gamepad2, Calendar, DollarSign, Users, Trophy, Clock, CheckCircle, XCircle } from "lucide-react"
import { useAuth } from "@/contexts/AuthContext"
import { getGameRooms, type GameRoom, type Registration } from "@/lib/localStorage"

type RegistrationWithRoom = Registration & { game_rooms?: GameRoom }

export default function MyRegistrationsPage() {
  const { user } = useAuth()
  const [registrations, setRegistrations] = useState<RegistrationWithRoom[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user) {
      fetchRegistrations()
    }
  }, [user])

  const fetchRegistrations = async () => {
    if (!user) return

    try {
      const registrations = localStorage.getItem("registrations")
      const allRegistrations: Registration[] = registrations ? JSON.parse(registrations) : []
      const userRegistrations = allRegistrations.filter((reg) => reg.user_id === user.id)

      // Get room details for each registration
      const rooms = getGameRooms()
      const registrationsWithRooms = userRegistrations.map((reg) => ({
        ...reg,
        game_rooms: rooms.find((room) => room.id === reg.room_id),
      }))

      setRegistrations(registrationsWithRooms)
    } catch (error) {
      console.error("Error fetching registrations:", error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-500"
      case "pending":
        return "bg-yellow-500"
      case "failed":
        return "bg-red-500"
      case "refunded":
        return "bg-gray-500"
      default:
        return "bg-gray-500"
    }
  }

  const getRoomStatusColor = (status: string) => {
    switch (status) {
      case "open":
        return "bg-green-500"
      case "full":
        return "bg-blue-500"
      case "started":
        return "bg-purple-500"
      case "completed":
        return "bg-gray-500"
      case "cancelled":
        return "bg-red-500"
      default:
        return "bg-gray-500"
    }
  }

  const upcomingGames = registrations.filter(
    (reg) => reg.game_rooms && ["open", "full"].includes(reg.game_rooms.status),
  )

  const activeGames = registrations.filter((reg) => reg.game_rooms && reg.game_rooms.status === "started")

  const completedGames = registrations.filter(
    (reg) => reg.game_rooms && ["completed", "cancelled"].includes(reg.game_rooms.status),
  )

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="text-white">Please log in to view your registrations.</div>
      </div>
    )
  }

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
              <Link href="/profile" className="text-white hover:text-purple-300 transition-colors">
                Profile
              </Link>
              <Link href="/my-registrations" className="text-purple-400 font-semibold">
                My Games
              </Link>
            </div>
            <Link href="/profile">
              <Button variant="outline" className="border-white/20 text-white hover:bg-white/10 bg-transparent">
                Profile
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">My Game Registrations</h1>
          <p className="text-gray-300 text-lg">Track your tournaments and schedules</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white/10 backdrop-blur-md border-white/20">
            <CardContent className="p-6 text-center">
              <Calendar className="h-8 w-8 text-blue-400 mx-auto mb-2" />
              <h3 className="text-2xl font-bold text-white">{upcomingGames.length}</h3>
              <p className="text-gray-300">Upcoming</p>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur-md border-white/20">
            <CardContent className="p-6 text-center">
              <Clock className="h-8 w-8 text-purple-400 mx-auto mb-2" />
              <h3 className="text-2xl font-bold text-white">{activeGames.length}</h3>
              <p className="text-gray-300">Active</p>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur-md border-white/20">
            <CardContent className="p-6 text-center">
              <CheckCircle className="h-8 w-8 text-green-400 mx-auto mb-2" />
              <h3 className="text-2xl font-bold text-white">{completedGames.length}</h3>
              <p className="text-gray-300">Completed</p>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur-md border-white/20">
            <CardContent className="p-6 text-center">
              <DollarSign className="h-8 w-8 text-yellow-400 mx-auto mb-2" />
              <h3 className="text-2xl font-bold text-white">
                ${registrations.reduce((sum, reg) => sum + Number(reg.payment_amount), 0).toFixed(2)}
              </h3>
              <p className="text-gray-300">Total Invested</p>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="upcoming" className="space-y-6">
          <TabsList className="bg-white/10 border-white/20">
            <TabsTrigger value="upcoming" className="data-[state=active]:bg-purple-600">
              Upcoming ({upcomingGames.length})
            </TabsTrigger>
            <TabsTrigger value="active" className="data-[state=active]:bg-purple-600">
              Active ({activeGames.length})
            </TabsTrigger>
            <TabsTrigger value="completed" className="data-[state=active]:bg-purple-600">
              Completed ({completedGames.length})
            </TabsTrigger>
            <TabsTrigger value="all" className="data-[state=active]:bg-purple-600">
              All ({registrations.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="upcoming" className="space-y-4">
            {loading ? (
              <div className="text-center text-white">Loading...</div>
            ) : upcomingGames.length === 0 ? (
              <Card className="bg-white/10 backdrop-blur-md border-white/20">
                <CardContent className="p-8 text-center">
                  <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-white text-lg mb-2">No Upcoming Games</h3>
                  <p className="text-gray-300 mb-4">You haven't registered for any upcoming tournaments.</p>
                  <Link href="/">
                    <Button className="bg-purple-600 hover:bg-purple-700">Browse Tournaments</Button>
                  </Link>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {upcomingGames.map((registration) => (
                  <RegistrationCard key={registration.id} registration={registration} />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="active" className="space-y-4">
            {activeGames.length === 0 ? (
              <Card className="bg-white/10 backdrop-blur-md border-white/20">
                <CardContent className="p-8 text-center">
                  <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-white text-lg mb-2">No Active Games</h3>
                  <p className="text-gray-300">No tournaments are currently in progress.</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {activeGames.map((registration) => (
                  <RegistrationCard key={registration.id} registration={registration} />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="completed" className="space-y-4">
            {completedGames.length === 0 ? (
              <Card className="bg-white/10 backdrop-blur-md border-white/20">
                <CardContent className="p-8 text-center">
                  <Trophy className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-white text-lg mb-2">No Completed Games</h3>
                  <p className="text-gray-300">You haven't completed any tournaments yet.</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {completedGames.map((registration) => (
                  <RegistrationCard key={registration.id} registration={registration} />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="all" className="space-y-4">
            {loading ? (
              <div className="text-center text-white">Loading...</div>
            ) : registrations.length === 0 ? (
              <Card className="bg-white/10 backdrop-blur-md border-white/20">
                <CardContent className="p-8 text-center">
                  <Gamepad2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-white text-lg mb-2">No Registrations</h3>
                  <p className="text-gray-300 mb-4">You haven't registered for any tournaments yet.</p>
                  <Link href="/">
                    <Button className="bg-purple-600 hover:bg-purple-700">Browse Tournaments</Button>
                  </Link>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {registrations.map((registration) => (
                  <RegistrationCard key={registration.id} registration={registration} />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

function RegistrationCard({ registration }: { registration: Registration }) {
  const room = registration.game_rooms
  if (!room) return null

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-500"
      case "pending":
        return "bg-yellow-500"
      case "failed":
        return "bg-red-500"
      case "refunded":
        return "bg-gray-500"
      default:
        return "bg-gray-500"
    }
  }

  const getRoomStatusColor = (status: string) => {
    switch (status) {
      case "open":
        return "bg-green-500"
      case "full":
        return "bg-blue-500"
      case "started":
        return "bg-purple-500"
      case "completed":
        return "bg-gray-500"
      case "cancelled":
        return "bg-red-500"
      default:
        return "bg-gray-500"
    }
  }

  return (
    <Card className="bg-white/10 backdrop-blur-md border-white/20 hover:bg-white/15 transition-all duration-300">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-white text-lg">{room.title}</CardTitle>
            <p className="text-gray-300">{room.game}</p>
          </div>
          <div className="flex flex-col items-end space-y-2">
            <Badge className={`${getRoomStatusColor(room.status)} text-white`}>
              {room.status.charAt(0).toUpperCase() + room.status.slice(1)}
            </Badge>
            <Badge className={`${getStatusColor(registration.payment_status)} text-white text-xs`}>
              {registration.payment_status}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center space-x-2">
            <DollarSign className="h-4 w-4 text-green-400" />
            <div>
              <p className="text-white font-semibold">${registration.payment_amount}</p>
              <p className="text-gray-400 text-xs">Entry Fee</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Users className="h-4 w-4 text-blue-400" />
            <div>
              <p className="text-white font-semibold">
                {room.current_players}/{room.max_players}
              </p>
              <p className="text-gray-400 text-xs">Players</p>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Calendar className="h-4 w-4 text-purple-400" />
          <div>
            <p className="text-white font-semibold">
              {new Date(`${room.start_date} ${room.start_time}`).toLocaleDateString()}
            </p>
            <p className="text-gray-400 text-xs">
              {new Date(`${room.start_date} ${room.start_time}`).toLocaleTimeString()}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Trophy className="h-4 w-4 text-yellow-400" />
          <div>
            <p className="text-white font-semibold">${room.prize_pool}</p>
            <p className="text-gray-400 text-xs">Prize Pool</p>
          </div>
        </div>

        <div className="text-gray-400 text-xs">Registered: {new Date(registration.registered_at).toLocaleString()}</div>

        {room.status === "open" && (
          <div className="text-green-400 text-sm flex items-center">
            <CheckCircle className="h-4 w-4 mr-1" />
            Ready to compete
          </div>
        )}

        {room.status === "started" && (
          <div className="text-purple-400 text-sm flex items-center">
            <Clock className="h-4 w-4 mr-1" />
            Tournament in progress
          </div>
        )}

        {room.status === "completed" && (
          <div className="text-gray-400 text-sm flex items-center">
            <Trophy className="h-4 w-4 mr-1" />
            Tournament completed
          </div>
        )}

        {room.status === "cancelled" && (
          <div className="text-red-400 text-sm flex items-center">
            <XCircle className="h-4 w-4 mr-1" />
            Tournament cancelled
          </div>
        )}
      </CardContent>
    </Card>
  )
}
