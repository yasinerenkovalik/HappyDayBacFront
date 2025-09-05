// @ts-nocheck
// src/app/organization-list/page.tsx
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Navbar, Footer } from "@/components";
import {
  getAllOrganizations,
  getPaginatedOrganizations,
  getAllCategories,
  getAllCities,
  getFilteredOrganizations,
} from "@/lib/api";
import { Organization } from "@/entities/organization.entity";
import { 
  Typography, 
  Card, 
  CardBody, 
  Button, 
  Select, 
  Option, 
  Input,
  Chip
} from "@material-tailwind/react";
import { 
  MapPinIcon, 
  ClockIcon, 
  UserGroupIcon,
  CurrencyDollarIcon,
  MagnifyingGlassIcon,
  AdjustmentsHorizontalIcon
} from "@heroicons/react/24/outline";
import { HeartIcon } from "@heroicons/react/24/solid";

function OrganizationCard({ org }: { org: Organization }) {
  return (
    <Link href={`/organization-detail/${org.id}`}>
      <Card className="overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 group cursor-pointer">
        <div className="relative overflow-hidden">
          <img
            src={`${process.env.NEXT_PUBLIC_IMAGE_BASE_URL}${org.coverPhotoPath}`}
            alt={org.title}
            className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute top-4 right-4">
            <Button
              size="sm"
              className="bg-white/80 text-pink-500 hover:bg-white p-2 rounded-full"
              onClick={(e) => {
                e.preventDefault();
                // Favorilere ekleme işlemi
              }}
            >
              <HeartIcon className="h-4 w-4" />
            </Button>
          </div>
          <div className="absolute bottom-4 left-4">
            <Chip
              value={org.isOutdoor ? "Dış Mekan" : "İç Mekan"}
              className={org.isOutdoor ? "bg-green-500" : "bg-blue-500"}
              size="sm"
            />
          </div>
        </div>
        
        <CardBody className="p-6">
          <Typography variant="h5" color="blue-gray" className="mb-3 font-bold">
            {org.title}
          </Typography>
          
          <div className="space-y-2 mb-4">
            <div className="flex items-center gap-2 text-gray-600">
              <ClockIcon className="h-4 w-4" />
              <Typography variant="small">{org.duration}</Typography>
            </div>
            
            <div className="flex items-center gap-2 text-gray-600">
              <UserGroupIcon className="h-4 w-4" />
              <Typography variant="small">Max {org.maxGuestCount} kişi</Typography>
            </div>
            
            <div className="flex items-center gap-2 text-gray-600">
              <MapPinIcon className="h-4 w-4" />
              <Typography variant="small">{org.location || "Konum belirtilmemiş"}</Typography>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              <CurrencyDollarIcon className="h-5 w-5 text-pink-500" />
              <Typography variant="h6" className="text-pink-500 font-bold">
                {org.price.toLocaleString()} TL
              </Typography>
            </div>
            
            <Button size="sm" color="pink" variant="outlined">
              Detayları Gör
            </Button>
          </div>
        </CardBody>
      </Card>
    </Link>
  );
}

interface Category {
  id: number;
  name: string;
}

interface City {
  id: number;
  cityName: string;
}

export default function OrganizationListPage() {
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [loading, setLoading] = useState(true);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [pageSize] = useState(6); // 6 organizasyon per page

  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [isOutdoor, setIsOutdoor] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch organizations with pagination
  const fetchOrganizations = async (page = 1, resetPage = false) => {
    try {
      setLoading(true);
      
      if (resetPage) {
        setCurrentPage(1);
        page = 1;
      }
      
      // API call with pagination parameters
      const data = await getPaginatedOrganizations(page, pageSize);
      
      console.log("Organizations API response:", data);
      
      if (data.isSuccess && data.data) {
        // Assuming API returns paginated data structure
        if (Array.isArray(data.data)) {
          setOrganizations(data.data);
          // If API doesn't return pagination info, calculate from data length
          setTotalCount(data.totalCount || data.data.length);
          setTotalPages(Math.ceil((data.totalCount || data.data.length) / pageSize));
        } else if (data.data.items && Array.isArray(data.data.items)) {
          // If API returns { items: [], totalCount: number, totalPages: number }
          setOrganizations(data.data.items);
          setTotalCount(data.data.totalCount || 0);
          setTotalPages(data.data.totalPages || Math.ceil((data.data.totalCount || 0) / pageSize));
        } else {
          setOrganizations([]);
          setTotalCount(0);
          setTotalPages(1);
        }
        
        setCurrentPage(page);
      } else {
        setOrganizations([]);
        setTotalCount(0);
        setTotalPages(1);
      }
    } catch (error) {
      console.error("Error fetching organizations:", error);
      setOrganizations([]);
      setTotalCount(0);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setLoading(true);
        
        // Fetch categories and cities (these don't need pagination)
        const [categoriesData, citiesData] = await Promise.all([
          getAllCategories(),
          getAllCities()
        ]);
        
        console.log("Categories received:", categoriesData);
        console.log("Cities received:", citiesData);
        
        // Ensure we have arrays
        const safeCategories = Array.isArray(categoriesData) ? categoriesData : [];
        const safeCities = Array.isArray(citiesData) ? citiesData : [];
        
        setCategories(safeCategories);
        setCities(safeCities);
        
        console.log("State updated - Categories:", safeCategories.length, "Cities:", safeCities.length);
        
        // Fetch first page of organizations
        await fetchOrganizations(1);
        
      } catch (error) {
        console.error("API Error:", error);
        setCategories([]);
        setCities([]);
        setOrganizations([]);
      }
    };
    
    fetchInitialData();
  }, []);

  const handleFilter = async () => {
    setLoading(true);
    const filters = {
      categoryId: selectedCategory || undefined,
      cityId: selectedCity || undefined,
      maxPrice: maxPrice ? parseInt(maxPrice) : undefined,
      isOutdoor: isOutdoor === "" ? undefined : isOutdoor === "true",
    };
    
    try {
      const data = await getFilteredOrganizations(filters);
      setOrganizations(Array.isArray(data) ? data : []);
      // Reset pagination when filtering
      setCurrentPage(1);
      setTotalCount(Array.isArray(data) ? data.length : 0);
      setTotalPages(Math.ceil((Array.isArray(data) ? data.length : 0) / pageSize));
    } catch (error) {
      console.error("Filter error:", error);
      setOrganizations([]);
      setTotalCount(0);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  };

  // Otomatik filtreleme için useEffect
  useEffect(() => {
    if (selectedCategory || selectedCity || maxPrice || isOutdoor) {
      handleFilter();
    } else {
      // No filters applied, fetch paginated data
      fetchOrganizations(1, true);
    }
  }, [selectedCategory, selectedCity, maxPrice, isOutdoor]);

  // Arama için useEffect (debounce ile)
  useEffect(() => {
    if (searchTerm) {
      const timeoutId = setTimeout(() => {
        const filteredOrgs = organizations.filter(org =>
          org.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          org.location?.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setOrganizations(filteredOrgs);
        setTotalCount(filteredOrgs.length);
        setTotalPages(Math.ceil(filteredOrgs.length / pageSize));
        setCurrentPage(1);
      }, 300);
      return () => clearTimeout(timeoutId);
    }
  }, [searchTerm]);

  const clearFilters = () => {
    setSelectedCategory("");
    setSelectedCity("");
    setMaxPrice("");
    setIsOutdoor("");
    setSearchTerm("");
    fetchOrganizations(1, true);
  };

  // Handle page change
  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages && page !== currentPage) {
      // If filters are applied, handle client-side pagination
      if (selectedCategory || selectedCity || maxPrice || isOutdoor || searchTerm) {
        setCurrentPage(page);
        // Client-side pagination for filtered results would need to be implemented
        // For now, we'll just change the page number
      } else {
        // No filters, fetch from API with pagination
        fetchOrganizations(page);
      }
    }
  };

  return (
    <>
      <Navbar />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-pink-500 to-purple-600 py-16">
        <div className="container mx-auto px-4 text-center">
          <Typography variant="h1" className="text-white font-bold mb-4">
            Organizasyonlar
          </Typography>
          <Typography variant="lead" className="text-pink-100 mb-8 max-w-2xl mx-auto">
            Size en uygun organizasyonu bulun. Hayalinizdeki etkinliği gerçekleştirin.
          </Typography>
          
          {/* Search Bar */}
          <div className="max-w-md mx-auto">
            <div className="relative">
              <Input
                type="text"
                placeholder="Organizasyon ara..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="!border-white/20 bg-white/10 text-white placeholder:text-white/70"
                labelProps={{
                  className: "hidden",
                }}
                containerProps={{ className: "min-w-0" }}
              />
              <MagnifyingGlassIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-white/70" />
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <Card className="mb-8 shadow-lg">
          <CardBody className="p-6">
            <div className="flex items-center gap-2 mb-6">
              <AdjustmentsHorizontalIcon className="h-5 w-5 text-pink-500" />
              <Typography variant="h6" color="blue-gray">
                Filtreler
              </Typography>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {/* Kategori */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  📋 Kategori
                </label>
                <div className="relative">
                  <select
                    value={selectedCategory}
                    onChange={(e) => {
                      setSelectedCategory(e.target.value);
                    }}
                    className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-all duration-200 appearance-none cursor-pointer shadow-sm hover:shadow-md"
                    disabled={categories.length === 0}
                  >
                    <option value="">Tüm Kategoriler</option>
                    {categories && categories.length > 0 ? categories.map((cat) => (
                      <option key={cat.id} value={cat.id.toString()}>
                        {cat.name}
                      </option>
                    )) : (
                      <option value="" disabled>
                        Kategoriler yükleniyor...
                      </option>
                    )}
                  </select>
                  {/* Custom dropdown arrow */}
                  <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
                {selectedCategory && (
                  <div className="text-xs text-pink-600 font-medium">
                    ✓ Kategori seçildi
                  </div>
                )}
              </div>

              {/* Şehir */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  📍 Şehir
                </label>
                <div className="relative">
                  <select
                    value={selectedCity}
                    onChange={(e) => {
                      setSelectedCity(e.target.value);
                    }}
                    className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-all duration-200 appearance-none cursor-pointer shadow-sm hover:shadow-md"
                    disabled={cities.length === 0}
                  >
                    <option value="">Tüm Şehirler</option>
                    {cities && cities.length > 0 ? cities.map((city) => (
                      <option key={city.id} value={city.id.toString()}>
                        {city.cityName}
                      </option>
                    )) : (
                      <option value="" disabled>
                        Şehirler yükleniyor...
                      </option>
                    )}
                  </select>
                  {/* Custom dropdown arrow */}
                  <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
                {selectedCity && (
                  <div className="text-xs text-pink-600 font-medium">
                    ✓ Şehir seçildi
                  </div>
                )}
              </div>

              {/* Maksimum Fiyat */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  💰 Maksimum Fiyat
                </label>
                <div className="relative">
                  <input
                    type="number"
                    placeholder="Örn: 50000"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                    className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-all duration-200 shadow-sm hover:shadow-md"
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none">
                    <span className="text-gray-400 text-sm">₺</span>
                  </div>
                </div>
                {maxPrice && (
                  <div className="text-xs text-pink-600 font-medium">
                    ✓ Max {parseInt(maxPrice).toLocaleString()} ₺
                  </div>
                )}
              </div>

              {/* Mekan Türü */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  🏢 Mekan Türü
                </label>
                <div className="relative">
                  <select
                    value={isOutdoor}
                    onChange={(e) => {
                      setIsOutdoor(e.target.value);
                    }}
                    className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-all duration-200 appearance-none cursor-pointer shadow-sm hover:shadow-md"
                  >
                    <option value="">Tüm Mekanlar</option>
                    <option value="true">🌳 Dış Mekan</option>
                    <option value="false">🏠 İç Mekan</option>
                  </select>
                  {/* Custom dropdown arrow */}
                  <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
                {isOutdoor && (
                  <div className="text-xs text-pink-600 font-medium">
                    ✓ {isOutdoor === "true" ? "Dış Mekan" : "İç Mekan"} seçildi
                  </div>
                )}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-between items-center pt-6 border-t border-gray-200">
              {/* Active Filters Display */}
              <div className="flex flex-wrap gap-2">
                {selectedCategory && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-pink-100 text-pink-800">
                    📋 Kategori seçili
                    <button
                      onClick={() => setSelectedCategory("")}
                      className="ml-2 text-pink-600 hover:text-pink-800"
                    >
                      ×
                    </button>
                  </span>
                )}
                {selectedCity && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    📍 Şehir seçili
                    <button
                      onClick={() => setSelectedCity("")}
                      className="ml-2 text-blue-600 hover:text-blue-800"
                    >
                      ×
                    </button>
                  </span>
                )}
                {maxPrice && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    💰 Max {parseInt(maxPrice).toLocaleString()} ₺
                    <button
                      onClick={() => setMaxPrice("")}
                      className="ml-2 text-green-600 hover:text-green-800"
                    >
                      ×
                    </button>
                  </span>
                )}
                {isOutdoor && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                    🏢 {isOutdoor === "true" ? "Dış Mekan" : "İç Mekan"}
                    <button
                      onClick={() => setIsOutdoor("")}
                      className="ml-2 text-purple-600 hover:text-purple-800"
                    >
                      ×
                    </button>
                  </span>
                )}
              </div>

              {/* Clear All Button */}
              {(selectedCategory || selectedCity || maxPrice || isOutdoor) && (
                <button
                  onClick={clearFilters}
                  className="px-6 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-medium transition-all duration-200 flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  Tüm Filtreleri Temizle
                </button>
              )}
            </div>
          </CardBody>
        </Card>

        {/* Results */}
        <div className="flex items-center justify-between mb-6">
          <Typography variant="h6" color="blue-gray">
            {totalCount} organizasyon bulundu
            {totalPages > 1 && (
              <span className="text-sm text-gray-500 ml-2">
                (Sayfa {currentPage} / {totalPages})
              </span>
            )}
          </Typography>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="flex items-center justify-center space-x-2">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-500"></div>
              <Typography>Yükleniyor...</Typography>
            </div>
          </div>
        ) : organizations.length === 0 ? (
          <div className="text-center py-12">
            <Typography variant="h6" color="gray">
              Aradığınız kriterlere uygun organizasyon bulunamadı.
            </Typography>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              {organizations.map((org) => (
                <OrganizationCard key={org.id} org={org} />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center space-x-2 py-8">
                {/* Previous Button */}
                <Button
                  variant="outlined"
                  size="sm"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  Önceki
                </Button>

                {/* Page Numbers */}
                <div className="flex items-center space-x-1">
                  {/* First page */}
                  {currentPage > 3 && (
                    <>
                      <Button
                        variant={1 === currentPage ? "filled" : "outlined"}
                        size="sm"
                        onClick={() => handlePageChange(1)}
                        className="w-10 h-10 p-0"
                      >
                        1
                      </Button>
                      {currentPage > 4 && (
                        <span className="px-2 text-gray-500">...</span>
                      )}
                    </>
                  )}

                  {/* Current page and neighbors */}
                  {Array.from({ length: totalPages }, (_, i) => i + 1)
                    .filter(page => {
                      return page >= Math.max(1, currentPage - 2) && 
                             page <= Math.min(totalPages, currentPage + 2);
                    })
                    .map(page => (
                      <Button
                        key={page}
                        variant={page === currentPage ? "filled" : "outlined"}
                        size="sm"
                        onClick={() => handlePageChange(page)}
                        className="w-10 h-10 p-0"
                        color={page === currentPage ? "pink" : "gray"}
                      >
                        {page}
                      </Button>
                    ))}

                  {/* Last page */}
                  {currentPage < totalPages - 2 && (
                    <>
                      {currentPage < totalPages - 3 && (
                        <span className="px-2 text-gray-500">...</span>
                      )}
                      <Button
                        variant={totalPages === currentPage ? "filled" : "outlined"}
                        size="sm"
                        onClick={() => handlePageChange(totalPages)}
                        className="w-10 h-10 p-0"
                      >
                        {totalPages}
                      </Button>
                    </>
                  )}
                </div>

                {/* Next Button */}
                <Button
                  variant="outlined"
                  size="sm"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="flex items-center gap-2"
                >
                  Sonraki
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Button>
              </div>
            )}

            {/* Page Info */}
            {totalPages > 1 && (
              <div className="text-center text-sm text-gray-500 pb-4">
                Toplam {totalCount} organizasyondan {((currentPage - 1) * pageSize) + 1}-{Math.min(currentPage * pageSize, totalCount)} arası gösteriliyor
              </div>
            )}
          </>
        )}
      </div>
      
      <Footer />
    </>
  );
}
