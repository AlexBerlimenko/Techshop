"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"
import type { Product, CartItem, User, Order } from "./data"
import { api } from "./api"

interface StoreState {
  // Cart
  cart: CartItem[]
  addToCart: (product: Product, quantity?: number, color?: string, memory?: string) => void
  removeFromCart: (productId: string) => void
  updateQuantity: (productId: string, quantity: number) => void
  clearCart: () => void
  getCartTotal: () => number
  getCartCount: () => number

  // Wishlist
  wishlist: Product[]
  addToWishlist: (product: Product) => void
  removeFromWishlist: (productId: string) => void
  isInWishlist: (productId: string) => boolean

  // Auth
  user: User | null
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<boolean>
  register: (email: string, password: string, name: string) => Promise<boolean>
  logout: () => void
  updateProfile: (data: Partial<User>) => void
  initAuth: (userData: { id: number; name: string; email: string; role: string }) => void
  clearAuth: () => void

  // Orders
  orders: Order[]
  createOrder: (address: string) => Promise<Order | null>
  loadOrders: () => Promise<void>
}

export const useStore = create<StoreState>()(
  persist(
    (set, get) => ({
      // Cart
      cart: [],
      addToCart: (product, quantity = 1, color, memory) => {
        set((state) => {
          const existingItem = state.cart.find(
            (item) => item.product.id === product.id && item.selectedColor === color && item.selectedMemory === memory,
          )
          if (existingItem) {
            return {
              cart: state.cart.map((item) =>
                item.product.id === product.id && item.selectedColor === color && item.selectedMemory === memory
                  ? { ...item, quantity: item.quantity + quantity }
                  : item,
              ),
            }
          }
          return {
            cart: [...state.cart, { product, quantity, selectedColor: color, selectedMemory: memory }],
          }
        })
      },
      removeFromCart: (productId) => {
        set((state) => ({
          cart: state.cart.filter((item) => item.product.id !== productId),
        }))
      },
      updateQuantity: (productId, quantity) => {
        set((state) => ({
          cart: state.cart.map((item) =>
            item.product.id === productId ? { ...item, quantity: Math.max(1, quantity) } : item,
          ),
        }))
      },
      clearCart: () => set({ cart: [] }),
      getCartTotal: () => {
        const { cart } = get()
        return cart.reduce((total, item) => total + item.product.price * item.quantity, 0)
      },
      getCartCount: () => {
        const { cart } = get()
        return cart.reduce((count, item) => count + item.quantity, 0)
      },

      // Wishlist
      wishlist: [],
      addToWishlist: (product) => {
        set((state) => {
          if (state.wishlist.find((p) => p.id === product.id)) return state
          return { wishlist: [...state.wishlist, product] }
        })
      },
      removeFromWishlist: (productId) => {
        set((state) => ({
          wishlist: state.wishlist.filter((p) => p.id !== productId),
        }))
      },
      isInWishlist: (productId) => {
        const { wishlist } = get()
        return wishlist.some((p) => p.id === productId)
      },

      // Auth
      user: null,
      isAuthenticated: false,
      login: async (email, password) => {
        const response = await api.auth.login(email, password)
        if (response.success && response.data) {
          if (response.data.token && typeof window !== 'undefined') {
            localStorage.setItem('auth_token', response.data.token)
          }
          set({
            user: {
              id: response.data.id.toString(),
              email: response.data.email,
              name: response.data.name,
              role: response.data.role,
              orders: [],
            },
            isAuthenticated: true,
          })
          return true
        }
        return false
      },
      register: async (email, password, name) => {
        const response = await api.auth.register({ email, password, name })
        if (response.success && response.data) {
          if (response.data.token && typeof window !== 'undefined') {
            localStorage.setItem('auth_token', response.data.token)
          }
          set({
            user: {
              id: response.data.id.toString(),
              email: response.data.email,
              name: response.data.name,
              role: response.data.role,
              orders: [],
            },
            isAuthenticated: true,
          })
          return true
        }
        return false
      },
      logout: async () => {
        await api.auth.logout()
        if (typeof window !== 'undefined') {
          localStorage.removeItem('auth_token')
        }
        set({ user: null, isAuthenticated: false })
      },
      updateProfile: (data) => {
        set((state) => ({
          user: state.user ? { ...state.user, ...data } : null,
        }))
      },
      initAuth: (userData) => {
        set({
          user: {
            id: userData.id.toString(),
            email: userData.email,
            name: userData.name,
            role: userData.role,
            orders: [],
          },
          isAuthenticated: true,
        })
      },
      clearAuth: () => {
        set({ user: null, isAuthenticated: false })
      },

      // Orders
      orders: [],
      loadOrders: async () => {
        const response = await api.orders.getAll()
        if (response.success && response.data) {
          const orders: Order[] = response.data.map((order: any) => ({
            id: order.id.toString(),
            items: (order.items || []).map((item: any) => ({
              product: {
                id: item.product_id.toString(),
                name: item.name || 'Товар',
                price: parseFloat(item.price),
                image: `http://localhost:8080/images/${item.image || 'no-image.png'}`,
                category: '',
                inStock: true,
                rating: 0,
                reviews: 0,
              },
              quantity: item.quantity,
            })),
            total: order.total,
            status: order.status === 'new' ? 'pending' : order.status === 'processing' ? 'processing' : order.status === 'completed' ? 'delivered' : 'pending',
            date: order.created_at,
            address: order.delivery_address,
          }))
          set({ orders })
        }
      },
      createOrder: async (address) => {
        const { cart, getCartTotal, user, clearCart } = get()
        if (cart.length === 0) return null

        if (!user) {
          return null
        }

        const items = cart.map((item) => ({
          product_id: parseInt(item.product.id),
          quantity: item.quantity,
        }))

        const response = await api.orders.create({
          full_name: user.name,
          phone: user.phone || '',
          email: user.email,
          delivery_address: address,
          items,
        })

        if (response.success && response.data) {
          const order: Order = {
            id: response.data.id.toString(),
            items: [...cart],
            total: response.data.total,
            status: "pending",
            date: new Date().toISOString(),
            address,
          }

          set((state) => ({
            orders: [order, ...state.orders],
            user: state.user ? { ...state.user, orders: [order, ...state.user.orders] } : null,
          }))

          clearCart()
          return order
        }

        return null
      },
    }),
    {
      name: "lokistore-storage",
    },
  ),
)
