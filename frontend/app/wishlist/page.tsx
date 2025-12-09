"use client"

import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { Heart, Trash2, ShoppingCart } from "lucide-react"
import Image from "next/image"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { useStore } from "@/lib/store"
import { Button } from "@/components/ui/button"

export default function WishlistPage() {
  const { wishlist, removeFromWishlist, addToCart } = useStore()

  const handleAddToCart = (product: (typeof wishlist)[0]) => {
    addToCart(product)
    removeFromWishlist(product.id)
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
          <span className="text-white">Список бажань</span>
        </div>

        <h1 className="text-3xl font-bold text-white mb-8">Список бажань</h1>

        {wishlist.length === 0 ? (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center py-20">
            <div className="w-24 h-24 bg-loki-dark-gray rounded-full flex items-center justify-center mx-auto mb-6">
              <Heart className="w-12 h-12 text-loki-soft-gray" />
            </div>
            <h2 className="text-xl font-semibold text-white mb-3">Список бажань порожній</h2>
            <p className="text-loki-soft-gray mb-6">Додайте товари, які вам сподобалися</p>
            <Link href="/category/all">
              <Button className="bg-loki-turquoise text-loki-black hover:bg-loki-turquoise/90">
                Перейти до каталогу
              </Button>
            </Link>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            <AnimatePresence>
              {wishlist.map((product, index) => (
                <motion.div
                  key={product.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-loki-dark-gray rounded-xl border border-loki-border-gray overflow-hidden group"
                >
                  <Link href={`/product/${product.id}`} className="block">
                    <div className="relative aspect-square p-4 bg-gradient-to-b from-loki-card-gray/30 to-transparent">
                      <Image
                        src={product.image || "/placeholder.svg"}
                        alt={product.name}
                        fill
                        className="object-contain p-2 group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  </Link>

                  <div className="p-4 space-y-3">
                    <Link href={`/product/${product.id}`}>
                      <h3 className="text-white font-medium hover:text-loki-turquoise transition-colors line-clamp-2">
                        {product.name}
                      </h3>
                    </Link>

                    <div className="flex items-baseline gap-2">
                      <span className="text-lg font-bold text-white">{product.price.toLocaleString("uk-UA")} ₴</span>
                      {product.oldPrice && (
                        <span className="text-sm text-loki-soft-gray line-through">
                          {product.oldPrice.toLocaleString("uk-UA")} ₴
                        </span>
                      )}
                    </div>

                    <div className="flex gap-2">
                      <Button
                        onClick={() => handleAddToCart(product)}
                        className="flex-1 bg-loki-turquoise text-loki-black hover:bg-loki-turquoise/90"
                      >
                        <ShoppingCart className="w-4 h-4 mr-2" />В кошик
                      </Button>
                      <Button
                        onClick={() => removeFromWishlist(product.id)}
                        variant="outline"
                        className="border-loki-border-gray text-loki-neon-red hover:bg-loki-neon-red/10 bg-transparent"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </main>

      <Footer />
    </div>
  )
}
