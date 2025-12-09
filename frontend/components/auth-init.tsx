"use client"

import { useEffect } from "react"
import { useStore } from "@/lib/store"
import { api } from "@/lib/api"

export function AuthInit() {
  const initAuth = useStore((state) => state.initAuth)
  const clearAuth = useStore((state) => state.clearAuth)

  useEffect(() => {
    async function loadAuth() {
      if (typeof window === 'undefined') return
      
      const token = localStorage.getItem('auth_token')
      if (token) {
        try {
          const response = await api.auth.me()
          if (response.success && response.data) {
            initAuth({
              id: response.data.id,
              name: response.data.name,
              email: response.data.email,
              role: response.data.role,
            })
            console.log('AuthInit: User loaded', { role: response.data.role })
          } else {
            localStorage.removeItem('auth_token')
            clearAuth()
          }
        } catch (error) {
          console.error('Auth init error:', error)
          localStorage.removeItem('auth_token')
          clearAuth()
        }
      } else {
        clearAuth()
      }
    }
    loadAuth()
  }, [initAuth, clearAuth])

  return null
}

