"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Gamepad2, ShoppingCart, Search, Star } from "lucide-react"
import { getStoreItems, type StoreItem } from "@/lib/localStorage"

export default function StorePage() {
  const [items, setItems] = useState<StoreItem[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [cart, setCart] = useState<string[]>([])

  useEffect(() => {
    const storeItems = getStoreItems()
    setItems(storeItems)
  }, [])

  const categories = [
    { id: "all", name: "All Items" },
    { id: "gear", name: "Gaming Gear" },
    { id: "skins", name: "Game Skins" },
    { id: "accessories", name: "Accessories" },
    { id: "merchandise", name: "Merchandise" },
  ]

  const filteredItems = items.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "all" || item.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const addToCart = (itemId: string) => {
    setCart((prev) => [...prev, itemId])
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "gear":
        return "bg-blue-500"
      case "skins":
        return "bg-purple-500"
      case "accessories":
        return "bg-green-500"
      case "merchandise":
        return "bg-orange-500"
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
              <Link href="/store" className="text-purple-400 font-semibold">
                Store
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="outline" className="border-white/20 text-white hover:bg-white/10 bg-transparent">
                <ShoppingCart className="h-4 w-4 mr-2" />
                Cart ({cart.length})
              </Button>
              <Link href="/profile">
                <Button variant="outline" className="border-white/20 text-white hover:bg-white/10 bg-transparent">
                  Profile
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">🛒 Esports Store</h1>
          <p className="text-gray-300 text-lg">Get the best gaming gear and exclusive items</p>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search items..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-white/10 border-white/20 text-white placeholder-gray-400"
            />
          </div>
          <div className="flex space-x-2">
            {categories.map((category) => (
              <Button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                variant={selectedCategory === category.id ? "default" : "outline"}
                className={
                  selectedCategory === category.id
                    ? "bg-purple-600 text-white"
                    : "border-white/20 text-white hover:bg-white/10 bg-transparent"
                }
              >
                {category.name}
              </Button>
            ))}
          </div>
        </div>

        {/* Featured Items */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-white mb-6">🔥 Featured Items</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {items.slice(0, 3).map((item) => (
              <Card
                key={item.id}
                className="bg-white/10 backdrop-blur-md border-white/20 hover:bg-white/15 transition-all duration-300"
              >
                <CardHeader>
                  <div className="aspect-square bg-gray-800 rounded-lg mb-4 flex items-center justify-center">
                    <img
                      src={item.image_url || "/placeholder.svg"}
                      alt={item.name}
                      className="w-full h-full object-cover rounded-lg"
                    />
                  </div>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-white text-lg">{item.name}</CardTitle>
                      <Badge className={`${getCategoryColor(item.category)} text-white mt-2`}>{item.category}</Badge>
                    </div>
                    <div className="flex items-center">
                      <Star className="h-4 w-4 text-yellow-400 mr-1" />
                      <span className="text-white text-sm">4.8</span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-gray-300 text-sm">{item.description}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-2xl font-bold text-green-400">${item.price}</span>
                    <Button
                      onClick={() => addToCart(item.id)}
                      disabled={!item.in_stock}
                      className="bg-purple-600 hover:bg-purple-700 text-white"
                    >
                      {item.in_stock ? "Add to Cart" : "Out of Stock"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* All Items */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-6">All Items</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredItems.map((item) => (
              <Card
                key={item.id}
                className="bg-white/10 backdrop-blur-md border-white/20 hover:bg-white/15 transition-all duration-300"
              >
                <CardHeader>
                  <div className="aspect-square bg-gray-800 rounded-lg mb-4 flex items-center justify-center">
                    <img
                      src={item.image_url || "/placeholder.svg"}
                      alt={item.name}
                      className="w-full h-full object-cover rounded-lg"
                    />
                  </div>
                  <CardTitle className="text-white text-lg">{item.name}</CardTitle>
                  <Badge className={`${getCategoryColor(item.category)} text-white w-fit`}>{item.category}</Badge>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-gray-300 text-sm">{item.description}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-xl font-bold text-green-400">${item.price}</span>
                    <div className="flex items-center">
                      <Star className="h-4 w-4 text-yellow-400 mr-1" />
                      <span className="text-white text-sm">4.{Math.floor(Math.random() * 9) + 1}</span>
                    </div>
                  </div>
                  <Button
                    onClick={() => addToCart(item.id)}
                    disabled={!item.in_stock}
                    className="w-full bg-purple-600 hover:bg-purple-700 text-white"
                  >
                    {item.in_stock ? "Add to Cart" : "Out of Stock"}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
