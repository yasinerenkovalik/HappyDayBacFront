
// src/app/organization-list/[id]/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getOrganizationDetail } from "@/lib/api";
import { OrganizationDetail } from "@/entities/organization.entity";
import { Navbar, Footer } from "@/components";

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

  useEffect(() => {
    if (id) {
      getOrganizationDetail(id as string).then((data) => {
        setOrg(data);
        // İlk büyük görsel seçiminde kapak fotoğrafını göster
        if (data?.coverPhotoPath) setSelectedImage(data.coverPhotoPath);
      });
    }
  }, [id]);

  if (!org) return <p className="text-center mt-12">Yükleniyor...</p>;

  // Koordinatları hesapla (hook kullanmıyoruz → hook sayısı sabit kalır)
  const lat = normalizeNumber(org.latitude as unknown, 90);
  const lng = normalizeNumber(org.longitude as unknown, 180);
  const hasValidCoords =
    lat !== null && lng !== null && Math.abs(lat) <= 90 && Math.abs(lng) <= 180;

  const gallery = [
    org.coverPhotoPath,
    ...(org.images?.map((img) => img.imageUrl) ?? []),
  ].filter(Boolean) as string[];

  return (
    <>
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-4 border-b pb-2">
          {org.title}
        </h1>
  
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sol taraf: Galeri ve Açıklama */}
          <div className="lg:w-2/3">
            {/* Seçili büyük görsel */}
            <div className="mb-6">
              <img
                src={`http://localhost:5268${selectedImage ?? org.coverPhotoPath ?? ""}`}
                alt="Kapak"
                className="w-full h-[450px] object-cover rounded-lg shadow"
              />
            </div>
  
            {/* Fotoğraf Galerisi */}
            <div className="bg-white rounded-lg shadow p-6 mb-6">
              <h2 className="text-2xl font-semibold mb-4 text-pink-600">
                Fotoğraf Galerisi
              </h2>
              <div className="grid grid-cols-3 md:grid-cols-4 gap-4">
                {gallery.map((imgPath, i) => (
                  <img
                    key={`${imgPath}-${i}`}
                    src={`http://localhost:5268${imgPath}`}
                    alt="Galeri"
                    className={`w-full h-28 object-cover rounded cursor-pointer transition hover:scale-105 ${
                      selectedImage === imgPath ? "ring-2 ring-pink-500" : ""
                    }`}
                    onClick={() => setSelectedImage(imgPath)}
                  />
                ))}
              </div>
            </div>
  
            {/* Açıklama */}
            <div className="bg-white rounded-lg shadow p-6 mb-6">
              <h2 className="text-2xl font-semibold mb-4 text-pink-600">
                Açıklama
              </h2>
              <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                {org.description}
              </p>
            </div>
  
            {/* Detaylar */}
            <div className="bg-white rounded-lg shadow p-6 mb-6">
              <h2 className="text-xl font-semibold text-pink-600 mb-4">
                Detay Bilgileri
              </h2>
              <ul className="space-y-2 text-gray-700">
                <li>
                  <strong>Fiyat:</strong> {org.price.toLocaleString()} TL
                </li>
                <li>
                  <strong>Süre:</strong> {org.duration}
                </li>
                <li>
                  <strong>Maksimum Katılımcı:</strong> {org.maxGuestCount}
                </li>
                <li>
                  <strong>İç/Dış Mekan:</strong>{" "}
                  {org.isOutdoor ? "Dış Mekan" : "İç Mekan"}
                </li>
                <li>
                  <strong>Rezervasyon Notu:</strong> {org.reservationNote}
                </li>
                <li>
                  <strong>İptal Politikası:</strong> {org.cancelPolicy}
                </li>
                <li>
                  <strong>Konum:</strong> {org.location || "Belirtilmemiş"}
                </li>
              </ul>
            </div>
  
            {/* Video */}
            {!!org.videoUrl && (
              <div className="bg-white rounded-lg shadow p-4 mb-6">
                <h3 className="text-lg font-semibold text-pink-600 mb-2">
                  Tanıtım Videosu
                </h3>
                <iframe
                  width="100%"
                  height="250"
                  className="rounded"
                  src={org.videoUrl.replace("watch?v=", "embed/")}
                  title="Tanıtım Videosu"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
            )}
          </div>
  
          {/* Sağ Taraf: İletişim Formu */}
          <div className="lg:w-1/3">
            <div className="bg-white rounded-lg shadow p-6 mb-6">
              <h2 className="text-xl font-semibold text-pink-600 mb-4">
                Hızlı İletişim
              </h2>
              <form className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-700">Ad Soyad</label>
                  <input
                    type="text"
                    className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400"
                    placeholder="Adınız Soyadınız"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-700">Telefon</label>
                  <input
                    type="tel"
                    className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400"
                    placeholder="+90 5xx xxx xx xx"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-700">E-posta</label>
                  <input
                    type="email"
                    className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400"
                    placeholder="example@mail.com"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-700">Mesajınız</label>
                  <textarea
                    rows={4}
                    className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400"
                    placeholder="Mesajınızı buraya yazabilirsiniz..."
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-pink-600 text-white py-2 px-4 rounded-lg hover:bg-pink-700 transition"
                >
                  Gönder
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
  
      {/* Harita */}
      <div className="container mx-auto px-4 pb-8">
        <h2 className="text-2xl font-semibold mb-4 text-pink-600">
          Konum Haritası
        </h2>
  
        {hasValidCoords ? (
          <div className="w-full h-[350px] rounded-lg overflow-hidden shadow">
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
        ) : (
          <p className="text-gray-600">Geçersiz koordinat değeri.</p>
        )}
      </div>
  
      <Footer />
    </>
  );
  
}
