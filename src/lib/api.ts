import axios from "axios";
import { Organization } from "@/entities/organization.entity";

const BASE_URL = "http://localhost:5268/api";

// Tüm organizasyonları getir
export async function getAllOrganizations(): Promise<Organization[]> {
  const res = await axios.get(`${BASE_URL}/Organization/OrganizationGetAll`);
  return res.data.data;
}

// 🔧 Eksik olan fonksiyonları burada tanımlıyoruz:

export async function getAllCities(): Promise<{ id: number; cityName: string }[]> {
    const res = await axios.get(`${BASE_URL}/City/CityGetAll`);
    return res.data.data;
  }

export async function getAllCategories() {
  const res = await axios.get(`${BASE_URL}/Category/OrganizationGetAll`);
  return res.data.data;
}

// Filtreli organizasyonları getir
export async function getFilteredOrganizations(filters: {
  cityId?: number;
  districtId?: number;
  categoryId?: number;
  isOutdoor?: boolean;
  maxPrice?: number;
}) {
  const res = await axios.get(`${BASE_URL}/Organization/Filter`, {
    params: filters,
  });
  return res.data.data;
}

export async function getOrganizationDetail(id: string) {
    const res = await axios.get(`http://localhost:5268/api/Organization/GetOrganizationWithImages?Id=${id}`);
    return res.data.data;
  }
  
  export async function getFeaturedOrganizations(categoryId: number) {
    const res = await axios.post(`${BASE_URL}/Organization/GetFeatured`, {
      id: categoryId,
    });
    return res.data.data; // ✅ sadece data array'ini döndür
  }