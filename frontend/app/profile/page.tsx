"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"
import { User, Package, Heart, Settings, LogOut, ChevronRight, Edit2 } from "lucide-react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { useStore } from "@/lib/store"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function ProfilePage() {
  const router = useRouter()
  const { user, isAuthenticated, logout, updateProfile, orders, loadOrders } = useStore()

  useEffect(() => {
    if (isAuthenticated) {
      loadOrders()
    }
  }, [isAuthenticated, loadOrders])

  const [activeTab, setActiveTab] = useState<"orders" | "settings">("orders")
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    name: user?.name || "",
    phone: user?.phone || "",
    address: user?.address || "",
  })

  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen bg-loki-black">
        <Header />
        <div className="container mx-auto px-4 py-20 text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Увійдіть в акаунт</h1>
          <p className="text-loki-soft-gray mb-6">Щоб переглянути профіль, потрібно авторизуватися</p>
          <Link href="/auth">
            <Button className="bg-loki-turquoise text-loki-black">Увійти</Button>
          </Link>
        </div>
        <Footer />
      </div>
    )
  }

  const handleLogout = () => {
    logout()
    router.push("/")
  }

  const handleSaveProfile = () => {
    updateProfile(formData)
    setIsEditing(false)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "delivered":
        return "text-green-500 bg-green-500/20"
      case "shipped":
        return "text-blue-500 bg-blue-500/20"
      case "processing":
        return "text-yellow-500 bg-yellow-500/20"
      default:
        return "text-loki-soft-gray bg-loki-dark-gray"
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "delivered":
        return "Доставлено"
      case "shipped":
        return "В дорозі"
      case "processing":
        return "Обробляється"
      default:
        return "Очікує"
    }
  }

  return (
    <div className="min-h-screen bg-loki-black">
      <Header />

      <main className="container mx-auto px-4 py-8">
        {/* Breadcrumbs */}
        <div className="flex items-center gap-2 text-sm text-loki-soft-gray mb-8">
          <Link href="/" className="hover:text-white transition-colors">
            Головна
          </Link>
          <span>/</span>
          <span className="text-white">Профіль</span>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-loki-dark-gray rounded-xl border border-loki-border-gray p-6">
              {/* User Info */}
              <div className="text-center mb-6">
                <div className="w-20 h-20 bg-loki-turquoise/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <User className="w-10 h-10 text-loki-turquoise" />
                </div>
                <h2 className="text-lg font-bold text-white">{user.name}</h2>
                <p className="text-sm text-loki-soft-gray">{user.email}</p>
              </div>

              {/* Navigation */}
              <nav className="space-y-1">
                <button
                  onClick={() => setActiveTab("orders")}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    activeTab === "orders"
                      ? "bg-loki-turquoise/20 text-loki-turquoise"
                      : "text-loki-soft-gray hover:text-white hover:bg-loki-card-gray"
                  }`}
                >
                  <Package className="w-5 h-5" />
                  Мої замовлення
                  <ChevronRight className="w-4 h-4 ml-auto" />
                </button>

                <Link
                  href="/wishlist"
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-loki-soft-gray hover:text-white hover:bg-loki-card-gray transition-colors"
                >
                  <Heart className="w-5 h-5" />
                  Список бажань
                  <ChevronRight className="w-4 h-4 ml-auto" />
                </Link>

                <button
                  onClick={() => setActiveTab("settings")}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    activeTab === "settings"
                      ? "bg-loki-turquoise/20 text-loki-turquoise"
                      : "text-loki-soft-gray hover:text-white hover:bg-loki-card-gray"
                  }`}
                >
                  <Settings className="w-5 h-5" />
                  Налаштування
                  <ChevronRight className="w-4 h-4 ml-auto" />
                </button>

                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-loki-neon-red hover:bg-loki-neon-red/10 transition-colors"
                >
                  <LogOut className="w-5 h-5" />
                  Вийти
                </button>
              </nav>
            </div>
          </div>

          {/* Content */}
          <div className="lg:col-span-3">
            {/* Orders Tab */}
            {activeTab === "orders" && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                <h1 className="text-2xl font-bold text-white">Мої замовлення</h1>

                {orders.length === 0 ? (
                  <div className="bg-loki-dark-gray rounded-xl border border-loki-border-gray p-12 text-center">
                    <Package className="w-16 h-16 text-loki-soft-gray mx-auto mb-4" />
                    <p className="text-loki-soft-gray mb-4">У вас ще немає замовлень</p>
                    <Link href="/category/all">
                      <Button className="bg-loki-turquoise text-loki-black">До каталогу</Button>
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {orders.map((order) => (
                      <div key={order.id} className="bg-loki-dark-gray rounded-xl border border-loki-border-gray p-6">
                        <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
                          <div>
                            <p className="text-white font-medium">{order.id}</p>
                            <p className="text-sm text-loki-soft-gray">
                              {new Date(order.date).toLocaleDateString("uk-UA")}
                            </p>
                          </div>
                          <span
                            className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}
                          >
                            {getStatusLabel(order.status)}
                          </span>
                        </div>

                        <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
                          {order.items.slice(0, 4).map((item, i) => (
                            <div
                              key={i}
                              className="relative w-16 h-16 bg-loki-card-gray rounded-lg overflow-hidden shrink-0"
                            >
                              <Image
                                src={item.product.image || "/placeholder.svg"}
                                alt={item.product.name}
                                fill
                                className="object-contain p-1"
                              />
                            </div>
                          ))}
                          {order.items.length > 4 && (
                            <div className="w-16 h-16 bg-loki-card-gray rounded-lg flex items-center justify-center shrink-0">
                              <span className="text-loki-soft-gray text-sm">+{order.items.length - 4}</span>
                            </div>
                          )}
                        </div>

                        <div className="flex items-center justify-between">
                          <p className="text-sm text-loki-soft-gray">{order.address}</p>
                          <p className="text-lg font-bold text-white">{order.total.toLocaleString("uk-UA")} ₴</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}

            {/* Settings Tab */}
            {activeTab === "settings" && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                <div className="flex items-center justify-between">
                  <h1 className="text-2xl font-bold text-white">Налаштування</h1>
                  {!isEditing && (
                    <Button
                      variant="outline"
                      onClick={() => setIsEditing(true)}
                      className="border-loki-border-gray text-white hover:bg-loki-dark-gray bg-transparent"
                    >
                      <Edit2 className="w-4 h-4 mr-2" />
                      Редагувати
                    </Button>
                  )}
                </div>

                <div className="bg-loki-dark-gray rounded-xl border border-loki-border-gray p-6 space-y-4">
                  <div>
                    <label className="block text-sm text-loki-soft-gray mb-2">{"Ім'я"}</label>
                    {isEditing ? (
                      <Input
                        value={formData.name}
                        onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                        className="bg-loki-card-gray border-loki-border-gray text-white"
                      />
                    ) : (
                      <p className="text-white">{user.name}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm text-loki-soft-gray mb-2">Email</label>
                    <p className="text-white">{user.email}</p>
                  </div>

                  <div>
                    <label className="block text-sm text-loki-soft-gray mb-2">Телефон</label>
                    {isEditing ? (
                      <Input
                        value={formData.phone}
                        onChange={(e) => setFormData((prev) => ({ ...prev, phone: e.target.value }))}
                        className="bg-loki-card-gray border-loki-border-gray text-white"
                        placeholder="+380 99 123 45 67"
                      />
                    ) : (
                      <p className="text-white">{user.phone || "Не вказано"}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm text-loki-soft-gray mb-2">Адреса доставки</label>
                    {isEditing ? (
                      <Input
                        value={formData.address}
                        onChange={(e) => setFormData((prev) => ({ ...prev, address: e.target.value }))}
                        className="bg-loki-card-gray border-loki-border-gray text-white"
                        placeholder="Місто, вулиця, будинок"
                      />
                    ) : (
                      <p className="text-white">{user.address || "Не вказано"}</p>
                    )}
                  </div>

                  {isEditing && (
                    <div className="flex gap-3 pt-4">
                      <Button
                        onClick={handleSaveProfile}
                        className="bg-loki-turquoise text-loki-black hover:bg-loki-turquoise/90"
                      >
                        Зберегти
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => setIsEditing(false)}
                        className="border-loki-border-gray text-white hover:bg-loki-card-gray bg-transparent"
                      >
                        Скасувати
                      </Button>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
