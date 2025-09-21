// @ts-nocheck
"use client";

import React, { useState, useEffect } from "react";
import {
  Typography,
  Card,
  CardBody,
  Button,
} from "@material-tailwind/react";
import {
  MagnifyingGlassIcon,
  AdjustmentsHorizontalIcon,
} from "@heroicons/react/24/outline";
import { useRouter } from "next/navigation";
import { getAllCategories, getAllCities, getDistrictsByCity } from "@/lib/api";

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
}

const SearchEngine = () => {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [districts, setDistricts] = useState<District[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [isOutdoor, setIsOutdoor] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  // Verileri yükle
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [categoriesData, citiesData] = await Promise.all([
          getAllCategories(),
          getAllCities()
        ]);
        
        console.log('Kategoriler yüklendi:', categoriesData);
        console.log('Şehirler yüklendi:', citiesData);
        setCategories(categoriesData || []);
        setCities(citiesData || []);
      } catch (error) {
        console.error("Veri yükleme hatası:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Şehir seçildiğinde ilçeleri yükle
  useEffect(() => {
    const fetchDistricts = async () => {
      if (selectedCity) {
        try {
          const districtsData = await getDistrictsByCity(parseInt(selectedCity));
          setDistricts(districtsData || []);
        } catch (error) {
          console.error("İlçe yükleme hatası:", error);
          setDistricts([]);
        }
      } else {
        setDistricts([]);
        setSelectedDistrict("");
      }
    };

    fetchDistricts();
  }, [selectedCity]);

  const handleSearch = () => {
    // Arama parametrelerini oluştur
    const params = new URLSearchParams();
    
    if (searchTerm) params.append("search", searchTerm);
    if (selectedCategory) params.append("categoryId", selectedCategory);
    if (selectedCity) params.append("cityId", selectedCity);
    if (selectedDistrict) params.append("districtId", selectedDistrict);
    if (isOutdoor) params.append("isOutdoor", isOutdoor);
    
    // Organizasyon listesi sayfasına yönlendir
    router.push(`/organization-list?${params.toString()}`);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <section className="py-16 px-4 overflow-visible">
      <div className="max-w-6xl mx-auto overflow-visible">
        <div className="text-center mb-12">
          <Typography
            variant="h2"
            className="mb-4 text-3xl md:text-4xl font-bold text-gray-900"
            placeholder={undefined}
            onPointerEnterCapture={undefined}
            onPointerLeaveCapture={undefined}
          >
            İdeal Organizasyonu Bulun
          </Typography>
          <Typography
            variant="lead"
            className="text-gray-800 max-w-3xl mx-auto text-lg"
            placeholder={undefined}
            onPointerEnterCapture={undefined}
            onPointerLeaveCapture={undefined}
          >
            Binlerce organizasyon seçeneği arasından size en uygun olanı kolayca bulun
          </Typography>
        </div>

        <Card className="shadow-2xl border-0 bg-white/95 backdrop-blur-sm relative z-10 overflow-visible">
          <CardBody 
            className="p-6 md:p-8 overflow-visible"
            placeholder={undefined}
            onPointerEnterCapture={undefined}
            onPointerLeaveCapture={undefined}
          >
            <div className="flex items-center gap-2 mb-6">
              <AdjustmentsHorizontalIcon className="h-5 w-5 text-pink-600" />
              <Typography
                variant="h5"
                className="font-bold text-gray-900"
                placeholder={undefined}
                onPointerEnterCapture={undefined}
                onPointerLeaveCapture={undefined}
              >
                Detaylı Arama
              </Typography>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              {/* Kategori */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-800 mb-2">
                  📋 Kategori
                </label>
                <div className="relative">
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    disabled={isLoading}
                    className="w-full px-4 py-3 bg-white border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-600 focus:border-pink-600 transition-all duration-200 appearance-none cursor-pointer shadow-sm hover:shadow-md text-gray-900"
                  >
                    <option value="">Tüm Kategoriler</option>
                    {isLoading ? (
                      <option value="" disabled>Kategoriler yükleniyor...</option>
                    ) : (
                      categories.map((category) => (
                        <option key={category.id} value={category.id.toString()}>
                          {category.name}
                        </option>
                      ))
                    )}
                  </select>
                  {/* Custom dropdown arrow */}
                  <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none">
                    <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Şehir */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-800 mb-2">
                  📍 Şehir
                </label>
                <div className="relative">
                  <select
                    value={selectedCity}
                    onChange={(e) => {
                      console.log('Şehir seçildi:', e.target.value);
                      setSelectedCity(e.target.value);
                    }}
                    disabled={isLoading}
                    className="w-full px-4 py-3 bg-white border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-600 focus:border-pink-600 transition-all duration-200 appearance-none cursor-pointer shadow-sm hover:shadow-md text-gray-900"
                  >
                    <option value="">Tüm Şehirler</option>
                    {isLoading ? (
                      <option value="" disabled>Şehirler yükleniyor...</option>
                    ) : cities.length > 0 ? (
                      cities.map((city) => (
                        <option key={city.id} value={city.id.toString()}>
                          {city.cityName}
                        </option>
                      ))
                    ) : (
                      <option value="" disabled>Şehir bulunamadı</option>
                    )}
                  </select>
                  {/* Custom dropdown arrow */}
                  <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none">
                    <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Mekan Türü */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-800 mb-2">
                  🏢 Mekan Türü
                </label>
                <div className="relative">
                  <select
                    value={isOutdoor}
                    onChange={(e) => setIsOutdoor(e.target.value)}
                    className="w-full px-4 py-3 bg-white border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-600 focus:border-pink-600 transition-all duration-200 appearance-none cursor-pointer shadow-sm hover:shadow-md text-gray-900"
                  >
                    <option value="">Tüm Mekanlar</option>
                    <option value="true">🌳 Dış Mekan</option>
                    <option value="false">🏠 İç Mekan</option>
                  </select>
                  {/* Custom dropdown arrow */}
                  <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none">
                    <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Arama Butonu */}
              <div className="flex items-end">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-pink-600 to-purple-700 shadow-lg hover:shadow-xl transition-all duration-300 w-full h-12 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                  onClick={handleSearch}
                  disabled={isLoading}
                  placeholder={undefined}
                  onPointerEnterCapture={undefined}
                  onPointerLeaveCapture={undefined}
                >
                  <MagnifyingGlassIcon className="h-5 w-5 mr-2" />
                  {isLoading ? "Yükleniyor..." : "Organizasyon Ara"}
                </Button>
              </div>
            </div>

            <div className="flex justify-center">
              <Typography
                variant="small"
                className="text-gray-700"
                placeholder={undefined}
                onPointerEnterCapture={undefined}
                onPointerLeaveCapture={undefined}
              >
                {categories.length} kategori, {cities.length} şehir arasından seçiminizi yapın
              </Typography>
            </div>
          </CardBody>
        </Card>
      </div>
    </section>
  );
};

export default SearchEngine;