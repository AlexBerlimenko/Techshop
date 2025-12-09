export interface Product {
  id: string
  name: string
  category: string
  price: number
  oldPrice?: number
  image: string
  rating: number
  reviews: number
  colors?: string[]
  memory?: string[]
  badge?: "new" | "sale" | "hit" | "promo"
  inStock: boolean
  stock?: number
  brand?: string
  category_id?: number
  description?: string
}

export interface Category {
  id: string
  name: string
  image: string
  count: number
}

export const categories: Category[] = [
  { id: "apple", name: "Apple", image: "/apple-products-macbook-iphone.jpg" },
  { id: "airpods", name: "AirPods", image: "/apple-airpods-pro-white.jpg" },
  { id: "iphone", name: "iPhone", image: "/iphone-15-pro-max-display.png" },
  { id: "smartphones", name: "Смартфони", image: "/samsung-galaxy-smartphone.png" },
  { id: "watches", name: "Смарт-годинники", image: "/apple-watch-smartwatch.jpg" },
  { id: "headphones", name: "Навушники", image: "/sony-headphones-black.jpg" },
  { id: "laptops", name: "Ноутбуки", image: "/macbook-pro-laptop.png" },
  { id: "tablets", name: "Планшети", image: "/ipad-pro-tablet.png" },
  { id: "gaming", name: "Ігрові приставки", image: "/playstation-5-console.png" },
  { id: "tv", name: "Телевізори", image: "/samsung-oled-tv.jpg" },
  { id: "accessories", name: "Аксесуари", image: "/phone-accessories-charger.jpg" },
  { id: "dyson", name: "Dyson", image: "/dyson-vacuum-cleaner.jpg" },
]

export const products: Product[] = [
  {
    id: "1",
    name: "iPhone 16 Pro Max 256GB",
    category: "iphone",
    price: 59999,
    oldPrice: 64999,
    image: "/iphone-16-pro-max-titanium.jpg",
    rating: 4.9,
    reviews: 1234,
    colors: ["#1C1C1E", "#F5F5F7", "#4A4A4C", "#BFA48F"],
    memory: ["256GB", "512GB", "1TB"],
    badge: "hit",
    inStock: true,
  },
  {
    id: "2",
    name: "MacBook Pro 14 M4 512GB",
    category: "laptops",
    price: 89999,
    oldPrice: 99999,
    image: "/macbook-pro-14-m4-space-gray.jpg",
    rating: 4.8,
    reviews: 567,
    colors: ["#1C1C1E", "#F5F5F7"],
    memory: ["512GB", "1TB"],
    badge: "new",
    inStock: true,
  },
  {
    id: "3",
    name: "AirPods Pro 2",
    category: "airpods",
    price: 10999,
    image: "/airpods-pro-2-white-case.jpg",
    rating: 4.9,
    reviews: 2341,
    colors: ["#F5F5F7"],
    inStock: true,
  },
  {
    id: "4",
    name: "Apple Watch Ultra 2",
    category: "watches",
    price: 34999,
    oldPrice: 37999,
    image: "/apple-watch-ultra-2-titanium.jpg",
    rating: 4.8,
    reviews: 678,
    badge: "promo",
    inStock: true,
  },
  {
    id: "5",
    name: "iPad Pro 13 M4",
    category: "tablets",
    price: 54999,
    image: "/ipad-pro-13-m4-silver.jpg",
    rating: 4.9,
    reviews: 345,
    memory: ["256GB", "512GB", "1TB"],
    badge: "new",
    inStock: true,
  },
  {
    id: "6",
    name: "Sony WH-1000XM5",
    category: "headphones",
    price: 14999,
    oldPrice: 16999,
    image: "/sony-wh1000xm5-headphones-black.jpg",
    rating: 4.7,
    reviews: 1123,
    colors: ["#1C1C1E", "#F5F5F7"],
    badge: "sale",
    inStock: true,
  },
]

export const promoSlides = [
  {
    id: 1,
    title: "iPhone 16 Pro",
    subtitle: "Титан. Такий міцний. Такий легкий.",
    discount: "-8%",
    image: "/iphone-16-pro-titanium-floating-dark-background.jpg",
    cta: "Купити зараз",
    color: "#8B5CF6",
  },
  {
    id: 2,
    title: "MacBook Pro M4",
    subtitle: "Неймовірна швидкість. Неймовірна ефективність.",
    discount: "-10%",
    image: "/macbook-pro-m4-floating-dark-background.jpg",
    cta: "Дізнатися більше",
    color: "#06B6D4",
  },
  {
    id: 3,
    title: "AirPods Pro 2",
    subtitle: "Адаптивне аудіо. Магічний звук.",
    discount: "-5%",
    image: "/airpods-pro-2-floating-dark-background.jpg",
    cta: "Замовити",
    color: "#10B981",
  },
]

export const brands = ["Apple", "dyson", "GARMIN", "Google", "logitech", "SAMSUNG"]

export const allProducts: Product[] = [
  ...products,
  {
    id: "7",
    name: "Samsung Galaxy S24 Ultra",
    category: "smartphones",
    price: 49999,
    oldPrice: 54999,
    image: "/samsung-galaxy-s24-ultra.jpg",
    rating: 4.8,
    reviews: 892,
    colors: ["#1C1C1E", "#F5F5F7", "#E6C9A8"],
    memory: ["256GB", "512GB", "1TB"],
    badge: "hit",
    inStock: true,
  },
  {
    id: "8",
    name: "iPhone 15 128GB",
    category: "iphone",
    price: 39999,
    image: "/iphone-15-blue.jpg",
    rating: 4.7,
    reviews: 1567,
    colors: ["#000000", "#E3E3DF", "#E5DEE0", "#CFDAE7", "#D4E4CB"],
    memory: ["128GB", "256GB", "512GB"],
    inStock: true,
  },
  {
    id: "9",
    name: "MacBook Air 15 M3",
    category: "laptops",
    price: 64999,
    oldPrice: 69999,
    image: "/macbook-air-15-m3.jpg",
    rating: 4.9,
    reviews: 432,
    colors: ["#1C1C1E", "#F5F5F7", "#E3D0BA", "#7D7E80"],
    memory: ["256GB", "512GB", "1TB"],
    badge: "sale",
    inStock: true,
  },
  {
    id: "10",
    name: "Apple Watch Series 10",
    category: "watches",
    price: 18999,
    image: "/apple-watch-series-10.jpg",
    rating: 4.8,
    reviews: 765,
    badge: "new",
    inStock: true,
  },
  {
    id: "11",
    name: "AirPods Max",
    category: "headphones",
    price: 24999,
    image: "/airpods-max-silver.jpg",
    rating: 4.6,
    reviews: 543,
    colors: ["#F5F5F7", "#1C1C1E", "#87CEEB", "#90EE90", "#FFB6C1"],
    inStock: true,
  },
  {
    id: "12",
    name: "PlayStation 5 Slim",
    category: "gaming",
    price: 22999,
    oldPrice: 24999,
    image: "/playstation-5-slim.jpg",
    rating: 4.9,
    reviews: 2134,
    badge: "hit",
    inStock: true,
  },
  {
    id: "13",
    name: 'Samsung OLED S95D 65"',
    category: "tv",
    price: 84999,
    oldPrice: 94999,
    image: "/samsung-oled-s95d.jpg",
    rating: 4.9,
    reviews: 234,
    badge: "promo",
    inStock: true,
  },
  {
    id: "14",
    name: "Dyson V15 Detect",
    category: "dyson",
    price: 29999,
    image: "/dyson-v15-detect.jpg",
    rating: 4.8,
    reviews: 678,
    inStock: true,
  },
  {
    id: "15",
    name: "iPad Air 11 M2",
    category: "tablets",
    price: 32999,
    image: "/ipad-air-11-m2.jpg",
    rating: 4.8,
    reviews: 456,
    memory: ["128GB", "256GB", "512GB"],
    badge: "new",
    inStock: true,
  },
  {
    id: "16",
    name: "Garmin Fenix 8",
    category: "watches",
    price: 39999,
    image: "/garmin-fenix-8.jpg",
    rating: 4.9,
    reviews: 321,
    inStock: true,
  },
  {
    id: "17",
    name: "Google Pixel 9 Pro",
    category: "smartphones",
    price: 44999,
    image: "/google-pixel-9-pro.jpg",
    rating: 4.7,
    reviews: 567,
    colors: ["#1C1C1E", "#F5F5F7", "#E8D5C4"],
    memory: ["128GB", "256GB", "512GB"],
    badge: "new",
    inStock: true,
  },
  {
    id: "18",
    name: "MagSafe Charger",
    category: "accessories",
    price: 1999,
    image: "/magsafe-charger.jpg",
    rating: 4.5,
    reviews: 2345,
    inStock: true,
  },
  {
    id: "19",
    name: "Bose QuietComfort Ultra",
    category: "headphones",
    price: 17999,
    oldPrice: 19999,
    image: "/bose-qc-ultra.jpg",
    rating: 4.8,
    reviews: 876,
    colors: ["#1C1C1E", "#F5F5F7"],
    badge: "sale",
    inStock: true,
  },
  {
    id: "20",
    name: "Xbox Series X",
    category: "gaming",
    price: 24999,
    image: "/xbox-series-x.jpg",
    rating: 4.8,
    reviews: 1234,
    inStock: false,
  },
]

export interface CartItem {
  product: Product
  quantity: number
  selectedColor?: string
  selectedMemory?: string
}

export interface Order {
  id: string
  items: CartItem[]
  total: number
  status: "pending" | "processing" | "shipped" | "delivered"
  date: string
  address: string
}

export interface User {
  id: string
  email: string
  name: string
  role?: string
  phone?: string
  address?: string
  orders: Order[]
}
