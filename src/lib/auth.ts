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
    console.error('❌ Token is invalid or expired');
    localStorage.clear();
    window.location.href = "/admin/login";
    throw new Error("Token expired");
  }

  const headers = {
    ...getAuthHeaders(),
    ...(options.headers || {}),
  };

  console.log('📡 API Call:', `${API_BASE_URL}${endpoint}`);
  console.log('📡 Headers:', headers);
  console.log('📡 Method:', options.method || 'GET');
  console.log('📡 Request body:', options.body);

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  console.log('📡 Response Status:', response.status);

  if (response.status === 401) {
    console.error('❌ Unauthorized - clearing localStorage');
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
  // Tarayıcı otomatik olarak "multipart/form-data; boundary=..." ayarlar

  // Debug bilgileri
  console.log('📡 API Call FormData:', `${API_BASE_URL}${endpoint}`);
  console.log('📡 Method:', method);
  console.log('📡 Headers:', headers);
  console.log('📡 FormData size:', formData.entries ? Array.from(formData.entries()).length : 'Unknown');
  
  // FormData içeriğini detaylı göster
  if (formData.entries) {
    console.log('📡 FormData contents:');
    for (let [key, value] of formData.entries()) {
      if (value instanceof File) {
        console.log(`  ${key}: File { name: "${value.name}", size: ${value.size}, type: "${value.type}" }`);
      } else {
        console.log(`  ${key}: "${value}"`);
      }
    }
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method,
    body: formData,
    headers
  });

  console.log('📡 Response Status:', response.status);
  console.log('📡 Response Headers:', Object.fromEntries(response.headers.entries()));

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
      // Store company ID, ensuring it's not undefined
      const companyId = tokenPayload.CompanyId || tokenPayload.companyId || "";
      localStorage.setItem("companyId", companyId);
      localStorage.setItem("userId", tokenPayload.nameid || "");
      
      // Email doğrulama durumunu kaydet
      if (data.data.isEmailConfirmed !== undefined) {
        localStorage.setItem("isEmailConfirmed", data.data.isEmailConfirmed.toString());
      }

      // Şirket adını da kaydet (token'dan veya API'den)
      if (tokenPayload.CompanyName) {
        localStorage.setItem("companyName", tokenPayload.CompanyName);
      } else if (tokenPayload.CompanyId) {
        // Şirket detaylarını çek ve adını kaydet
        try {
          const companyResponse = await getCompanyDetails(tokenPayload.CompanyId);
          if (companyResponse.isSuccess && companyResponse.data.length > 0) {
            localStorage.setItem("companyName", companyResponse.data[0].name);
          }
        } catch (error) {
          console.log("Company details fetch error:", error);
        }
      }
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
  
  // Email doğrulama durumunu da temizle
  localStorage.removeItem("isEmailConfirmed");
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
  latitude?: number;
  longitude?: number;
  coverPhotoPath?: string;
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
  Id?: string; // Backend'den gelebilecek alternatif ID field'ı
  ID?: string; // Başka bir alternatif
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
  districtId?: number;
  services: string[];
  duration?: string;
  isOutdoor: boolean;
  reservationNote?: string;
  cancelPolicy?: string;
  videoUrl?: string;
  coverPhoto?: File;
}

export const updateOrganization = async (data: OrganizationUpdateData): Promise<any> => {
  try {
    const formData = new FormData();

    formData.append('Id', data.id);
    formData.append('Title', data.title || '');
    formData.append('Description', data.description || '');
    formData.append('Price', data.price.toString());
    formData.append('MaxGuestCount', data.maxGuestCount.toString());

    // CityId alanını doğru şekilde işle
    if (data.cityId !== undefined && data.cityId !== null) {
      const cityIdValue = typeof data.cityId === 'string' ? parseInt(data.cityId, 10) : data.cityId;
      if (!isNaN(cityIdValue) && cityIdValue > 0) {
        formData.append('CityId', cityIdValue.toString());
      }
    }

    // DistrictId alanını doğru şekilde işle
    if (data.districtId !== undefined && data.districtId !== null) {
      const districtIdValue = typeof data.districtId === 'string' ? parseInt(data.districtId, 10) : data.districtId;
      if (!isNaN(districtIdValue) && districtIdValue > 0) {
        formData.append('DistrictId', districtIdValue.toString());
      }
    }

    // CategoryId alanını doğru şekilde işle
    if (data.categoryId !== undefined && data.categoryId !== null) {
      const categoryIdValue = typeof data.categoryId === 'string' ? parseInt(data.categoryId, 10) : data.categoryId;
      if (!isNaN(categoryIdValue) && categoryIdValue > 0) {
        formData.append('CategoryId', categoryIdValue.toString());
      }
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
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Organization update error response:', errorText);
      throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
    }
    
    return response.json();
  } catch (error) {
    console.error('Error in updateOrganization:', error);
    throw error;
  }
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
// Get company details (public endpoint - no auth required) - Updated to use proxy
export const getCompanyDetailsPublic = async (companyId: string): Promise<CompanyResponse> => {
  try {
    console.log('📡 Calling PROXY API (no auth):', `/Company/getbyid?Id=${companyId}`);
    
    // Use proxy URL instead of direct server
    const proxyUrl = `/api/proxy/Company/getbyid?Id=${companyId}`;
    console.log('📍 Proxy URL:', proxyUrl);
    
    const response = await fetch(proxyUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    console.log('📡 Response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ API Error Response:', errorText);
      throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
    }

    const data = await response.json();
    console.log('✅ API Success Response:', data);
    return data;
  } catch (error) {
    console.error('💥 Error in getCompanyDetailsPublic:', error);
    throw error;
  }
};

// Get company details (with auth)
export const getCompanyDetails = async (companyId: string): Promise<CompanyResponse> => {
  try {
    const token = getAuthToken();
    console.log('🔑 JWT Token exists:', !!token);
    console.log('🔑 JWT Token (first 20 chars):', token ? token.substring(0, 20) + '...' : 'No token');
    
    // JWT token'dan user role'ü al
    const tokenPayload = parseJWT(token || '');
    const userRole = tokenPayload?.role;
    const currentCompanyId = tokenPayload?.CompanyId;
    
    console.log('👤 User Role:', userRole);
    console.log('🏢 Current Company ID:', currentCompanyId);
    console.log('🎯 Requested Company ID:', companyId);
    
    console.log('📡 Calling API with auth:', `/Company/getbyid?Id=${companyId}`);
    
    // Önce public endpoint'i deneyelim
    try {
      return await getCompanyDetailsPublic(companyId);
    } catch (publicError) {
      console.log('❌ Public endpoint failed, trying with auth...');
      
      const response = await apiCall(`/Company/getbyid?Id=${companyId}`);
      
      console.log('📡 Response status:', response.status);
      console.log('📡 Response headers:', Object.fromEntries(response.headers.entries()));

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ API Error Response:', errorText);
        
        if (response.status === 403) {
          throw new Error(`Erişim reddedildi. Bu şirketin bilgilerine erişim yetkiniz bulunmamaktadır.`);
        }
        
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
      }

      const data = await response.json();
      console.log('✅ API Success Response:', data);
      return data;
    }
  } catch (error) {
    console.error('💥 Error in getCompanyDetails:', error);
    throw error;
  }
};

// Update company
export interface CompanyUpdateData {
  id: string;
  name: string;
  email?: string;
  adress: string;
  phoneNumber: string;
  description: string;
  latitude?: number;
  longitude?: number;
  cityId?: number;
  districtId?: number;
  coverPhotoPath?: string;
  coverPhoto?: File;
}

export const updateCompany = async (data: CompanyUpdateData): Promise<any> => {
  try {
    console.log('🚀 updateCompany called with data:', data);
    console.log('🚀 Data type:', typeof data);
    console.log('🚀 Data keys:', Object.keys(data || {}));
    
    // Validate required fields
    if (!data) {
      console.error('❌ Data is null or undefined');
      throw new Error("Veri bulunamadı");
    }
    
    if (!data.id || data.id.trim() === '') {
      console.error('❌ ID is missing or empty:', data.id);
      throw new Error("Şirket ID'si gereklidir");
    }
    if (!data.name || data.name.trim() === '') {
      console.error('❌ Name is missing or empty:', data.name);
      throw new Error("Şirket adı gereklidir");
    }
    if (!data.adress || data.adress.trim() === '') {
      console.error('❌ Address is missing or empty:', data.adress);
      throw new Error("Adres bilgisi gereklidir");
    }
    if (!data.description || data.description.trim() === '') {
      console.error('❌ Description is missing or empty:', data.description);
      throw new Error("Açıklama bilgisi gereklidir");
    }
    if (!data.phoneNumber || data.phoneNumber.trim() === '') {
      console.error('❌ Phone number is missing or empty:', data.phoneNumber);
      throw new Error("Telefon numarası gereklidir");
    }
    // Trim all string fields to avoid sending whitespace-only values
    const trimmedData = {
      ...data,
      id: data.id?.trim() || '',
      name: data.name?.trim() || '',
      adress: data.adress?.trim() || '',
      description: data.description?.trim() || '',
      phoneNumber: data.phoneNumber?.trim() || '',
      email: data.email?.trim() || ''
    };
    
    console.log('🔍 Original data:', data);
    console.log('🔍 Trimmed data:', trimmedData);
    console.log('🔍 Validation check:');
    console.log('  - id:', trimmedData.id, 'empty?', trimmedData.id === '');
    console.log('  - name:', trimmedData.name, 'empty?', trimmedData.name === '');
    console.log('  - adress:', trimmedData.adress, 'empty?', trimmedData.adress === '');
    console.log('  - description:', trimmedData.description, 'empty?', trimmedData.description === '');
    console.log('  - phoneNumber:', trimmedData.phoneNumber, 'empty?', trimmedData.phoneNumber === '');
    
    // Check if any required field is empty
    if (trimmedData.id === '') {
      console.error('❌ ID is empty!');
      throw new Error("Şirket ID'si boş olamaz");
    }
    if (trimmedData.name === '') {
      console.error('❌ Name is empty!');
      throw new Error("Şirket adı boş olamaz");
    }
    if (trimmedData.adress === '') {
      console.error('❌ Address is empty!');
      throw new Error("Adres boş olamaz");
    }
    if (trimmedData.description === '') {
      console.error('❌ Description is empty!');
      throw new Error("Açıklama boş olamaz");
    }
    if (trimmedData.phoneNumber === '') {
      console.error('❌ Phone number is empty!');
      throw new Error("Telefon numarası boş olamaz");
    }

    // Postman'daki başarılı request'e göre sadece gerekli alanları gönder
    const formData = new FormData();
    
    // Backend'in beklediği alan adları (Swagger'daki başarılı istekten alınmıştır)
    formData.append('Id', trimmedData.id);
    formData.append('Name', trimmedData.name);
    formData.append('Adress', trimmedData.adress);
    formData.append('PhoneNumber', trimmedData.phoneNumber);
    formData.append('Description', trimmedData.description);
    
    // Latitude ve Longitude için varsayılan değerler
    formData.append('Latitude', trimmedData.latitude?.toString() || '0');
    formData.append('Longitude', trimmedData.longitude?.toString() || '0');
    
    // Cover photo varsa ekle
    if (data.coverPhoto) {
      formData.append('CoverPhoto', data.coverPhoto);
    }
      
      // Debug: FormData içeriğini konsola yazdır
      console.log('📤 Company Update FormData contents:');
      for (let [key, value] of formData.entries()) {
        if (value instanceof File) {
          console.log(`${key}: File(${value.name}, ${value.size} bytes, ${value.type})`);
        } else {
          console.log(`${key}: ${value}`);
        }
      }
      
      // FormData'nın doğru oluşturulduğunu kontrol et
      console.log('🔍 FormData keys:', Array.from(formData.keys()));
      
      // Use the correct endpoint path - this should match what works in Swagger
      const response = await apiCallFormData("/Company/update", formData, "PUT");
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Company update error response:', errorText);
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
      }
      
      return response.json();
  } catch (error) {
    console.error('Error in updateCompany:', error);
    throw error;
  }
};