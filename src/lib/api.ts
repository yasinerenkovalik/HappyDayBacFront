import { Organization } from "@/entities/organization.entity";
import { apiConfig, getEndpointUrl } from "@/config/api";

// Use proxy URL for production (HTTPS) deployments to avoid Mixed Content Policy
const BASE_URL = '/api/proxy'; // Always use proxy for consistency
console.log('🔧 API Configuration - Using proxy URL for Mixed Content Policy compatibility:', BASE_URL);

// API client object for general use - Updated to use direct server URLs
export const api = {
  post: async (endpoint: string, data?: any) => {
    const url = getEndpointUrl(endpoint, true); // true = use proxy to avoid Mixed Content
    console.log('🚀 API POST Request (Direct Server):', url);
    console.log('📝 POST Body:', data);
    
    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: data ? JSON.stringify(data) : undefined,
      });
      
      console.log('📡 Response status:', res.status, res.statusText);
      
      if (!res.ok) {
        throw new Error(`HTTP ${res.status}: ${res.statusText}`);
      }
      
      const responseData = await res.json();
      console.log('📦 Response data:', responseData);
      
      return responseData;
    } catch (error) {
      console.error('❌ API POST Error:', error);
      throw error;
    }
  },
  get: async (endpoint: string) => {
    const url = getEndpointUrl(endpoint, true); // true = use proxy to avoid Mixed Content
    console.log('🚀 API GET Request (Direct Server):', url);
    
    try {
      const res = await fetch(url);
      console.log('📡 Response status:', res.status, res.statusText);
      
      if (!res.ok) {
        throw new Error(`HTTP ${res.status}: ${res.statusText}`);
      }
      
      const responseData = await res.json();
      console.log('📦 Response data:', responseData);
      
      return responseData;
    } catch (error) {
      console.error('❌ API GET Error:', error);
      throw error;
    }
  }
};



// Tüm organizasyonları getir - Updated to use proxy
export async function getAllOrganizations(): Promise<Organization[]> {
  const proxyUrl = `${BASE_URL}/Organization/OrganizationGetAll`;
  console.log('🔧 DEBUG: Using proxy URL =', proxyUrl);
  
  const res = await fetch(proxyUrl);
  const data = await res.json();
  console.log('🔧 DEBUG: Response data =', data);
  return data.data;
}

// Sayfalı organizasyonları getir - Updated to use proxy
export async function getPaginatedOrganizations(pageNumber: number = 1, pageSize: number = 6) {
  const proxyUrl = `${BASE_URL}/Organization/OrganizationGetAll?pageNumber=${pageNumber}&pageSize=${pageSize}`;
  console.log('🔍 Proxy API Call URL:', proxyUrl);
  
  try {
    const res = await fetch(proxyUrl);
    console.log('🔍 API Response Status:', res.status, res.statusText);
    
    if (!res.ok) {
      throw new Error(`API request failed: ${res.status} ${res.statusText}`);
    }
    
    const data = await res.json();
    console.log('🔍 API Response Data:', data);
    console.log('🔍 First organization raw data:', data?.data?.[0]);
    return data;
  } catch (error) {
    console.error('❌ API Error:', error);
    throw error;
  }
}

// 🔧 Eksik olan fonksiyonları burada tanımlıyoruz:

export async function getAllCities(): Promise<{ id: number; cityName: string }[]> {
  console.log('🔍 API Call: getAllCities (Using Proxy)');
  const proxyUrl = `${BASE_URL}/City/CityGetAll`;
  console.log('📍 Proxy API URL:', proxyUrl);
  
  const res = await fetch(proxyUrl);
  const data = await res.json();
  console.log('🔍 API Response: getAllCities', data);
  console.log('🔍 Cities data sample:', data?.data?.slice(0, 3));
  return data.data;
}

export async function getAllCategories(): Promise<{ id: number; name: string }[]> {
  console.log('🔍 API Call: getAllCategories (Using Proxy)');
  const proxyUrl = `${BASE_URL}/Category/CategoryGetAll`;
  console.log('📍 Proxy API URL:', proxyUrl);
  
  const res = await fetch(proxyUrl);
  const data = await res.json();
  console.log('🔍 API Response: getAllCategories', data);
  console.log('🔍 Categories data sample:', data?.data?.slice(0, 3));
  return data.data;
}

export async function getDistrictsByCity(cityId: number): Promise<{ id: number; districtName: string }[]> {
  const proxyUrl = `${BASE_URL}/District/GetAllDisctrictByCity`;
  console.log('🔍 Proxy API URL for districts:', proxyUrl);
  
  const res = await fetch(proxyUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'accept': 'text/plain'
    },
    body: JSON.stringify({
      cityId: cityId
    })
  });
  const data = await res.json();
  return data.data;
}

// Filtreli organizasyonları getir - Updated to use proxy
export async function getFilteredOrganizations(
  filters: {
    cityId?: number;
    districtId?: number;
    categoryId?: number;
    isOutdoor?: boolean;
    maxPrice?: number;
  },
  page: number = 1,
  pageSize: number = 6
) {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined) {
      params.append(key, value.toString());
    }
  });
  // Backend swagger: Page, PageSize
  params.append('Page', page.toString());
  params.append('PageSize', pageSize.toString());
  
  const proxyUrl = `${BASE_URL}/Organization/Filter?${params}`;
  console.log('🔍 Proxy Filter API URL:', proxyUrl);
  console.log('🔍 Filter params:', filters);
  
  try {
    const res = await fetch(proxyUrl);
    console.log('🔍 Filter API Response Status:', res.status);
    
    if (!res.ok) {
      throw new Error(`Filter API request failed: ${res.status} ${res.statusText}`);
    }
    
    const data = await res.json();
    console.log('🔍 Filter API Response Data:', data);
    console.log('🔍 First filtered organization:', Array.isArray(data?.data) ? data?.data?.[0] : data?.data?.items?.[0]);
    
    // Return full response so caller can use totalCount/totalPages
    return data;
  } catch (error) {
    console.error('❌ Filter API Error:', error);
    throw error;
  }
}

export async function getOrganizationDetail(id: string) {
  console.log('🔍 Fetching organization detail for ID (Using Proxy):', id);
  
  // Use proxy URL instead of direct server
  const proxyUrl = `${BASE_URL}/Organization/GetOrganizationWithImages?Id=${id}`;
  console.log('📍 Proxy API URL:', proxyUrl);
  
  const res = await fetch(proxyUrl);
  console.log('📡 API Response status:', res.status, res.statusText);
  
  const data = await res.json();
  console.log('🔍 Full API response:', data);
  console.log('🔍 Response structure check:', {
    hasData: !!data.data,
    isSuccess: data.isSuccess,
    dataType: typeof data.data,
    dataKeys: data.data ? Object.keys(data.data) : 'No data',
    coverPhotoPath: data.data?.coverPhotoPath,
    images: data.data?.images
  });
  
  // Return the correct data structure
  if (data.isSuccess && data.data) {
    console.log('✅ API Success, returning data.data');
    return data.data;
  } else {
    console.warn('⚠️ API response not successful or no data:', data);
    return data.data || data; // Fallback
  }
}

// İletişim mesajı gönder - Updated to use proxy
export async function sendContactMessage(data: {
  fullName: string;
  phone: string;
  email: string;
  message: string;
  organizationId: string;
}) {
  const formData = new FormData();
  formData.append('FullName', data.fullName);
  formData.append('Phone', data.phone);
  formData.append('Email', data.email);
  formData.append('Message', data.message);
  formData.append('OrganizationId', data.organizationId);

  const proxyUrl = `${BASE_URL}/ContactMessage/add`;
  console.log('📬 Proxy contact message URL:', proxyUrl);

  const res = await fetch(proxyUrl, {
    method: 'POST',
    body: formData,
  });
  const responseData = await res.json();
  return responseData;
}

// Contact form mesajı gönder
export async function sendContactForm(data: {
  name: string;
  surName: string;
  email: string;
  phone: string;
  mesaage: string;
}) {
  // FormData oluştur (multipart/form-data için)
  const formData = new FormData();
  formData.append('Name', data.name.trim());
  formData.append('SurName', data.surName.trim());
  formData.append('Email', data.email.trim());
  formData.append('Phone', data.phone.trim());
  formData.append('Mesaage', data.mesaage.trim());

  console.log('📤 Sending contact form with FormData:');
  for (let [key, value] of formData.entries()) {
    console.log(`${key}:`, value);
  }

  const proxyUrl = `${BASE_URL}/Concat/add`;
  console.log('📬 Proxy contact form URL:', proxyUrl);

  const res = await fetch(proxyUrl, {
    method: 'POST',
    body: formData, // FormData kullan, Content-Type header'ı otomatik ayarlanır
  });
  
  const responseData = await res.json();
  console.log('📡 Contact form response:', responseData);
  
  return responseData;
}

// Tüm contact mesajlarını getir - Updated to use proxy
export async function getAllContacts() {
  const proxyUrl = `${BASE_URL}/Concat/ContactGetAll`;
  console.log('📬 Proxy contacts URL:', proxyUrl);
  
  const res = await fetch(proxyUrl);
  const data = await res.json();
  return data;
}

// Contact detayını getir - Updated to use proxy
export async function getContactById(id: string) {
  const proxyUrl = `${BASE_URL}/Concat/getbyid`;
  console.log('📬 Proxy contact detail URL:', proxyUrl);
  
  const res = await fetch(proxyUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      Id: id
    }),
  });
  const data = await res.json();
  return data;
}

// Şirket iletişim mesajlarını getir - Updated to use proxy
export async function getCompanyContactMessages(companyId: string) {
  const formData = new FormData();
  formData.append('CompanyId', companyId);

  const proxyUrl = `${BASE_URL}/ContactMessage/CompanyContactMessage`;
  console.log('📬 Proxy company messages URL:', proxyUrl);

  const res = await fetch(proxyUrl, {
    method: 'POST',
    body: formData,
  });
  const data = await res.json();
  return data;
}

// Davetiye gönder
export async function sendInvitation(data: {
  email: string;
  companyNameHint: string;
  expiresAt: string;
}) {
  // Try different possible token keys
  const token = localStorage.getItem('token') || 
                localStorage.getItem('authToken') || 
                localStorage.getItem('jwt') ||
                localStorage.getItem('accessToken');
  
  console.log('🔍 localStorage debug:', {
    allKeys: Object.keys(localStorage),
    tokenExists: !!token,
    tokenValue: token,
    tokenType: typeof token,
    tokenLength: token?.length || 0,
    checkedKeys: {
      token: localStorage.getItem('token'),
      authToken: localStorage.getItem('authToken'),
      jwt: localStorage.getItem('jwt'),
      accessToken: localStorage.getItem('accessToken')
    }
  });
  
  if (!token) {
    console.error('❌ No token found in localStorage!');
    console.error('Available localStorage keys:', Object.keys(localStorage));
    return {
      isSuccess: false,
      error: 'Authentication token not found. Please login again.',
      message: 'Token bulunamadı. Lütfen tekrar giriş yapın.'
    };
  }
  
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    'Accept': '*/*',
    'Authorization': `Bearer ${token}`
  };

  console.log('📤 Request details:', {
    url: '/api/proxy/admin/invitations/create',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': '*/*',
      'Authorization': `Bearer ${token.substring(0, 20)}...`
    },
    body: data
  });

  try {
    const res = await fetch('/api/proxy/admin/invitations/create', {
      method: 'POST',
      headers,
      body: JSON.stringify(data),
    });
    
    console.log('📡 Response details:', {
      status: res.status,
      statusText: res.statusText,
      ok: res.ok,
      headers: Object.fromEntries(res.headers.entries())
    });
    
    const responseData = await res.json();
    
    console.log('📥 Raw Response data:', responseData);
    console.log('📥 Response type:', typeof responseData);
    console.log('📥 Response keys:', Object.keys(responseData));
    
    // Backend başarılı olup olmadığını farklı şekillerde kontrol et
    const isSuccessful = res.ok || 
                         res.status === 200 || 
                         res.status === 201 || 
                         responseData.isSuccess === true ||
                         responseData.success === true ||
                         (responseData.data && !responseData.error);
    
    console.log('✅ Success check:', {
      'res.ok': res.ok,
      'status 200/201': res.status === 200 || res.status === 201,
      'responseData.isSuccess': responseData.isSuccess,
      'responseData.success': responseData.success,
      'has data, no error': !!(responseData.data && !responseData.error),
      'final isSuccessful': isSuccessful
    });
    
    if (isSuccessful) {
      console.log('🎉 Request was successful!');
      // Başarılı response formatını normalize et
      return {
        isSuccess: true,
        success: true,
        data: responseData.data || responseData,
        token: responseData.token || responseData.data?.token,
        invitationLink: responseData.invitationLink || responseData.data?.invitationLink,
        message: responseData.message || 'Davetiye başarıyla oluşturuldu'
      };
    } else {
      console.error('❌ Request failed:', {
        status: res.status,
        statusText: res.statusText,
        responseData
      });
      return {
        isSuccess: false,
        success: false,
        error: responseData.error || responseData.message || `HTTP ${res.status}`,
        message: responseData.message || responseData.error || 'Davetiye oluşturulamadı'
      };
    }
  } catch (error) {
    console.error('💥 Network error:', error);
    return {
      isSuccess: false,
      error: 'Network error occurred',
      message: 'Ağ hatası oluştu'
    };
  }
}

// Tüm davetleri getir
export async function getAllInvitations() {
  const token = localStorage.getItem('token');
  const headers: HeadersInit = {};
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(`${BASE_URL}/admin/invitations`, {
    headers
  });
  const data = await res.json();
  return data;
}

// Şirket davetiye ile kayıt ol
export async function registerCompanyByInvite(data: {
  token: string;
  email: string;
  companyName: string;
  password: string;
  adress: string;
  phoneNumber: string;
  description: string;
  coverPhoto?: File;
}) {
  console.log('🏢 Company registration request:', data);
  
  try {
    // Eğer cover photo varsa FormData kullan
    if (data.coverPhoto) {
      const formData = new FormData();
      
      // Backend'in beklediği field adları
      formData.append('Token', data.token);
      formData.append('Email', data.email);
      formData.append('CompanyName', data.companyName);
      formData.append('Password', data.password);
      formData.append('Adress', data.adress); // Backend'de Adress yazılış şekli
      formData.append('PhoneNumber', data.phoneNumber);
      formData.append('Description', data.description);
      formData.append('CoverPhoto', data.coverPhoto);
      
      // Debug: FormData içeriğini konsola yazdır
      console.log('🏢 Company Registration FormData contents:');
      for (let [key, value] of formData.entries()) {
        if (value instanceof File) {
          console.log(`${key}: File(${value.name}, ${value.size} bytes, ${value.type})`);
        } else {
          console.log(`${key}: ${value}`);
        }
      }
      
      console.log('🏢 Sending with FormData (includes cover photo)');
      
      const res = await fetch('/api/proxy/company/register-by-invite', {
        method: 'POST',
        body: formData, // FormData gönder, Content-Type otomatik ayarlanır
      });
      
      console.log('🏢 Registration response status:', res.status, res.statusText);
      
      const responseData = await res.json();
      console.log('🏢 Registration response data:', responseData);
      
      const isSuccessful = res.ok || 
                           res.status === 200 || 
                           res.status === 201 || 
                           responseData.isSuccess === true ||
                           responseData.success === true ||
                           !responseData.error;
      
      return {
        ...responseData,
        isSuccess: isSuccessful,
        success: isSuccessful
      };
    } else {
      // Cover photo yoksa normal JSON gönder
      const res = await fetch('/api/proxy/company/register-by-invite', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': '*/*'
        },
        body: JSON.stringify(data),
      });
      
      console.log('🏢 Registration response status:', res.status, res.statusText);
      
      const responseData = await res.json();
      
      console.log('🏢 Registration response data:', responseData);
      
      // Response normalization
      const isSuccessful = res.ok || 
                           res.status === 200 || 
                           res.status === 201 || 
                           responseData.isSuccess === true ||
                           responseData.success === true ||
                           !responseData.error;
      
      return {
        ...responseData,
        isSuccess: isSuccessful,
        success: isSuccessful
      };
    }
  } catch (error) {
    console.error('🏢 Registration error:', error);
    return {
      isSuccess: false,
      success: false,
      error: 'Network error occurred',
      message: 'Ağ hatası oluştu'
    };
  }
}

// Get organizations by company ID
export const getOrganizationsByCompany = async (companyId: string): Promise<Organization[]> => {
  try {
    const response = await api.get(`/Organization/GetOrganizationWithICompany?Id=${companyId}`);
    return response.data || [];
  } catch (error) {
    console.error("Error fetching organizations by company:", error);
    return [];
  }
};