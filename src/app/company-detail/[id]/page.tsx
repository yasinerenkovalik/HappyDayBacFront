// @ts-nocheck
"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getCompanyDetailsPublic } from "@/lib/auth";
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

export default function CompanyDetailPage() {
  const { id } = useParams();
  const [company, setCompany] = useState<Company | null>(null);
  const [loading, setLoading] = useState(true);
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