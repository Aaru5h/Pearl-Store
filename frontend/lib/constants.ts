export const API = {
  AUTH: {
    LOGIN: "/auth/login",
    REGISTER: "/auth/register",
    LOGOUT: "/auth/logout",
    REFRESH: "/auth/refresh",
    ME: "/auth/me",
  },
  PRODUCTS: {
    LIST: "/products",
    FEATURED: "/products/featured",
    NEW_ARRIVALS: "/products/new-arrivals",
    BY_SLUG: (slug: string) => `/products/${slug}`,
  },
  CATEGORIES: {
    TREE: "/categories/tree",
    LIST: "/categories",
  },
  CART: {
    GET: "/cart",
    ADD: "/cart/items",
    UPDATE: (itemId: string) => `/cart/items/${itemId}`,
    REMOVE: (itemId: string) => `/cart/items/${itemId}`,
    CLEAR: "/cart/clear",
    APPLY_COUPON: "/cart/coupon",
  },
  ORDERS: {
    CREATE: "/orders",
    LIST: "/orders",
    BY_ID: (id: string) => `/orders/${id}`,
  },
};

export const QUERY_KEYS = {
  products: ["products"] as const,
  product: (slug: string) => ["products", slug] as const,
  categories: ["categories"] as const,
  cart: ["cart"] as const,
  orders: ["orders"] as const,
  order: (id: string) => ["orders", id] as const,
  user: ["user"] as const,
};
