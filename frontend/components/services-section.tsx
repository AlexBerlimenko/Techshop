"use client"

import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"

const services = [
  {
    id: "engraving",
    title: "Гравіювання",
    image: "/engraving-service-macbook.jpg",
    link: "/services/engraving",
  },
  {
    id: "repair",
    title: "Ремонт Apple",
    image: "/apple-repair-service.jpg",
    link: "/services/repair",
  },
  {
    id: "trade-in",
    title: "TRADE-IN",
    image: "/trade-in-service-phone.jpg",
    link: "/services/trade-in",
  },
]

export function ServicesSection() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {services.map((service, index) => (
        <motion.div
          key={service.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.1 }}
        >
          <Link
            href={service.link}
            className="group relative block h-40 bg-loki-dark-gray rounded-xl border border-loki-border-gray overflow-hidden hover:border-loki-turquoise/50 transition-all"
          >
            <Image
              src={service.image || "/placeholder.svg"}
              alt={service.title}
              fill
              className="object-cover opacity-60 group-hover:opacity-80 group-hover:scale-105 transition-all duration-300"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
            <div className="absolute bottom-4 left-4">
              <h3 className="text-lg font-semibold text-white">{service.title}</h3>
            </div>
          </Link>
        </motion.div>
      ))}
    </div>
  )
}
