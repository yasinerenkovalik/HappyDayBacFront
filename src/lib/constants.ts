// Application constants
export const API_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL || "/api/proxy",
  IMAGE_BASE_URL: process.env.NEXT_PUBLIC_IMAGE_BASE_URL || "/api/images",
} as const;

export const APP_CONFIG = {
  APP_URL: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
  APP_NAME: "MutluGünüm",
  APP_DESCRIPTION: "Organizasyon ve etkinlik yönetim platformu",
  VERSION: "1.0.0",
} as const;

export const ROUTES = {
  HOME: "/",
  LOGIN: "/admin/login",
  ADMIN_DASHBOARD: "/admin/dashboard",
  COMPANY_DASHBOARD: "/admin/company-dashboard",
  ORGANIZATIONS: "/admin/my-organizations",
  ORGANIZATION_DETAIL: "/organization-detail",
  ORGANIZATION_LIST: "/organization-list",
} as const;

export const STORAGE_KEYS = {
  AUTH_TOKEN: "authToken",
  USER_TYPE: "userType",
  USER_ROLE: "userRole",
  COMPANY_ID: "companyId",
  USER_ID: "userId",
} as const;

export const ERROR_MESSAGES = {
  NETWORK_ERROR: "Bağlantı hatası. Lütfen internet bağlantınızı kontrol edin.",
  UNAUTHORIZED: "Oturum süreniz dolmuş. Lütfen tekrar giriş yapın.",
  FORBIDDEN: "Bu işlem için yetkiniz bulunmamaktadır.",
  NOT_FOUND: "Aradığınız sayfa bulunamadı.",
  SERVER_ERROR: "Sunucu hatası. Lütfen daha sonra tekrar deneyin.",
  VALIDATION_ERROR: "Lütfen tüm alanları doğru şekilde doldurun.",
} as const;