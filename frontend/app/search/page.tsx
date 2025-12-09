"use client"

import { useMemo } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { motion } from "framer-motion"
import { Search } from "lucide-react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ProductCard } from "@/components/product-card"
import { allProducts } from "@/lib/data"

export default function SearchPage() {
  const searchParams = useSearchParams()
  const query = searchParams.get("q") || ""

  const results = useMemo(() => {
    if (!query) return []
    const lowerQuery = query.toLowerCase()
    return allProducts.filter(
      (product) =>
        product.name.toLowerCase().includes(lowerQuery) || product.category.toLowerCase().includes(lowerQuery),
    )
  }, [query])

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
          <span className="text-white">Пошук</span>
        </div>

        <h1 className="text-3xl font-bold text-white mb-2">Результати пошуку</h1>
        {query && (
          <p className="text-loki-soft-gray mb-8">
            За запитом <span className="text-loki-turquoise">{`"${query}"`}</span> знайдено {results.length}{" "}
            {results.length === 1 ? "товар" : results.length < 5 ? "товари" : "товарів"}
          </p>
        )}

        {!query ? (
          <div className="text-center py-20">
            <div className="w-24 h-24 bg-loki-dark-gray rounded-full flex items-center justify-center mx-auto mb-6">
              <Search className="w-12 h-12 text-loki-soft-gray" />
            </div>
            <h2 className="text-xl font-semibold text-white mb-3">Введіть пошуковий запит</h2>
            <p className="text-loki-soft-gray">Почніть вводити назву товару або категорії</p>
          </div>
        ) : results.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-24 h-24 bg-loki-dark-gray rounded-full flex items-center justify-center mx-auto mb-6">
              <Search className="w-12 h-12 text-loki-soft-gray" />
            </div>
            <h2 className="text-xl font-semibold text-white mb-3">Нічого не знайдено</h2>
            <p className="text-loki-soft-gray mb-6">Спробуйте змінити пошуковий запит</p>
            <Link
              href="/category/all"
              className="inline-flex items-center gap-2 px-6 py-3 bg-loki-turquoise text-loki-black rounded-lg font-medium hover:bg-loki-turquoise/90 transition-colors"
            >
              Переглянути каталог
            </Link>
          </div>
        ) : (
          <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {results.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <ProductCard product={product} />
              </motion.div>
            ))}
          </motion.div>
        )}
      </main>

      <Footer />
    </div>
  )
}
