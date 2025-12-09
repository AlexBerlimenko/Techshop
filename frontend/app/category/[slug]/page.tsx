"use client"

import { useState, useMemo, useEffect } from "react"
import { useParams } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { SlidersHorizontal, ChevronDown, Grid3X3, LayoutList, X } from "lucide-react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ProductCard } from "@/components/product-card"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Slider } from "@/components/ui/slider"
import { api } from "@/lib/api"
import { convertBackendProductToFrontend, convertBackendCategoryToFrontend } from "@/lib/utils-api"
import type { Product } from "@/lib/data"

const sortOptions = [
  { value: "popular", label: "За популярністю" },
  { value: "price-asc", label: "Від дешевих" },
  { value: "price-desc", label: "Від дорогих" },
  { value: "rating", label: "За рейтингом" },
  { value: "new", label: "Новинки" },
]

export default function CategoryPage() {
  const params = useParams()
  const slug = params.slug as string

  const [sortBy, setSortBy] = useState("popular")
  const [priceRange, setPriceRange] = useState([0, 100000])
  const [showFilters, setShowFilters] = useState(false)
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [selectedBrands, setSelectedBrands] = useState<string[]>([])
  const [inStockOnly, setInStockOnly] = useState(false)
  const [showSortDropdown, setShowSortDropdown] = useState(false)
  const [categories, setCategories] = useState<Array<{ id: string; name: string; image: string; count: number }>>([])
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadData() {
      setLoading(true)
      try {
        const [categoriesRes, productsRes] = await Promise.all([
          api.categories.getAll(),
          api.products.getAll({ category: slug !== 'all' ? slug : undefined }),
        ])

        if (categoriesRes.success && categoriesRes.data) {
          setCategories(categoriesRes.data.map((cat) => convertBackendCategoryToFrontend(cat)))
        }

        if (productsRes.success && productsRes.data) {
          setProducts(productsRes.data.map((prod) => convertBackendProductToFrontend(prod)))
        }
      } catch (error) {
        console.error('Error loading data:', error)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [slug])

  const category = categories.find((c) => c.id === slug)

  const filteredProducts = useMemo(() => {
    let filtered = slug === "all" ? products : products.filter((p) => p.category === slug)

    // Price filter
    filtered = filtered.filter((p) => p.price >= priceRange[0] && p.price <= priceRange[1])

    // Stock filter
    if (inStockOnly) {
      filtered = filtered.filter((p) => p.inStock)
    }

    // Sort
    switch (sortBy) {
      case "price-asc":
        filtered.sort((a, b) => a.price - b.price)
        break
      case "price-desc":
        filtered.sort((a, b) => b.price - a.price)
        break
      case "rating":
        filtered.sort((a, b) => b.rating - a.rating)
        break
      case "new":
        filtered = filtered.filter((p) => p.badge === "new")
        break
    }

    return filtered
  }, [slug, sortBy, priceRange, inStockOnly])

  return (
    <div className="min-h-screen bg-loki-black">
      <Header />

      <main className="container mx-auto px-4 py-8">
        {/* Breadcrumbs */}
        <div className="flex items-center gap-2 text-sm text-loki-soft-gray mb-6">
          <a href="/" className="hover:text-white transition-colors">
            Головна
          </a>
          <span>/</span>
          <span className="text-white">{category?.name || "Всі товари"}</span>
        </div>

        {/* Title */}
        <h1 className="text-3xl font-bold text-white mb-8">{category?.name || "Всі товари"}</h1>

        <div className="flex gap-8">
          {/* Filters Sidebar - Desktop */}
          <aside className="hidden lg:block w-64 shrink-0">
            <div className="sticky top-24 space-y-6">
              {/* Price Range */}
              <div className="bg-loki-dark-gray rounded-xl p-5">
                <h3 className="text-white font-semibold mb-4">Ціна</h3>
                <Slider
                  value={priceRange}
                  onValueChange={setPriceRange}
                  min={0}
                  max={100000}
                  step={1000}
                  className="mb-4"
                />
                <div className="flex items-center justify-between text-sm">
                  <span className="text-loki-soft-gray">{priceRange[0].toLocaleString()} ₴</span>
                  <span className="text-loki-soft-gray">{priceRange[1].toLocaleString()} ₴</span>
                </div>
              </div>

              {/* In Stock */}
              <div className="bg-loki-dark-gray rounded-xl p-5">
                <label className="flex items-center gap-3 cursor-pointer">
                  <Checkbox
                    checked={inStockOnly}
                    onCheckedChange={(checked) => setInStockOnly(!!checked)}
                    className="border-loki-border-gray data-[state=checked]:bg-loki-turquoise data-[state=checked]:border-loki-turquoise"
                  />
                  <span className="text-white">Тільки в наявності</span>
                </label>
              </div>

              {/* Categories */}
              <div className="bg-loki-dark-gray rounded-xl p-5">
                <h3 className="text-white font-semibold mb-4">Категорії</h3>
                <div className="space-y-2">
                  {categories.map((cat) => (
                    <a
                      key={cat.id}
                      href={`/category/${cat.id}`}
                      className={`block px-3 py-2 rounded-lg text-sm transition-colors ${
                        cat.id === slug
                          ? "bg-loki-turquoise/20 text-loki-turquoise"
                          : "text-loki-soft-gray hover:text-white hover:bg-loki-card-gray"
                      }`}
                    >
                      {cat.name}
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          {/* Products */}
          <div className="flex-1">
            {/* Toolbar */}
            <div className="flex items-center justify-between mb-6 gap-4">
              {/* Mobile filter button */}
              <Button
                variant="outline"
                className="lg:hidden border-loki-border-gray text-white hover:bg-loki-dark-gray bg-transparent"
                onClick={() => setShowFilters(true)}
              >
                <SlidersHorizontal className="w-4 h-4 mr-2" />
                Фільтри
              </Button>

              {/* Sort dropdown */}
              <div className="relative ml-auto">
                <button
                  onClick={() => setShowSortDropdown(!showSortDropdown)}
                  className="flex items-center gap-2 px-4 py-2 bg-loki-dark-gray border border-loki-border-gray rounded-lg text-white text-sm hover:border-loki-turquoise transition-colors"
                >
                  {sortOptions.find((o) => o.value === sortBy)?.label}
                  <ChevronDown className="w-4 h-4" />
                </button>

                <AnimatePresence>
                  {showSortDropdown && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute right-0 top-full mt-2 w-48 bg-loki-dark-gray border border-loki-border-gray rounded-lg overflow-hidden z-20"
                    >
                      {sortOptions.map((option) => (
                        <button
                          key={option.value}
                          onClick={() => {
                            setSortBy(option.value)
                            setShowSortDropdown(false)
                          }}
                          className={`block w-full text-left px-4 py-2 text-sm transition-colors ${
                            sortBy === option.value
                              ? "bg-loki-turquoise/20 text-loki-turquoise"
                              : "text-loki-soft-gray hover:text-white hover:bg-loki-card-gray"
                          }`}
                        >
                          {option.label}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* View mode */}
              <div className="hidden sm:flex items-center gap-1 bg-loki-dark-gray rounded-lg p-1">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 rounded-md transition-colors ${
                    viewMode === "grid" ? "bg-loki-turquoise text-loki-black" : "text-loki-soft-gray hover:text-white"
                  }`}
                >
                  <Grid3X3 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2 rounded-md transition-colors ${
                    viewMode === "list" ? "bg-loki-turquoise text-loki-black" : "text-loki-soft-gray hover:text-white"
                  }`}
                >
                  <LayoutList className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Results count */}
            <p className="text-loki-soft-gray text-sm mb-6">Знайдено: {filteredProducts.length} товарів</p>

            {/* Products Grid */}
            {filteredProducts.length > 0 ? (
              <motion.div
                layout
                className={`grid gap-4 ${
                  viewMode === "grid" ? "grid-cols-1 sm:grid-cols-2 xl:grid-cols-3" : "grid-cols-1"
                }`}
              >
                <AnimatePresence>
                  {filteredProducts.map((product, index) => (
                    <motion.div
                      key={product.id}
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <ProductCard product={product} />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </motion.div>
            ) : (
              <div className="text-center py-20">
                <p className="text-loki-soft-gray text-lg mb-4">Товарів не знайдено</p>
                <Button
                  onClick={() => {
                    setPriceRange([0, 100000])
                    setInStockOnly(false)
                    setSortBy("popular")
                  }}
                  className="bg-loki-turquoise text-loki-black hover:bg-loki-turquoise/90"
                >
                  Скинути фільтри
                </Button>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Mobile Filters Modal */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 z-50 lg:hidden"
            onClick={() => setShowFilters(false)}
          >
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              className="absolute left-0 top-0 h-full w-80 max-w-full bg-loki-dark-gray p-6 overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-white">Фільтри</h2>
                <button
                  onClick={() => setShowFilters(false)}
                  className="p-2 text-loki-soft-gray hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-6">
                {/* Price Range */}
                <div>
                  <h3 className="text-white font-semibold mb-4">Ціна</h3>
                  <Slider
                    value={priceRange}
                    onValueChange={setPriceRange}
                    min={0}
                    max={100000}
                    step={1000}
                    className="mb-4"
                  />
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-loki-soft-gray">{priceRange[0].toLocaleString()} ₴</span>
                    <span className="text-loki-soft-gray">{priceRange[1].toLocaleString()} ₴</span>
                  </div>
                </div>

                {/* In Stock */}
                <label className="flex items-center gap-3 cursor-pointer">
                  <Checkbox
                    checked={inStockOnly}
                    onCheckedChange={(checked) => setInStockOnly(!!checked)}
                    className="border-loki-border-gray data-[state=checked]:bg-loki-turquoise data-[state=checked]:border-loki-turquoise"
                  />
                  <span className="text-white">Тільки в наявності</span>
                </label>

                {/* Categories */}
                <div>
                  <h3 className="text-white font-semibold mb-4">Категорії</h3>
                  <div className="space-y-2">
                    {categories.map((cat) => (
                      <a
                        key={cat.id}
                        href={`/category/${cat.id}`}
                        className={`block px-3 py-2 rounded-lg text-sm transition-colors ${
                          cat.id === slug
                            ? "bg-loki-turquoise/20 text-loki-turquoise"
                            : "text-loki-soft-gray hover:text-white"
                        }`}
                      >
                        {cat.name}
                      </a>
                    ))}
                  </div>
                </div>
              </div>

              <Button
                className="w-full mt-8 bg-loki-turquoise text-loki-black hover:bg-loki-turquoise/90"
                onClick={() => setShowFilters(false)}
              >
                Застосувати
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  )
}
