module.exports = [
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[project]/lib/api.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "api",
    ()=>api
]);
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';
function getAuthToken() {
    if ("TURBOPACK compile-time truthy", 1) return null;
    //TURBOPACK unreachable
    ;
}
async function fetchApi(endpoint, options) {
    try {
        const token = getAuthToken();
        const headers = {
            'Content-Type': 'application/json',
            ...options?.headers
        };
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }
        const response = await fetch(`${API_BASE_URL}/${endpoint}`, {
            ...options,
            headers,
            credentials: 'include'
        });
        const data = await response.json();
        if (!response.ok) {
            return {
                success: false,
                error: data.error || 'Request failed'
            };
        }
        return data;
    } catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Network error'
        };
    }
}
const api = {
    categories: {
        getAll: ()=>fetchApi('categories.php')
    },
    products: {
        getAll: (params)=>{
            const queryParams = new URLSearchParams();
            if (params?.category) queryParams.append('category', params.category);
            if (params?.price_min) queryParams.append('price_min', params.price_min.toString());
            if (params?.price_max) queryParams.append('price_max', params.price_max.toString());
            if (params?.brand) queryParams.append('brand', params.brand);
            if (params?.search) queryParams.append('search', params.search);
            const query = queryParams.toString();
            return fetchApi(`products.php${query ? `?${query}` : ''}`);
        },
        getById: (id)=>fetchApi(`product.php?id=${id}`)
    },
    auth: {
        login: (email, password)=>fetchApi('auth.php?action=login', {
                method: 'POST',
                body: JSON.stringify({
                    email,
                    password
                })
            }),
        register: (data)=>fetchApi('auth.php?action=register', {
                method: 'POST',
                body: JSON.stringify(data)
            }),
        logout: ()=>fetchApi('auth.php?action=logout', {
                method: 'POST'
            }),
        me: ()=>fetchApi('auth.php?action=me')
    },
    orders: {
        create: (data)=>fetchApi('orders.php', {
                method: 'POST',
                body: JSON.stringify(data)
            }),
        getAll: ()=>fetchApi('orders.php'),
        updateStatus: (id, status)=>fetchApi('orders.php', {
                method: 'PUT',
                body: JSON.stringify({
                    id,
                    status
                })
            }),
        delete: (id)=>fetchApi(`orders.php?id=${id}`, {
                method: 'DELETE'
            })
    },
    admin: {
        products: {
            create: (data)=>fetchApi('admin/products.php', {
                    method: 'POST',
                    body: JSON.stringify(data)
                }),
            update: (data)=>fetchApi('admin/products.php', {
                    method: 'PUT',
                    body: JSON.stringify(data)
                }),
            delete: (id)=>fetchApi(`admin/products.php?id=${id}`, {
                    method: 'DELETE'
                })
        },
        categories: {
            create: (data)=>fetchApi('admin/categories.php', {
                    method: 'POST',
                    body: JSON.stringify(data)
                }),
            update: (data)=>fetchApi('admin/categories.php', {
                    method: 'PUT',
                    body: JSON.stringify(data)
                }),
            delete: (id)=>fetchApi(`admin/categories.php?id=${id}`, {
                    method: 'DELETE'
                })
        }
    }
};
}),
"[project]/lib/store.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useStore",
    ()=>useStore
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$react$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/zustand/esm/react.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$middleware$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/zustand/esm/middleware.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/api.ts [app-ssr] (ecmascript)");
"use client";
;
;
;
const useStore = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$react$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["create"])()((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$middleware$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["persist"])((set, get)=>({
        // Cart
        cart: [],
        addToCart: (product, quantity = 1, color, memory)=>{
            set((state)=>{
                const existingItem = state.cart.find((item)=>item.product.id === product.id && item.selectedColor === color && item.selectedMemory === memory);
                if (existingItem) {
                    return {
                        cart: state.cart.map((item)=>item.product.id === product.id && item.selectedColor === color && item.selectedMemory === memory ? {
                                ...item,
                                quantity: item.quantity + quantity
                            } : item)
                    };
                }
                return {
                    cart: [
                        ...state.cart,
                        {
                            product,
                            quantity,
                            selectedColor: color,
                            selectedMemory: memory
                        }
                    ]
                };
            });
        },
        removeFromCart: (productId)=>{
            set((state)=>({
                    cart: state.cart.filter((item)=>item.product.id !== productId)
                }));
        },
        updateQuantity: (productId, quantity)=>{
            set((state)=>({
                    cart: state.cart.map((item)=>item.product.id === productId ? {
                            ...item,
                            quantity: Math.max(1, quantity)
                        } : item)
                }));
        },
        clearCart: ()=>set({
                cart: []
            }),
        getCartTotal: ()=>{
            const { cart } = get();
            return cart.reduce((total, item)=>total + item.product.price * item.quantity, 0);
        },
        getCartCount: ()=>{
            const { cart } = get();
            return cart.reduce((count, item)=>count + item.quantity, 0);
        },
        // Wishlist
        wishlist: [],
        addToWishlist: (product)=>{
            set((state)=>{
                if (state.wishlist.find((p)=>p.id === product.id)) return state;
                return {
                    wishlist: [
                        ...state.wishlist,
                        product
                    ]
                };
            });
        },
        removeFromWishlist: (productId)=>{
            set((state)=>({
                    wishlist: state.wishlist.filter((p)=>p.id !== productId)
                }));
        },
        isInWishlist: (productId)=>{
            const { wishlist } = get();
            return wishlist.some((p)=>p.id === productId);
        },
        // Auth
        user: null,
        isAuthenticated: false,
        login: async (email, password)=>{
            const response = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["api"].auth.login(email, password);
            if (response.success && response.data) {
                if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
                ;
                set({
                    user: {
                        id: response.data.id.toString(),
                        email: response.data.email,
                        name: response.data.name,
                        role: response.data.role,
                        orders: []
                    },
                    isAuthenticated: true
                });
                return true;
            }
            return false;
        },
        register: async (email, password, name)=>{
            const response = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["api"].auth.register({
                email,
                password,
                name
            });
            if (response.success && response.data) {
                if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
                ;
                set({
                    user: {
                        id: response.data.id.toString(),
                        email: response.data.email,
                        name: response.data.name,
                        role: response.data.role,
                        orders: []
                    },
                    isAuthenticated: true
                });
                return true;
            }
            return false;
        },
        logout: async ()=>{
            await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["api"].auth.logout();
            if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
            ;
            set({
                user: null,
                isAuthenticated: false
            });
        },
        updateProfile: (data)=>{
            set((state)=>({
                    user: state.user ? {
                        ...state.user,
                        ...data
                    } : null
                }));
        },
        initAuth: (userData)=>{
            set({
                user: {
                    id: userData.id.toString(),
                    email: userData.email,
                    name: userData.name,
                    role: userData.role,
                    orders: []
                },
                isAuthenticated: true
            });
        },
        clearAuth: ()=>{
            set({
                user: null,
                isAuthenticated: false
            });
        },
        // Orders
        orders: [],
        loadOrders: async ()=>{
            const response = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["api"].orders.getAll();
            if (response.success && response.data) {
                const orders = response.data.map((order)=>({
                        id: order.id.toString(),
                        items: (order.items || []).map((item)=>({
                                product: {
                                    id: item.product_id.toString(),
                                    name: item.name || 'Товар',
                                    price: parseFloat(item.price),
                                    image: `http://localhost:8080/images/${item.image || 'no-image.png'}`,
                                    category: '',
                                    inStock: true,
                                    rating: 0,
                                    reviews: 0
                                },
                                quantity: item.quantity
                            })),
                        total: order.total,
                        status: order.status === 'new' ? 'pending' : order.status === 'processing' ? 'processing' : order.status === 'completed' ? 'delivered' : 'pending',
                        date: order.created_at,
                        address: order.delivery_address
                    }));
                set({
                    orders
                });
            }
        },
        createOrder: async (address)=>{
            const { cart, getCartTotal, user, clearCart } = get();
            if (cart.length === 0) return null;
            if (!user) {
                return null;
            }
            const items = cart.map((item)=>({
                    product_id: parseInt(item.product.id),
                    quantity: item.quantity
                }));
            const response = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["api"].orders.create({
                full_name: user.name,
                phone: user.phone || '',
                email: user.email,
                delivery_address: address,
                items
            });
            if (response.success && response.data) {
                const order = {
                    id: response.data.id.toString(),
                    items: [
                        ...cart
                    ],
                    total: response.data.total,
                    status: "pending",
                    date: new Date().toISOString(),
                    address
                };
                set((state)=>({
                        orders: [
                            order,
                            ...state.orders
                        ],
                        user: state.user ? {
                            ...state.user,
                            orders: [
                                order,
                                ...state.user.orders
                            ]
                        } : null
                    }));
                clearCart();
                return order;
            }
            return null;
        }
    }), {
    name: "lokistore-storage"
}));
}),
"[project]/components/auth-init.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "AuthInit",
    ()=>AuthInit
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/store.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/api.ts [app-ssr] (ecmascript)");
"use client";
;
;
;
function AuthInit() {
    const initAuth = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useStore"])((state)=>state.initAuth);
    const clearAuth = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useStore"])((state)=>state.clearAuth);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        async function loadAuth() {
            if ("TURBOPACK compile-time truthy", 1) return;
            //TURBOPACK unreachable
            ;
            const token = undefined;
        }
        loadAuth();
    }, [
        initAuth,
        clearAuth
    ]);
    return null;
}
}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/action-async-storage.external.js [external] (next/dist/server/app-render/action-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/action-async-storage.external.js", () => require("next/dist/server/app-render/action-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/after-task-async-storage.external.js [external] (next/dist/server/app-render/after-task-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/after-task-async-storage.external.js", () => require("next/dist/server/app-render/after-task-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/dynamic-access-async-storage.external.js [external] (next/dist/server/app-render/dynamic-access-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/dynamic-access-async-storage.external.js", () => require("next/dist/server/app-render/dynamic-access-async-storage.external.js"));

module.exports = mod;
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__7df64478._.js.map