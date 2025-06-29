"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import { getCurrentUser, setCurrentUser, initializeDummyData, type Profile } from "@/lib/localStorage"

interface AuthContextType {
  user: Profile | null
  profile: Profile | null
  loading: boolean
  signUp: (email: string, password: string, username: string) => Promise<any>
  signIn: (email: string, password: string) => Promise<any>
  signOut: () => Promise<void>
  updateProfile: (updates: Partial<Profile>) => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<Profile | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Initialize dummy data
    initializeDummyData()

    // Check for existing user
    const currentUser = getCurrentUser()
    if (currentUser) {
      setUser(currentUser)
      setProfile(currentUser)
    }
    setLoading(false)
  }, [])

  const signUp = async (email: string, password: string, username: string) => {
    try {
      // Check if user already exists
      const existingUsers = JSON.parse(localStorage.getItem("users") || "[]")
      if (existingUsers.find((u: any) => u.email === email)) {
        throw new Error("User already exists")
      }

      const newUser: Profile = {
        id: Date.now().toString(),
        username,
        email,
        total_earnings: 0,
        games_won: 0,
        games_played: 0,
        level: 1,
        rank: "Bronze",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }

      existingUsers.push(newUser)
      localStorage.setItem("users", JSON.stringify(existingUsers))

      return { data: { user: newUser }, error: null }
    } catch (error: any) {
      return { data: null, error: { message: error.message } }
    }
  }

  const signIn = async (email: string, password: string) => {
    try {
      const existingUsers = JSON.parse(localStorage.getItem("users") || "[]")
      const user = existingUsers.find((u: any) => u.email === email)

      if (!user) {
        // Create a demo user for testing
        const demoUser: Profile = {
          id: "demo-user",
          username: "DemoPlayer",
          email,
          total_earnings: 1250,
          games_won: 15,
          games_played: 32,
          level: 25,
          rank: "Gold",
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }

        setCurrentUser(demoUser)
        setUser(demoUser)
        setProfile(demoUser)

        return { data: { user: demoUser }, error: null }
      }

      setCurrentUser(user)
      setUser(user)
      setProfile(user)

      return { data: { user }, error: null }
    } catch (error: any) {
      return { data: null, error: { message: error.message } }
    }
  }

  const signOut = async () => {
    setCurrentUser(null)
    setUser(null)
    setProfile(null)
  }

  const updateProfile = async (updates: Partial<Profile>) => {
    if (!user) return

    const updatedUser = { ...user, ...updates, updated_at: new Date().toISOString() }
    setCurrentUser(updatedUser)
    setUser(updatedUser)
    setProfile(updatedUser)

    // Update in users array
    const existingUsers = JSON.parse(localStorage.getItem("users") || "[]")
    const userIndex = existingUsers.findIndex((u: any) => u.id === user.id)
    if (userIndex !== -1) {
      existingUsers[userIndex] = updatedUser
      localStorage.setItem("users", JSON.stringify(existingUsers))
    }
  }

  const value = {
    user,
    profile,
    loading,
    signUp,
    signIn,
    signOut,
    updateProfile,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
