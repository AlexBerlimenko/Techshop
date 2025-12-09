import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { AuthInit } from "@/components/auth-init"

const inter = Inter({ subsets: ["latin", "cyrillic"] })

export const metadata: Metadata = {
  title: "LokiStore — Інтернет-магазин техніки",
  description: "Найкращі ціни на смартфони, ноутбуки, планшети та аксесуари. Швидка доставка по Україні.",
  generator: "v0.app",
  keywords: ["техніка", "смартфони", "iPhone", "Samsung", "ноутбуки", "планшети"],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="uk" className="dark">
      <body className={`font-sans antialiased bg-loki-black min-h-screen`}>
        <AuthInit />
        {children}
      </body>
    </html>
  )
}
