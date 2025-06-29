"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Gamepad2, Trophy, DollarSign, Target, Medal, Crown, Award } from "lucide-react"
import { getLeaderboard, type LeaderboardEntry } from "@/lib/localStorage"

export default function LeaderboardPage() {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([])
  const [sortBy, setSortBy] = useState<"earnings" | "wins" | "winrate">("earnings")

  useEffect(() => {
    const data = getLeaderboard()
    setLeaderboard(data)
  }, [])

  const sortedLeaderboard = [...leaderboard].sort((a, b) => {
    switch (sortBy) {
      case "earnings":
        return b.total_earnings - a.total_earnings
      case "wins":
        return b.games_won - a.games_won
      case "winrate":
        return b.win_rate - a.win_rate
      default:
        return b.total_earnings - a.total_earnings
    }
  })

  const getRankIcon = (position: number) => {
    switch (position) {
      case 1:
        return <Crown className="h-6 w-6 text-yellow-400" />
      case 2:
        return <Medal className="h-6 w-6 text-gray-400" />
      case 3:
        return <Award className="h-6 w-6 text-orange-400" />
      default:
        return <span className="text-gray-400 font-bold">#{position}</span>
    }
  }

  const getRankColor = (rank: string) => {
    switch (rank) {
      case "Diamond":
        return "bg-blue-500"
      case "Gold":
        return "bg-yellow-500"
      case "Silver":
        return "bg-gray-400"
      case "Bronze":
        return "bg-orange-600"
      default:
        return "bg-gray-500"
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
              <Link href="/leaderboard" className="text-purple-400 font-semibold">
                Leaderboard
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

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">🏆 Leaderboard</h1>
          <p className="text-gray-300 text-lg">Top players in the GameArena community</p>
        </div>

        {/* Sort Controls */}
        <div className="flex justify-center mb-8">
          <div className="bg-white/10 backdrop-blur-md rounded-lg p-2 flex space-x-2">
            <Button
              onClick={() => setSortBy("earnings")}
              variant={sortBy === "earnings" ? "default" : "ghost"}
              className={sortBy === "earnings" ? "bg-purple-600" : "text-white hover:bg-white/10"}
            >
              <DollarSign className="h-4 w-4 mr-2" />
              Earnings
            </Button>
            <Button
              onClick={() => setSortBy("wins")}
              variant={sortBy === "wins" ? "default" : "ghost"}
              className={sortBy === "wins" ? "bg-purple-600" : "text-white hover:bg-white/10"}
            >
              <Trophy className="h-4 w-4 mr-2" />
              Wins
            </Button>
            <Button
              onClick={() => setSortBy("winrate")}
              variant={sortBy === "winrate" ? "default" : "ghost"}
              className={sortBy === "winrate" ? "bg-purple-600" : "text-white hover:bg-white/10"}
            >
              <Target className="h-4 w-4 mr-2" />
              Win Rate
            </Button>
          </div>
        </div>

        {/* Top 3 Podium */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {sortedLeaderboard.slice(0, 3).map((player, index) => (
            <Card
              key={player.id}
              className={`bg-white/10 backdrop-blur-md border-white/20 ${
                index === 0 ? "ring-2 ring-yellow-400 transform scale-105" : ""
              }`}
            >
              <CardHeader className="text-center">
                <div className="flex justify-center mb-4">{getRankIcon(index + 1)}</div>
                <Avatar className="h-20 w-20 mx-auto mb-4">
                  <AvatarImage src={player.avatar_url || "/placeholder.svg"} alt={player.username} />
                  <AvatarFallback className="bg-purple-600 text-white text-xl">
                    {player.username.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <CardTitle className="text-white text-xl">{player.username}</CardTitle>
                <Badge className={`${getRankColor(player.rank)} text-white`}>{player.rank}</Badge>
              </CardHeader>
              <CardContent className="text-center space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Earnings:</span>
                  <span className="text-green-400 font-bold">${player.total_earnings}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Wins:</span>
                  <span className="text-yellow-400 font-bold">{player.games_won}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Win Rate:</span>
                  <span className="text-blue-400 font-bold">{player.win_rate}%</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Full Leaderboard */}
        <Card className="bg-white/10 backdrop-blur-md border-white/20">
          <CardHeader>
            <CardTitle className="text-white text-2xl text-center">Full Rankings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {sortedLeaderboard.map((player, index) => (
                <div
                  key={player.id}
                  className={`flex items-center justify-between p-4 rounded-lg ${
                    index < 3 ? "bg-white/10" : "bg-white/5"
                  } hover:bg-white/15 transition-colors`}
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-8 flex justify-center">
                      {index < 3 ? getRankIcon(index + 1) : <span className="text-gray-400">#{index + 1}</span>}
                    </div>
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={player.avatar_url || "/placeholder.svg"} alt={player.username} />
                      <AvatarFallback className="bg-purple-600 text-white">
                        {player.username.slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="text-white font-semibold">{player.username}</h3>
                      <Badge className={`${getRankColor(player.rank)} text-white text-xs`}>{player.rank}</Badge>
                    </div>
                  </div>

                  <div className="flex items-center space-x-8 text-sm">
                    <div className="text-center">
                      <div className="text-green-400 font-bold">${player.total_earnings}</div>
                      <div className="text-gray-400">Earnings</div>
                    </div>
                    <div className="text-center">
                      <div className="text-yellow-400 font-bold">{player.games_won}</div>
                      <div className="text-gray-400">Wins</div>
                    </div>
                    <div className="text-center">
                      <div className="text-blue-400 font-bold">{player.win_rate}%</div>
                      <div className="text-gray-400">Win Rate</div>
                    </div>
                    <div className="text-center">
                      <div className="text-purple-400 font-bold">{player.games_played}</div>
                      <div className="text-gray-400">Games</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
