import { Header } from "@/components/header"
import { HeroSection } from "@/components/hero-section"
import { BrandsBar } from "@/components/brands-bar"
import { CategoriesGrid } from "@/components/categories-grid"
import { ProductsSection } from "@/components/products-section"
import { ServicesSection } from "@/components/services-section"
import { Footer } from "@/components/footer"
import { api } from "@/lib/api"
import { convertBackendProductToFrontend, convertBackendCategoryToFrontend } from "@/lib/utils-api"

async function getData() {
  try {
    const [categoriesRes, productsRes] = await Promise.all([
      api.categories.getAll(),
      api.products.getAll(),
    ])

    const categories = categoriesRes.success && categoriesRes.data
      ? categoriesRes.data.map((cat) => convertBackendCategoryToFrontend(cat))
      : []

    const products = productsRes.success && productsRes.data
      ? productsRes.data.map((prod) => convertBackendProductToFrontend(prod))
      : []

    return { categories, products }
  } catch (error) {
    console.error('Error fetching data:', error)
    return { categories: [], products: [] }
  }
}

export default async function HomePage() {
  const { categories, products } = await getData()
  const featuredProducts = products.slice(0, 6)

  return (
    <div className="min-h-screen bg-loki-black">
      <Header />

      <main>
        {/* Hero Carousel */}
        <HeroSection />

        {/* Brands Bar */}
        <BrandsBar />

        {/* Categories Grid */}
        <section className="container mx-auto px-4 py-8">
          <CategoriesGrid categories={categories} />
        </section>

        {/* Services */}
        <section className="container mx-auto px-4 py-8">
          <ServicesSection />
        </section>

        {/* Featured Products */}
        {featuredProducts.length > 0 && (
          <section className="container mx-auto px-4 py-8">
            <ProductsSection title="Популярні товари" products={featuredProducts} viewAllLink="/category/all" />
          </section>
        )}
      </main>

      <Footer />
    </div>
  )
}
