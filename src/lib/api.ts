import { Organization } from "@/entities/organization.entity";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "/api/proxy";

// Tüm organizasyonları getir
export async function getAllOrganizations(): Promise<Organization[]> {
  const res = await fetch(`${BASE_URL}/Organization/OrganizationGetAll`);
  const data = await res.json();
  return data.data;
}

// Sayfalı organizasyonları getir
export async function getPaginatedOrganizations(pageNumber: number = 1, pageSize: number = 6) {
  const res = await fetch(`${BASE_URL}/Organization/OrganizationGetAll?pageNumber=${pageNumber}&pageSize=${pageSize}`);
  const data = await res.json();
  return data;
}

// 🔧 Eksik olan fonksiyonları burada tanımlıyoruz:

export async function getAllCities(): Promise<{ id: number; cityName: string }[]> {
  const res = await fetch(`${BASE_URL}/City/CityGetAll`);
  const data = await res.json();
  return data.data;
}

export async function getAllCategories() {
  const res = await fetch(`${BASE_URL}/Category/OrganizationGetAll`);
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
  
  const res = await fetch(`${BASE_URL}/Organization/Filter?${params}`);
  const data = await res.json();
  return data.data;
}

export async function getOrganizationDetail(id: string) {
  const res = await fetch(`${BASE_URL}/Organization/GetOrganizationWithImages?Id=${id}`);
  const data = await res.json();
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