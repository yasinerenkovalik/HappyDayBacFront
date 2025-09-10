import { Organization } from "@/entities/organization.entity";

const BASE_URL = "/api/proxy";

// Tüm organizasyonları getir
export async function getAllOrganizations(): Promise<Organization[]> {
  const res = await fetch(`${BASE_URL}/Organization/OrganizationGetAll`);
  const data = await res.json();
  return data.data;
}

// Sayfalı organizasyonları getir
export async function getPaginatedOrganizations(pageNumber: number = 1, pageSize: number = 6) {
  const url = `${BASE_URL}/Organization/OrganizationGetAll?pageNumber=${pageNumber}&pageSize=${pageSize}`;
  console.log('🔍 API Call URL:', url);
  
  try {
    const res = await fetch(url);
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
  console.log('🔍 API Call: getAllCities');
  const res = await fetch(`${BASE_URL}/City/CityGetAll`);
  const data = await res.json();
  console.log('🔍 API Response: getAllCities', data);
  console.log('🔍 Cities data sample:', data?.data?.slice(0, 3));
  return data.data;
}

export async function getAllCategories() {
  const res = await fetch(`${BASE_URL}/Category/OrganizationGetAll`);
  const data = await res.json();
  return data.data;
}

export async function getDistrictsByCity(cityId: number): Promise<{ id: number; districtName: string }[]> {
  const res = await fetch(`${BASE_URL}/District/GetAllDisctrictByCity`, {
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

// Filtreli organizasyonları getir
export async function getFilteredOrganizations(filters: {
  cityId?: number;
  districtId?: number;
  categoryId?: number;
  isOutdoor?: boolean;
  maxPrice?: number;
}) {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined) {
      params.append(key, value.toString());
    }
  });
  
  const url = `${BASE_URL}/Organization/Filter?${params}`;
  console.log('🔍 Filter API URL:', url);
  console.log('🔍 Filter params:', filters);
  
  try {
    const res = await fetch(url);
    console.log('🔍 Filter API Response Status:', res.status);
    
    if (!res.ok) {
      throw new Error(`Filter API request failed: ${res.status} ${res.statusText}`);
    }
    
    const data = await res.json();
    console.log('🔍 Filter API Response Data:', data);
    console.log('🔍 First filtered organization:', data?.data?.[0]);
    
    return data.data;
  } catch (error) {
    console.error('❌ Filter API Error:', error);
    throw error;
  }
}

export async function getOrganizationDetail(id: string) {
  const res = await fetch(`${BASE_URL}/Organization/GetOrganizationWithImages?Id=${id}`);
  const data = await res.json();
  console.log('🔍 Organization detail API response:', data);
  console.log('🔍 Organization detail data:', data.data);
  return data.data;
}

export async function getFeaturedOrganizations(categoryId: number) {
  const res = await fetch(`${BASE_URL}/Organization/GetFeatured`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ id: categoryId }),
  });
  const data = await res.json();
  return data.data; // ✅ sadece data array'ini döndür
}

// İletişim mesajı gönder
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

  const res = await fetch(`${BASE_URL}/ContactMessage/add`, {
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

  const res = await fetch(`${BASE_URL}/Concat/add`, {
    method: 'POST',
    body: formData, // FormData kullan, Content-Type header'ı otomatik ayarlanır
  });
  
  const responseData = await res.json();
  console.log('📡 Contact form response:', responseData);
  
  return responseData;
}

// Tüm contact mesajlarını getir
export async function getAllContacts() {
  const res = await fetch(`${BASE_URL}/Concat/ContactGetAll`);
  const data = await res.json();
  return data;
}

// Contact detayını getir
export async function getContactById(id: string) {
  const res = await fetch(`${BASE_URL}/Concat/getbyid`, {
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

// Şirket iletişim mesajlarını getir
export async function getCompanyContactMessages(companyId: string) {
  const formData = new FormData();
  formData.append('CompanyId', companyId);

  const res = await fetch(`${BASE_URL}/ContactMessage/CompanyContactMessage`, {
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
}) {
  console.log('🏢 Company registration request:', data);
  
  try {
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