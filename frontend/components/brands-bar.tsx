"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { brands } from "@/lib/data"

export function BrandsBar() {
  return (
    <section className="container mx-auto px-4 py-4">
      <div className="bg-loki-dark-gray rounded-xl border border-loki-border-gray overflow-hidden">
        <div className="flex items-center justify-between divide-x divide-loki-border-gray">
          {brands.map((brand, index) => (
            <motion.div
              key={brand}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: index * 0.05 }}
              className="flex-1"
            >
              <Link
                href={`/brand/${brand.toLowerCase()}`}
                className="flex items-center justify-center py-4 px-2 text-loki-soft-gray hover:text-white hover:bg-loki-card-gray transition-all"
              >
                <span className="text-sm sm:text-base font-medium tracking-wide">{brand}</span>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
