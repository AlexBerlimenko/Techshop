"use client"

import { useState, useMemo, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import { Heart, ShoppingCart, Minus, Plus, Check, Star, Truck, Shield, RotateCcw, ChevronRight } from "lucide-react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ProductCard } from "@/components/product-card"
import { useStore } from "@/lib/store"
import { Button } from "@/components/ui/button"
import { api } from "@/lib/api"
import { convertBackendProductToFrontend } from "@/lib/utils-api"
import type { Product } from "@/lib/data"

export default function ProductPage() {
  const params = useParams()
  const router = useRouter()
  const productId = params.id as string

  const [product, setProduct] = useState<Product | null>(null)
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [categoryInfo, setCategoryInfo] = useState<{ id: string; name: string } | null>(null)

  useEffect(() => {
    async function loadProduct() {
      setLoading(true)
      try {
        const response = await api.products.getById(productId)
        if (response.success && response.data) {
          const convertedProduct = convertBackendProductToFrontend(response.data)
          setProduct(convertedProduct)
          
          if (response.data.category_slug && response.data.category_name) {
            setCategoryInfo({
              id: response.data.category_slug,
              name: response.data.category_name,
            })
          }

          const relatedRes = await api.products.getAll({ category: response.data.category_slug })
          if (relatedRes.success && relatedRes.data) {
            const related = relatedRes.data
              .filter((p: any) => p.id.toString() !== productId)
              .slice(0, 4)
              .map((p: any) => convertBackendProductToFrontend(p))
            setRelatedProducts(related)
          }
        }
      } catch (error) {
        console.error('Error loading product:', error)
      } finally {
        setLoading(false)
      }
    }
    if (productId) {
      loadProduct()
    }
  }, [productId])

  const [selectedColor, setSelectedColor] = useState("")
  const [selectedMemory, setSelectedMemory] = useState("")
  const [quantity, setQuantity] = useState(1)
  const [activeTab, setActiveTab] = useState<"description" | "specs" | "reviews">("description")

  const { addToCart, addToWishlist, removeFromWishlist, isInWishlist } = useStore()
  const inWishlist = product ? isInWishlist(product.id) : false

  useEffect(() => {
    if (product) {
      setSelectedColor(product.colors?.[0] || "")
      setSelectedMemory(product.memory?.[0] || "")
    }
  }, [product])

  if (loading) {
    return (
      <div className="min-h-screen bg-loki-black">
        <Header />
        <div className="container mx-auto px-4 py-20 text-center">
          <p className="text-loki-soft-gray">Завантаження...</p>
        </div>
        <Footer />
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-loki-black">
        <Header />
        <div className="container mx-auto px-4 py-20 text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Товар не знайдено</h1>
          <Button onClick={() => router.push("/")} className="bg-loki-turquoise text-loki-black">
            На головну
          </Button>
        </div>
        <Footer />
      </div>
    )
  }


  const handleAddToCart = () => {
    addToCart(product, quantity, selectedColor, selectedMemory)
  }

  const handleWishlist = () => {
    if (inWishlist) {
      removeFromWishlist(product.id)
    } else {
      addToWishlist(product)
    }
  }

  return (
    <div className="min-h-screen bg-loki-black">
      <Header />

      <main className="container mx-auto px-4 py-8">
        {/* Breadcrumbs */}
        <div className="flex items-center gap-2 text-sm text-loki-soft-gray mb-8 flex-wrap">
          <Link href="/" className="hover:text-white transition-colors">
            Головна
          </Link>
          <ChevronRight className="w-4 h-4" />
          {categoryInfo && (
            <>
              <Link href={`/category/${categoryInfo.id}`} className="hover:text-white transition-colors">
                {categoryInfo.name}
              </Link>
              <ChevronRight className="w-4 h-4" />
            </>
          )}
          <span className="text-white">{product.name}</span>
        </div>

        {/* Product Section */}
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 mb-16">
          {/* Images */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
            <div className="relative aspect-square bg-loki-dark-gray rounded-2xl border border-loki-border-gray overflow-hidden">
              {product.badge && (
                <span
                  className={`absolute top-4 right-4 px-3 py-1 text-xs font-bold rounded-lg z-10 ${
                    product.badge === "new"
                      ? "bg-loki-turquoise text-loki-black"
                      : product.badge === "hit"
                        ? "bg-loki-neon-purple text-white"
                        : "bg-loki-neon-red text-white"
                  }`}
                >
                  {product.badge === "new" ? "Новинка" : product.badge === "hit" ? "Хіт" : "Акція"}
                </span>
              )}
              <Image
                src={product.image || "/placeholder.svg"}
                alt={product.name}
                fill
                className="object-contain p-8"
                priority
              />
            </div>
          </motion.div>

          {/* Info */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold text-white mb-3">{product.name}</h1>

              {/* Rating */}
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${i < Math.floor(product.rating) ? "fill-yellow-400 text-yellow-400" : "text-loki-border-gray"}`}
                    />
                  ))}
                </div>
                <span className="text-loki-soft-gray text-sm">
                  {product.rating} ({product.reviews} відгуків)
                </span>
              </div>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-4">
              <span className="text-3xl lg:text-4xl font-bold text-white">
                {product.price.toLocaleString("uk-UA")} ₴
              </span>
            </div>

            {/* Stock */}
            <div className="flex items-center gap-2">
              {product.inStock ? (
                <>
                  <Check className="w-5 h-5 text-green-500" />
                  <span className="text-green-500 font-medium">В наявності</span>
                </>
              ) : (
                <span className="text-loki-neon-red font-medium">Немає в наявності</span>
              )}
            </div>

            {/* Colors */}
            {product.colors && product.colors.length > 0 && (
              <div>
                <p className="text-white font-medium mb-3">Колір</p>
                <div className="flex gap-2">
                  {product.colors.map((color) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`w-10 h-10 rounded-full border-2 transition-all ${
                        selectedColor === color ? "border-loki-turquoise scale-110" : "border-loki-border-gray"
                      }`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Memory */}
            {product.memory && product.memory.length > 0 && (
              <div>
                <p className="text-white font-medium mb-3">{"Пам'ять"}</p>
                <div className="flex flex-wrap gap-2">
                  {product.memory.map((mem) => (
                    <button
                      key={mem}
                      onClick={() => setSelectedMemory(mem)}
                      className={`px-4 py-2 rounded-lg border text-sm font-medium transition-all ${
                        selectedMemory === mem
                          ? "border-loki-turquoise bg-loki-turquoise/20 text-loki-turquoise"
                          : "border-loki-border-gray text-loki-soft-gray hover:border-loki-turquoise/50"
                      }`}
                    >
                      {mem}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity */}
            <div>
              <p className="text-white font-medium mb-3">Кількість</p>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 rounded-lg bg-loki-dark-gray border border-loki-border-gray text-white flex items-center justify-center hover:border-loki-turquoise transition-colors"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-12 text-center text-white font-medium">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-10 h-10 rounded-lg bg-loki-dark-gray border border-loki-border-gray text-white flex items-center justify-center hover:border-loki-turquoise transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-4">
              <Button
                onClick={handleAddToCart}
                disabled={!product.inStock}
                className="flex-1 h-12 bg-loki-turquoise text-loki-black font-bold hover:bg-loki-turquoise/90 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ShoppingCart className="w-5 h-5 mr-2" />
                Додати в кошик
              </Button>
              <Button
                onClick={handleWishlist}
                variant="outline"
                className={`h-12 w-12 border-loki-border-gray ${
                  inWishlist ? "bg-loki-neon-red/20 border-loki-neon-red text-loki-neon-red" : "text-white"
                } hover:bg-loki-dark-gray`}
              >
                <Heart className={`w-5 h-5 ${inWishlist ? "fill-current" : ""}`} />
              </Button>
            </div>

            {/* Benefits */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t border-loki-border-gray">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-loki-dark-gray flex items-center justify-center">
                  <Truck className="w-5 h-5 text-loki-turquoise" />
                </div>
                <div>
                  <p className="text-white text-sm font-medium">Доставка</p>
                  <p className="text-loki-soft-gray text-xs">1-3 дні</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-loki-dark-gray flex items-center justify-center">
                  <Shield className="w-5 h-5 text-loki-turquoise" />
                </div>
                <div>
                  <p className="text-white text-sm font-medium">Гарантія</p>
                  <p className="text-loki-soft-gray text-xs">12 місяців</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-loki-dark-gray flex items-center justify-center">
                  <RotateCcw className="w-5 h-5 text-loki-turquoise" />
                </div>
                <div>
                  <p className="text-white text-sm font-medium">Повернення</p>
                  <p className="text-loki-soft-gray text-xs">14 днів</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Tabs */}
        <div className="mb-16">
          <div className="flex gap-1 border-b border-loki-border-gray mb-6">
            {[
              { id: "description", label: "Опис" },
              { id: "specs", label: "Характеристики" },
              { id: "reviews", label: `Відгуки (${product.reviews})` },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`px-6 py-3 text-sm font-medium transition-colors relative ${
                  activeTab === tab.id ? "text-loki-turquoise" : "text-loki-soft-gray hover:text-white"
                }`}
              >
                {tab.label}
                {activeTab === tab.id && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-loki-turquoise"
                  />
                )}
              </button>
            ))}
          </div>

          <div className="bg-loki-dark-gray rounded-xl p-6">
            {activeTab === "description" && (
              <div className="text-loki-soft-gray space-y-4">
                <p>
                  {product.name} — це преміальний пристрій, який поєднує в собі передові технології та елегантний
                  дизайн. Створений для тих, хто цінує якість та надійність.
                </p>
                <p>
                  Завдяки потужному процесору та оптимізованому програмному забезпеченню, ви отримаєте неперевершену
                  продуктивність для будь-яких задач — від повсякденного використання до професійної роботи.
                </p>
              </div>
            )}

            {activeTab === "specs" && (
              <div className="space-y-3">
                {[
                  { label: "Бренд", value: "Apple" },
                  { label: "Модель", value: product.name },
                  { label: "Колір", value: selectedColor || "Стандартний" },
                  { label: "Пам'ять", value: selectedMemory || "Базова комплектація" },
                  { label: "Гарантія", value: "12 місяців" },
                  { label: "Країна виробник", value: "Китай" },
                ].map((spec, i) => (
                  <div
                    key={i}
                    className={`flex justify-between py-3 ${i !== 5 ? "border-b border-loki-border-gray" : ""}`}
                  >
                    <span className="text-loki-soft-gray">{spec.label}</span>
                    <span className="text-white">{spec.value}</span>
                  </div>
                ))}
              </div>
            )}

            {activeTab === "reviews" && (
              <div className="space-y-4">
                {[
                  {
                    name: "Олександр",
                    date: "15.01.2025",
                    rating: 5,
                    text: "Чудовий товар! Повністю відповідає опису. Доставка швидка.",
                  },
                  {
                    name: "Марія",
                    date: "10.01.2025",
                    rating: 4,
                    text: "Якість на висоті, трохи дорого, але воно того варте.",
                  },
                  {
                    name: "Дмитро",
                    date: "05.01.2025",
                    rating: 5,
                    text: "Купую вже не вперше в цьому магазині. Завжди задоволений!",
                  },
                ].map((review, i) => (
                  <div key={i} className="pb-4 border-b border-loki-border-gray last:border-0">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-white font-medium">{review.name}</span>
                      <span className="text-loki-soft-gray text-sm">{review.date}</span>
                    </div>
                    <div className="flex items-center gap-1 mb-2">
                      {Array.from({ length: 5 }).map((_, j) => (
                        <Star
                          key={j}
                          className={`w-4 h-4 ${j < review.rating ? "fill-yellow-400 text-yellow-400" : "text-loki-border-gray"}`}
                        />
                      ))}
                    </div>
                    <p className="text-loki-soft-gray text-sm">{review.text}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <section>
            <h2 className="text-2xl font-bold text-white mb-6">Схожі товари</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {relatedProducts.map((p, i) => (
                <ProductCard key={p.id} product={p} index={i} />
              ))}
            </div>
          </section>
        )}
      </main>

      <Footer />
    </div>
  )
}
