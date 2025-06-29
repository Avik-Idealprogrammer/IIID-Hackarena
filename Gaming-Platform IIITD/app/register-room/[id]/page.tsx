"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Gamepad2, DollarSign, Users, Calendar, Trophy, CreditCard, CheckCircle, Loader2 } from "lucide-react"
import { useAuth } from "@/contexts/AuthContext"
import { getGameRooms, saveRegistration, type GameRoom, type Registration } from "@/lib/localStorage"

interface PaymentAnimationProps {
  isVisible: boolean
  onComplete: () => void
}

function PaymentAnimation({ isVisible, onComplete }: PaymentAnimationProps) {
  const [step, setStep] = useState(0)

  useEffect(() => {
    if (!isVisible) return

    const steps = [
      { delay: 1000, message: "Processing payment..." },
      { delay: 2000, message: "Verifying transaction..." },
      { delay: 3000, message: "Registering for tournament..." },
      { delay: 4000, message: "Success! You're registered!" },
    ]

    steps.forEach((stepData, index) => {
      setTimeout(() => {
        setStep(index + 1)
        if (index === steps.length - 1) {
          setTimeout(onComplete, 1000)
        }
      }, stepData.delay)
    })
  }, [isVisible, onComplete])

  if (!isVisible) return null

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50">
      <Card className="bg-white/10 backdrop-blur-md border-white/20 w-96">
        <CardContent className="p-8 text-center">
          <div className="mb-6">
            {step < 4 ? (
              <Loader2 className="h-16 w-16 text-purple-400 mx-auto animate-spin" />
            ) : (
              <CheckCircle className="h-16 w-16 text-green-400 mx-auto animate-pulse" />
            )}
          </div>

          <div className="space-y-4">
            <div className={`transition-opacity duration-500 ${step >= 1 ? "opacity-100" : "opacity-50"}`}>
              <div className="flex items-center justify-center space-x-2">
                {step > 1 ? (
                  <CheckCircle className="h-4 w-4 text-green-400" />
                ) : (
                  <Loader2 className="h-4 w-4 animate-spin" />
                )}
                <span className="text-white">Processing payment...</span>
              </div>
            </div>

            <div className={`transition-opacity duration-500 ${step >= 2 ? "opacity-100" : "opacity-50"}`}>
              <div className="flex items-center justify-center space-x-2">
                {step > 2 ? (
                  <CheckCircle className="h-4 w-4 text-green-400" />
                ) : step === 2 ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <div className="h-4 w-4" />
                )}
                <span className="text-white">Verifying transaction...</span>
              </div>
            </div>

            <div className={`transition-opacity duration-500 ${step >= 3 ? "opacity-100" : "opacity-50"}`}>
              <div className="flex items-center justify-center space-x-2">
                {step > 3 ? (
                  <CheckCircle className="h-4 w-4 text-green-400" />
                ) : step === 3 ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <div className="h-4 w-4" />
                )}
                <span className="text-white">Registering for tournament...</span>
              </div>
            </div>

            <div className={`transition-opacity duration-500 ${step >= 4 ? "opacity-100" : "opacity-50"}`}>
              <div className="flex items-center justify-center space-x-2">
                {step >= 4 && <CheckCircle className="h-4 w-4 text-green-400" />}
                <span className={`text-white font-semibold ${step >= 4 ? "text-green-400" : ""}`}>
                  Success! You're registered!
                </span>
              </div>
            </div>
          </div>

          {step >= 4 && (
            <div className="mt-6 animate-bounce">
              <Trophy className="h-8 w-8 text-yellow-400 mx-auto" />
              <p className="text-gray-300 mt-2">Good luck in the tournament!</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default function RegisterRoomPage({ params }: { params: { id: string } }) {
  const { user, profile } = useAuth()
  const router = useRouter()
  const [room, setRoom] = useState<GameRoom | null>(null)
  const [loading, setLoading] = useState(true)
  const [registering, setRegistering] = useState(false)
  const [showAnimation, setShowAnimation] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState("card")

  useEffect(() => {
    if (!user) {
      router.push("/login")
      return
    }
    fetchRoom()
  }, [user, params.id])

  const fetchRoom = async () => {
    try {
      const rooms = getGameRooms()
      const foundRoom = rooms.find((r) => r.id === params.id)

      if (!foundRoom) {
        throw new Error("Room not found")
      }

      setRoom(foundRoom)
    } catch (error) {
      console.error("Error fetching room:", error)
      router.push("/")
    } finally {
      setLoading(false)
    }
  }

  const handleRegister = async () => {
    if (!user || !room) return

    setRegistering(true)
    setShowAnimation(true)
  }

  const handleAnimationComplete = async () => {
    if (!user || !room) return

    try {
      // Create registration record
      const registration: Registration = {
        id: Date.now().toString(),
        user_id: user.id,
        room_id: room.id,
        payment_amount: room.entry_fee,
        payment_status: "completed",
        payment_id: `pay_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        registered_at: new Date().toISOString(),
        game_room: room,
      }

      saveRegistration(registration)

      // Update room player count and prize pool
      const rooms = getGameRooms()
      const updatedRooms = rooms.map((r) => {
        if (r.id === room.id) {
          return {
            ...r,
            current_players: r.current_players + 1,
            prize_pool: r.prize_pool + room.entry_fee,
          }
        }
        return r
      })
      localStorage.setItem("gamerooms", JSON.stringify(updatedRooms))

      setShowAnimation(false)
      router.push("/my-registrations")
    } catch (error) {
      console.error("Registration error:", error)
      alert("Registration failed. Please try again.")
      setShowAnimation(false)
      setRegistering(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    )
  }

  if (!room) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="text-white">Room not found</div>
      </div>
    )
  }

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

  const calculatePrizes = () => {
    const total = room.prize_pool + room.entry_fee
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
            <div className="flex items-center space-x-4">
              <Link href="/">
                <Button variant="outline" className="border-white/20 text-white hover:bg-white/10 bg-transparent">
                  Back to Home
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">Join Tournament</h1>
          <p className="text-gray-300 text-lg">Complete your registration and payment</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Room Details */}
          <Card className="bg-white/10 backdrop-blur-md border-white/20">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-white text-2xl">{room.title}</CardTitle>
                  <p className="text-gray-300 mt-2">{room.game}</p>
                </div>
                <Badge className={`${getDifficultyColor(room.difficulty)} text-white`}>{room.difficulty}</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {room.description && (
                <div>
                  <h3 className="text-white font-semibold mb-2">Description</h3>
                  <p className="text-gray-300">{room.description}</p>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center space-x-2">
                  <DollarSign className="h-5 w-5 text-green-400" />
                  <div>
                    <p className="text-white font-semibold">${room.entry_fee}</p>
                    <p className="text-gray-400 text-sm">Entry Fee</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Users className="h-5 w-5 text-blue-400" />
                  <div>
                    <p className="text-white font-semibold">
                      {room.current_players}/{room.max_players}
                    </p>
                    <p className="text-gray-400 text-sm">Players</p>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Calendar className="h-5 w-5 text-purple-400" />
                <div>
                  <p className="text-white font-semibold">
                    {new Date(`${room.start_date} ${room.start_time}`).toLocaleString()}
                  </p>
                  <p className="text-gray-400 text-sm">Start Time</p>
                </div>
              </div>

              {room.rules && (
                <div>
                  <h3 className="text-white font-semibold mb-2">Rules</h3>
                  <p className="text-gray-300 text-sm">{room.rules}</p>
                </div>
              )}

              <div className="text-gray-400 text-sm">Hosted by: {room.host_username || "Unknown"}</div>
            </CardContent>
          </Card>

          {/* Payment Section */}
          <div className="space-y-6">
            {/* Prize Pool */}
            <Card className="bg-white/10 backdrop-blur-md border-white/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Trophy className="h-5 w-5 mr-2" />
                  Prize Distribution
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-400">
                    ${(room.prize_pool + room.entry_fee).toFixed(2)}
                  </div>
                  <p className="text-gray-300 text-sm">Total Prize Pool</p>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">🥇 1st Place (60%)</span>
                    <span className="text-yellow-400 font-semibold">${calculatePrizes().first}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">🥈 2nd Place (25%)</span>
                    <span className="text-gray-400 font-semibold">${calculatePrizes().second}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">🥉 3rd Place (15%)</span>
                    <span className="text-orange-400 font-semibold">${calculatePrizes().third}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Payment Method */}
            <Card className="bg-white/10 backdrop-blur-md border-white/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <CreditCard className="h-5 w-5 mr-2" />
                  Payment Method
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <label className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="radio"
                      name="payment"
                      value="card"
                      checked={paymentMethod === "card"}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="text-purple-600"
                    />
                    <span className="text-white">Credit/Debit Card</span>
                  </label>
                  <label className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="radio"
                      name="payment"
                      value="paypal"
                      checked={paymentMethod === "paypal"}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="text-purple-600"
                    />
                    <span className="text-white">PayPal</span>
                  </label>
                  <label className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="radio"
                      name="payment"
                      value="crypto"
                      checked={paymentMethod === "crypto"}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="text-purple-600"
                    />
                    <span className="text-white">Cryptocurrency</span>
                  </label>
                </div>

                <div className="border-t border-white/20 pt-4">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-gray-300">Entry Fee:</span>
                    <span className="text-white font-semibold">${room.entry_fee}</span>
                  </div>
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-gray-300">Processing Fee:</span>
                    <span className="text-white font-semibold">$0.00</span>
                  </div>
                  <div className="border-t border-white/20 pt-2">
                    <div className="flex justify-between items-center">
                      <span className="text-white font-semibold">Total:</span>
                      <span className="text-green-400 font-bold text-xl">${room.entry_fee}</span>
                    </div>
                  </div>
                </div>

                <Button
                  onClick={handleRegister}
                  disabled={registering || room.current_players >= room.max_players}
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3"
                >
                  {registering ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Processing...
                    </>
                  ) : room.current_players >= room.max_players ? (
                    "Tournament Full"
                  ) : (
                    `Pay $${room.entry_fee} & Join Tournament`
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <PaymentAnimation isVisible={showAnimation} onComplete={handleAnimationComplete} />
    </div>
  )
}
