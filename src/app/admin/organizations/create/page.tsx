// @ts-nocheck
"use client";

import React, { useState, useEffect } from "react";
import {
  Card,
  CardBody,
  Typography,
  Button,
  Input,
  Textarea,
  Select,
  Option,
  Checkbox,
  Alert
} from "@material-tailwind/react";
import {
  PhotoIcon,
  VideoCameraIcon,
  PlusIcon,
  TrashIcon,
  ArrowLeftIcon
} from "@heroicons/react/24/outline";
import AdminLayout from "../../components/AdminLayout";
import ProtectedRoute from "../../components/ProtectedRoute";
import { useRouter } from "next/navigation";
import { getAuthToken, parseJWT } from "@/lib/auth";

interface Category {
  id: number;
  name: string;
}

interface City {
  id: number;
  cityName: string;
}

interface District {
  id: number;
  districtName: string;
  cityId: number;
}

export default function OrganizationCreate() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    maxGuestCount: "",
    categoryId: "",
    services: [""],
    duration: "",
    isOutdoor: false,
    reservationNote: "",
    cancelPolicy: "",
    videoUrl: "",
    cityId: "",
    districtId: "",
    companyId: ""
  });

  const [coverPhoto, setCoverPhoto] = useState<File | null>(null);
  const [images, setImages] = useState<File[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [districts, setDistricts] = useState<District[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingCities, setLoadingCities] = useState(false);
  const [loadingDistricts, setLoadingDistricts] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Debug: Cover photo state'ini izle
  useEffect(() => {
    console.log('📸 Cover photo state changed:', coverPhoto ? coverPhoto.name : 'null');
  }, [coverPhoto]);

  // Debug: Images state'ini izle
  useEffect(() => {
    console.log('📸 Images state changed:', images.length, 'files');
  }, [images]);

  // JWT'den companyId'yi al ve company bilgilerini çek
  useEffect(() => {
    const fetchCompanyInfo = async () => {
      const token = getAuthToken();
      console.log('🔑 JWT Token exists:', !!token);
      if (token) {
        const tokenPayload = parseJWT(token);
        console.log('👤 JWT Payload:', tokenPayload);
        if (tokenPayload && tokenPayload.CompanyId) {
          console.log('🏢 Company ID from token:', tokenPayload.CompanyId);

          // Company bilgilerini çek
          try {
            const response = await fetch(`/api/proxy/Company/getbyid?Id=${tokenPayload.CompanyId}`, {
              headers: {
                'Authorization': `Bearer ${token}`
              }
            });

            if (response.ok) {
              const companyData = await response.json();
              console.log('🏢 Company data:', companyData);

              if (companyData.isSuccess) {
                const company = Array.isArray(companyData.data) ? companyData.data[0] : companyData.data;

                setFormData(prev => ({
                  ...prev,
                  companyId: tokenPayload.CompanyId,
                  // Eğer company'de şehir bilgisi varsa otomatik seç
                  cityId: company.cityId ? company.cityId.toString() : "",
                  districtId: company.districtId ? company.districtId.toString() : ""
                }));
              }
            }
          } catch (error) {
            console.error('Company bilgileri alınamadı:', error);
            // Fallback: Boş değerler
            setFormData(prev => ({
              ...prev,
              companyId: tokenPayload.CompanyId,
              cityId: "", // Şehir seçilmemiş
              districtId: "" // İlçe seçilmemiş
            }));
          }
        } else {
          console.error('❌ No CompanyId in token');
        }
      } else {
        console.error('❌ No JWT token found');
      }
    };

    fetchCompanyInfo();
  }, []);

  // Kategorileri yükle
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const token = getAuthToken();
        const headers: Record<string, string> = {
          'Content-Type': 'application/json'
        };
        if (token) {
          headers['Authorization'] = `Bearer ${token}`;
        }

        const response = await fetch(`/api/proxy/Category/OrganizationGetAll`, {
          headers
        });
        const data = await response.json();
        if (data.isSuccess) {
          setCategories(data.data);
        }
      } catch (error) {
        console.error("Kategoriler yüklenirken hata:", error);
      }
    };

    fetchCategories();
  }, []);

  // Şehirleri API'den yükle
  useEffect(() => {
    const fetchCities = async () => {
      try {
        setLoadingCities(true);
        const token = getAuthToken();
        const headers: Record<string, string> = {
          'Content-Type': 'application/json'
        };
        if (token) {
          headers['Authorization'] = `Bearer ${token}`;
        }

        const response = await fetch('/api/proxy/City/CityGetAll', {
          headers
        });
        const data = await response.json();

        if (data.isSuccess && data.data) {
          setCities(data.data);
          console.log('✅ Cities loaded:', data.data);
        } else {
          console.error('❌ Failed to fetch cities:', data.message);
          setError('Şehirler yüklenirken hata oluştu');
        }
      } catch (error) {
        console.error('❌ Error fetching cities:', error);
        setError('Şehirler yüklenirken bağlantı hatası');
      } finally {
        setLoadingCities(false);
      }
    };

    fetchCities();
  }, []);

  // İlçeleri API'den yükle
  const fetchDistricts = async (cityId: number) => {
    try {
      setLoadingDistricts(true);
      setDistricts([]); // Önce mevcut ilçeleri temizle
      console.log('🔍 Fetching districts for city ID:', cityId);

      // API'nin beklediği request format: GetAllDisctrictByCityRequest
      const requestBody = {
        CityId: cityId
      };
      console.log('📤 Request body:', requestBody);

      const token = getAuthToken();
      const headers: Record<string, string> = {
        'Content-Type': 'application/json'
      };
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch(`/api/proxy/District/GetAllDisctrictByCity`, {
        method: 'POST',
        headers,
        body: JSON.stringify(requestBody)
      });

      console.log('📡 Response status:', response.status);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('📡 Response data:', data);

      if (data.isSuccess && data.data && Array.isArray(data.data)) {
        setDistricts(data.data);
        console.log('✅ Districts loaded for city', cityId, ':', data.data.length, 'districts');
      } else {
        console.warn('⚠️ No districts found for city:', cityId, data.message);
        setDistricts([]);
      }
    } catch (error) {
      console.error('❌ Error fetching districts:', error);
      setDistricts([]);
    } finally {
      setLoadingDistricts(false);
    }
  };

  // Şehir değiştiğinde ilçeleri yükle
  useEffect(() => {
    if (formData.cityId) {
      console.log('🔄 City changed to:', formData.cityId);
      fetchDistricts(parseInt(formData.cityId));
    } else {
      console.log('🔄 No city selected, clearing districts');
      setDistricts([]);
    }
  }, [formData.cityId]);

  const handleInputChange = (name: string, value: any) => {
    console.log('🔄 Input changed:', name, '=', value);
    setFormData(prev => {
      const newData = {
        ...prev,
        [name]: value
      };

      // Şehir değiştiğinde ilçeyi sıfırla (ama districts listesini temizleme, useEffect halledecek)
      if (name === 'cityId') {
        newData.districtId = '';
      }

      return newData;
    });
  };

  const handleServiceChange = (index: number, value: string) => {
    const newServices = [...formData.services];
    newServices[index] = value;
    setFormData(prev => ({
      ...prev,
      services: newServices
    }));
  };

  const addService = () => {
    setFormData(prev => ({
      ...prev,
      services: [...prev.services, ""]
    }));
  };

  const removeService = (index: number) => {
    const newServices = formData.services.filter((_, i) => i !== index);
    setFormData(prev => ({
      ...prev,
      services: newServices
    }));
  };

  const handleCoverPhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log('📸 Cover photo change event:', e.target.files);
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      console.log('📸 Selected cover photo:', file.name, file.size);
      setCoverPhoto(file);
    }
    // Input'u sıfırla ki aynı dosya tekrar seçilebilsin
    e.target.value = '';
  };

  const handleImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log('📸 Images change event:', e.target.files);
    if (e.target.files) {
      const fileArray = Array.from(e.target.files);
      console.log('📸 Selected images:', fileArray.map(f => f.name));
      setImages(fileArray);
    }
    // Input'u sıfırla ki aynı dosyalar tekrar seçilebilsin
    e.target.value = '';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      // Kapsamlı form validation
      if (!formData.title.trim()) {
        setError("Organizasyon başlığı gereklidir.");
        setLoading(false);
        return;
      }

      if (formData.title.trim().length < 3) {
        setError("Organizasyon başlığı en az 3 karakter olmalıdır.");
        setLoading(false);
        return;
      }

      if (!formData.description.trim()) {
        setError("Açıklama gereklidir.");
        setLoading(false);
        return;
      }

      if (formData.description.trim().length < 10) {
        setError("Açıklama en az 10 karakter olmalıdır.");
        setLoading(false);
        return;
      }

      if (!formData.price || parseFloat(formData.price) <= 0) {
        setError("Geçerli bir fiyat giriniz.");
        setLoading(false);
        return;
      }

      if (!formData.maxGuestCount || parseInt(formData.maxGuestCount) <= 0) {
        setError("Geçerli bir misafir sayısı giriniz.");
        setLoading(false);
        return;
      }

      if (!formData.categoryId) {
        setError("Kategori seçmek zorunludur.");
        setLoading(false);
        return;
      }

      if (!formData.duration.trim()) {
        setError("Süre bilgisi gereklidir.");
        setLoading(false);
        return;
      }

      const formDataToSend = new FormData();

      // Form verilerini ekle - Backend'in tam beklediği format
      formDataToSend.append("Title", formData.title.trim());
      formDataToSend.append("Description", formData.description.trim());
      formDataToSend.append("Price", formData.price);
      formDataToSend.append("MaxGuestCount", formData.maxGuestCount);
      formDataToSend.append("CategoryId", formData.categoryId);
      formDataToSend.append("Duration", formData.duration.trim());
      formDataToSend.append("IsOutdoor", formData.isOutdoor.toString());
      formDataToSend.append("ReservationNote", formData.reservationNote.trim());
      formDataToSend.append("CancelPolicy", formData.cancelPolicy.trim());
      formDataToSend.append("VideoUrl", formData.videoUrl.trim());

      // CityId ve DistrictId - opsiyonel alanlar
      if (formData.cityId) {
        formDataToSend.append("CityId", formData.cityId);
      }
      if (formData.districtId) {
        formDataToSend.append("DistrictId", formData.districtId);
      }

      // CompanyId kontrolü - Guid olarak gönder
      if (!formData.companyId) {
        setError("Şirket bilgisi bulunamadı. Lütfen tekrar giriş yapın.");
        setLoading(false);
        return;
      }
      formDataToSend.append("CompanyId", formData.companyId);

      // Servisleri ekle - List<string> formatında
      const validServices = formData.services.filter(s => s.trim());
      if (validServices.length === 0) {
        setError("En az bir hizmet eklemelisiniz.");
        setLoading(false);
        return;
      }
      validServices.forEach((service) => {
        formDataToSend.append("Services", service.trim());
      });

      // Kapak fotoğrafını ekle - ZORUNLU
      if (!coverPhoto) {
        setError("Kapak fotoğrafı seçmek zorunludur.");
        setLoading(false);
        return;
      }
      formDataToSend.append("CoverPhoto", coverPhoto);

      // Diğer resimleri ekle - List<IFormFile> formatında
      if (images.length > 0) {
        images.forEach((image) => {
          formDataToSend.append("Images", image);
        });
      }

      // JWT token'ı al ve header'a ekle
      const token = getAuthToken();
      const headers: Record<string, string> = {};
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      console.log('🚀 Sending organization data...');
      console.log('📋 FormData contents:');
      for (let [key, value] of formDataToSend.entries()) {
        if (value instanceof File) {
          console.log(`${key}: [File] ${value.name} (${value.size} bytes)`);
        } else {
          console.log(`${key}:`, value);
        }
      }

      console.log('📊 Form validation summary:');
      console.log('- Title:', formData.title.trim());
      console.log('- Description length:', formData.description.trim().length);
      console.log('- Price (decimal):', formData.price);
      console.log('- MaxGuestCount (int):', formData.maxGuestCount);
      console.log('- CategoryId (int):', formData.categoryId);
      console.log('- CityId (int):', formData.cityId);
      console.log('- DistrictId (int):', formData.districtId);
      console.log('- CompanyId (Guid):', formData.companyId);
      console.log('- IsOutdoor (bool):', formData.isOutdoor);
      console.log('- Services (List<string>):', validServices);
      console.log('- Cover photo:', coverPhoto ? coverPhoto.name : 'None');
      console.log('- Images count:', images.length);

      const response = await fetch(`/api/proxy/Organization/AddOrganization?t=${Date.now()}`, {
        method: "POST",
        body: formDataToSend,
        headers
      });

      console.log('📡 Response status:', response.status);
      console.log('📡 Response headers:', Object.fromEntries(response.headers.entries()));

      const result = await response.json();
      console.log('📡 API Response:', result);

      if (!response.ok) {
        console.error('❌ API Error Response:', result);

        // Validation hatalarını daha detaylı göster
        if (result.errors && typeof result.errors === 'object') {
          const errorMessages = Object.entries(result.errors)
            .map(([field, messages]) => `${field}: ${Array.isArray(messages) ? messages.join(', ') : messages}`)
            .join('\n');
          setError(`Validation Hataları:\n${errorMessages}`);
        } else if (result.title && result.detail) {
          setError(`${result.title}: ${result.detail}`);
        } else if (result.message) {
          setError(result.message);
        } else {
          setError(`API Hatası (${response.status}): ${JSON.stringify(result)}`);
        }
        return;
      }

      console.log('✅ API Success Response:', result);

      if (result.isSuccess) {
        setSuccess("Organizasyon başarıyla oluşturuldu!");
        // 2 saniye sonra organizasyonlar sayfasına yönlendir
        setTimeout(() => {
          router.push("/admin/my-organizations");
        }, 2000);
      } else {
        setError(result.message || result.errors?.join(', ') || "Organizasyon oluşturulurken hata oluştu");
      }
    } catch (error) {
      console.error("Submit error:", error);
      if (error instanceof TypeError && error.message.includes('fetch')) {
        setError("Sunucuya bağlanılamıyor. İnternet bağlantınızı kontrol edin ve tekrar deneyin.");
      } else if (error instanceof Error) {
        setError(`Hata: ${error.message}`);
      } else {
        setError("Beklenmeyen bir hata oluştu. Lütfen tekrar deneyin.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <ProtectedRoute requiredUserType="company">
      <AdminLayout userType="company">
        <div className="p-6">
          {/* Header */}
          <div className="mb-8 flex items-center justify-between">
            <div>
              <Typography variant="h3" color="blue-gray" className="mb-2">
                Yeni Organizasyon Oluştur
              </Typography>
              <Typography color="gray">
                Organizasyon detaylarını doldurun ve yayınlayın
              </Typography>
            </div>
            <Button
              variant="outlined"
              color="gray"
              className="flex items-center gap-2"
              onClick={() => router.push("/admin/organizations")}
            >
              <ArrowLeftIcon className="h-4 w-4" />
              Geri Dön
            </Button>
          </div>

          {error && (
            <Alert color="red" className="mb-6">
              {error}
            </Alert>
          )}

          {success && (
            <Alert color="green" className="mb-6">
              {success}
            </Alert>
          )}

          <Card className="shadow-lg">
            <CardBody className="p-8">
              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Temel Bilgiler */}
                <div>
                  <Typography variant="h5" color="blue-gray" className="mb-6 pb-2 border-b border-gray-200">
                    Temel Bilgiler
                  </Typography>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Input
                      label="Organizasyon Başlığı"
                      value={formData.title}
                      onChange={(e) => handleInputChange("title", e.target.value)}
                      required
                      size="lg"
                    />

                    <div className="relative">
                      <select
                        value={formData.categoryId}
                        onChange={(e) => handleInputChange("categoryId", e.target.value)}
                        className="peer w-full h-12 px-3 py-2.5 font-sans text-sm font-normal text-blue-gray-700 bg-transparent border border-blue-gray-200 rounded-md focus:border-2 focus:border-pink-500 focus:outline-0 disabled:border-blue-gray-200 appearance-none cursor-pointer"
                        required
                      >
                        <option value="">Kategori Seçin</option>
                        {categories.map((category) => (
                          <option key={category.id} value={category.id.toString()}>
                            {category.name}
                          </option>
                        ))}
                      </select>
                      <label className="flex w-full h-full select-none pointer-events-none absolute left-0 font-normal !overflow-visible truncate peer-placeholder-shown:text-blue-gray-500 leading-tight peer-focus:leading-tight peer-disabled:text-transparent peer-disabled:peer-placeholder-shown:text-blue-gray-500 transition-all -top-1.5 peer-placeholder-shown:text-sm text-xs peer-focus:text-xs before:content[' '] before:block before:box-border before:w-2.5 before:h-1.5 before:mt-[6.5px] before:mr-1 peer-placeholder-shown:before:border-transparent before:rounded-tl-md before:border-t peer-focus:before:border-t-2 before:border-l peer-focus:before:border-l-2 before:pointer-events-none before:transition-all peer-disabled:before:border-transparent after:content[' '] after:block after:flex-grow after:box-border after:w-2.5 after:h-1.5 after:mt-[6.5px] after:ml-1 peer-placeholder-shown:after:border-transparent after:rounded-tr-md after:border-t peer-focus:after:border-t-2 after:border-r peer-focus:after:border-r-2 after:pointer-events-none after:transition-all peer-disabled:after:border-transparent peer-placeholder-shown:leading-[3.75] text-pink-500 peer-focus:text-pink-500 before:border-pink-500 peer-focus:before:border-pink-500 after:border-pink-500 peer-focus:after:border-pink-500">
                        Kategori
                      </label>
                      {/* Custom dropdown arrow */}
                      <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none">
                        <svg className="w-4 h-4 text-blue-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>

                    <Input
                      label="Fiyat (₺)"
                      type="number"
                      value={formData.price}
                      onChange={(e) => handleInputChange("price", e.target.value)}
                      required
                      size="lg"
                    />

                    <Input
                      label="Maksimum Misafir Sayısı"
                      type="number"
                      value={formData.maxGuestCount}
                      onChange={(e) => handleInputChange("maxGuestCount", e.target.value)}
                      required
                      size="lg"
                    />

                    <Input
                      label="Süre"
                      placeholder="Örn: 4 saat"
                      value={formData.duration}
                      onChange={(e) => handleInputChange("duration", e.target.value)}
                      size="lg"
                    />

                    <Input
                      label="Video URL (Opsiyonel)"
                      value={formData.videoUrl}
                      onChange={(e) => handleInputChange("videoUrl", e.target.value)}
                      size="lg"
                    />
                  </div>

                  <div className="mt-6">
                    <Textarea
                      label="Açıklama"
                      value={formData.description}
                      onChange={(e) => handleInputChange("description", e.target.value)}
                      required
                      rows={4}
                      size="lg"
                    />
                  </div>

                  <div className="mt-6">
                    <Checkbox
                      label="Açık Hava Etkinliği"
                      checked={formData.isOutdoor}
                      onChange={(e) => handleInputChange("isOutdoor", e.target.checked)}
                    />
                  </div>
                </div>

                {/* Lokasyon */}
                <div>
                  <Typography variant="h5" color="blue-gray" className="mb-6 pb-2 border-b border-gray-200">
                    Lokasyon
                  </Typography>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Şehir Seçimi */}
                    <div className="relative">
                      <select
                        value={formData.cityId || ""}
                        onChange={(e) => handleInputChange("cityId", e.target.value)}
                        className="peer w-full h-12 px-3 py-2.5 font-sans text-sm font-normal text-blue-gray-700 bg-transparent border border-blue-gray-200 rounded-md focus:border-2 focus:border-pink-500 focus:outline-0 disabled:border-blue-gray-200 disabled:bg-blue-gray-50 appearance-none cursor-pointer"
                        disabled={loadingCities}
                      >
                        <option value="">Şehir Seçin</option>
                        {cities.length === 0 && !loadingCities ? (
                          <option value="" disabled>
                            Şehir bulunamadı
                          </option>
                        ) : (
                          cities.map((city) => (
                            <option key={city.id} value={city.id.toString()}>
                              {city.cityName}
                            </option>
                          ))
                        )}
                      </select>
                      <label className="flex w-full h-full select-none pointer-events-none absolute left-0 font-normal !overflow-visible truncate peer-placeholder-shown:text-blue-gray-500 leading-tight peer-focus:leading-tight peer-disabled:text-transparent peer-disabled:peer-placeholder-shown:text-blue-gray-500 transition-all -top-1.5 peer-placeholder-shown:text-sm text-xs peer-focus:text-xs before:content[' '] before:block before:box-border before:w-2.5 before:h-1.5 before:mt-[6.5px] before:mr-1 peer-placeholder-shown:before:border-transparent before:rounded-tl-md before:border-t peer-focus:before:border-t-2 before:border-l peer-focus:before:border-l-2 before:pointer-events-none before:transition-all peer-disabled:before:border-transparent after:content[' '] after:block after:flex-grow after:box-border after:w-2.5 after:h-1.5 after:mt-[6.5px] after:ml-1 peer-placeholder-shown:after:border-transparent after:rounded-tr-md after:border-t peer-focus:after:border-t-2 after:border-r peer-focus:after:border-r-2 after:pointer-events-none after:transition-all peer-disabled:after:border-transparent peer-placeholder-shown:leading-[3.75] text-pink-500 peer-focus:text-pink-500 before:border-pink-500 peer-focus:before:border-pink-500 after:border-pink-500 peer-focus:after:border-pink-500">
                        Şehir
                      </label>
                      {/* Custom dropdown arrow */}
                      <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none">
                        <svg className="w-4 h-4 text-blue-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                      {loadingCities && (
                        <div className="text-xs text-blue-600 font-medium mt-1">
                          🔄 Şehirler yükleniyor...
                        </div>
                      )}
                      {cities.length === 0 && !loadingCities && (
                        <div className="text-xs text-red-600 font-medium mt-1">
                          ❌ Şehirler yüklenemedi
                        </div>
                      )}
                    </div>

                    {/* İlçe Seçimi */}
                    <div className="relative">
                      <select
                        value={formData.districtId || ""}
                        onChange={(e) => handleInputChange("districtId", e.target.value)}
                        className="peer w-full h-12 px-3 py-2.5 font-sans text-sm font-normal text-blue-gray-700 bg-transparent border border-blue-gray-200 rounded-md focus:border-2 focus:border-pink-500 focus:outline-0 disabled:border-blue-gray-200 disabled:bg-blue-gray-50 appearance-none cursor-pointer"
                        disabled={loadingDistricts || !formData.cityId}
                      >
                        {!formData.cityId ? (
                          <option value="" disabled>
                            Önce şehir seçin
                          </option>
                        ) : districts.length === 0 && !loadingDistricts ? (
                          <option value="" disabled>
                            Bu şehirde ilçe bulunamadı
                          </option>
                        ) : (
                          <>
                            <option value="">İlçe Seçin</option>
                            {districts.map((district) => (
                              <option key={district.id} value={district.id.toString()}>
                                {district.districtName}
                              </option>
                            ))}
                          </>
                        )}
                      </select>
                      <label className="flex w-full h-full select-none pointer-events-none absolute left-0 font-normal !overflow-visible truncate peer-placeholder-shown:text-blue-gray-500 leading-tight peer-focus:leading-tight peer-disabled:text-transparent peer-disabled:peer-placeholder-shown:text-blue-gray-500 transition-all -top-1.5 peer-placeholder-shown:text-sm text-xs peer-focus:text-xs before:content[' '] before:block before:box-border before:w-2.5 before:h-1.5 before:mt-[6.5px] before:mr-1 peer-placeholder-shown:before:border-transparent before:rounded-tl-md before:border-t peer-focus:before:border-t-2 before:border-l peer-focus:before:border-l-2 before:pointer-events-none before:transition-all peer-disabled:before:border-transparent after:content[' '] after:block after:flex-grow after:box-border after:w-2.5 after:h-1.5 after:mt-[6.5px] after:ml-1 peer-placeholder-shown:after:border-transparent after:rounded-tr-md after:border-t peer-focus:after:border-t-2 after:border-r peer-focus:after:border-r-2 after:pointer-events-none after:transition-all peer-disabled:after:border-transparent peer-placeholder-shown:leading-[3.75] text-pink-500 peer-focus:text-pink-500 before:border-pink-500 peer-focus:before:border-pink-500 after:border-pink-500 peer-focus:after:border-pink-500">
                        İlçe
                      </label>
                      {/* Custom dropdown arrow */}
                      <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none">
                        <svg className="w-4 h-4 text-blue-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                      {loadingDistricts && (
                        <div className="text-xs text-blue-600 font-medium mt-1">
                          🔄 İlçeler yükleniyor...
                        </div>
                      )}
                      {!formData.cityId && (
                        <div className="text-xs text-gray-500 font-medium mt-1">
                          ℹ️ Önce şehir seçin
                        </div>
                      )}
                      {formData.cityId && districts.length === 0 && !loadingDistricts && (
                        <div className="text-xs text-orange-600 font-medium mt-1">
                          ⚠️ Bu şehir için ilçe bulunamadı
                        </div>
                      )}
                      {formData.districtId && (
                        <div className="text-xs text-green-600 font-medium mt-1">
                          ✓ İlçe seçildi
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Hizmetler */}
                <div>
                  <Typography variant="h5" color="blue-gray" className="mb-6 pb-2 border-b border-gray-200">
                    Hizmetler
                  </Typography>

                  <div className="space-y-4">
                    {formData.services.map((service, index) => (
                      <div key={index} className="flex gap-3 items-end">
                        <div className="flex-1">
                          <Input
                            label={`Hizmet ${index + 1}`}
                            value={service}
                            onChange={(e) => handleServiceChange(index, e.target.value)}
                            size="lg"
                          />
                        </div>
                        {formData.services.length > 1 && (
                          <Button
                            type="button"
                            variant="outlined"
                            color="red"
                            size="sm"
                            onClick={() => removeService(index)}
                            className="px-3 py-2"
                          >
                            <TrashIcon className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    ))}

                    <Button
                      type="button"
                      variant="outlined"
                      color="blue"
                      size="sm"
                      onClick={addService}
                      className="flex items-center gap-2 mt-4"
                    >
                      <PlusIcon className="h-4 w-4" />
                      Hizmet Ekle
                    </Button>
                  </div>
                </div>

                {/* Politikalar */}
                <div>
                  <Typography variant="h5" color="blue-gray" className="mb-6 pb-2 border-b border-gray-200">
                    Politikalar
                  </Typography>

                  <div className="space-y-6">
                    <Textarea
                      label="Rezervasyon Notu"
                      value={formData.reservationNote}
                      onChange={(e) => handleInputChange("reservationNote", e.target.value)}
                      rows={3}
                      size="lg"
                    />

                    <Textarea
                      label="İptal Politikası"
                      value={formData.cancelPolicy}
                      onChange={(e) => handleInputChange("cancelPolicy", e.target.value)}
                      rows={3}
                      size="lg"
                    />
                  </div>
                </div>

                {/* Fotoğraflar */}
                <div>
                  <Typography variant="h5" color="blue-gray" className="mb-6 pb-2 border-b border-gray-200">
                    Fotoğraflar
                  </Typography>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Typography variant="small" color="gray" className="mb-3 font-medium">
                        Kapak Fotoğrafı * <span className="text-red-500">(Zorunlu)</span>
                      </Typography>
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-pink-300 transition-colors">
                        <PhotoIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleCoverPhotoChange}
                          className="hidden"
                          id="cover-photo"
                        />
                        <Button
                          variant="outlined"
                          color="pink"
                          size="sm"
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            document.getElementById('cover-photo')?.click();
                          }}
                        >
                          Kapak Fotoğrafı Seç
                        </Button>
                        {coverPhoto && (
                          <Typography variant="small" color="green" className="mt-3 font-medium">
                            ✓ {coverPhoto.name}
                          </Typography>
                        )}
                      </div>
                    </div>

                    <div>
                      <Typography variant="small" color="gray" className="mb-3 font-medium">
                        Diğer Fotoğraflar
                      </Typography>
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-pink-300 transition-colors">
                        <PhotoIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <input
                          type="file"
                          accept="image/*"
                          multiple
                          onChange={handleImagesChange}
                          className="hidden"
                          id="images"
                        />
                        <Button
                          variant="outlined"
                          color="pink"
                          size="sm"
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            document.getElementById('images')?.click();
                          }}
                        >
                          Fotoğrafları Seç
                        </Button>
                        {images.length > 0 && (
                          <Typography variant="small" color="green" className="mt-3 font-medium">
                            ✓ {images.length} fotoğraf seçildi
                          </Typography>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Seçilen fotoğrafları göster */}
                  {(coverPhoto || images.length > 0) && (
                    <div className="mt-6">
                      <Typography variant="small" color="gray" className="mb-3 font-medium">
                        Seçilen Fotoğraflar:
                      </Typography>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {coverPhoto && (
                          <div className="relative">
                            <img
                              src={URL.createObjectURL(coverPhoto)}
                              alt="Kapak fotoğrafı"
                              className="w-full h-24 object-cover rounded-lg"
                            />
                            <div className="absolute top-1 left-1 bg-pink-500 text-white text-xs px-2 py-1 rounded">
                              Kapak
                            </div>
                            <Button
                              size="sm"
                              color="red"
                              className="absolute top-1 right-1 p-1"
                              onClick={() => setCoverPhoto(null)}
                              type="button"
                            >
                              <TrashIcon className="h-3 w-3" />
                            </Button>
                          </div>
                        )}
                        {images.map((image, index) => (
                          <div key={index} className="relative">
                            <img
                              src={URL.createObjectURL(image)}
                              alt={`Fotoğraf ${index + 1}`}
                              className="w-full h-24 object-cover rounded-lg"
                            />
                            <Button
                              size="sm"
                              color="red"
                              className="absolute top-1 right-1 p-1"
                              onClick={() => {
                                const newImages = images.filter((_, i) => i !== index);
                                setImages(newImages);
                              }}
                              type="button"
                            >
                              <TrashIcon className="h-3 w-3" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Submit Buttons */}
                <div className="flex justify-between items-center pt-8 border-t border-gray-200">
                  <Button
                    type="button"
                    variant="outlined"
                    color="gray"
                    onClick={() => router.push("/admin/organizations")}
                    disabled={loading}
                  >
                    İptal
                  </Button>

                  <Button
                    type="submit"
                    className="bg-gradient-to-r from-pink-500 to-purple-600"
                    size="lg"
                    loading={loading}
                    disabled={loading}
                  >
                    {loading ? "Oluşturuluyor..." : "Organizasyon Oluştur"}
                  </Button>
                </div>
              </form>
            </CardBody>
          </Card>
        </div>
      </AdminLayout>
    </ProtectedRoute>
  );
}