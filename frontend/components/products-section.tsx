"use client"

import Link from "next/link"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { ProductCard } from "./product-card"
import type { Product } from "@/lib/data"

interface ProductsSectionProps {
  title: string
  products: Product[]
  viewAllLink: string
}

export function ProductsSection({ title, products, viewAllLink }: ProductsSectionProps) {
  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <h2 className="text-xl font-bold text-white">{title}</h2>
          <Link href={viewAllLink} className="text-sm text-loki-soft-gray hover:text-loki-turquoise transition-colors">
            В категорію →
          </Link>
        </div>

        <div className="flex items-center gap-2">
          <button className="w-9 h-9 rounded-full border border-loki-border-gray flex items-center justify-center text-loki-soft-gray hover:text-white hover:border-loki-turquoise transition-colors">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button className="w-9 h-9 rounded-full border border-loki-border-gray flex items-center justify-center text-loki-soft-gray hover:text-white hover:border-loki-turquoise transition-colors">
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Products grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
        {products.map((product, index) => (
          <ProductCard key={product.id} product={product} index={index} />
        ))}
      </div>
    </div>
  )
}
