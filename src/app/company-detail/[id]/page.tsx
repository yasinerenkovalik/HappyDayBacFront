// @ts-nocheck
"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getCompanyDetailsPublic } from "@/lib/auth";
import { getOrganizationsByCompany } from "@/lib/api";
import { Navbar, Footer } from "@/components";
import {
  Typography,
  Card,
  CardBody,
  Button,
  Chip,
  IconButton,
} from "@material-tailwind/react";
import {
  MapPinIcon,
  PhoneIcon,
  EnvelopeIcon,
  ShareIcon,
  HeartIcon,
  BuildingOfficeIcon,
  GlobeAltIcon,
  CurrencyDollarIcon,
  UserGroupIcon,
} from "@heroicons/react/24/outline";
import { HeartIcon as HeartSolidIcon } from "@heroicons/react/24/solid";

// import dynamic from 'next/dynamic';

// Temporarily disable Map component to debug server component error
// const Map = dynamic(() => import('@/components/Map'), {
//   ssr: false,
//   loading: () => (
//     <div className="w-full h-96 rounded-lg bg-gray-100 flex items-center justify-center">
//       <div className="text-center">
//         <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-2"></div>
//         <Typography variant="small" color="gray">Harita yükleniyor...</Typography>
//       </div>
//     </div>
//   )
// });

interface Company {
  name: string;
  email: string;
  adress: string;
  phoneNumber: string;
  description: string;
  latitude?: number;
  longitude?: number;
  coverPhotoPath?: string;
}

interface Organization {
  id: string;
  title: string;
  categoryId: number;
  description: string;
  location: string | null;
  services: string[];
  isOutdoor: boolean;
  coverPhotoPath: string;
  price: number;
  maxGuestCount: number;
}

export default function CompanyDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [company, setCompany] = useState<Company | null>(null);
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [loading, setLoading] = useState(true);
  const [organizationsLoading, setOrganizationsLoading] = useState(true);
  const [error, setError] = useState("");
  const [isFavorite, setIsFavorite] = useState(false);

  // Image URL helper function - Updated to use proxy
  const getImageUrl = (imagePath: string | null | undefined) => {
    if (!imagePath) {
      return '/api/images/placeholder.jpg';
    }
    
    console.log('🖼️ Original image path:', imagePath);
    
    // Clean the path - remove leading slash if present
    const cleanPath = imagePath.startsWith('/') ? imagePath.substring(1) : imagePath;
    
    // Use the image proxy endpoint
    const proxyUrl = `/api/images/${cleanPath}`;
    console.log('🖼️ Using proxy URL:', proxyUrl);
    
    return proxyUrl;
  };

  useEffect(() => {
    if (id) {
      const fetchCompany = async () => {
        try {
          setLoading(true);
          setError("");
          
          const response = await getCompanyDetailsPublic(id as string);
          
          if (response.isSuccess && response.data) {
            // API response'u array mi yoksa tek obje mi kontrol et
            const companyData = Array.isArray(response.data) ? response.data[0] : response.data;
            setCompany(companyData);
          } else {
            setError("Şirket bilgileri bulunamadı.");
          }
        } catch (error) {
          console.error("Error fetching company:", error);
          setError("Şirket bilgileri yüklenirken hata oluştu.");
        } finally {
          setLoading(false);
        }
      };

      fetchCompany();
    }
  }, [id]);

  // Fetch organizations when company is loaded
  useEffect(() => {
    if (id && !loading) {
      const fetchOrganizations = async () => {
        try {
          setOrganizationsLoading(true);
          const orgs = await getOrganizationsByCompany(id as string);
          setOrganizations(orgs);
        } catch (error) {
          console.error("Error fetching organizations:", error);
        } finally {
          setOrganizationsLoading(false);
        }
      };

      fetchOrganizations();
    }
  }, [id, loading]);

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="container mx-auto px-4 py-20 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <Typography variant="h4" color="gray">
            Şirket bilgileri yükleniyor...
          </Typography>
        </div>
        <Footer />
      </>
    );
  }

  if (error || !company) {
    return (
      <>
        <Navbar />
        <div className="container mx-auto px-4 py-20 text-center">
          <Typography variant="h4" color="red" className="mb-4">
            {error || "Şirket bulunamadı"}
          </Typography>
          <Button 
            color="blue" 
            onClick={() => window.history.back()}
          >
            Geri Dön
          </Button>
        </div>
        <Footer />
      </>
    );
  }

  const hasValidCoords = company.latitude && company.longitude &&
    Math.abs(company.latitude) <= 90 && Math.abs(company.longitude) <= 180;

  return (
    <>
      <Navbar />

      {/* Hero Section */}
      <section className="relative">
        <div className="relative h-80 overflow-hidden bg-gradient-to-r from-blue-500 to-indigo-600">
          {company.coverPhotoPath ? (
            <img
              src={getImageUrl(company.coverPhotoPath)}
              alt={company.name}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center">
              <BuildingOfficeIcon className="h-32 w-32 text-white/30" />
            </div>
          )}
          <div className="absolute inset-0 bg-black/40" />

          {/* Action Buttons */}
          <div className="absolute top-4 right-4 flex gap-2">
            <IconButton
              size="sm"
              className="bg-white/80 text-gray-800 hover:bg-white"
              onClick={() => setIsFavorite(!isFavorite)}
            >
              {isFavorite ? (
                <HeartSolidIcon className="h-5 w-5 text-red-500" />
              ) : (
                <HeartIcon className="h-5 w-5" />
              )}
            </IconButton>
            <IconButton
              size="sm"
              className="bg-white/80 text-gray-800 hover:bg-white"
            >
              <ShareIcon className="h-5 w-5" />
            </IconButton>
          </div>

          {/* Company Info Overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
            <div className="container mx-auto">
              <Typography variant="h1" className="mb-2 font-bold">
                {company.name}
              </Typography>
              <div className="flex items-center gap-4 text-white/90">
                <div className="flex items-center gap-1">
                  <MapPinIcon className="h-5 w-5" />
                  <Typography>
                    {company.adress || "Adres belirtilmemiş"}
                  </Typography>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Sol Taraf - Şirket Bilgileri */}
          <div className="lg:col-span-2 space-y-8">
            {/* Şirket Hakkında */}
            <Card>
              <CardBody className="p-6">
                <Typography variant="h4" color="blue-gray" className="mb-4">
                  Şirket Hakkında
                </Typography>
                <Typography className="text-gray-700 leading-relaxed whitespace-pre-line">
                  {company.description || "Şirket açıklaması bulunmamaktadır."}
                </Typography>
              </CardBody>
            </Card>

            {/* İletişim Bilgileri */}
            <Card>
              <CardBody className="p-6">
                <Typography variant="h4" color="blue-gray" className="mb-4">
                  İletişim Bilgileri
                </Typography>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="bg-blue-50 rounded-full p-2">
                      <EnvelopeIcon className="h-5 w-5 text-blue-500" />
                    </div>
                    <div>
                      <Typography variant="small" color="gray">E-posta</Typography>
                      <Typography className="font-medium">{company.email}</Typography>
                    </div>
                  </div>
                  
                  {company.phoneNumber && (
                    <div className="flex items-center gap-3">
                      <div className="bg-green-50 rounded-full p-2">
                        <PhoneIcon className="h-5 w-5 text-green-500" />
                      </div>
                      <div>
                        <Typography variant="small" color="gray">Telefon</Typography>
                        <Typography className="font-medium">{company.phoneNumber}</Typography>
                      </div>
                    </div>
                  )}
                  
                  <div className="flex items-center gap-3">
                    <div className="bg-purple-50 rounded-full p-2">
                      <MapPinIcon className="h-5 w-5 text-purple-500" />
                    </div>
                    <div>
                      <Typography variant="small" color="gray">Adres</Typography>
                      <Typography className="font-medium">{company.adress}</Typography>
                    </div>
                  </div>
                </div>
              </CardBody>
            </Card>

            {/* Organizasyonlar */}
            <Card>
              <CardBody className="p-6">
                <Typography variant="h4" color="blue-gray" className="mb-6">
                  Organizasyonlar
                </Typography>
                
                {organizationsLoading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
                    <Typography variant="small" color="gray">Organizasyonlar yükleniyor...</Typography>
                  </div>
                ) : organizations.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {organizations.map((org) => (
                      <Card 
                        key={org.id} 
                        className="cursor-pointer hover:shadow-lg transition-shadow duration-300"
                        onClick={() => router.push(`/organization-detail/${org.id}`)}
                      >
                        <div className="relative h-48 overflow-hidden">
                          <img
                            src={getImageUrl(org.coverPhotoPath)}
                            alt={org.title}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.currentTarget.style.display = 'none';
                            }}
                          />
                          <div className="absolute top-2 right-2">
                            <Chip
                              color={org.isOutdoor ? "green" : "blue"}
                              size="sm"
                              value={org.isOutdoor ? "Dış Mekan" : "İç Mekan"}
                            />
                          </div>
                        </div>
                        <CardBody className="p-4">
                          <Typography variant="h6" color="blue-gray" className="mb-2 line-clamp-2">
                            {org.title}
                          </Typography>
                          <Typography variant="small" color="gray" className="mb-3 line-clamp-2">
                            {org.description}
                          </Typography>
                          
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-1">
                              <CurrencyDollarIcon className="h-4 w-4 text-green-500" />
                              <Typography variant="small" className="font-semibold text-green-600">
                                {org.price.toLocaleString('tr-TR')} ₺
                              </Typography>
                            </div>
                            <div className="flex items-center gap-1">
                              <UserGroupIcon className="h-4 w-4 text-blue-500" />
                              <Typography variant="small" color="gray">
                                {org.maxGuestCount} kişi
                              </Typography>
                            </div>
                          </div>

                          {org.services.length > 0 && (
                            <div className="flex flex-wrap gap-1 mb-4">
                              {org.services.slice(0, 2).map((service, index) => (
                                <Chip
                                  key={index}
                                  color="gray"
                                  size="sm"
                                  value={service}
                                  className="text-xs"
                                />
                              ))}
                              {org.services.length > 2 && (
                                <Chip
                                  color="gray"
                                  size="sm"
                                  value={`+${org.services.length - 2} daha`}
                                  className="text-xs"
                                />
                              )}
                            </div>
                          )}

                          {/* Şirket Bilgisi ve Buton */}
                          <div className="border-t border-gray-100 pt-3">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <BuildingOfficeIcon className="h-4 w-4 text-blue-500" />
                                <Typography variant="small" color="gray" className="font-medium">
                                  {company.name}
                                </Typography>
                              </div>
                              <Button
                                size="sm"
                                color="blue"
                                variant="outlined"
                                className="text-xs px-3 py-1"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  router.push(`/company-detail/${id}`);
                                }}
                              >
                                Şirket Detayı
                              </Button>
                            </div>
                          </div>
                        </CardBody>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <BuildingOfficeIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                    <Typography variant="h6" color="gray" className="mb-2">
                      Henüz organizasyon bulunmuyor
                    </Typography>
                    <Typography variant="small" color="gray">
                      Bu şirket henüz herhangi bir organizasyon eklememiş.
                    </Typography>
                  </div>
                )}
              </CardBody>
            </Card>
          </div>

          {/* Sağ Taraf - Hızlı İşlemler */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              <Card className="shadow-xl">
                <CardBody className="p-6">
                  <Typography variant="h5" color="blue-gray" className="mb-6">
                    Hızlı İşlemler
                  </Typography>

                  <div className="space-y-3">
                    {company.phoneNumber && (
                      <Button
                        color="green"
                        size="lg"
                        fullWidth
                        className="flex items-center justify-center gap-2"
                        onClick={() => window.open(`tel:${company.phoneNumber}`, '_self')}
                      >
                        <PhoneIcon className="h-5 w-5" />
                        Telefon Et
                      </Button>
                    )}

                    <Button
                      color="blue"
                      size="lg"
                      fullWidth
                      className="flex items-center justify-center gap-2"
                      onClick={() => window.open(`mailto:${company.email}`, '_self')}
                    >
                      <EnvelopeIcon className="h-5 w-5" />
                      E-posta Gönder
                    </Button>

                    {hasValidCoords && (
                      <Button
                        color="purple"
                        size="lg"
                        fullWidth
                        className="flex items-center justify-center gap-2"
                        onClick={() => {
                          const url = `https://www.google.com/maps?q=${company.latitude},${company.longitude}`;
                          window.open(url, '_blank');
                        }}
                      >
                        <MapPinIcon className="h-5 w-5" />
                        Haritada Görüntüle
                      </Button>
                    )}
                  </div>

                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <Typography variant="small" color="gray" className="text-center">
                      Bu şirketle ilgili daha fazla bilgi için iletişime geçebilirsiniz.
                    </Typography>
                  </div>
                </CardBody>
              </Card>
            </div>
          </div>
        </div>

        {/* Konum Bilgisi - Temporarily disabled */}
        {/* hasValidCoords && (
          <Card className="mt-8">
            <CardBody className="p-6">
              <Typography variant="h4" color="blue-gray" className="mb-4">
                Şirket Konumu
              </Typography>
              <Map 
                latitude={company.latitude as number} 
                longitude={company.longitude as number} 
                title={company.name}
              />
              <div className="mt-4 text-center">
                <Typography variant="small" color="gray">
                  Enlem: {(company.latitude as number).toFixed(6)} | Boylam: {(company.longitude as number).toFixed(6)}
                </Typography>
              </div>
            </CardBody>
          </Card>
        ) */}
      </div>

      <Footer />
    </>
  );
}