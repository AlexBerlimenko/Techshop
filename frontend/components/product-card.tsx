"use client"

import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import type { Product } from "@/lib/data"

interface ProductCardProps {
  product: Product
  index?: number
}

export function ProductCard({ product, index = 0 }: ProductCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
    >
      <Link href={`/product/${product.id}`} className="group block">
        <div className="relative bg-loki-dark-gray rounded-xl border border-loki-border-gray overflow-hidden hover:border-loki-turquoise/50 transition-all">

          {/* Image */}
          <div className="relative aspect-square p-4 bg-gradient-to-b from-loki-card-gray/30 to-transparent">
            <Image
              src={product.image || "/placeholder.svg"}
              alt={product.name}
              fill
              className="object-contain p-2 group-hover:scale-105 transition-transform duration-300"
            />
          </div>

          {/* Content */}
          <div className="p-3 space-y-2">
            {/* Title */}
            <h3 className="text-sm text-loki-soft-gray group-hover:text-white transition-colors line-clamp-2 min-h-[40px]">
              {product.name}
            </h3>

            {/* Price */}
            <div className="flex items-baseline gap-2">
              <span className="text-base font-bold text-white">{product.price.toLocaleString("uk-UA")} ₴</span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}
