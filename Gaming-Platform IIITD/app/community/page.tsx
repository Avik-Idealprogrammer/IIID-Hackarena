"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Gamepad2, Send, MessageCircle, Users, Hash } from "lucide-react"
import { useAuth } from "@/contexts/AuthContext"
import { getChatMessages, saveChatMessage, type ChatMessage } from "@/lib/localStorage"

export default function CommunityPage() {
  const { user } = useAuth()
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [newMessage, setNewMessage] = useState("")
  const [activeChannel, setActiveChannel] = useState("general")

  const channels = [
    { id: "general", name: "General", icon: Hash },
    { id: "tournaments", name: "Tournaments", icon: MessageCircle },
    { id: "looking-for-team", name: "Looking for Team", icon: Users },
    { id: "fortnite", name: "Fortnite", icon: Gamepad2 },
    { id: "cs2", name: "CS2", icon: Gamepad2 },
    { id: "valorant", name: "Valorant", icon: Gamepad2 },
  ]

  useEffect(() => {
    const chatMessages = getChatMessages()
    setMessages(chatMessages)
  }, [])

  const handleSendMessage = () => {
    if (!newMessage.trim() || !user) return

    const message: ChatMessage = {
      id: Date.now().toString(),
      user_id: user.id,
      username: user.username,
      message: newMessage.trim(),
      timestamp: new Date().toISOString(),
      room_id: activeChannel,
    }

    saveChatMessage(message)
    setMessages((prev) => [...prev, message])
    setNewMessage("")
  }

  const filteredMessages = messages.filter((msg) => !msg.room_id || msg.room_id === activeChannel)

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    })
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
              <Link href="/community" className="text-purple-400 font-semibold">
                Community
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
          <h1 className="text-4xl font-bold text-white mb-4">💬 Community Chat</h1>
          <p className="text-gray-300 text-lg">Connect with fellow gamers and discuss strategies</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Channels Sidebar */}
          <Card className="bg-white/10 backdrop-blur-md border-white/20 lg:col-span-1">
            <CardHeader>
              <CardTitle className="text-white">Channels</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {channels.map((channel) => {
                const Icon = channel.icon
                return (
                  <Button
                    key={channel.id}
                    onClick={() => setActiveChannel(channel.id)}
                    variant={activeChannel === channel.id ? "default" : "ghost"}
                    className={`w-full justify-start ${
                      activeChannel === channel.id ? "bg-purple-600 text-white" : "text-gray-300 hover:bg-white/10"
                    }`}
                  >
                    <Icon className="h-4 w-4 mr-2" />
                    {channel.name}
                  </Button>
                )
              })}
            </CardContent>
          </Card>

          {/* Chat Area */}
          <Card className="bg-white/10 backdrop-blur-md border-white/20 lg:col-span-3">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Hash className="h-5 w-5 mr-2" />#{channels.find((c) => c.id === activeChannel)?.name || "general"}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Messages */}
              <div className="h-96 overflow-y-auto space-y-4 p-4 bg-black/20 rounded-lg">
                {filteredMessages.map((message) => (
                  <div key={message.id} className="flex items-start space-x-3">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-purple-600 text-white text-xs">
                        {message.username.slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <span className="text-white font-semibold text-sm">{message.username}</span>
                        <span className="text-gray-400 text-xs">{formatTime(message.timestamp)}</span>
                      </div>
                      <p className="text-gray-300 text-sm mt-1">{message.message}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Message Input */}
              {user ? (
                <div className="flex space-x-2">
                  <Input
                    placeholder={`Message #${channels.find((c) => c.id === activeChannel)?.name || "general"}`}
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                    className="bg-white/10 border-white/20 text-white placeholder-gray-400"
                  />
                  <Button onClick={handleSendMessage} className="bg-purple-600 hover:bg-purple-700">
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <div className="text-center text-gray-400">
                  <Link href="/login" className="text-purple-400 hover:text-purple-300">
                    Login to join the conversation
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Community Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <Card className="bg-white/10 backdrop-blur-md border-white/20">
            <CardContent className="p-6 text-center">
              <Users className="h-8 w-8 text-blue-400 mx-auto mb-2" />
              <h3 className="text-2xl font-bold text-white">2,547</h3>
              <p className="text-gray-300">Online Members</p>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur-md border-white/20">
            <CardContent className="p-6 text-center">
              <MessageCircle className="h-8 w-8 text-green-400 mx-auto mb-2" />
              <h3 className="text-2xl font-bold text-white">15,892</h3>
              <p className="text-gray-300">Messages Today</p>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur-md border-white/20">
            <CardContent className="p-6 text-center">
              <Gamepad2 className="h-8 w-8 text-purple-400 mx-auto mb-2" />
              <h3 className="text-2xl font-bold text-white">342</h3>
              <p className="text-gray-300">Active Tournaments</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
