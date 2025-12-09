"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { Search, Menu, X, Heart, User, ShoppingCart, LayoutGrid, Settings } from "lucide-react"
import { categories } from "@/lib/data"
import { useStore } from "@/lib/store"

export function Header() {
  const router = useRouter()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isCatalogOpen, setIsCatalogOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [mounted, setMounted] = useState(false)

  const { getCartCount, user, isAuthenticated } = useStore()
  const cartCount = getCartCount()

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`)
      setSearchQuery("")
    }
  }

  return (
    <header className="sticky top-0 z-50 w-full bg-loki-black border-b border-loki-border-gray">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <div className="w-9 h-9 bg-loki-turquoise rounded-lg flex items-center justify-center">
              <span className="text-loki-black font-bold text-lg">L</span>
            </div>
            <span className="hidden sm:block text-lg font-bold text-white">LokiStore</span>
          </Link>

          {/* Catalog button */}
          <button
            onClick={() => setIsCatalogOpen(!isCatalogOpen)}
            className={`hidden lg:flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-all ${
              isCatalogOpen
                ? "bg-loki-turquoise text-loki-black"
                : "bg-loki-dark-gray text-white hover:bg-loki-card-gray"
            }`}
          >
            <LayoutGrid className="w-4 h-4" />
            Каталог
          </button>

          {/* Search */}
          <form onSubmit={handleSearch} className="flex-1 max-w-xl">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-loki-soft-gray" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Пошук..."
                className="w-full h-10 pl-10 pr-4 bg-loki-dark-gray border border-loki-border-gray rounded-lg text-white placeholder:text-loki-soft-gray focus:outline-none focus:border-loki-turquoise transition-colors text-sm"
              />
            </div>
          </form>

          {/* Actions */}
          <div className="flex items-center gap-1">
            {isAuthenticated && user?.role === 'admin' && (
              <Link
                href="/admin"
                className="p-2 text-loki-soft-gray hover:text-white rounded-lg hover:bg-loki-dark-gray transition-colors"
                title="Адмін панель"
              >
                <Settings className="w-5 h-5" />
              </Link>
            )}
            <Link
              href="/profile"
              className="p-2 text-loki-soft-gray hover:text-white rounded-lg hover:bg-loki-dark-gray transition-colors"
            >
              <User className="w-5 h-5" />
            </Link>

            <Link
              href="/wishlist"
              className="p-2 text-loki-soft-gray hover:text-white rounded-lg hover:bg-loki-dark-gray transition-colors"
            >
              <Heart className="w-5 h-5" />
            </Link>

            <Link
              href="/cart"
              className="relative p-2 text-loki-soft-gray hover:text-white rounded-lg hover:bg-loki-dark-gray transition-colors"
            >
              <ShoppingCart className="w-5 h-5" />
              {mounted && cartCount > 0 && (
                <span className="absolute top-0.5 right-0.5 w-4 h-4 bg-loki-turquoise text-loki-black text-xs font-bold rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>

            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden p-2 text-loki-soft-gray hover:text-white transition-colors"
            >
              {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Catalog dropdown */}
      <AnimatePresence>
        {isCatalogOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full left-0 w-full bg-loki-dark-gray border-b border-loki-border-gray"
          >
            <div className="container mx-auto px-4 py-6">
              <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {categories.map((category) => (
                  <Link
                    key={category.id}
                    href={`/category/${category.id}`}
                    onClick={() => setIsCatalogOpen(false)}
                    className="group p-3 rounded-lg hover:bg-loki-card-gray transition-colors text-center"
                  >
                    <span className="text-sm text-loki-soft-gray group-hover:text-white transition-colors">
                      {category.name}
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-loki-dark-gray border-b border-loki-border-gray overflow-hidden"
          >
            <div className="container mx-auto px-4 py-4 space-y-1">
              {categories.map((category) => (
                <Link
                  key={category.id}
                  href={`/category/${category.id}`}
                  onClick={() => setIsMenuOpen(false)}
                  className="block px-3 py-2 rounded-lg text-loki-soft-gray hover:text-white hover:bg-loki-card-gray transition-colors"
                >
                  {category.name}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
