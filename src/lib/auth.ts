// Authentication utilities
import { STORAGE_KEYS, ROUTES, API_CONFIG } from './constants';

export const API_BASE_URL = API_CONFIG.BASE_URL;

export interface LoginResponse {
  data: {
    token: string;
  };
  isSuccess: boolean;
  errors: string[] | null;
  message: string;
}

export const parseJWT = (token: string) => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(function (c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    return null;
  }
};

export const isTokenValid = (token: string) => {
  // JWT format kontrolü (3 parça olmalı)
  const parts = token.split('.');
  if (parts.length !== 3) return false;

  // Payload parse kontrolü
  const payload = parseJWT(token);
  if (!payload) return false;

  // Expiration time kontrolü
  const currentTime = Date.now() / 1000;
  if (payload.exp <= currentTime) return false;

  // Temel JWT structure kontrolü
  try {
    // Header kontrolü
    const header = JSON.parse(atob(parts[0].replace(/-/g, '+').replace(/_/g, '/')));
    if (!header.alg || !header.typ) return false;

    // Payload'da gerekli alanlar var mı kontrol et
    if (!payload.sub && !payload.userId && !payload.nameid) return false;

    return true;
  } catch (error) {
    return false;
  }
};

export const getAuthToken = () => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
};

export const getAuthHeaders = () => {
  const token = getAuthToken();
  return {
    "Content-Type": "application/json",
    ...(token ? { "Authorization": `Bearer ${token}` } : {})
  };
};

export const apiCall = async (endpoint: string, options: RequestInit = {}) => {
  const token = getAuthToken();

  if (token && !isTokenValid(token)) {
    localStorage.clear();
    window.location.href = "/admin/login";
    throw new Error("Token expired");
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      ...getAuthHeaders(),
      ...(options.headers || {}),
    },
  });

  if (response.status === 401) {
    localStorage.clear();
    window.location.href = "/admin/login";
    throw new Error("Unauthorized");
  }

  return response;
};

// FormData için özel API çağrısı
export const apiCallFormData = async (
  endpoint: string,
  formData: FormData,
  method: string = "PUT"
) => {
  const token = getAuthToken();

  if (token && !isTokenValid(token)) {
    localStorage.clear();
    window.location.href = "/admin/login";
    throw new Error("Token expired");
  }

  const headers: Record<string, string> = {};
  if (token) headers["Authorization"] = `Bearer ${token}`;
  // ÖNEMLİ: FormData gönderirken Content-Type manuel eklenmez.

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method,
    body: formData,
    headers
  });

  if (response.status === 401) {
    localStorage.clear();
    window.location.href = "/admin/login";
    throw new Error("Unauthorized");
  }

  return response;
};

export const login = async (email: string, password: string): Promise<LoginResponse> => {
  const response = await fetch(`${API_BASE_URL}/User/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

  const data = await response.json();

  // Başarılı giriş sonrası token'ı parse et ve kullanıcı tipini belirle
  if (data.isSuccess && data.data.token) {
    const tokenPayload = parseJWT(data.data.token);
    if (tokenPayload) {
      const userType = tokenPayload.role === "Admin" ? "admin" : "company";

      localStorage.setItem("authToken", data.data.token);
      localStorage.setItem("userRole", tokenPayload.role);
      localStorage.setItem("userType", userType);
      localStorage.setItem("companyId", tokenPayload.CompanyId || "");
      localStorage.setItem("userId", tokenPayload.nameid || "");
    }
  }

  return data;
};

// Company login function
export const companyLogin = async (email: string, password: string): Promise<LoginResponse> => {
  const response = await fetch(`${API_BASE_URL}/Company/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

  const data = await response.json();

  // Başarılı giriş sonrası token'ı parse et ve kullanıcı tipini belirle
  if (data.isSuccess && data.data.token) {
    const tokenPayload = parseJWT(data.data.token);

    if (tokenPayload) {
      localStorage.setItem("authToken", data.data.token);
      localStorage.setItem("userRole", "Company");
      localStorage.setItem("userType", "company");
      localStorage.setItem("companyId", tokenPayload.CompanyId || "");
      localStorage.setItem("userId", tokenPayload.nameid || "");
    }
  }

  return data;
};

// Helper function to clear auth data
export const clearAuthData = () => {
  if (typeof window === 'undefined') return;

  Object.values(STORAGE_KEYS).forEach(key => {
    localStorage.removeItem(key);
  });
};

export const logout = () => {
  clearAuthData();
  window.location.href = ROUTES.LOGIN;
};

// Company API calls
export interface Company {
  name: string;
  email: string;
  password: string;
  adress: string;
  phoneNumber: string;
  description: string;
  id: string;
}

export interface CompanyResponse {
  data: Company[];
  isSuccess: boolean;
  errors: string[] | null;
  message: string;
}

export const getAllCompanies = async (): Promise<CompanyResponse> => {
  const response = await apiCall("/Company/CompanyGetAll");
  return response.json();
};

// Organization API calls
export interface Organization {
  title: string;
  description: string;
  price: number;
  maxGuestCount: number;
  location: string | null;
  services: string[];
  duration: string;
  isOutdoor: boolean;
  reservationNote: string;
  cancelPolicy: string;
  videoUrl: string;
  coverPhotoPath: string;
  companyId: string;
  id: string;
  bookings?: number;
  rating?: number;
}

export interface OrganizationResponse {
  data: Organization[];
  isSuccess: boolean;
  errors: string[] | null;
  message: string;
}

export const getAllOrganizations = async (): Promise<OrganizationResponse> => {
  const response = await apiCall("/Organization/OrganizationGetAll");
  return response.json();
};

// Organization detail with images
export interface OrganizationDetail extends Organization {
  categoryId?: number;
  cityId?: number;
  latitude?: number;
  longitude?: number;
  images?: Array<{
    id: number | string;
    imageUrl: string;
  }>;
}

export interface OrganizationDetailResponse {
  data: OrganizationDetail;
  isSuccess: boolean;
  errors: string[] | null;
  message: string;
}

export const getOrganizationDetail = async (id: string): Promise<OrganizationDetailResponse> => {
  const response = await apiCall(`/Organization/GetOrganizationWithImages?Id=${id}`);
  return response.json();
};

// Organization update
export interface OrganizationUpdateData {
  id: string;
  title: string;
  description: string;
  price: number;
  maxGuestCount: number;
  categoryId?: number;
  cityId?: number;
  services: string[];
  duration: string;
  isOutdoor: boolean;
  reservationNote: string;
  cancelPolicy: string;
  videoUrl: string;
  coverPhoto?: File;
}

export const updateOrganization = async (data: OrganizationUpdateData): Promise<any> => {
  const formData = new FormData();

  formData.append('Id', data.id);
  formData.append('Title', data.title || '');
  formData.append('Description', data.description || '');
  formData.append('Price', data.price.toString());
  formData.append('MaxGuestCount', data.maxGuestCount.toString());

  if (data.categoryId && data.categoryId > 0) {
    formData.append('CategoryId', data.categoryId.toString());
  }

  if (data.cityId && data.cityId > 0) {
    formData.append('CityId', data.cityId.toString());
  }

  // Services -> .NET List<string> için aynı isimle tekrarlı ekleme
  if (data.services && data.services.length > 0) {
    data.services.forEach((service) => {
      formData.append('Services', service);
    });
  }

  // Zorunlu alanlar için varsayılanlar
  formData.append('Duration', data.duration || '1 saat');
  formData.append('IsOutdoor', data.isOutdoor.toString());
  formData.append('ReservationNote', data.reservationNote || 'Rezervasyon notu bulunmamaktadır.');
  formData.append('CancelPolicy', data.cancelPolicy || 'İptal politikası bulunmamaktadır.');
  formData.append('VideoUrl', data.videoUrl || '');

  if (data.coverPhoto) {
    // Backend DTO: IFormFile CoverPhoto => alan adı birebir "CoverPhoto" olmalı
    formData.append('CoverPhoto', data.coverPhoto);
  }

  // Debug
  console.log('FormData contents (updateOrganization):');
  for (let [key, value] of formData.entries()) {
    console.log(key, value);
  }

  // Not: Endpoint sende "OrganizationUpdate" olarak görünüyor.
  // Eğer backend tarafında "/Organization/Update" ise, buradaki path'i değiştir.
  const response = await apiCallFormData("/Organization/OrganizationUpdate", formData, "PUT");
  return response.json();
};

// Add single organization image
export const addOrganizationImage = async (organizationId: string, image: File): Promise<any> => {
  const formData = new FormData();

  // Add organization ID
  formData.append('OrganizationId', organizationId);

  // Add single image with correct field name
  formData.append('OrganizationImage', image);

  // Debug: FormData içeriğini konsola yazdır
  console.log('Add Image FormData contents:');
  for (let [key, value] of formData.entries()) {
    console.log(key, value);
  }

  const response = await apiCallFormData("/OrganizationImages/AddOrganizationImages", formData, "POST");
  return response.json();
};

// Add multiple organization images (tek tek gönderir)
export const addOrganizationImages = async (organizationId: string, images: File[]): Promise<any> => {
  const results = [];
  let successCount = 0;
  let failCount = 0;

  for (const image of images) {
    try {
      const result = await addOrganizationImage(organizationId, image);
      results.push(result);
      if (result.isSuccess) {
        successCount++;
      } else {
        failCount++;
      }
    } catch (error) {
      failCount++;
      results.push({
        isSuccess: false,
        message: `${image.name} yüklenirken hata oluştu`,
        error: error
      });
    }
  }

  // Tüm sonuçları birleştir
  return {
    isSuccess: successCount > 0,
    message: `${successCount} resim başarıyla eklendi${failCount > 0 ? `, ${failCount} resim başarısız` : ''}`,
    results: results,
    successCount: successCount,
    failCount: failCount
  };
};

// Get company's own organizations
export const getCompanyOrganizations = async (): Promise<OrganizationResponse> => {
  // JWT token'dan company ID'yi al
  const token = getAuthToken();
  if (!token) {
    throw new Error("No auth token found");
  }

  const tokenPayload = parseJWT(token);
  if (!tokenPayload || !tokenPayload.CompanyId) {
    throw new Error("Company ID not found in token");
  }

  const companyId = tokenPayload.CompanyId;
  const response = await apiCall(`/Organization/GetOrganizationWithICompany?Id=${companyId}`);
  return response.json();
};
// Get company details
export const getCompanyDetails = async (companyId: string): Promise<CompanyResponse> => {
  const response = await apiCall(`/Company/getbyid?Id=${companyId}`);
  return response.json();
};

// Update company
export interface CompanyUpdateData {
  id: string;
  name: string;
  email: string;
  adress: string;
  phoneNumber: string;
  description: string;
}

export const updateCompany = async (data: CompanyUpdateData): Promise<any> => {
  const response = await apiCall("/Company/update", {
    method: "PUT",
    body: JSON.stringify(data)
  });
  return response.json();
};