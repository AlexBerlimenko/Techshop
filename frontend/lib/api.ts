const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

function getAuthToken(): string | null {
  if (typeof window === 'undefined') return null
  return localStorage.getItem('auth_token')
}

async function fetchApi<T>(
  endpoint: string,
  options?: RequestInit
): Promise<ApiResponse<T>> {
  try {
    const token = getAuthToken()
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options?.headers,
    }
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`
    }
    
    const response = await fetch(`${API_BASE_URL}/${endpoint}`, {
      ...options,
      headers,
      credentials: 'include',
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: data.error || 'Request failed',
      };
    }

    return data;
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Network error',
    };
  }
}

export const api = {
  categories: {
    getAll: () => fetchApi<Array<{ id: number; name: string; slug: string }>>('categories.php'),
  },

  products: {
    getAll: (params?: {
      category?: string;
      price_min?: number;
      price_max?: number;
      brand?: string;
      search?: string;
    }) => {
      const queryParams = new URLSearchParams();
      if (params?.category) queryParams.append('category', params.category);
      if (params?.price_min) queryParams.append('price_min', params.price_min.toString());
      if (params?.price_max) queryParams.append('price_max', params.price_max.toString());
      if (params?.brand) queryParams.append('brand', params.brand);
      if (params?.search) queryParams.append('search', params.search);

      const query = queryParams.toString();
      return fetchApi<Array<any>>(`products.php${query ? `?${query}` : ''}`);
    },
    getById: (id: number | string) => fetchApi<any>(`product.php?id=${id}`),
  },

  auth: {
    login: (email: string, password: string) =>
      fetchApi<{
        id: number;
        name: string;
        email: string;
        role: string;
      }>('auth.php?action=login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      }),

    register: (data: {
      name: string;
      email: string;
      password: string;
      phone?: string;
      address?: string;
    }) =>
      fetchApi<{
        id: number;
        name: string;
        email: string;
        role: string;
      }>('auth.php?action=register', {
        method: 'POST',
        body: JSON.stringify(data),
      }),

    logout: () =>
      fetchApi('auth.php?action=logout', {
        method: 'POST',
      }),

    me: () =>
      fetchApi<{
        id: number;
        name: string;
        email: string;
        role: string;
      }>('auth.php?action=me'),
  },

  orders: {
    create: (data: {
      full_name: string;
      phone: string;
      email: string;
      delivery_address: string;
      items: Array<{
        product_id: number;
        quantity: number;
      }>;
    }) =>
      fetchApi<{
        id: number;
        total: number;
      }>('orders.php', {
        method: 'POST',
        body: JSON.stringify(data),
      }),

    getAll: () => fetchApi<Array<any>>('orders.php'),
    
    updateStatus: (id: number, status: string) =>
      fetchApi<{ id: number; status: string }>('orders.php', {
        method: 'PUT',
        body: JSON.stringify({ id, status }),
      }),
    
    delete: (id: number) =>
      fetchApi<{ id: number }>(`orders.php?id=${id}`, {
        method: 'DELETE',
      }),
  },

  admin: {
    products: {
      create: (data: {
        name: string;
        price: number;
        stock: number;
        brand: string;
        category_id: number;
        description?: string;
        image?: string;
      }) =>
        fetchApi<{ id: number }>('admin/products.php', {
          method: 'POST',
          body: JSON.stringify(data),
        }),
      
      update: (data: {
        id: number;
        name: string;
        price: number;
        stock: number;
        brand: string;
        category_id: number;
        description?: string;
        image?: string;
      }) =>
        fetchApi<{ id: number }>('admin/products.php', {
          method: 'PUT',
          body: JSON.stringify(data),
        }),
      
      delete: (id: number) =>
        fetchApi<{ id: number }>(`admin/products.php?id=${id}`, {
          method: 'DELETE',
        }),
    },
    
    categories: {
      create: (data: { name: string; slug?: string }) =>
        fetchApi<{ id: number }>('admin/categories.php', {
          method: 'POST',
          body: JSON.stringify(data),
        }),
      
      update: (data: { id: number; name: string; slug?: string }) =>
        fetchApi<{ id: number }>('admin/categories.php', {
          method: 'PUT',
          body: JSON.stringify(data),
        }),
      
      delete: (id: number) =>
        fetchApi<{ id: number }>(`admin/categories.php?id=${id}`, {
          method: 'DELETE',
        }),
    },
  },
};

