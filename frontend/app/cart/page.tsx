"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { Trash2, Minus, Plus, ShoppingBag, ArrowRight } from "lucide-react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { useStore } from "@/lib/store"
import { Button } from "@/components/ui/button"

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity, getCartTotal, clearCart } = useStore()
  const [isClearing, setIsClearing] = useState(false)

  const total = getCartTotal()
  const deliveryFee = total > 2000 ? 0 : 150

  const handleClearCart = () => {
    setIsClearing(true)
    setTimeout(() => {
      clearCart()
      setIsClearing(false)
    }, 300)
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
          <span className="text-white">Кошик</span>
        </div>

        <h1 className="text-3xl font-bold text-white mb-8">Кошик</h1>

        {cart.length === 0 ? (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center py-20">
            <div className="w-24 h-24 bg-loki-dark-gray rounded-full flex items-center justify-center mx-auto mb-6">
              <ShoppingBag className="w-12 h-12 text-loki-soft-gray" />
            </div>
            <h2 className="text-xl font-semibold text-white mb-3">Кошик порожній</h2>
            <p className="text-loki-soft-gray mb-6">Додайте товари, щоб оформити замовлення</p>
            <Link href="/category/all">
              <Button className="bg-loki-turquoise text-loki-black hover:bg-loki-turquoise/90">
                Перейти до каталогу
              </Button>
            </Link>
          </motion.div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              <div className="flex items-center justify-between mb-4">
                <span className="text-loki-soft-gray">
                  {cart.length} {cart.length === 1 ? "товар" : cart.length < 5 ? "товари" : "товарів"}
                </span>
                <button
                  onClick={handleClearCart}
                  disabled={isClearing}
                  className="text-sm text-loki-soft-gray hover:text-loki-neon-red transition-colors"
                >
                  Очистити кошик
                </button>
              </div>

              <AnimatePresence>
                {cart.map((item) => (
                  <motion.div
                    key={`${item.product.id}-${item.selectedColor}-${item.selectedMemory}`}
                    layout
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20, height: 0 }}
                    className="bg-loki-dark-gray rounded-xl border border-loki-border-gray p-4 flex gap-4"
                  >
                    {/* Image */}
                    <Link href={`/product/${item.product.id}`} className="shrink-0">
                      <div className="relative w-24 h-24 bg-loki-card-gray rounded-lg overflow-hidden">
                        <Image
                          src={item.product.image || "/placeholder.svg"}
                          alt={item.product.name}
                          fill
                          className="object-contain p-2"
                        />
                      </div>
                    </Link>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <Link href={`/product/${item.product.id}`}>
                        <h3 className="text-white font-medium hover:text-loki-turquoise transition-colors line-clamp-2">
                          {item.product.name}
                        </h3>
                      </Link>

                      {/* Variants */}
                      <div className="flex flex-wrap gap-2 mt-2 text-sm text-loki-soft-gray">
                        {item.selectedColor && (
                          <span className="flex items-center gap-1">
                            <span
                              className="w-3 h-3 rounded-full border border-loki-border-gray"
                              style={{ backgroundColor: item.selectedColor }}
                            />
                            Колір
                          </span>
                        )}
                        {item.selectedMemory && <span>{item.selectedMemory}</span>}
                      </div>

                      {/* Price & Quantity */}
                      <div className="flex items-center justify-between mt-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                            className="w-8 h-8 rounded-lg bg-loki-card-gray text-white flex items-center justify-center hover:bg-loki-turquoise/20 transition-colors"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="w-8 text-center text-white">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                            className="w-8 h-8 rounded-lg bg-loki-card-gray text-white flex items-center justify-center hover:bg-loki-turquoise/20 transition-colors"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>

                        <div className="flex items-center gap-4">
                          <span className="text-white font-bold">
                            {(item.product.price * item.quantity).toLocaleString("uk-UA")} ₴
                          </span>
                          <button
                            onClick={() => removeFromCart(item.product.id)}
                            className="p-2 text-loki-soft-gray hover:text-loki-neon-red transition-colors"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* Summary */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 bg-loki-dark-gray rounded-xl border border-loki-border-gray p-6 space-y-4">
                <h2 className="text-xl font-bold text-white">Разом</h2>

                <div className="space-y-3 pb-4 border-b border-loki-border-gray">
                  <div className="flex justify-between text-sm">
                    <span className="text-loki-soft-gray">Товари</span>
                    <span className="text-white">{total.toLocaleString("uk-UA")} ₴</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-loki-soft-gray">Доставка</span>
                    <span className={deliveryFee === 0 ? "text-green-500" : "text-white"}>
                      {deliveryFee === 0 ? "Безкоштовно" : `${deliveryFee} ₴`}
                    </span>
                  </div>
                </div>

                <div className="flex justify-between">
                  <span className="text-lg font-bold text-white">До сплати</span>
                  <span className="text-lg font-bold text-loki-turquoise">
                    {(total + deliveryFee).toLocaleString("uk-UA")} ₴
                  </span>
                </div>

                {total < 2000 && (
                  <p className="text-xs text-loki-soft-gray">
                    Додайте товарів на {(2000 - total).toLocaleString("uk-UA")} ₴ для безкоштовної доставки
                  </p>
                )}

                <Link href="/checkout" className="block">
                  <Button className="w-full h-12 bg-loki-turquoise text-loki-black font-bold hover:bg-loki-turquoise/90">
                    Оформити замовлення
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </Link>

                <Link href="/category/all" className="block">
                  <Button
                    variant="outline"
                    className="w-full border-loki-border-gray text-white hover:bg-loki-card-gray bg-transparent"
                  >
                    Продовжити покупки
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  )
}
