// @ts-nocheck
// src/app/organization-list/page.tsx
"use client";

import { useEffect, useState, useCallback, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Navbar, Footer } from "@/components";
import {
  getAllOrganizations,
  getPaginatedOrganizations,
  getAllCategories,
  getAllCities,
  getFilteredOrganizations,
  getDistrictsByCity,
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
  AdjustmentsHorizontalIcon,
  BuildingOfficeIcon
} from "@heroicons/react/24/outline";
import { HeartIcon } from "@heroicons/react/24/solid";

function OrganizationCard({ org, cities, allDistricts }: { org: Organization; cities: City[]; allDistricts: District[] }) {
  // Determine image source with proper validation
  const getImageSrc = () => {
    // Eğer coverPhotoPath yoksa veya null ise default image kullan
    if (!org.coverPhotoPath || org.coverPhotoPath === null) {
      console.log('⚠️ No coverPhotoPath for', org.title);
      return '/api/images/placeholder.jpg'; // Use proxy placeholder
    }
    
    // Clean the path - remove leading slash if present
    const cleanPath = org.coverPhotoPath.startsWith('/') ? org.coverPhotoPath.substring(1) : org.coverPhotoPath;
    
    // Use the image proxy endpoint
    const imagePath = `/api/images/${cleanPath}`;
    
    console.log('🖼️ Image path for', org.title, ':', imagePath);
    console.log('🖼️ Original coverPhotoPath:', org.coverPhotoPath);
    
    return imagePath;
  };

  return (
    <Link href={`/organization-detail/${org.id}`}>
      <Card className="overflow-hidden shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 group cursor-pointer">
        <div className="relative overflow-hidden">
          <Image
            src={getImageSrc()}
            alt={org.title || 'Organization image'}
            width={400}
            height={256}
            className="w-full h-64 object-cover transition-transform duration-500"
            unoptimized={true} // Disable Next.js optimization to avoid parsing issues
            onError={(e) => {
              console.log('❌ Image load error for', org.title);
              console.log('❌ Failed image src:', e.currentTarget.src);
              console.log('❌ coverPhotoPath was:', org.coverPhotoPath);
              // Set to a simple placeholder
              e.currentTarget.src = '/api/images/placeholder.jpg';
            }}
          />
          <div className="absolute top-4 right-4">
          {/*  <Button
              size="sm"
              className="bg-white/80 text-pink-500 hover:bg-white p-2 rounded-full"
              onClick={(e) => {
                e.preventDefault();
                // Favorilere ekleme işlemi
              }}
            >
              <HeartIcon className="h-4 w-4" />
            </Button>
          */}
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
              <Typography variant="small">
                {(() => {
                  // cityId ve districtId kullanarak sunucudan gerçek isimleri al
                  if (org.cityId && cities && cities.length > 0) {
                    const foundCity = cities.find(city => city.id === org.cityId);
                    
                    if (org.districtId && allDistricts && allDistricts.length > 0) {
                      const foundDistrict = allDistricts.find(district => district.id === org.districtId);
                      
                      if (foundCity && foundDistrict) {
                        console.log('✅ Using cityId + districtId:', `${foundDistrict.districtName}, ${foundCity.cityName}`);
                        return `${foundDistrict.districtName}, ${foundCity.cityName}`;
                      }
                    }
                    
                    if (foundCity) {
                      console.log('✅ Using cityId only:', foundCity.cityName);
                      return foundCity.cityName;
                    }
                  }
                  
                  // Fallback: direkt API'den gelen isimler
                  if (org.districtName && org.cityName) {
                    console.log('✅ Using API districtName + cityName:', `${org.districtName}, ${org.cityName}`);
                    return `${org.districtName}, ${org.cityName}`;
                  }
                  
                  if (org.districtName) {
                    console.log('✅ Using API districtName:', org.districtName);
                    return org.districtName;
                  }
                  
                  if (org.cityName) {
                    console.log('✅ Using API cityName:', org.cityName);
                    return org.cityName;
                  }
                  
                  if (org.location) {
                    console.log('✅ Using location field:', org.location);
                    return org.location;
                  }
                  
                  console.log('❌ No location data found - cityId:', org.cityId, 'districtId:', org.districtId);
                  return "Konum belirtilmemiş";
                })()
                }
              </Typography>
            </div>
          </div>

          <div className="space-y-3">
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

            {/* Şirket Bilgisi ve Buton */}
            {org.companyId && (
              <div className="border-t border-gray-100 pt-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <BuildingOfficeIcon className="h-4 w-4 text-blue-500" />
                    <Typography variant="small" color="gray" className="font-medium">
                      {org.companyName || "Şirket Bilgisi"}
                    </Typography>
                  </div>
                  <Button
                    size="sm"
                    color="blue"
                    variant="outlined"
                    className="text-xs px-3 py-1"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      window.open(`/company-detail/${org.companyId}`, '_blank');
                    }}
                  >
                    Şirket Detayı
                  </Button>
                </div>
              </div>
            )}
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

interface District {
  id: number;
  districtName: string;
}

function OrganizationListInner() {
  const searchParams = useSearchParams();
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [districts, setDistricts] = useState<District[]>([]);
  const [allDistricts, setAllDistricts] = useState<District[]>([]); // Tüm ilçeler
  const [loading, setLoading] = useState(true);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [pageSize] = useState(6); // 6 organizasyon per page

  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [isOutdoor, setIsOutdoor] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  // Cache keys for localStorage
  const CACHE_KEYS = {
    ORGANIZATIONS: 'organizations_cache',
    CATEGORIES: 'categories_cache',
    CITIES: 'cities_cache',
    DISTRICTS: 'districts_cache',
    FILTERED_ORGS: 'filtered_organizations_cache'
  };

  // Cache duration (5 minutes)
  const CACHE_DURATION = 5 * 60 * 1000;

  // Helper function to check if cache is valid
  const isCacheValid = (cacheKey: string) => {
    const cached = localStorage.getItem(cacheKey);
    if (!cached) return false;
    
    try {
      const { timestamp } = JSON.parse(cached);
      return Date.now() - timestamp < CACHE_DURATION;
    } catch {
      return false;
    }
  };

  // Helper function to get from cache
  const getFromCache = (cacheKey: string) => {
    try {
      const cached = localStorage.getItem(cacheKey);
      if (cached) {
        const { data } = JSON.parse(cached);
        return data;
      }
    } catch {
      localStorage.removeItem(cacheKey);
    }
    return null;
  };

  // Helper function to save to cache
  const saveToCache = (cacheKey: string, data: any) => {
    try {
      localStorage.setItem(cacheKey, JSON.stringify({
        data,
        timestamp: Date.now()
      }));
    } catch (error) {
      console.warn('Failed to save to localStorage:', error);
    }
  };

  // Normalize various pagination response shapes to a single structure
  const normalizePaginated = (data: any, fallbackPageSize: number) => {
    let items: any[] = [];
    let count = 0;
    let pages = 1;

    if (Array.isArray(data?.data)) {
      items = data.data;
      count = data.totalCount || data.data.length || 0;
      pages = data.totalPages || Math.ceil(count / fallbackPageSize) || 1;
    } else if (data?.data?.items && Array.isArray(data.data.items)) {
      items = data.data.items;
      count = data.data.totalCount || 0;
      pages = data.data.totalPages || Math.ceil(count / fallbackPageSize) || 1;
    } else if (Array.isArray(data)) {
      // Non-paginated array fallback
      items = data;
      count = data.length;
      pages = Math.ceil(count / fallbackPageSize) || 1;
    }

    return { items, count, pages };
  };

  // Ensure exactly pageSize items render as a safety net when backend ignores paging
  const clampItemsToPage = (items: any[], page: number, size: number) => {
    if (!Array.isArray(items) || items.length <= size) return items;
    const start = (page - 1) * size;
    const end = start + size;
    return items.slice(start, end);
  };

  // Fetch organizations with pagination and caching
  const fetchOrganizations = useCallback(async (page = 1, resetPage = false) => {
    try {
      setLoading(true);

      if (resetPage) {
        setCurrentPage(1);
        page = 1;
      }

      // Cache key with page info
      const cacheKey = `${CACHE_KEYS.ORGANIZATIONS}_page_${page}`;
      
      // Check cache first
      if (isCacheValid(cacheKey)) {
        const cachedData = getFromCache(cacheKey);
        if (cachedData) {
          console.log('📦 Organizations loaded from cache (page', page, ')');
          setOrganizations(cachedData.organizations || []);
          setTotalCount(cachedData.totalCount || 0);
          setTotalPages(cachedData.totalPages || 1);
          setCurrentPage(page);
          setLoading(false);
          
          // Cache'den yüklenen organizations için de districts çek
          await fetchAllDistrictsForOrganizations(cachedData.organizations || []);
          return;
        }
      }

      // API call with pagination parameters
      const data = await getPaginatedOrganizations(page, pageSize);

      console.log("Organizations API response:", data);
      console.log("First organization sample:", data?.data?.[0]);

      if (data?.isSuccess) {
        const { items: normalizedItems, count: totalCount, pages: totalPages } = normalizePaginated(data, pageSize);
        const orgsData = clampItemsToPage(normalizedItems, page, pageSize);

        // Save to cache
        saveToCache(cacheKey, {
          organizations: orgsData,
          totalCount,
          totalPages
        });

        setOrganizations(orgsData);
        setTotalCount(totalCount);
        setTotalPages(totalPages);
        setCurrentPage(page);
        
        // Organizations yüklendikten sonra ilgili districts'i çek
        await fetchAllDistrictsForOrganizations(orgsData);
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
  }, [pageSize]); // Only depend on pageSize

  // Fetch all districts for organizations
  const fetchAllDistrictsForOrganizations = async (orgs: Organization[]) => {
    try {
      // Organizasyonlardaki unique cityId'leri bul
      const uniqueCityIds = [...new Set(orgs.map(org => org.cityId).filter(Boolean))];
      console.log('🏙️ Unique city IDs in organizations:', uniqueCityIds);
      
      if (uniqueCityIds.length === 0) return;
      
      // Her cityId için districts'i çek
      const allDistrictsPromises = uniqueCityIds.map(async (cityId) => {
        try {
          const cacheKey = `${CACHE_KEYS.DISTRICTS}_city_${cityId}`;
          
          // Cache kontrol
          if (isCacheValid(cacheKey)) {
            const cachedData = getFromCache(cacheKey);
            if (cachedData) {
              console.log(`📦 Districts loaded from cache for city ${cityId}`);
              return cachedData;
            }
          }
          
          const districts = await getDistrictsByCity(cityId);
          console.log(`🌐 Districts fetched for city ${cityId}:`, districts?.length || 0);
          
          // Cache'e kaydet
          if (districts) {
            saveToCache(cacheKey, districts);
          }
          
          return districts || [];
        } catch (error) {
          console.error(`Error fetching districts for city ${cityId}:`, error);
          return [];
        }
      });
      
      const allDistrictsArrays = await Promise.all(allDistrictsPromises);
      const flatDistricts = allDistrictsArrays.flat();
      
      console.log('📍 All districts loaded:', flatDistricts.length);
      setAllDistricts(flatDistricts);
      
    } catch (error) {
      console.error('Error fetching all districts:', error);
    }
  };

  // Fetch districts when city is selected (for filter dropdown)
  const fetchDistricts = useCallback(async (cityId: number) => {
    try {
      const cacheKey = `${CACHE_KEYS.DISTRICTS}_city_${cityId}`;
      
      // Check cache first
      if (isCacheValid(cacheKey)) {
        const cachedData = getFromCache(cacheKey);
        if (cachedData) {
          console.log('📦 Districts loaded from cache for filter', cityId);
          setDistricts(Array.isArray(cachedData) ? cachedData : []);
          return;
        }
      }

      const data = await getDistrictsByCity(cityId);
      console.log("Districts received for filter", cityId, ":", data);
      const safeDistricts = Array.isArray(data) ? data : [];
      
      // Save to cache
      saveToCache(cacheKey, safeDistricts);
      
      setDistricts(safeDistricts);
    } catch (error) {
      console.error("Error fetching districts for filter:", error);
      setDistricts([]);
    }
  }, []); // No dependencies needed

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setLoading(true);

        // Check cache for categories and cities
        let categoriesData, citiesData;
        
        // Categories cache check
        if (isCacheValid(CACHE_KEYS.CATEGORIES)) {
          categoriesData = getFromCache(CACHE_KEYS.CATEGORIES);
          console.log('📦 Categories loaded from cache');
        } else {
          categoriesData = await getAllCategories();
          saveToCache(CACHE_KEYS.CATEGORIES, categoriesData);
          console.log('🌐 Categories fetched from API');
        }

        // Cities cache check
        if (isCacheValid(CACHE_KEYS.CITIES)) {
          citiesData = getFromCache(CACHE_KEYS.CITIES);
          console.log('📦 Cities loaded from cache');
        } else {
          citiesData = await getAllCities();
          saveToCache(CACHE_KEYS.CITIES, citiesData);
          console.log('🌐 Cities fetched from API');
        }

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
  }, []); // Empty dependency array - only run once

  // Read all filters from query string
  useEffect(() => {
    const categoryFromQuery = searchParams?.get('categoryId');
    const cityFromQuery = searchParams?.get('cityId');
    const districtFromQuery = searchParams?.get('districtId');
    const searchFromQuery = searchParams?.get('search');
    const isOutdoorFromQuery = searchParams?.get('isOutdoor');
    
    if (categoryFromQuery) {
      setSelectedCategory(categoryFromQuery);
    }
    if (cityFromQuery) {
      setSelectedCity(cityFromQuery);
    }
    if (districtFromQuery) {
      setSelectedDistrict(districtFromQuery);
    }
    if (searchFromQuery) {
      setSearchTerm(searchFromQuery);
    }
    if (isOutdoorFromQuery) {
      setIsOutdoor(isOutdoorFromQuery);
    }
  }, [searchParams]);

  // Fetch districts when city is selected
  useEffect(() => {
    if (selectedCity) {
      fetchDistricts(parseInt(selectedCity));
    } else {
      setDistricts([]);
      setSelectedDistrict(""); // Clear district selection when city is cleared
    }
  }, [selectedCity, fetchDistricts]);

  const handleFilter = useCallback(async () => {
    setLoading(true);
    const filters = {
      categoryId: selectedCategory || undefined,
      cityId: selectedCity || undefined,
      districtId: selectedDistrict || undefined,
      maxPrice: maxPrice ? parseInt(maxPrice) : undefined,
      isOutdoor: isOutdoor === "" ? undefined : isOutdoor === "true",
      search: searchTerm || undefined,
    };

    try {
      // Server-side pagination for filtered results
      const data = await getFilteredOrganizations(filters, 1, pageSize);
      console.log('🌐 Filtered organizations fetched from API (paginated)');

      const { items, count, pages } = normalizePaginated(data, pageSize);
      const clamped = clampItemsToPage(items, 1, pageSize);
      setOrganizations(clamped);
      setCurrentPage(1);
      setTotalCount(count);
      setTotalPages(pages);
    } catch (error) {
      console.error("Filter error:", error);
      setOrganizations([]);
      setTotalCount(0);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  }, [selectedCategory, selectedCity, selectedDistrict, maxPrice, isOutdoor, searchTerm, pageSize]);

  // Otomatik filtreleme için useEffect
  useEffect(() => {
    if (selectedCategory || selectedCity || selectedDistrict || maxPrice || isOutdoor || searchTerm) {
      handleFilter();
    } else {
      // No filters applied, fetch paginated data
      fetchOrganizations(1, true);
    }
  }, [selectedCategory, selectedCity, selectedDistrict, maxPrice, isOutdoor, searchTerm, handleFilter, fetchOrganizations]);

  // Search functionality - removed automatic filtering to prevent loops

  const clearFilters = () => {
    setSelectedCategory("");
    setSelectedCity("");
    setSelectedDistrict("");
    setMaxPrice("");
    setIsOutdoor("");
    setSearchTerm("");
    fetchOrganizations(1, true);
  };



  // Handle page change
  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages && page !== currentPage) {
      const anyFilter = selectedCategory || selectedCity || selectedDistrict || maxPrice || isOutdoor;
      if (anyFilter) {
        // Server-side pagination with active filters
        (async () => {
          try {
            setLoading(true);
            const filters = {
              categoryId: selectedCategory || undefined,
              cityId: selectedCity || undefined,
              districtId: selectedDistrict || undefined,
              maxPrice: maxPrice ? parseInt(maxPrice) : undefined,
              isOutdoor: isOutdoor === "" ? undefined : isOutdoor === "true",
            };

            const data = await getFilteredOrganizations(filters, page, pageSize);

            const { items, count, pages } = normalizePaginated(data, pageSize);
            const clamped = clampItemsToPage(items, page, pageSize);
            setOrganizations(clamped);
            setCurrentPage(page);
            setTotalCount(count);
            setTotalPages(pages);
          } catch (err) {
            console.error('Pagination with filters error:', err);
          } finally {
            setLoading(false);
          }
        })();
      } else {
        // No filters, fetch from API with pagination
        fetchOrganizations(page);
      }
    }
  };

  return (
    <Suspense fallback={<div className="container mx-auto px-4 py-12"><span className="animate-pulse text-gray-500">Yükleniyor...</span></div>}>
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

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
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

              {/* İlçe */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  🏘️ İlçe
                </label>
                <div className="relative">
                  <select
                    value={selectedDistrict}
                    onChange={(e) => {
                      setSelectedDistrict(e.target.value);
                    }}
                    className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-all duration-200 appearance-none cursor-pointer shadow-sm hover:shadow-md"
                    disabled={!selectedCity || districts.length === 0}
                  >
                    <option value="">Tüm İlçeler</option>
                    {districts && districts.length > 0 ? districts.map((district) => (
                      <option key={district.id} value={district.id.toString()}>
                        {district.districtName}
                      </option>
                    )) : (
                      <option value="" disabled>
                        {!selectedCity ? "Önce şehir seçin" : "İlçeler yükleniyor..."}
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
                {selectedDistrict && (
                  <div className="text-xs text-pink-600 font-medium">
                    ✓ İlçe seçildi
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
                {selectedDistrict && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                    🏘️ İlçe seçili
                    <button
                      onClick={() => setSelectedDistrict("")}
                      className="ml-2 text-purple-600 hover:text-purple-800"
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
              {(selectedCategory || selectedCity || selectedDistrict || maxPrice || isOutdoor) && (
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
                <OrganizationCard 
                  key={org.id} 
                  org={org} 
                  cities={cities} 
                  allDistricts={allDistricts} 
                />
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
    </Suspense>
  );
}

export default function OrganizationListPage() {
  return (
    <Suspense fallback={<div className="container mx-auto px-4 py-12"><span className="animate-pulse text-gray-500">Yükleniyor...</span></div>}>
      <OrganizationListInner />
    </Suspense>
  );
}
