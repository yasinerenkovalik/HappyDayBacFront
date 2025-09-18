
// @ts-nocheck
// src/app/organization-detail/[id]/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getOrganizationDetail, sendContactMessage } from "@/lib/api";
import { OrganizationDetail } from "@/entities/organization.entity";
import { Navbar, Footer } from "@/components";
import {
  Typography,
  Card,
  CardBody,
  Button,
  Input,
  Textarea,
  Chip,
  IconButton,
  Dialog,
  DialogHeader,
  DialogBody,
} from "@material-tailwind/react";
import {
  MapPinIcon,
  ClockIcon,
  UserGroupIcon,
  CurrencyDollarIcon,
  PhoneIcon,
  EnvelopeIcon,
  ShareIcon,
  HeartIcon,
  XMarkIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  BuildingOfficeIcon,
} from "@heroicons/react/24/outline";
import { HeartIcon as HeartSolidIcon, StarIcon } from "@heroicons/react/24/solid";

// import dynamic from 'next/dynamic';

// Temporarily disable Map component to debug server component error
// const Map = dynamic(() => import('@/components/Map'), {
//   ssr: false,
//   loading: () => (
//     <div className="w-full h-96 rounded-lg bg-gray-100 flex items-center justify-center">
//       <div className="text-center">
//         <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-500 mx-auto mb-2"></div>
//         <Typography variant="small" color="gray">Harita yükleniyor...</Typography>
//       </div>
//     </div>
//   )
// });

// Büyük gelen koordinatı 90/180 aralığına indir (gerekirse 10'a bölerek)
function normalizeNumber(val: unknown, maxAbs: number) {
  if (val === null || val === undefined) return null;
  let v = Number(val);
  if (!Number.isFinite(v)) return null;
  let guard = 0;
  while (Math.abs(v) > maxAbs && guard < 20) {
    v = v / 10;
    guard++;
  }
  if (!Number.isFinite(v) || Math.abs(v) > maxAbs) return null;
  return v;
}

export default function OrganizationDetailPage() {
  const { id } = useParams();
  const [org, setOrg] = useState<OrganizationDetail | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    message: "",
  });

  // Image URL helper function with debugging - Updated to use proxy
  const getImageUrl = (imagePath: string | null | undefined) => {
    console.log('🖼️ getImageUrl called with:', imagePath);
    
    if (!imagePath) {
      console.log('⚠️ No image path provided, using placeholder');
      return '/api/images/placeholder.jpg'; // Use proxy placeholder
    }
    
    console.log('🖼️ Original image path:', imagePath);
    console.log('🖼️ Type of imagePath:', typeof imagePath);
    
    // Clean the path - remove leading slash if present
    const cleanPath = imagePath.startsWith('/') ? imagePath.substring(1) : imagePath;
    
    // Use the image proxy endpoint instead of direct URL
    const proxyUrl = `/api/images/${cleanPath}`;
    
    console.log('🖼️ Using proxy URL:', proxyUrl);
    return proxyUrl;
  };

  useEffect(() => {
    // Debug environment variables on client side
    console.log('🔧 Environment debug:', {
      NODE_ENV: process.env.NODE_ENV,
      NEXT_PUBLIC_IMAGE_BASE_URL: process.env.NEXT_PUBLIC_IMAGE_BASE_URL,
      allNextPublicVars: Object.entries(process.env).filter(([key]) => key.startsWith('NEXT_PUBLIC_'))
    });
    
    if (id) {
      getOrganizationDetail(id as string).then((response) => {
        console.log('🏢 Full API response:', response);
        console.log('🏢 Organization data:', response);
        console.log('🖼️ Cover photo path:', response?.coverPhotoPath);
        console.log('🖼️ Images:', response?.images);
        
        setOrg(response);
        if (response?.coverPhotoPath) {
          setSelectedImage(response.coverPhotoPath);
          console.log('🖼️ Selected image set to:', response.coverPhotoPath);
        } else {
          console.log('⚠️ No cover photo path found');
        }
      }).catch(error => {
        console.error('❌ Error fetching organization:', error);
      });
    }
  }, [id]);

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!org?.id) {
      setSubmitMessage("Organizasyon bilgisi bulunamadı.");
      return;
    }

    setIsSubmitting(true);
    setSubmitMessage("");

    try {
      await sendContactMessage({
        fullName: formData.name,
        phone: formData.phone,
        email: formData.email,
        message: formData.message,
        organizationId: org.id,
      });

      setSubmitMessage("Mesajınız başarıyla gönderildi!");
      setFormData({
        name: "",
        phone: "",
        email: "",
        message: "",
      });
    } catch (error) {
      console.error("Mesaj gönderme hatası:", error);
      setSubmitMessage("Mesaj gönderilirken bir hata oluştu. Lütfen tekrar deneyin.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  if (!org) {
    return (
      <>
        <Navbar />
        <div className="container mx-auto px-4 py-20 text-center">
          <Typography variant="h4" color="gray">
            Yükleniyor...
          </Typography>
        </div>
        <Footer />
      </>
    );
  }

  const lat = normalizeNumber(org.latitude as unknown, 90);
  const lng = normalizeNumber(org.longitude as unknown, 180);
  const hasValidCoords =
    lat !== null && lng !== null && Math.abs(lat) <= 90 && Math.abs(lng) <= 180;

  // Create gallery with unique images only
  const createGallery = () => {
    const allImages: string[] = [];
    
    // Add cover photo if it exists
    if (org.coverPhotoPath) {
      allImages.push(org.coverPhotoPath);
    }
    
    // Add images from images array, avoiding duplicates
    if (org.images && Array.isArray(org.images)) {
      org.images.forEach((img) => {
        if (img.imageUrl && !allImages.includes(img.imageUrl)) {
          allImages.push(img.imageUrl);
        }
      });
    }
    
    return allImages;
  };
  
  const gallery = createGallery();
  
  console.log('🖼️ Gallery construction debug:', {
    coverPhotoPath: org.coverPhotoPath,
    imagesArray: org.images,
    imagesLength: org.images?.length || 0,
    imageUrls: org.images?.map((img) => img.imageUrl) || [],
    fullGallery: gallery,
    galleryLength: gallery.length,
    uniqueImages: [...new Set(gallery)]
  });

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % gallery.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + gallery.length) % gallery.length);
  };

  return (
    <>
      <Navbar />

      {/* Hero Section */}
      <section className="relative">
        <div className="relative h-96 overflow-hidden">
          <img
            src={getImageUrl(selectedImage ?? org.coverPhotoPath)}
            alt={org.title}
            className="w-full h-full object-cover"
            onError={(e) => {
              console.log('❌ Main image load error:', e.currentTarget.src);
              e.currentTarget.src = '/image/organizations/organizations1.jpg';
            }}
          />
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

          {/* Title Overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
            <div className="container mx-auto">
              <Typography variant="h1" className="mb-2 font-bold">
                {org.title}
              </Typography>
              <div className="flex items-center gap-4 text-white/90">
                <div className="flex items-center gap-1">
                  <MapPinIcon className="h-5 w-5" />
                  <Typography>
                    {org.cityName && org.districtName 
                      ? `${org.districtName}, ${org.cityName}`
                      : org.location || "Konum belirtilmemiş"
                    }
                  </Typography>
                </div>
            
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Sol Taraf - Ana İçerik */}
          <div className="lg:col-span-2 space-y-8">
            {/* Hızlı Bilgiler */}
            <Card>
              <CardBody className="p-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="bg-pink-50 rounded-full p-3 w-16 h-16 mx-auto mb-2 flex items-center justify-center">
                      <CurrencyDollarIcon className="h-8 w-8 text-pink-500" />
                    </div>
                    <Typography variant="h6" className="text-pink-500 font-bold">
                      {org.price.toLocaleString()} TL
                    </Typography>
                    <Typography variant="small" color="gray">
                      Başlangıç Fiyatı
                    </Typography>
                  </div>

                  <div className="text-center">
                    <div className="bg-blue-50 rounded-full p-3 w-16 h-16 mx-auto mb-2 flex items-center justify-center">
                      <ClockIcon className="h-8 w-8 text-blue-500" />
                    </div>
                    <Typography variant="h6" className="text-blue-500 font-bold">
                      {org.duration}
                    </Typography>
                    <Typography variant="small" color="gray">
                      Süre
                    </Typography>
                  </div>

                  <div className="text-center">
                    <div className="bg-green-50 rounded-full p-3 w-16 h-16 mx-auto mb-2 flex items-center justify-center">
                      <UserGroupIcon className="h-8 w-8 text-green-500" />
                    </div>
                    <Typography variant="h6" className="text-green-500 font-bold">
                      {org.maxGuestCount}
                    </Typography>
                    <Typography variant="small" color="gray">
                      Max Kişi
                    </Typography>
                  </div>

                  <div className="text-center">
                    <div className="bg-purple-50 rounded-full p-3 w-16 h-16 mx-auto mb-2 flex items-center justify-center">
                      <MapPinIcon className="h-8 w-8 text-purple-500" />
                    </div>
                    <Chip
                      value={org.isOutdoor ? "Dış Mekan" : "İç Mekan"}
                      className={org.isOutdoor ? "bg-green-500" : "bg-blue-500"}
                      size="sm"
                    />
                  </div>
                </div>
              </CardBody>
            </Card>

            {/* Açıklama */}
            <Card>
              <CardBody className="p-6">
                <Typography variant="h4" color="blue-gray" className="mb-4">
                  Açıklama
                </Typography>
                <Typography className="text-gray-700 leading-relaxed whitespace-pre-line">
                  {org.description}
                </Typography>
              </CardBody>
            </Card>

            {/* Hizmetler */}
            {org.services && org.services.length > 0 && (
              <Card>
                <CardBody className="p-6">
                  <Typography variant="h4" color="blue-gray" className="mb-4">
                    Hizmetler
                  </Typography>
                  <div className="flex flex-wrap gap-2">
                    {org.services.map((service, idx) => (
                      <Chip
                        key={`${service}-${idx}`}
                        value={service}
                        size="sm"
                        className="bg-pink-50 text-pink-700"
                      />
                    ))}
                  </div>
                </CardBody>
              </Card>
            )}

            {/* Fotoğraf Galerisi */}
            <Card>
              <CardBody className="p-6">
                <Typography variant="h4" color="blue-gray" className="mb-4">
                  Fotoğraf Galerisi
                </Typography>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {gallery.slice(0, 8).map((imgPath, i) => (
                    <div
                      key={`${imgPath}-${i}`}
                      className="relative group cursor-pointer"
                      onClick={() => {
                        setCurrentImageIndex(i);
                        setIsGalleryOpen(true);
                      }}
                    >
                      <img
                        src={getImageUrl(imgPath)}
                        alt="Galeri"
                        className="w-full h-32 object-cover rounded-lg transition-transform group-hover:scale-105"
                        onError={(e) => {
                          console.log('❌ Gallery image load error:', e.currentTarget.src);
                          e.currentTarget.src = '/image/organizations/organizations2.jpg';
                        }}
                      />
                      {i === 7 && gallery.length > 8 && (
                        <div className="absolute inset-0 bg-black/60 rounded-lg flex items-center justify-center">
                          <Typography variant="h6" className="text-white">
                            +{gallery.length - 8}
                          </Typography>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardBody>
            </Card>

            {/* Video - Sadece videoUrl varsa göster */}
            {org.videoUrl && org.videoUrl.trim() !== "" && (
              <Card>
                <CardBody className="p-6">
                  <Typography variant="h4" color="blue-gray" className="mb-4">
                    Tanıtım Videosu
                  </Typography>
                  <div className="aspect-video">
                    <iframe
                      width="100%"
                      height="100%"
                      className="rounded-lg"
                      src={org.videoUrl.replace("watch?v=", "embed/")}
                      title="Tanıtım Videosu"
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                </CardBody>
              </Card>
            )}

            {/* Detay Bilgileri */}
            <Card>
              <CardBody className="p-6">
                <Typography variant="h4" color="blue-gray" className="mb-4">
                  Detay Bilgileri
                </Typography>
                <div className="space-y-4">
                  <div className="py-3 border-b border-gray-100">
                    <Typography className="font-medium mb-2">Rezervasyon Notu:</Typography>
                    <Typography color="gray" className="text-sm leading-relaxed break-words">
                      {org.reservationNote}
                    </Typography>
                  </div>
                  <div className="py-3 border-b border-gray-100">
                    <Typography className="font-medium mb-2">İptal Politikası:</Typography>
                    <Typography color="gray" className="text-sm leading-relaxed break-words">
                      {org.cancelPolicy}
                    </Typography>
                  </div>
                </div>
              </CardBody>
            </Card>
          </div>

          {/* Sağ Taraf - İletişim Formu */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              <Card className="shadow-xl">
                <CardBody className="p-6">
                  <Typography variant="h5" color="blue-gray" className="mb-6">
                    Hızlı İletişim
                  </Typography>

                  <form onSubmit={handleFormSubmit} className="space-y-4">
                    <div>
                      <Input
                        label="Ad Soyad"
                        value={formData.name}
                        onChange={(e) => handleInputChange("name", e.target.value)}
                        required
                      />
                    </div>

                    <div>
                      <Input
                        label="Telefon"
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => handleInputChange("phone", e.target.value)}
                        required
                      />
                    </div>

                    <div>
                      <Input
                        label="E-posta"
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange("email", e.target.value)}
                        required
                      />
                    </div>

                    <div>
                      <Textarea
                        label="Mesajınız"
                        value={formData.message}
                        onChange={(e) => handleInputChange("message", e.target.value)}
                        rows={4}
                      />
                    </div>

                    {submitMessage && (
                      <div className={`p-3 rounded-lg text-sm ${submitMessage.includes("başarıyla")
                        ? "bg-green-50 text-green-700 border border-green-200"
                        : "bg-red-50 text-red-700 border border-red-200"
                        }`}>
                        {submitMessage}
                      </div>
                    )}

                    <Button
                      type="submit"
                      color="pink"
                      size="lg"
                      fullWidth
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Gönderiliyor..." : "Mesaj Gönder"}
                    </Button>
                  </form>

                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <div className="flex items-center gap-4">
                      <Button
                        variant="outlined"
                        color="pink"
                        size="sm"
                        className="flex items-center gap-2 flex-1"
                      >
                        <PhoneIcon className="h-4 w-4" />
                        Ara
                      </Button>
                      <Button
                        variant="outlined"
                        color="pink"
                        size="sm"
                        className="flex items-center gap-2 flex-1"
                      >
                        <EnvelopeIcon className="h-4 w-4" />
                        E-posta
                      </Button>
                    </div>
                    
                    {/* Şirket Detayına Git Butonu */}
                    {/* Geçici olarak her zaman göster - API'dan companyId gelince bu koşulu düzelt */}
                    <div className="mt-4">
                      <Button
                        color="blue"
                        size="sm"
                        fullWidth
                        className="flex items-center justify-center gap-2"
                        onClick={() => {
                          // Geçici companyId - API'dan gelince org.companyId kullan
                          const tempCompanyId = "019929e2-d51c-7858-a8c7-e76e79ed1136";
                          window.open(`/company-detail/${tempCompanyId}`, '_blank');
                        }}
                      >
                        <BuildingOfficeIcon className="h-4 w-4" />
                        Şirket Sayfasını Görüntüle
                      </Button>
                    </div>
                  </div>
                </CardBody>
              </Card>
            </div>
          </div>
        </div>
        <div className="w-full max-w-4xl mx-auto my-8 rounded-lg overflow-hidden shadow-lg">
  <iframe
    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d193490.18409242673!2d29.18977745023473!3d40.73377317351208!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14cadf712c25e571%3A0x2df43c5267816cd4!2sLotus%20Organizasyon!5e0!3m2!1sen!2str!4v1758211271248!5m2!1sen!2str"
    width="100%"
    height="450"
    style={{ border: 0 }}
    allowFullScreen
    loading="lazy"
    referrerPolicy="no-referrer-when-downgrade"
    className="w-full h-full"
  />
</div>



        {/* Konum Bilgisi - Temporarily disabled to debug Server Component error */}
        {/* hasValidCoords && (
          <Card className="mt-8">
            <CardBody className="p-6">
              <Typography variant="h4" color="blue-gray" className="mb-4">
                Konum
              </Typography>
              <Map 
                latitude={lat as number} 
                longitude={lng as number} 
                title={org.title}
              />
              <div className="mt-4 text-center">
                <Typography variant="small" color="gray">
                  Enlem: {(lat as number).toFixed(6)} | Boylam: {(lng as number).toFixed(6)}
                </Typography>
              </div>
            </CardBody>
          </Card>
        ) */}
      </div>

      {/* Gallery Modal */}
      <Dialog
        open={isGalleryOpen}
        handler={() => setIsGalleryOpen(false)}
        size="xl"
        className="bg-black/90"
      >
        <DialogHeader className="justify-between text-white">
          <Typography variant="h5">Fotoğraf Galerisi</Typography>
          <IconButton
            variant="text"
            color="white"
            onClick={() => setIsGalleryOpen(false)}
          >
            <XMarkIcon className="h-6 w-6" />
          </IconButton>
        </DialogHeader>
        <DialogBody className="p-0 relative">
          <div className="flex items-center justify-center relative">
            {/* Sol Ok */}
            {gallery.length > 1 && (
              <IconButton
                variant="text"
                color="white"
                size="lg"
                className="absolute left-2 top-1/2 transform -translate-y-1/2 z-10 bg-black/30 hover:bg-black/50 rounded-full"
                onClick={prevImage}
              >
                <ChevronLeftIcon className="h-8 w-8" />
              </IconButton>
            )}

            {/* Resim */}
            <div className="w-full flex justify-center">
              <img
                src={getImageUrl(gallery[currentImageIndex])}
                alt="Gallery"
                className="max-w-full max-h-96 object-contain"
                onError={(e) => {
                  console.log('❌ Modal image load error:', e.currentTarget.src);
                  e.currentTarget.src = '/api/images/placeholder.jpg';
                }}
              />
            </div>

            {/* Sağ Ok */}
            {gallery.length > 1 && (
              <IconButton
                variant="text"
                color="white"
                size="lg"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 z-10 bg-black/30 hover:bg-black/50 rounded-full"
                onClick={nextImage}
              >
                <ChevronRightIcon className="h-8 w-8" />
              </IconButton>
            )}
          </div>

          {/* Sayfa Numarası */}
          <div className="text-center text-white p-4">
            <Typography>
              {currentImageIndex + 1} / {gallery.length}
            </Typography>
          </div>
        </DialogBody>
      </Dialog>

      <Footer />
    </>
  );

}