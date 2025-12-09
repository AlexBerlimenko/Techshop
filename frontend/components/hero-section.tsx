"use client"

import { useState, useEffect, useCallback } from "react"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { promoSlides } from "@/lib/data"

export function HeroSection() {
  const [current, setCurrent] = useState(0)

  const next = useCallback(() => {
    setCurrent((prev) => (prev + 1) % promoSlides.length)
  }, [])

  const prev = () => {
    setCurrent((prev) => (prev - 1 + promoSlides.length) % promoSlides.length)
  }

  useEffect(() => {
    const timer = setInterval(next, 5000)
    return () => clearInterval(timer)
  }, [next])

  return (
    <section className="container mx-auto px-4 py-4">
      <div className="relative overflow-hidden rounded-2xl bg-loki-dark-gray h-[320px] sm:h-[400px] lg:h-[480px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={current}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0"
          >
            <Image
              src={promoSlides[current].image || "/placeholder.svg"}
              alt={promoSlides[current].title}
              fill
              className="object-cover"
              priority
            />

            <div
              className="absolute inset-0"
              style={{
                background: `linear-gradient(90deg, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.6) 40%, transparent 70%), linear-gradient(to top, rgba(0,0,0,0.5) 0%, transparent 30%)`,
              }}
            />

            <div
              className="absolute inset-0 opacity-30"
              style={{
                background: `radial-gradient(ellipse at 0% 50%, ${promoSlides[current].color}40 0%, transparent 50%)`,
              }}
            />

            <div className="relative h-full flex items-center px-8 sm:px-12 lg:px-16">
              <div className="max-w-xl">
                {promoSlides[current].discount && (
                  <motion.span
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1, duration: 0.4 }}
                    className="inline-block px-4 py-1.5 mb-4 text-sm font-bold rounded-full"
                    style={{
                      backgroundColor: promoSlides[current].color,
                      boxShadow: `0 0 20px ${promoSlides[current].color}80`,
                    }}
                  >
                    {promoSlides[current].discount}
                  </motion.span>
                )}
                <motion.h2
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2, duration: 0.4 }}
                  className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-4 leading-tight"
                >
                  {promoSlides[current].title}
                </motion.h2>
                <motion.p
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3, duration: 0.4 }}
                  className="text-lg sm:text-xl text-white/80 mb-8 leading-relaxed"
                >
                  {promoSlides[current].subtitle}
                </motion.p>
                <motion.button
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4, duration: 0.4 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                  className="px-8 py-3.5 font-semibold rounded-xl transition-all duration-300 text-white"
                  style={{
                    backgroundColor: promoSlides[current].color,
                    boxShadow: `0 4px 20px ${promoSlides[current].color}60`,
                  }}
                >
                  {promoSlides[current].cta}
                </motion.button>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Navigation arrows */}
        <button
          onClick={prev}
          className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center text-white hover:bg-black/60 transition-colors z-10"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button
          onClick={next}
          className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center text-white hover:bg-black/60 transition-colors z-10"
        >
          <ChevronRight className="w-5 h-5" />
        </button>

        {/* Dots */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 z-10">
          {promoSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrent(index)}
              className={`h-2 rounded-full transition-all ${
                index === current ? "w-8 bg-loki-turquoise" : "w-2 bg-white/40 hover:bg-white/60"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
