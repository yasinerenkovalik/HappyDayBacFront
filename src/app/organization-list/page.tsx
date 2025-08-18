// src/app/organization-list/page.tsx
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Navbar, Footer } from "@/components";
import {
  getAllOrganizations,
  getAllCategories,
  getAllCities,
  getFilteredOrganizations,
} from "@/lib/api";
import { Organization, Category, City } from "@/entities/organization.entity";
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
            src={`http://localhost:5268${org.coverPhotoPath}`}
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

export default function OrganizationListPage() {
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [loading, setLoading] = useState(true);

  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [isOutdoor, setIsOutdoor] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    Promise.all([
      getAllCategories(),
      getAllCities(),
      getAllOrganizations()
    ]).then(([categoriesData, citiesData, organizationsData]) => {
      setCategories(categoriesData);
      setCities(citiesData);
      setOrganizations(organizationsData);
      setLoading(false);
    });
  }, []);

  const handleFilter = () => {
    setLoading(true);
    const filters = {
      categoryId: selectedCategory || undefined,
      cityId: selectedCity || undefined,
      maxPrice: maxPrice ? parseInt(maxPrice) : undefined,
      isOutdoor: isOutdoor === "" ? undefined : isOutdoor === "true",
    };
    getFilteredOrganizations(filters).then((data) => {
      setOrganizations(data);
      setLoading(false);
    });
  };

  const clearFilters = () => {
    setSelectedCategory("");
    setSelectedCity("");
    setMaxPrice("");
    setIsOutdoor("");
    setSearchTerm("");
    setLoading(true);
    getAllOrganizations().then((data) => {
      setOrganizations(data);
      setLoading(false);
    });
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

      <div className="container mx-auto px-4 py-8">
        {/* Filters */}
        <Card className="mb-8 shadow-lg">
          <CardBody className="p-6">
            <div className="flex items-center gap-2 mb-6">
              <AdjustmentsHorizontalIcon className="h-5 w-5 text-pink-500" />
              <Typography variant="h6" color="blue-gray">
                Filtreler
              </Typography>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <div>
                <Typography variant="small" className="mb-2 text-gray-700">
                  Kategori
                </Typography>
                <Select
                  value={selectedCategory}
                  onChange={(value) => setSelectedCategory(value || "")}
                  placeholder="Kategori Seçin"
                >
                  {categories.map((cat) => (
                    <Option key={cat.id} value={cat.id.toString()}>
                      {cat.name}
                    </Option>
                  ))}
                </Select>
              </div>

              <div>
                <Typography variant="small" className="mb-2 text-gray-700">
                  Şehir
                </Typography>
                <Select
                  value={selectedCity}
                  onChange={(value) => setSelectedCity(value || "")}
                  placeholder="Şehir Seçin"
                >
                  {cities.map((city) => (
                    <Option key={city.id} value={city.id.toString()}>
                      {city.cityName}
                    </Option>
                  ))}
                </Select>
              </div>

              <div>
                <Typography variant="small" className="mb-2 text-gray-700">
                  Maksimum Fiyat
                </Typography>
                <Input
                  type="number"
                  placeholder="Max Fiyat"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                />
              </div>

              <div>
                <Typography variant="small" className="mb-2 text-gray-700">
                  Mekan Türü
                </Typography>
                <Select
                  value={isOutdoor}
                  onChange={(value) => setIsOutdoor(value || "")}
                  placeholder="Mekan Türü"
                >
                  <Option value="true">Dış Mekan</Option>
                  <Option value="false">İç Mekan</Option>
                </Select>
              </div>
            </div>

            <div className="flex gap-4">
              <Button onClick={handleFilter} color="pink" className="flex-1">
                Filtrele
              </Button>
              <Button onClick={clearFilters} variant="outlined" color="pink">
                Temizle
              </Button>
            </div>
          </CardBody>
        </Card>

        {/* Results */}
        <div className="flex items-center justify-between mb-6">
          <Typography variant="h6" color="blue-gray">
            {organizations.length} organizasyon bulundu
          </Typography>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <Typography>Yükleniyor...</Typography>
          </div>
        ) : organizations.length === 0 ? (
          <div className="text-center py-12">
            <Typography variant="h6" color="gray">
              Aradığınız kriterlere uygun organizasyon bulunamadı.
            </Typography>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {organizations.map((org) => (
              <OrganizationCard key={org.id} org={org} />
            ))}
          </div>
        )}
      </div>
      
      <Footer />
    </>
  );
}
