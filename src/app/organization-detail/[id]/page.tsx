
// src/app/organization-detail/[id]/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getOrganizationDetail } from "@/lib/api";
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
} from "@heroicons/react/24/outline";
import { HeartIcon as HeartSolidIcon, StarIcon } from "@heroicons/react/24/solid";

// Leaflet (stil + ikon uyumluluğu)
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";

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
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    message: "",
  });

  useEffect(() => {
    if (id) {
      getOrganizationDetail(id as string).then((data) => {
        setOrg(data);
        if (data?.coverPhotoPath) setSelectedImage(data.coverPhotoPath);
      });
    }
  }, [id]);

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Form gönderme işlemi
    console.log("Form gönderildi:", formData);
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

  const gallery = [
    org.coverPhotoPath,
    ...(org.images?.map((img) => img.imageUrl) ?? []),
  ].filter(Boolean) as string[];

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
            src={`http://localhost:5268${selectedImage ?? org.coverPhotoPath ?? ""}`}
            alt={org.title}
            className="w-full h-full object-cover"
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
                  <Typography>{org.location || "Konum belirtilmemiş"}</Typography>
                </div>
                <div className="flex items-center gap-1">
                  <StarIcon className="h-5 w-5 text-yellow-400" />
                  <Typography>4.8 (124 değerlendirme)</Typography>
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
                        src={`http://localhost:5268${imgPath}`}
                        alt="Galeri"
                        className="w-full h-32 object-cover rounded-lg transition-transform group-hover:scale-105"
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

            {/* Video */}
            {org.videoUrl && (
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
                <div className="space-y-3">
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <Typography className="font-medium">Rezervasyon Notu:</Typography>
                    <Typography color="gray">{org.reservationNote}</Typography>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <Typography className="font-medium">İptal Politikası:</Typography>
                    <Typography color="gray">{org.cancelPolicy}</Typography>
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

                    <Button type="submit" color="pink" size="lg" fullWidth>
                      Mesaj Gönder
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
                  </div>
                </CardBody>
              </Card>
            </div>
          </div>
        </div>

        {/* Harita */}
        {hasValidCoords && (
          <Card className="mt-8">
            <CardBody className="p-6">
              <Typography variant="h4" color="blue-gray" className="mb-4">
                Konum
              </Typography>
              <div className="w-full h-96 rounded-lg overflow-hidden">
                <MapContainer
                  key={`${lat},${lng}`}
                  center={[lat as number, lng as number]}
                  zoom={15}
                  scrollWheelZoom={false}
                  style={{ height: "100%", width: "100%" }}
                >
                  <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                  />
                  <Marker position={[lat as number, lng as number]}>
                    <Popup>{org.title}</Popup>
                  </Marker>
                </MapContainer>
              </div>
            </CardBody>
          </Card>
        )}
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
          <div className="relative">
            <img
              src={`http://localhost:5268${gallery[currentImageIndex]}`}
              alt="Gallery"
              className="w-full h-96 object-contain"
            />

            {gallery.length > 1 && (
              <>
                <IconButton
                  variant="text"
                  color="white"
                  size="lg"
                  className="absolute left-4 top-1/2 transform -translate-y-1/2"
                  onClick={prevImage}
                >
                  <ChevronLeftIcon className="h-8 w-8" />
                </IconButton>

                <IconButton
                  variant="text"
                  color="white"
                  size="lg"
                  className="absolute right-4 top-1/2 transform -translate-y-1/2"
                  onClick={nextImage}
                >
                  <ChevronRightIcon className="h-8 w-8" />
                </IconButton>
              </>
            )}
          </div>

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
