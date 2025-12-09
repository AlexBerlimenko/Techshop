(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/lib/api.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "api",
    ()=>api
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
const API_BASE_URL = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';
function getAuthToken() {
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    return localStorage.getItem('auth_token');
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
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/store.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useStore",
    ()=>useStore
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$react$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/zustand/esm/react.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$middleware$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/zustand/esm/middleware.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/api.ts [app-client] (ecmascript)");
"use client";
;
;
;
const useStore = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$react$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["create"])()((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$middleware$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["persist"])((set, get)=>({
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
            const response = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["api"].auth.login(email, password);
            if (response.success && response.data) {
                if (response.data.token && ("TURBOPACK compile-time value", "object") !== 'undefined') {
                    localStorage.setItem('auth_token', response.data.token);
                }
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
            const response = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["api"].auth.register({
                email,
                password,
                name
            });
            if (response.success && response.data) {
                if (response.data.token && ("TURBOPACK compile-time value", "object") !== 'undefined') {
                    localStorage.setItem('auth_token', response.data.token);
                }
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
            await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["api"].auth.logout();
            if ("TURBOPACK compile-time truthy", 1) {
                localStorage.removeItem('auth_token');
            }
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
            const response = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["api"].orders.getAll();
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
            const response = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["api"].orders.create({
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
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/auth-init.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "AuthInit",
    ()=>AuthInit
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/store.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/api.ts [app-client] (ecmascript)");
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
function AuthInit() {
    _s();
    const initAuth = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useStore"])({
        "AuthInit.useStore[initAuth]": (state)=>state.initAuth
    }["AuthInit.useStore[initAuth]"]);
    const clearAuth = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useStore"])({
        "AuthInit.useStore[clearAuth]": (state)=>state.clearAuth
    }["AuthInit.useStore[clearAuth]"]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "AuthInit.useEffect": ()=>{
            async function loadAuth() {
                if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
                ;
                const token = localStorage.getItem('auth_token');
                if (token) {
                    try {
                        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["api"].auth.me();
                        if (response.success && response.data) {
                            initAuth({
                                id: response.data.id,
                                name: response.data.name,
                                email: response.data.email,
                                role: response.data.role
                            });
                            console.log('AuthInit: User loaded', {
                                role: response.data.role
                            });
                        } else {
                            localStorage.removeItem('auth_token');
                            clearAuth();
                        }
                    } catch (error) {
                        console.error('Auth init error:', error);
                        localStorage.removeItem('auth_token');
                        clearAuth();
                    }
                } else {
                    clearAuth();
                }
            }
            loadAuth();
        }
    }["AuthInit.useEffect"], [
        initAuth,
        clearAuth
    ]);
    return null;
}
_s(AuthInit, "J2Y0IYqjyUIrGwzh06Xb8/ZHwfs=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useStore"]
    ];
});
_c = AuthInit;
var _c;
__turbopack_context__.k.register(_c, "AuthInit");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=_aea50590._.js.map