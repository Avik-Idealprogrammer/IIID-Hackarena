"use client"

import type React from "react"
import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Gamepad2, DollarSign, Users, Calendar, Trophy, Info } from "lucide-react"
import { useAuth } from "@/contexts/AuthContext"
import { useRouter } from "next/navigation"
import { saveGameRoom, type GameRoom } from "@/lib/localStorage"

export default function CreateRoomPage() {
  const [formData, setFormData] = useState({
    title: "",
    game: "",
    description: "",
    entryFee: "",
    maxPlayers: "",
    startDate: "",
    startTime: "",
    difficulty: "",
    rules: "",
  })

  const [loading, setLoading] = useState(false)
  const { user } = useAuth()
  const router = useRouter()

  const formValid =
    formData.title.trim() &&
    formData.game.trim() &&
    formData.entryFee &&
    Number.parseFloat(formData.entryFee) > 0 &&
    formData.maxPlayers &&
    Number.parseInt(formData.maxPlayers) > 1 &&
    formData.startDate &&
    formData.startTime &&
    formData.difficulty

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formValid) {
      alert("Please fill in all required fields.")
      return
    }
    if (!user) {
      router.push("/login")
      return
    }

    setLoading(true)
    try {
      const newRoom: GameRoom = {
        id: Date.now().toString(),
        title: formData.title.trim(),
        description: formData.description.trim() || undefined,
        game: formData.game.trim(),
        entry_fee: Number.parseFloat(formData.entryFee),
        max_players: Number.parseInt(formData.maxPlayers, 10),
        current_players: 0,
        prize_pool: 0,
        start_date: formData.startDate,
        start_time: formData.startTime,
        difficulty: formData.difficulty as "Beginner" | "Intermediate" | "Expert",
        rules: formData.rules.trim() || undefined,
        status: "open",
        host_id: user.id,
        host_username: user.username,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }

      saveGameRoom(newRoom)
      alert("Room created successfully!")
      router.push("/")
    } catch (err: any) {
      console.error("Error creating room:", err)
      alert("Failed to create room. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const calculatePrizePool = () => {
    const entryFee = Number.parseFloat(formData.entryFee) || 0
    const maxPlayers = Number.parseInt(formData.maxPlayers) || 0
    return entryFee * maxPlayers
  }

  const calculatePrizes = () => {
    const total = calculatePrizePool()
    return {
      first: ((total * 60) / 100).toFixed(2),
      second: ((total * 25) / 100).toFixed(2),
      third: ((total * 15) / 100).toFixed(2),
    }
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
              <Link href="/create-room" className="text-purple-400 font-semibold">
                Create Room
              </Link>
              <Link href="/profile" className="text-white hover:text-purple-300 transition-colors">
                Profile
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

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">Create Game Room</h1>
          <p className="text-gray-300 text-lg">Set up your competitive gaming tournament</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Form */}
          <div className="lg:col-span-2">
            <Card className="bg-white/10 backdrop-blur-md border-white/20">
              <CardHeader>
                <CardTitle className="text-white">Room Details</CardTitle>
                <CardDescription className="text-gray-300">Configure your game room settings</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="title" className="text-white">
                      Room Title
                    </Label>
                    <Input
                      id="title"
                      placeholder="Enter room title"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      className="bg-white/10 border-white/20 text-white placeholder-gray-400"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="game" className="text-white">
                      Game
                    </Label>
                    <Select value={formData.game} onValueChange={(value) => setFormData({ ...formData, game: value })}>
                      <SelectTrigger className="bg-white/10 border-white/20 text-white">
                        <SelectValue placeholder="Select a game" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Fortnite">Fortnite</SelectItem>
                        <SelectItem value="Counter-Strike 2">Counter-Strike 2</SelectItem>
                        <SelectItem value="Valorant">Valorant</SelectItem>
                        <SelectItem value="Rocket League">Rocket League</SelectItem>
                        <SelectItem value="Apex Legends">Apex Legends</SelectItem>
                        <SelectItem value="Call of Duty">Call of Duty</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description" className="text-white">
                      Description
                    </Label>
                    <Textarea
                      id="description"
                      placeholder="Describe your tournament..."
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className="bg-white/10 border-white/20 text-white placeholder-gray-400"
                      rows={3}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="entryFee" className="text-white">
                        Entry Fee ($)
                      </Label>
                      <Input
                        id="entryFee"
                        type="number"
                        placeholder="0"
                        value={formData.entryFee}
                        onChange={(e) => setFormData({ ...formData, entryFee: e.target.value })}
                        className="bg-white/10 border-white/20 text-white placeholder-gray-400"
                        min="0"
                        step="0.01"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="maxPlayers" className="text-white">
                        Max Players
                      </Label>
                      <Input
                        id="maxPlayers"
                        type="number"
                        placeholder="0"
                        value={formData.maxPlayers}
                        onChange={(e) => setFormData({ ...formData, maxPlayers: e.target.value })}
                        className="bg-white/10 border-white/20 text-white placeholder-gray-400"
                        min="2"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="startDate" className="text-white">
                        Start Date
                      </Label>
                      <Input
                        id="startDate"
                        type="date"
                        value={formData.startDate}
                        onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                        className="bg-white/10 border-white/20 text-white"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="startTime" className="text-white">
                        Start Time
                      </Label>
                      <Input
                        id="startTime"
                        type="time"
                        value={formData.startTime}
                        onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                        className="bg-white/10 border-white/20 text-white"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="difficulty" className="text-white">
                      Difficulty Level
                    </Label>
                    <Select
                      value={formData.difficulty}
                      onValueChange={(value) => setFormData({ ...formData, difficulty: value })}
                    >
                      <SelectTrigger className="bg-white/10 border-white/20 text-white">
                        <SelectValue placeholder="Select difficulty" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Beginner">Beginner</SelectItem>
                        <SelectItem value="Intermediate">Intermediate</SelectItem>
                        <SelectItem value="Expert">Expert</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="rules" className="text-white">
                      Rules & Requirements
                    </Label>
                    <Textarea
                      id="rules"
                      placeholder="Specify any special rules or requirements..."
                      value={formData.rules}
                      onChange={(e) => setFormData({ ...formData, rules: e.target.value })}
                      className="bg-white/10 border-white/20 text-white placeholder-gray-400"
                      rows={3}
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={!formValid || loading}
                    className="w-full bg-purple-600 hover:bg-purple-700 text-white disabled:opacity-50"
                  >
                    {loading ? "Creating..." : "Create Room"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Prize Pool Preview */}
            <Card className="bg-white/10 backdrop-blur-md border-white/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Trophy className="h-5 w-5 mr-2" />
                  Prize Pool
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-400">${calculatePrizePool().toFixed(2)}</div>
                  <p className="text-gray-300 text-sm">Total Prize Pool</p>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">🥇 1st Place</span>
                    <span className="text-yellow-400 font-semibold">${calculatePrizes().first}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">🥈 2nd Place</span>
                    <span className="text-gray-400 font-semibold">${calculatePrizes().second}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">🥉 3rd Place</span>
                    <span className="text-orange-400 font-semibold">${calculatePrizes().third}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Room Summary */}
            <Card className="bg-white/10 backdrop-blur-md border-white/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Info className="h-5 w-5 mr-2" />
                  Room Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center space-x-3">
                  <DollarSign className="h-4 w-4 text-green-400" />
                  <span className="text-gray-300">Entry Fee: ${formData.entryFee || "0"}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Users className="h-4 w-4 text-blue-400" />
                  <span className="text-gray-300">Max Players: {formData.maxPlayers || "0"}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Calendar className="h-4 w-4 text-purple-400" />
                  <span className="text-gray-300">
                    {formData.startDate && formData.startTime
                      ? `${formData.startDate} at ${formData.startTime}`
                      : "Date & Time TBD"}
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Tips */}
            <Card className="bg-white/10 backdrop-blur-md border-white/20">
              <CardHeader>
                <CardTitle className="text-white text-sm">💡 Tips</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm text-gray-300">
                <p>• Set reasonable entry fees to attract more players</p>
                <p>• Clear rules help avoid disputes</p>
                <p>• Schedule games during peak hours</p>
                <p>• Consider skill-based matchmaking</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
