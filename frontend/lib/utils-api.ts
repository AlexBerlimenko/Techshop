import type { Product } from "./data"

export function convertBackendProductToFrontend(backendProduct: any): Product {
  return {
    id: backendProduct.id.toString(),
    name: backendProduct.name,
    category: backendProduct.category_slug || backendProduct.category_name?.toLowerCase() || '',
    price: parseFloat(backendProduct.price),
    image: `http://localhost:8080/images/${backendProduct.image}`,
    rating: 4.5,
    reviews: 0,
    inStock: backendProduct.inStock !== undefined ? backendProduct.inStock : (backendProduct.stock > 0),
    description: backendProduct.description || '',
    brand: backendProduct.brand || '',
  }
}

export function convertBackendCategoryToFrontend(backendCategory: any, image?: string) {
  return {
    id: backendCategory.slug,
    name: backendCategory.name,
    image: image || '/placeholder-category.jpg',
    count: 0,
  }
}

