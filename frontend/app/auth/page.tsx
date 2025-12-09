"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { Mail, Lock, User, Eye, EyeOff, ArrowRight } from "lucide-react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { useStore } from "@/lib/store"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function AuthPage() {
  const router = useRouter()
  const { login, register, isAuthenticated, user } = useStore()

  const [mode, setMode] = useState<"login" | "register">("login")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  })

  useEffect(() => {
    if (isAuthenticated) {
      // Перевіряємо, чи користувач не намагається зайти в адмінку
      const currentPath = window.location.pathname
      if (currentPath === '/auth') {
        // Якщо користувач адмін і намагався зайти в адмінку, редиректимо туди
        if (user?.role === 'admin') {
          const returnTo = sessionStorage.getItem('returnTo')
          if (returnTo === '/admin') {
            sessionStorage.removeItem('returnTo')
            router.push('/admin')
            return
          }
        }
        router.push("/profile")
      }
    }
  }, [isAuthenticated, user, router])

  if (isAuthenticated) {
    return null
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    setError("")
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      if (mode === "register") {
        if (formData.password !== formData.confirmPassword) {
          setError("Паролі не співпадають")
          setIsLoading(false)
          return
        }
        const success = await register(formData.email, formData.password, formData.name)
        if (success) {
          router.push("/profile")
        } else {
          setError("Помилка реєстрації. Спробуйте ще раз.")
        }
      } else {
        const success = await login(formData.email, formData.password)
        if (success) {
          router.push("/profile")
        } else {
          setError("Невірний email або пароль")
        }
      }
    } catch {
      setError("Щось пішло не так. Спробуйте пізніше.")
    }

    setIsLoading(false)
  }

  return (
    <div className="min-h-screen bg-loki-black">
      <Header />

      <main className="container mx-auto px-4 py-12">
        <div className="max-w-md mx-auto">
          {/* Tabs */}
          <div className="flex bg-loki-dark-gray rounded-lg p-1 mb-8">
            <button
              onClick={() => setMode("login")}
              className={`flex-1 py-3 rounded-md text-sm font-medium transition-colors ${
                mode === "login" ? "bg-loki-turquoise text-loki-black" : "text-loki-soft-gray hover:text-white"
              }`}
            >
              Вхід
            </button>
            <button
              onClick={() => setMode("register")}
              className={`flex-1 py-3 rounded-md text-sm font-medium transition-colors ${
                mode === "register" ? "bg-loki-turquoise text-loki-black" : "text-loki-soft-gray hover:text-white"
              }`}
            >
              Реєстрація
            </button>
          </div>

          {/* Form */}
          <motion.div
            key={mode}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-loki-dark-gray rounded-xl border border-loki-border-gray p-6"
          >
            <h1 className="text-2xl font-bold text-white mb-6 text-center">
              {mode === "login" ? "Вітаємо знову!" : "Створити акаунт"}
            </h1>

            <form onSubmit={handleSubmit} className="space-y-4">
              <AnimatePresence mode="wait">
                {mode === "register" && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                  >
                    <label className="block text-sm text-loki-soft-gray mb-2">{"Ім'я"}</label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-loki-soft-gray" />
                      <Input
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required={mode === "register"}
                        className="pl-10 bg-loki-card-gray border-loki-border-gray text-white"
                        placeholder="Ваше ім'я"
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div>
                <label className="block text-sm text-loki-soft-gray mb-2">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-loki-soft-gray" />
                  <Input
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="pl-10 bg-loki-card-gray border-loki-border-gray text-white"
                    placeholder="example@email.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm text-loki-soft-gray mb-2">Пароль</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-loki-soft-gray" />
                  <Input
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                    minLength={6}
                    className="pl-10 pr-10 bg-loki-card-gray border-loki-border-gray text-white"
                    placeholder="Мінімум 6 символів"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-loki-soft-gray hover:text-white transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <AnimatePresence mode="wait">
                {mode === "register" && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                  >
                    <label className="block text-sm text-loki-soft-gray mb-2">Підтвердіть пароль</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-loki-soft-gray" />
                      <Input
                        name="confirmPassword"
                        type="password"
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        required={mode === "register"}
                        className="pl-10 bg-loki-card-gray border-loki-border-gray text-white"
                        placeholder="Повторіть пароль"
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {error && (
                <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-loki-neon-red text-sm">
                  {error}
                </motion.p>
              )}

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-12 bg-loki-turquoise text-loki-black font-bold hover:bg-loki-turquoise/90 disabled:opacity-50"
              >
                {isLoading ? "Зачекайте..." : mode === "login" ? "Увійти" : "Зареєструватися"}
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </form>

            {mode === "login" && (
              <p className="text-center text-sm text-loki-soft-gray mt-4">
                <Link href="/forgot-password" className="text-loki-turquoise hover:underline">
                  Забули пароль?
                </Link>
              </p>
            )}
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
