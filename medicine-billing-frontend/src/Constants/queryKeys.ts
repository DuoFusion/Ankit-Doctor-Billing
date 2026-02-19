export const QUERY_KEYS = {
  ME: ["me"],

  PRODUCTS: (params?: any) => ["products", params],
  PRODUCT: (id: string) => ["product", id],

  COMPANIES: (params?: any) => ["companies", params],
  COMPANY: (id: string) => ["company", id],

  USERS: (params?: any) => ["users", params],
};
