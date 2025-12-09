"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"
import { CreditCard, Truck, MapPin, CheckCircle, ChevronLeft } from "lucide-react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { useStore } from "@/lib/store"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { api } from "@/lib/api"

export default function CheckoutPage() {
  const router = useRouter()
  const { cart, getCartTotal, isAuthenticated, user, clearCart } = useStore()

  const [step, setStep] = useState(1)
  const [isProcessing, setIsProcessing] = useState(false)
  const [orderComplete, setOrderComplete] = useState(false)
  const [orderId, setOrderId] = useState("")

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    city: "",
    address: "",
    deliveryMethod: "nova-poshta",
    paymentMethod: "card",
    cardNumber: "",
    cardExpiry: "",
    cardCvv: "",
  })

  const total = getCartTotal()
  const deliveryFee = total > 2000 ? 0 : 150

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsProcessing(true)

    try {
      if (!user) {
        alert('Будь ласка, увійдіть в систему')
        setIsProcessing(false)
        return
      }

      if (cart.length === 0) {
        alert('Кошик порожній')
        setIsProcessing(false)
        return
      }

      const fullName = `${formData.firstName} ${formData.lastName}`.trim() || user.name
      const phone = formData.phone || user.phone || ''
      const email = formData.email || user.email
      
      if (!phone || !email || !formData.city || !formData.address) {
        alert('Будь ласка, заповніть всі обов\'язкові поля')
        setIsProcessing(false)
        return
      }

      const deliveryAddress = `${formData.deliveryMethod}: ${formData.city}, ${formData.address}`

      const items = cart.map((item) => ({
        product_id: parseInt(item.product.id),
        quantity: item.quantity,
      }))

      const response = await api.orders.create({
        full_name: fullName,
        phone: phone,
        email: email,
        delivery_address: deliveryAddress,
        items,
      })

      if (response.success && response.data) {
        setOrderId(response.data.id.toString())
        setOrderComplete(true)
        clearCart()
        const store = useStore.getState()
        await store.loadOrders()
      } else {
        alert(response.error || 'Помилка при створенні замовлення')
      }
    } catch (error) {
      console.error('Order creation error:', error)
      alert('Помилка при створенні замовлення')
    } finally {
      setIsProcessing(false)
    }
  }

  if (cart.length === 0 && !orderComplete) {
    return (
      <div className="min-h-screen bg-loki-black">
        <Header />
        <div className="container mx-auto px-4 py-20 text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Кошик порожній</h1>
          <Link href="/category/all">
            <Button className="bg-loki-turquoise text-loki-black">До каталогу</Button>
          </Link>
        </div>
        <Footer />
      </div>
    )
  }

  if (orderComplete) {
    return (
      <div className="min-h-screen bg-loki-black">
        <Header />
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="container mx-auto px-4 py-20 text-center max-w-lg"
        >
          <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-green-500" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-3">Замовлення оформлено!</h1>
          <p className="text-loki-soft-gray mb-2">Номер вашого замовлення:</p>
          <p className="text-loki-turquoise font-mono text-lg mb-6">{orderId}</p>
          <p className="text-loki-soft-gray text-sm mb-8">
            Ми надіслали деталі замовлення на вашу електронну пошту. Очікуйте дзвінок від менеджера для підтвердження.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/profile">
              <Button className="bg-loki-turquoise text-loki-black hover:bg-loki-turquoise/90">Мої замовлення</Button>
            </Link>
            <Link href="/">
              <Button
                variant="outline"
                className="border-loki-border-gray text-white hover:bg-loki-dark-gray bg-transparent"
              >
                На головну
              </Button>
            </Link>
          </div>
        </motion.div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-loki-black">
      <Header />

      <main className="container mx-auto px-4 py-8">
        {/* Back */}
        <Link
          href="/cart"
          className="inline-flex items-center gap-2 text-loki-soft-gray hover:text-white transition-colors mb-8"
        >
          <ChevronLeft className="w-4 h-4" />
          Повернутися до кошика
        </Link>

        <h1 className="text-3xl font-bold text-white mb-8">Оформлення замовлення</h1>

        {/* Steps */}
        <div className="flex items-center gap-4 mb-8 overflow-x-auto pb-4">
          {[
            { num: 1, label: "Контакти" },
            { num: 2, label: "Доставка" },
            { num: 3, label: "Оплата" },
          ].map((s, i) => (
            <div key={s.num} className="flex items-center gap-4">
              <button
                onClick={() => step > s.num && setStep(s.num)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                  step === s.num
                    ? "bg-loki-turquoise text-loki-black"
                    : step > s.num
                      ? "bg-loki-dark-gray text-loki-turquoise"
                      : "bg-loki-dark-gray text-loki-soft-gray"
                }`}
              >
                <span className="w-6 h-6 rounded-full border-2 border-current flex items-center justify-center text-sm font-bold">
                  {step > s.num ? "✓" : s.num}
                </span>
                <span className="hidden sm:inline font-medium">{s.label}</span>
              </button>
              {i < 2 && <div className="w-8 h-px bg-loki-border-gray" />}
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Step 1: Contact */}
              {step === 1 && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="bg-loki-dark-gray rounded-xl border border-loki-border-gray p-6 space-y-4"
                >
                  <h2 className="text-xl font-bold text-white flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-loki-turquoise" />
                    Контактна інформація
                  </h2>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-loki-soft-gray mb-2">{"Ім'я"}</label>
                      <Input
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        required
                        className="bg-loki-card-gray border-loki-border-gray text-white"
                        placeholder="Іван"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-loki-soft-gray mb-2">Прізвище</label>
                      <Input
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        required
                        className="bg-loki-card-gray border-loki-border-gray text-white"
                        placeholder="Петренко"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm text-loki-soft-gray mb-2">Телефон</label>
                    <Input
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleInputChange}
                      required
                      className="bg-loki-card-gray border-loki-border-gray text-white"
                      placeholder="+380 99 123 45 67"
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-loki-soft-gray mb-2">Email</label>
                    <Input
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="bg-loki-card-gray border-loki-border-gray text-white"
                      placeholder="example@email.com"
                    />
                  </div>

                  <Button
                    type="button"
                    onClick={() => setStep(2)}
                    className="w-full bg-loki-turquoise text-loki-black hover:bg-loki-turquoise/90"
                  >
                    Продовжити
                  </Button>
                </motion.div>
              )}

              {/* Step 2: Delivery */}
              {step === 2 && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="bg-loki-dark-gray rounded-xl border border-loki-border-gray p-6 space-y-4"
                >
                  <h2 className="text-xl font-bold text-white flex items-center gap-2">
                    <Truck className="w-5 h-5 text-loki-turquoise" />
                    Доставка
                  </h2>

                  <div className="space-y-3">
                    {[
                      { id: "nova-poshta", label: "Нова Пошта", desc: "1-3 дні" },
                      { id: "ukrposhta", label: "Укрпошта", desc: "3-7 днів" },
                      { id: "courier", label: "Кур'єр", desc: "Сьогодні-завтра" },
                    ].map((method) => (
                      <label
                        key={method.id}
                        className={`flex items-center gap-3 p-4 rounded-lg border cursor-pointer transition-colors ${
                          formData.deliveryMethod === method.id
                            ? "border-loki-turquoise bg-loki-turquoise/10"
                            : "border-loki-border-gray hover:border-loki-turquoise/50"
                        }`}
                      >
                        <input
                          type="radio"
                          name="deliveryMethod"
                          value={method.id}
                          checked={formData.deliveryMethod === method.id}
                          onChange={handleInputChange}
                          className="sr-only"
                        />
                        <div
                          className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                            formData.deliveryMethod === method.id ? "border-loki-turquoise" : "border-loki-border-gray"
                          }`}
                        >
                          {formData.deliveryMethod === method.id && (
                            <div className="w-2.5 h-2.5 rounded-full bg-loki-turquoise" />
                          )}
                        </div>
                        <div className="flex-1">
                          <p className="text-white font-medium">{method.label}</p>
                          <p className="text-sm text-loki-soft-gray">{method.desc}</p>
                        </div>
                      </label>
                    ))}
                  </div>

                  <div>
                    <label className="block text-sm text-loki-soft-gray mb-2">Місто</label>
                    <Input
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      required
                      className="bg-loki-card-gray border-loki-border-gray text-white"
                      placeholder="Київ"
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-loki-soft-gray mb-2">Адреса / Відділення</label>
                    <Input
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      required
                      className="bg-loki-card-gray border-loki-border-gray text-white"
                      placeholder="Відділення №1 або вул. Хрещатик, 1"
                    />
                  </div>

                  <Button
                    type="button"
                    onClick={() => setStep(3)}
                    className="w-full bg-loki-turquoise text-loki-black hover:bg-loki-turquoise/90"
                  >
                    Продовжити
                  </Button>
                </motion.div>
              )}

              {/* Step 3: Payment */}
              {step === 3 && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="bg-loki-dark-gray rounded-xl border border-loki-border-gray p-6 space-y-4"
                >
                  <h2 className="text-xl font-bold text-white flex items-center gap-2">
                    <CreditCard className="w-5 h-5 text-loki-turquoise" />
                    Оплата
                  </h2>

                  <div className="space-y-3">
                    {[
                      { id: "card", label: "Карткою онлайн", desc: "Visa, Mastercard" },
                      { id: "cash", label: "Накладений платіж", desc: "Оплата при отриманні" },
                    ].map((method) => (
                      <label
                        key={method.id}
                        className={`flex items-center gap-3 p-4 rounded-lg border cursor-pointer transition-colors ${
                          formData.paymentMethod === method.id
                            ? "border-loki-turquoise bg-loki-turquoise/10"
                            : "border-loki-border-gray hover:border-loki-turquoise/50"
                        }`}
                      >
                        <input
                          type="radio"
                          name="paymentMethod"
                          value={method.id}
                          checked={formData.paymentMethod === method.id}
                          onChange={handleInputChange}
                          className="sr-only"
                        />
                        <div
                          className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                            formData.paymentMethod === method.id ? "border-loki-turquoise" : "border-loki-border-gray"
                          }`}
                        >
                          {formData.paymentMethod === method.id && (
                            <div className="w-2.5 h-2.5 rounded-full bg-loki-turquoise" />
                          )}
                        </div>
                        <div className="flex-1">
                          <p className="text-white font-medium">{method.label}</p>
                          <p className="text-sm text-loki-soft-gray">{method.desc}</p>
                        </div>
                      </label>
                    ))}
                  </div>

                  {formData.paymentMethod === "card" && (
                    <div className="space-y-4 pt-4 border-t border-loki-border-gray">
                      <div>
                        <label className="block text-sm text-loki-soft-gray mb-2">Номер картки</label>
                        <Input
                          name="cardNumber"
                          value={formData.cardNumber}
                          onChange={handleInputChange}
                          className="bg-loki-card-gray border-loki-border-gray text-white"
                          placeholder="1234 5678 9012 3456"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm text-loki-soft-gray mb-2">Термін дії</label>
                          <Input
                            name="cardExpiry"
                            value={formData.cardExpiry}
                            onChange={handleInputChange}
                            className="bg-loki-card-gray border-loki-border-gray text-white"
                            placeholder="MM/YY"
                          />
                        </div>
                        <div>
                          <label className="block text-sm text-loki-soft-gray mb-2">CVV</label>
                          <Input
                            name="cardCvv"
                            type="password"
                            value={formData.cardCvv}
                            onChange={handleInputChange}
                            className="bg-loki-card-gray border-loki-border-gray text-white"
                            placeholder="***"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  <Button
                    type="submit"
                    disabled={isProcessing}
                    className="w-full h-12 bg-loki-turquoise text-loki-black font-bold hover:bg-loki-turquoise/90 disabled:opacity-50"
                  >
                    {isProcessing ? "Обробка..." : `Сплатити ${(total + deliveryFee).toLocaleString("uk-UA")} ₴`}
                  </Button>
                </motion.div>
              )}
            </form>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 bg-loki-dark-gray rounded-xl border border-loki-border-gray p-6 space-y-4">
              <h2 className="text-xl font-bold text-white">Ваше замовлення</h2>

              <div className="space-y-3 max-h-64 overflow-y-auto">
                {cart.map((item) => (
                  <div key={`${item.product.id}-${item.selectedColor}-${item.selectedMemory}`} className="flex gap-3">
                    <div className="relative w-16 h-16 bg-loki-card-gray rounded-lg overflow-hidden shrink-0">
                      <Image
                        src={item.product.image || "/placeholder.svg"}
                        alt={item.product.name}
                        fill
                        className="object-contain p-1"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-white line-clamp-2">{item.product.name}</p>
                      <p className="text-xs text-loki-soft-gray mt-1">
                        {item.quantity} x {item.product.price.toLocaleString("uk-UA")} ₴
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-3 pt-4 border-t border-loki-border-gray">
                <div className="flex justify-between text-sm">
                  <span className="text-loki-soft-gray">Товари</span>
                  <span className="text-white">{total.toLocaleString("uk-UA")} ₴</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-loki-soft-gray">Доставка</span>
                  <span className={deliveryFee === 0 ? "text-green-500" : "text-white"}>
                    {deliveryFee === 0 ? "Безкоштовно" : `${deliveryFee} ₴`}
                  </span>
                </div>
              </div>

              <div className="flex justify-between pt-4 border-t border-loki-border-gray">
                <span className="text-lg font-bold text-white">Разом</span>
                <span className="text-lg font-bold text-loki-turquoise">
                  {(total + deliveryFee).toLocaleString("uk-UA")} ₴
                </span>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
