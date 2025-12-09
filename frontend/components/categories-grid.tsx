"use client"

import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import type { Category } from "@/lib/data"

interface CategoriesGridProps {
  categories: Category[]
}

export function CategoriesGrid({ categories }: CategoriesGridProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
      {categories.map((category, index) => (
        <motion.div
          key={category.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.03 }}
        >
          <Link
            href={`/category/${category.id}`}
            className="group block bg-loki-dark-gray rounded-xl border border-loki-border-gray overflow-hidden hover:border-loki-turquoise/50 transition-all"
          >
            {/* Image */}
            <div className="relative aspect-square p-4 bg-gradient-to-b from-loki-card-gray/50 to-transparent">
              <Image
                src={category.image || "/placeholder.svg"}
                alt={category.name}
                fill
                className="object-contain p-2 group-hover:scale-105 transition-transform duration-300"
              />
            </div>

            {/* Label */}
            <div className="px-3 pb-3 pt-1">
              <h3 className="text-sm text-center text-loki-soft-gray group-hover:text-white transition-colors font-medium truncate">
                {category.name}
              </h3>
            </div>
          </Link>
        </motion.div>
      ))}
    </div>
  )
}
