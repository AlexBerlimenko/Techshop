"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { Package, ShoppingCart, Settings, LogOut, ChevronRight, Plus, Edit, Trash2, X } from "lucide-react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { useStore } from "@/lib/store"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { api } from "@/lib/api"
import { convertBackendProductToFrontend } from "@/lib/utils-api"
import type { Product } from "@/lib/data"

export default function AdminPage() {
  const router = useRouter()
  const { user, isAuthenticated, logout } = useStore()
  const [activeTab, setActiveTab] = useState<"orders" | "products" | "categories">("orders")
  const [orders, setOrders] = useState<any[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [authChecked, setAuthChecked] = useState(false)
  
  // Модальні вікна
  const [showProductModal, setShowProductModal] = useState(false)
  const [showCategoryModal, setShowCategoryModal] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [editingCategory, setEditingCategory] = useState<any | null>(null)
  
  // Форми
  const [productForm, setProductForm] = useState({
    name: "",
    price: "",
    stock: "",
    brand: "",
    category_id: "",
    description: "",
    image: "",
  })
  
  const [categoryForm, setCategoryForm] = useState({
    name: "",
    slug: "",
  })

  useEffect(() => {
    let mounted = true
    
    const checkAuth = async () => {
      // Чекаємо на ініціалізацію автентифікації
      // Перевіряємо кожні 100мс, максимум 3 секунди
      let attempts = 0
      const maxAttempts = 30
      
      while (attempts < maxAttempts && mounted) {
        const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null
        
        // Якщо немає токену, одразу редиректимо
        if (!token) {
          if (mounted) {
            setAuthChecked(true)
            sessionStorage.setItem('returnTo', '/admin')
            window.location.href = '/auth'
          }
          return
        }
        
        // Якщо користувач вже завантажений
        if (isAuthenticated && user) {
          if (mounted) {
            setAuthChecked(true)
            
            // Перевіряємо роль
            if (user.role !== 'admin') {
              console.log('AdminPage: User is not admin, redirecting')
              sessionStorage.setItem('returnTo', '/admin')
              window.location.href = '/auth'
              return
            }
            
            console.log('AdminPage: Auth OK, admin access granted')
          }
          return
        }
        
        // Чекаємо трохи і перевіряємо знову
        await new Promise(resolve => setTimeout(resolve, 100))
        attempts++
      }
      
      // Якщо після всіх спроб користувач не завантажений
      if (mounted) {
        setAuthChecked(true)
        const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null
        
        if (!token || !isAuthenticated || !user || user.role !== 'admin') {
          console.log('AdminPage: Auth check timeout, redirecting')
          sessionStorage.setItem('returnTo', '/admin')
          window.location.href = '/auth'
        }
      }
    }
    
    checkAuth()
    
    return () => {
      mounted = false
    }
  }, [isAuthenticated, user])
  
  useEffect(() => {
    if (authChecked && isAuthenticated && user && user.role !== 'admin') {
      window.location.href = '/auth'
    }
  }, [authChecked, isAuthenticated, user])

  useEffect(() => {
    if (authChecked && isAuthenticated && user && user.role === 'admin') {
      loadData()
    }
  }, [authChecked, activeTab, isAuthenticated, user])

  async function loadData() {
    setLoading(true)
    try {
      if (activeTab === 'orders') {
        const response = await api.orders.getAll()
        if (response.success && response.data) {
          setOrders(response.data)
        }
      } else if (activeTab === 'products') {
        const [productsResponse, categoriesResponse] = await Promise.all([
          api.products.getAll(),
          api.categories.getAll()
        ])
        if (productsResponse.success && productsResponse.data) {
          setProducts(productsResponse.data.map((p: any) => convertBackendProductToFrontend(p)))
        }
        if (categoriesResponse.success && categoriesResponse.data) {
          setCategories(categoriesResponse.data)
        }
      } else if (activeTab === 'categories') {
        const response = await api.categories.getAll()
        if (response.success && response.data) {
          setCategories(response.data)
        }
      }
    } catch (error) {
      console.error('Error loading data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateOrderStatus = async (orderId: number, status: string) => {
    try {
      const response = await api.orders.updateStatus(orderId, status)
      if (response.success) {
        setOrders(orders.map(o => o.id === orderId ? { ...o, status } : o))
      }
    } catch (error) {
      console.error('Error updating order status:', error)
      alert('Помилка оновлення статусу замовлення')
    }
  }

  const handleDeleteOrder = async (orderId: number) => {
    if (!confirm('Видалити це замовлення?')) return
    
    try {
      const response = await api.orders.delete(orderId)
      if (response.success) {
        setOrders(orders.filter(o => o.id !== orderId))
      }
    } catch (error) {
      console.error('Error deleting order:', error)
      alert('Помилка видалення замовлення')
    }
  }

  const handleOpenProductModal = (product?: Product) => {
    if (product) {
      setEditingProduct(product)
      setProductForm({
        name: product.name,
        price: product.price.toString(),
        stock: product.stock?.toString() || "0",
        brand: product.brand || "",
        category_id: product.category_id?.toString() || "",
        description: product.description || "",
        image: product.image || "",
      })
    } else {
      setEditingProduct(null)
      setProductForm({
        name: "",
        price: "",
        stock: "",
        brand: "",
        category_id: "",
        description: "",
        image: "",
      })
    }
    setShowProductModal(true)
  }

  const handleSaveProduct = async () => {
    if (!productForm.name || !productForm.price || !productForm.category_id) {
      alert('Заповніть всі обов\'язкові поля')
      return
    }

    try {
      const data = {
        name: productForm.name,
        price: parseFloat(productForm.price),
        stock: parseInt(productForm.stock) || 0,
        brand: productForm.brand,
        category_id: parseInt(productForm.category_id),
        description: productForm.description,
        image: productForm.image,
      }

      if (editingProduct) {
        const response = await api.admin.products.update({ ...data, id: parseInt(editingProduct.id) })
        if (response.success) {
          await loadData()
          setShowProductModal(false)
        }
      } else {
        const response = await api.admin.products.create(data)
        if (response.success) {
          await loadData()
          setShowProductModal(false)
        }
      }
    } catch (error) {
      console.error('Error saving product:', error)
      alert('Помилка збереження товару')
    }
  }

  const handleDeleteProduct = async (productId: string) => {
    if (!confirm('Видалити цей товар?')) return
    
    try {
      const response = await api.admin.products.delete(parseInt(productId))
      if (response.success) {
        setProducts(products.filter(p => p.id !== productId))
      }
    } catch (error) {
      console.error('Error deleting product:', error)
      alert('Помилка видалення товару')
    }
  }

  const handleOpenCategoryModal = (category?: any) => {
    if (category) {
      setEditingCategory(category)
      setCategoryForm({
        name: category.name,
        slug: category.slug,
      })
    } else {
      setEditingCategory(null)
      setCategoryForm({
        name: "",
        slug: "",
      })
    }
    setShowCategoryModal(true)
  }

  const handleSaveCategory = async () => {
    if (!categoryForm.name) {
      alert('Введіть назву категорії')
      return
    }

    try {
      if (editingCategory) {
        const response = await api.admin.categories.update({
          id: editingCategory.id,
          name: categoryForm.name,
          slug: categoryForm.slug,
        })
        if (response.success) {
          await loadData()
          setShowCategoryModal(false)
        }
      } else {
        const response = await api.admin.categories.create({
          name: categoryForm.name,
          slug: categoryForm.slug,
        })
        if (response.success) {
          await loadData()
          setShowCategoryModal(false)
        }
      }
    } catch (error) {
      console.error('Error saving category:', error)
      alert('Помилка збереження категорії')
    }
  }

  const handleDeleteCategory = async (categoryId: number) => {
    if (!confirm('Видалити цю категорію?')) return
    
    try {
      const response = await api.admin.categories.delete(categoryId)
      if (response.success) {
        setCategories(categories.filter(c => c.id !== categoryId))
      }
    } catch (error: any) {
      console.error('Error deleting category:', error)
      alert(error?.error || 'Помилка видалення категорії')
    }
  }

  const handleLogout = () => {
    logout()
    router.push("/")
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "text-green-500 bg-green-500/20"
      case "processing":
        return "text-yellow-500 bg-yellow-500/20"
      case "cancelled":
        return "text-red-500 bg-red-500/20"
      default:
        return "text-loki-soft-gray bg-loki-dark-gray"
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "completed":
        return "Завершено"
      case "processing":
        return "Обробляється"
      case "cancelled":
        return "Скасовано"
      default:
        return "Нове"
    }
  }

  if (!authChecked) {
    return (
      <div className="min-h-screen bg-loki-black flex items-center justify-center">
        <p className="text-loki-soft-gray">Завантаження...</p>
      </div>
    )
  }

  if (authChecked && (!isAuthenticated || !user || user.role !== 'admin')) {
    return (
      <div className="min-h-screen bg-loki-black flex items-center justify-center">
        <p className="text-loki-soft-gray">Перенаправлення...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-loki-black">
      <Header />

      <main className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-white">Адмін панель</h1>
          <Button
            onClick={handleLogout}
            variant="outline"
            className="border-loki-border-gray text-white hover:bg-loki-dark-gray bg-transparent"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Вийти
          </Button>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1">
            <div className="bg-loki-dark-gray rounded-xl border border-loki-border-gray p-6">
              <nav className="space-y-1">
                <button
                  onClick={() => setActiveTab("orders")}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    activeTab === "orders"
                      ? "bg-loki-turquoise/20 text-loki-turquoise"
                      : "text-loki-soft-gray hover:text-white hover:bg-loki-card-gray"
                  }`}
                >
                  <ShoppingCart className="w-5 h-5" />
                  Замовлення
                  <ChevronRight className="w-4 h-4 ml-auto" />
                </button>

                <button
                  onClick={() => setActiveTab("products")}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    activeTab === "products"
                      ? "bg-loki-turquoise/20 text-loki-turquoise"
                      : "text-loki-soft-gray hover:text-white hover:bg-loki-card-gray"
                  }`}
                >
                  <Package className="w-5 h-5" />
                  Товари
                  <ChevronRight className="w-4 h-4 ml-auto" />
                </button>

                <button
                  onClick={() => setActiveTab("categories")}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    activeTab === "categories"
                      ? "bg-loki-turquoise/20 text-loki-turquoise"
                      : "text-loki-soft-gray hover:text-white hover:bg-loki-card-gray"
                  }`}
                >
                  <Settings className="w-5 h-5" />
                  Категорії
                  <ChevronRight className="w-4 h-4 ml-auto" />
                </button>
              </nav>
            </div>
          </div>

          <div className="lg:col-span-3">
            {loading ? (
              <div className="text-center py-20">
                <p className="text-loki-soft-gray">Завантаження...</p>
              </div>
            ) : (
              <>
                {activeTab === "orders" && (
                  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                    <h2 className="text-2xl font-bold text-white">Замовлення</h2>
                    {orders.length === 0 ? (
                      <div className="bg-loki-dark-gray rounded-xl border border-loki-border-gray p-12 text-center">
                        <p className="text-loki-soft-gray">Немає замовлень</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {orders.map((order) => (
                          <div key={order.id} className="bg-loki-dark-gray rounded-xl border border-loki-border-gray p-6">
                            <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
                              <div>
                                <p className="text-white font-medium">Замовлення №{order.id}</p>
                                <p className="text-sm text-loki-soft-gray">
                                  {new Date(order.created_at).toLocaleDateString("uk-UA")}
                                </p>
                                <p className="text-sm text-loki-soft-gray mt-1">{order.full_name}</p>
                                <p className="text-sm text-loki-soft-gray">{order.email}</p>
                                <p className="text-sm text-loki-soft-gray">{order.phone}</p>
                              </div>
                              <div className="flex items-center gap-2">
                                <select
                                  value={order.status}
                                  onChange={(e) => handleUpdateOrderStatus(order.id, e.target.value)}
                                  className="px-3 py-1 rounded-lg bg-loki-card-gray border border-loki-border-gray text-white text-sm"
                                >
                                  <option value="new">Нове</option>
                                  <option value="processing">Обробляється</option>
                                  <option value="completed">Завершено</option>
                                  <option value="cancelled">Скасовано</option>
                                </select>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleDeleteOrder(order.id)}
                                  className="border-loki-neon-red text-loki-neon-red hover:bg-loki-neon-red/10"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                            </div>

                            <div className="mb-4">
                              <p className="text-sm text-loki-soft-gray mb-2">Адреса доставки:</p>
                              <p className="text-white">{order.delivery_address}</p>
                            </div>

                            {order.items && order.items.length > 0 && (
                              <div className="mb-4">
                                <p className="text-sm text-loki-soft-gray mb-2">Товари:</p>
                                <div className="space-y-2">
                                  {order.items.map((item: any, i: number) => (
                                    <div key={i} className="flex items-center justify-between text-sm">
                                      <span className="text-white">
                                        {item.name || `Товар #${item.product_id}`} x {item.quantity}
                                      </span>
                                      <span className="text-loki-soft-gray">
                                        {(Number(item.price) * Number(item.quantity)).toLocaleString("uk-UA")} ₴
                                      </span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}

                            <div className="flex items-center justify-between pt-4 border-t border-loki-border-gray">
                              <p className="text-sm text-loki-soft-gray">Сума замовлення</p>
                              <p className="text-lg font-bold text-white">{order.total.toLocaleString("uk-UA")} ₴</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </motion.div>
                )}

                {activeTab === "products" && (
                  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h2 className="text-2xl font-bold text-white">Товари</h2>
                      <Button
                        onClick={() => handleOpenProductModal()}
                        className="bg-loki-turquoise text-loki-black"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Додати товар
                      </Button>
                    </div>
                    {products.length === 0 ? (
                      <div className="bg-loki-dark-gray rounded-xl border border-loki-border-gray p-12 text-center">
                        <p className="text-loki-soft-gray">Немає товарів</p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {products.map((product) => (
                          <div key={product.id} className="bg-loki-dark-gray rounded-xl border border-loki-border-gray p-4">
                            <div className="aspect-square bg-loki-card-gray rounded-lg mb-4 overflow-hidden">
                              <img
                                src={product.image}
                                alt={product.name}
                                className="w-full h-full object-contain p-2"
                              />
                            </div>
                            <h3 className="text-white font-medium mb-2 line-clamp-2">{product.name}</h3>
                            <p className="text-loki-turquoise font-bold mb-4">{product.price.toLocaleString("uk-UA")} ₴</p>
                            <div className="flex gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleOpenProductModal(product)}
                                className="flex-1 border-loki-border-gray text-white hover:bg-loki-card-gray"
                              >
                                <Edit className="w-4 h-4 mr-2" />
                                Редагувати
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleDeleteProduct(product.id)}
                                className="border-loki-neon-red text-loki-neon-red hover:bg-loki-neon-red/10"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </motion.div>
                )}

                {activeTab === "categories" && (
                  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h2 className="text-2xl font-bold text-white">Категорії</h2>
                      <Button
                        onClick={() => handleOpenCategoryModal()}
                        className="bg-loki-turquoise text-loki-black"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Додати категорію
                      </Button>
                    </div>
                    {categories.length === 0 ? (
                      <div className="bg-loki-dark-gray rounded-xl border border-loki-border-gray p-12 text-center">
                        <p className="text-loki-soft-gray">Немає категорій</p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {categories.map((category) => (
                          <div
                            key={category.id}
                            className="bg-loki-dark-gray rounded-xl border border-loki-border-gray p-6 flex items-center justify-between"
                          >
                            <div>
                              <h3 className="text-white font-medium">{category.name}</h3>
                              <p className="text-sm text-loki-soft-gray">{category.slug}</p>
                            </div>
                            <div className="flex gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleOpenCategoryModal(category)}
                                className="border-loki-border-gray text-white hover:bg-loki-card-gray"
                              >
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleDeleteCategory(category.id)}
                                className="border-loki-neon-red text-loki-neon-red hover:bg-loki-neon-red/10"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </motion.div>
                )}
              </>
            )}
          </div>
        </div>
      </main>

      {/* Модальне вікно для товару */}
      <AnimatePresence>
        {showProductModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-loki-dark-gray rounded-xl border border-loki-border-gray p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-white">
                  {editingProduct ? 'Редагувати товар' : 'Додати товар'}
                </h3>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowProductModal(false)}
                  className="border-loki-border-gray text-white"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-loki-soft-gray mb-1 block">Назва *</label>
                  <Input
                    value={productForm.name}
                    onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                    className="bg-loki-card-gray border-loki-border-gray text-white"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-loki-soft-gray mb-1 block">Ціна *</label>
                    <Input
                      type="number"
                      value={productForm.price}
                      onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                      className="bg-loki-card-gray border-loki-border-gray text-white"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-loki-soft-gray mb-1 block">Наявність</label>
                    <Input
                      type="number"
                      value={productForm.stock}
                      onChange={(e) => setProductForm({ ...productForm, stock: e.target.value })}
                      className="bg-loki-card-gray border-loki-border-gray text-white"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-loki-soft-gray mb-1 block">Бренд</label>
                    <Input
                      value={productForm.brand}
                      onChange={(e) => setProductForm({ ...productForm, brand: e.target.value })}
                      className="bg-loki-card-gray border-loki-border-gray text-white"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-loki-soft-gray mb-1 block">Категорія *</label>
                    <select
                      value={productForm.category_id}
                      onChange={(e) => setProductForm({ ...productForm, category_id: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg bg-loki-card-gray border border-loki-border-gray text-white"
                    >
                      <option value="">Виберіть категорію</option>
                      {categories.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                          {cat.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                
                <div>
                  <label className="text-sm text-loki-soft-gray mb-1 block">Опис</label>
                  <textarea
                    value={productForm.description}
                    onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-loki-card-gray border border-loki-border-gray text-white"
                    rows={4}
                  />
                </div>
                
                <div>
                  <label className="text-sm text-loki-soft-gray mb-1 block">URL зображення</label>
                  <Input
                    value={productForm.image}
                    onChange={(e) => setProductForm({ ...productForm, image: e.target.value })}
                    className="bg-loki-card-gray border-loki-border-gray text-white"
                    placeholder="https://example.com/image.jpg"
                  />
                </div>
                
                <div className="flex gap-2 justify-end">
                  <Button
                    variant="outline"
                    onClick={() => setShowProductModal(false)}
                    className="border-loki-border-gray text-white"
                  >
                    Скасувати
                  </Button>
                  <Button
                    onClick={handleSaveProduct}
                    className="bg-loki-turquoise text-loki-black"
                  >
                    Зберегти
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Модальне вікно для категорії */}
      <AnimatePresence>
        {showCategoryModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-loki-dark-gray rounded-xl border border-loki-border-gray p-6 max-w-md w-full"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-white">
                  {editingCategory ? 'Редагувати категорію' : 'Додати категорію'}
                </h3>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowCategoryModal(false)}
                  className="border-loki-border-gray text-white"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-loki-soft-gray mb-1 block">Назва *</label>
                  <Input
                    value={categoryForm.name}
                    onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })}
                    className="bg-loki-card-gray border-loki-border-gray text-white"
                  />
                </div>
                
                <div>
                  <label className="text-sm text-loki-soft-gray mb-1 block">Slug (заповниться автоматично)</label>
                  <Input
                    value={categoryForm.slug}
                    onChange={(e) => setCategoryForm({ ...categoryForm, slug: e.target.value })}
                    className="bg-loki-card-gray border-loki-border-gray text-white"
                    placeholder="category-slug"
                  />
                </div>
                
                <div className="flex gap-2 justify-end">
                  <Button
                    variant="outline"
                    onClick={() => setShowCategoryModal(false)}
                    className="border-loki-border-gray text-white"
                  >
                    Скасувати
                  </Button>
                  <Button
                    onClick={handleSaveCategory}
                    className="bg-loki-turquoise text-loki-black"
                  >
                    Зберегти
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  )
}
