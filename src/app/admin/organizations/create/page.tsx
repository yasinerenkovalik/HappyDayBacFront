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
  name: string;
}

interface District {
  id: number;
  name: string;
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
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // JWT'den companyId'yi al
  useEffect(() => {
    const token = getAuthToken();
    if (token) {
      const tokenPayload = parseJWT(token);
      if (tokenPayload && tokenPayload.CompanyId) {
        setFormData(prev => ({
          ...prev,
          companyId: tokenPayload.CompanyId
        }));
      }
    }
  }, []);

  // Kategorileri yükle
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/Category/OrganizationGetAll`);
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

  // Mock şehir ve ilçe verileri (API'den gelecek)
  useEffect(() => {
    setCities([
      { id: 1, name: "İstanbul" },
      { id: 2, name: "Ankara" },
      { id: 3, name: "İzmir" }
    ]);
  }, []);

  useEffect(() => {
    if (formData.cityId) {
      // Mock ilçe verileri
      setDistricts([
        { id: 1, name: "Kadıköy", cityId: 1 },
        { id: 2, name: "Beşiktaş", cityId: 1 },
        { id: 3, name: "Çankaya", cityId: 2 },
        { id: 4, name: "Keçiören", cityId: 2 },
        { id: 5, name: "Konak", cityId: 3 },
        { id: 6, name: "Bornova", cityId: 3 }
      ].filter(d => d.cityId === parseInt(formData.cityId)));
    }
  }, [formData.cityId]);

  const handleInputChange = (name: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
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
    if (e.target.files && e.target.files[0]) {
      setCoverPhoto(e.target.files[0]);
    }
  };

  const handleImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setImages(Array.from(e.target.files));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const formDataToSend = new FormData();

      // Form verilerini ekle
      formDataToSend.append("Title", formData.title);
      formDataToSend.append("Description", formData.description);
      formDataToSend.append("Price", formData.price);
      formDataToSend.append("MaxGuestCount", formData.maxGuestCount);
      formDataToSend.append("CategoryId", formData.categoryId);
      formDataToSend.append("Duration", formData.duration);
      formDataToSend.append("IsOutdoor", formData.isOutdoor.toString());
      formDataToSend.append("ReservationNote", formData.reservationNote);
      formDataToSend.append("CancelPolicy", formData.cancelPolicy);
      formDataToSend.append("VideoUrl", formData.videoUrl);
      formDataToSend.append("CityId", formData.cityId);
      formDataToSend.append("DistrictId", formData.districtId);
      // CompanyId kontrolü
      if (!formData.companyId) {
        setError("Şirket bilgisi bulunamadı. Lütfen tekrar giriş yapın.");
        setLoading(false);
        return;
      }
      formDataToSend.append("CompanyId", formData.companyId);

      // Servisleri ekle
      formData.services.filter(s => s.trim()).forEach((service, index) => {
        formDataToSend.append(`Services[${index}]`, service);
      });

      // Kapak fotoğrafını ekle
      if (coverPhoto) {
        formDataToSend.append("CoverPhoto", coverPhoto);
      }

      // Diğer resimleri ekle
      images.forEach((image, index) => {
        formDataToSend.append(`Images`, image);
      });

      // JWT token'ı al ve header'a ekle
      const token = getAuthToken();
      const headers: Record<string, string> = {};
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/Organization/AddOrganization`, {
        method: "POST",
        body: formDataToSend,
        headers
      });

      const result = await response.json();

      if (result.isSuccess) {
        setSuccess("Organizasyon başarıyla oluşturuldu!");
        // 2 saniye sonra organizasyonlar sayfasına yönlendir
        setTimeout(() => {
          router.push("/admin/organizations");
        }, 2000);
      } else {
        setError(result.message || "Organizasyon oluşturulurken hata oluştu");
      }
    } catch (error) {
      console.error("Submit error:", error);
      setError("Bağlantı hatası. Lütfen tekrar deneyin.");
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

                    <Select
                      label="Kategori"
                      value={formData.categoryId}
                      onChange={(value) => handleInputChange("categoryId", value)}
                      size="lg"
                    >
                      {categories.map((category) => (
                        <Option key={category.id} value={category.id.toString()}>
                          {category.name}
                        </Option>
                      ))}
                    </Select>

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
                    <Select
                      label="Şehir"
                      value={formData.cityId}
                      onChange={(value) => handleInputChange("cityId", value)}
                      size="lg"
                    >
                      {cities.map((city) => (
                        <Option key={city.id} value={city.id.toString()}>
                          {city.name}
                        </Option>
                      ))}
                    </Select>

                    <Select
                      label="İlçe"
                      value={formData.districtId}
                      onChange={(value) => handleInputChange("districtId", value)}
                      disabled={!formData.cityId}
                      size="lg"
                    >
                      {districts.map((district) => (
                        <Option key={district.id} value={district.id.toString()}>
                          {district.name}
                        </Option>
                      ))}
                    </Select>
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
                        Kapak Fotoğrafı *
                      </Typography>
                      <div
                        className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-pink-300 transition-colors cursor-pointer"
                        onClick={() => document.getElementById('cover-photo')?.click()}
                      >
                        <PhotoIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleCoverPhotoChange}
                          className="hidden"
                          id="cover-photo"
                        />
                        <Button variant="outlined" color="pink" size="sm" type="button">
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
                      <div
                        className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-pink-300 transition-colors cursor-pointer"
                        onClick={() => document.getElementById('images')?.click()}
                      >
                        <PhotoIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <input
                          type="file"
                          accept="image/*"
                          multiple
                          onChange={handleImagesChange}
                          className="hidden"
                          id="images"
                        />
                        <Button variant="outlined" color="pink" size="sm" type="button">
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