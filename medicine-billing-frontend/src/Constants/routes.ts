export const ROUTES = {
  LOGIN: "/login",
  SIGNUP: "/",
  VERIFY_OTP: "/verify-otp",
  PRODUCTS: "/products",
  CREATE_PRODUCT: "/products/create",
  PRODUCT_DETAILS: (id: string) => `/products/${id}`,
  PRODUCT_EDIT: "/products/:id/edit",

  DASHBOARD: "/dashboard",
  COMPANIES: "/companies",
  CREATE_COMPANY: "/companies/create",
  COMPANY_DETAILS: (id: string) => `/companies/${id}`,
  COMPANY_EDIT: "/companies/:id/edit",

  PROFILE: "/profile",
  EDITPROFILE: "/profile/edit",

  BILLING: "/billing",                
  CREATE_BILL: "/billing/create",      
  BILL_DETAILS: (id: string) => `/billing/${id}`, 
  BILL_PDF: (id: string) => `/billing/${id}/pdf`,

  USERS: "/users",
};