// @ts-nocheck
"use client";

import React from "react";
import { Card, CardBody, Typography, Button, Chip } from "@material-tailwind/react";
import { StarIcon, MapPinIcon, UsersIcon } from "@heroicons/react/24/solid";
import Image from "next/image";

const featuredOrganizations = [
  {
    id: 1,
    title: "Lüks Düğün Organizasyonu",
    description: "Hayalinizdeki düğünü gerçekleştiriyoruz. Profesyonel ekibimizle unutulmaz anlar yaşayın.",
    price: 25000,
    rating: 4.9,
    location: "İstanbul, Beşiktaş",
    capacity: 200,
    image: "/image/organizations/organizations1.jpg",
    category: "Düğün",
    features: ["Profesyonel Fotoğrafçı", "Canlı Müzik", "Dekorasyon"]
  },
  {
    id: 2,
    title: "Doğum Günü Partisi",
    description: "Çocuklarınız için eğlenceli ve güvenli doğum günü partileri düzenliyoruz.",
    price: 3500,
    rating: 4.8,
    location: "Ankara, Çankaya",
    capacity: 50,
    image: "/image/organizations/organizations2.jpg",
    category: "Doğum Günü",
    features: ["Animasyon", "Pasta", "Hediyeler"]
  },
  {
    id: 3,
    title: "Kurumsal Etkinlik",
    description: "Şirketiniz için profesyonel kurumsal etkinlikler ve toplantılar organize ediyoruz.",
    price: 15000,
    rating: 4.7,
    location: "İzmir, Konak",
    capacity: 150,
    image: "/image/organizations/organizations3.jpg",
    category: "Kurumsal",
    features: ["Teknik Ekipman", "Catering", "Protokol"]
  },
  {
    id: 4,
    title: "Nişan & Söz Töreni",
    description: "Romantik ve unutulmaz nişan organizasyonları ile özel gününüzü taçlandırın.",
    price: 8500,
    rating: 4.8,
    location: "Bursa, Nilüfer",
    capacity: 80,
    image: "/image/organizations/organizations4.jpg",
    category: "Nişan",
    features: ["Romantik Dekor", "Fotoğraf Çekimi", "Müzik"]
  },
  {
    id: 5,
    title: "Konser & Müzik Etkinliği",
    description: "Canlı müzik performansları ve konser organizasyonları ile eğlenceli geceler.",
    price: 12000,
    rating: 4.6,
    location: "İstanbul, Kadıköy",
    capacity: 300,
    image: "/image/organizations/organizations5.jpg",
    category: "Konser",
    features: ["Sahne Kurulumu", "Ses Sistemi", "Işık Show"]
  },
  {
    id: 6,
    title: "Mezuniyet Töreni",
    description: "Eğitim hayatınızın en özel anını unutulmaz bir törenle kutlayın.",
    price: 5500,
    rating: 4.7,
    location: "Ankara, Kızılay",
    capacity: 120,
    image: "/image/organizations/organizations6.jpg",
    category: "Mezuniyet",
    features: ["Tören Düzeni", "Diploma Töreni", "Anı Fotoğrafları"]
  }
];

export default function FeaturedOrganizations() {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <Typography
            variant="h2"
            className="mb-4 text-3xl lg:text-4xl font-bold text-gray-900"
            placeholder={undefined}
            onPointerEnterCapture={undefined}
            onPointerLeaveCapture={undefined}
          >
            Öne Çıkan Organizasyonlar
          </Typography>
          <Typography
            variant="lead"
            className="text-gray-600 max-w-2xl mx-auto"
            placeholder={undefined}
            onPointerEnterCapture={undefined}
            onPointerLeaveCapture={undefined}
          >
            En popüler ve kaliteli organizasyon hizmetlerimizi keşfedin
          </Typography>
        </div>

        {/* Organizations Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredOrganizations.slice(0, 6).map((org) => (
            <Card
              key={org.id}
              className="shadow-lg hover:shadow-xl transition-shadow duration-300"
              placeholder={undefined}
              onPointerEnterCapture={undefined}
              onPointerLeaveCapture={undefined}
            >
              <div className="relative h-48 overflow-hidden rounded-t-lg">
                <Image
                  src={org.image}
                  alt={org.title}
                  fill
                  className="object-cover hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-4 left-4">
                  <Chip
                    value={org.category}
                    color="pink"
                    size="sm"
                    className="text-white"
                  />
                </div>
                <div className="absolute top-4 right-4 bg-white rounded-full px-2 py-1 flex items-center gap-1">
                  <StarIcon className="h-4 w-4 text-yellow-500" />
                  <Typography variant="small" className="font-semibold">
                    {org.rating}
                  </Typography>
                </div>
              </div>

              <CardBody
                className="p-6"
                placeholder={undefined}
                onPointerEnterCapture={undefined}
                onPointerLeaveCapture={undefined}
              >
                <Typography
                  variant="h5"
                  className="mb-2 font-bold text-gray-900"
                  placeholder={undefined}
                  onPointerEnterCapture={undefined}
                  onPointerLeaveCapture={undefined}
                >
                  {org.title}
                </Typography>

                <Typography
                  variant="small"
                  className="mb-4 text-gray-600 line-clamp-2"
                  placeholder={undefined}
                  onPointerEnterCapture={undefined}
                  onPointerLeaveCapture={undefined}
                >
                  {org.description}
                </Typography>

                {/* Info */}
                <div className="flex items-center gap-4 mb-4 text-sm text-gray-500">
                  <div className="flex items-center gap-1">
                    <MapPinIcon className="h-4 w-4" />
                    <span>{org.location}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <UsersIcon className="h-4 w-4" />
                    <span>{org.capacity} kişi</span>
                  </div>
                </div>

                {/* Features */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {org.features.slice(0, 2).map((feature, index) => (
                    <Chip
                      key={index}
                      value={feature}
                      size="sm"
                      variant="outlined"
                      color="blue"
                      className="text-xs"
                    />
                  ))}
                </div>

                {/* Price and Button */}
                <div className="flex items-center justify-between">
                  <div>
                    <Typography
                      variant="h6"
                      className="font-bold text-green-600"
                      placeholder={undefined}
                      onPointerEnterCapture={undefined}
                      onPointerLeaveCapture={undefined}
                    >
                      ₺{org.price.toLocaleString()}
                    </Typography>
                    <Typography
                      variant="small"
                      color="gray"
                      placeholder={undefined}
                      onPointerEnterCapture={undefined}
                      onPointerLeaveCapture={undefined}
                    >
                      başlangıç fiyatı
                    </Typography>
                  </div>
                  <Button
                    size="sm"
                    className="bg-gradient-to-r from-pink-500 to-purple-600"
                    placeholder={undefined}
                    onPointerEnterCapture={undefined}
                    onPointerLeaveCapture={undefined}
                  >
                    İncele
                  </Button>
                </div>
              </CardBody>
            </Card>
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center mt-12">
          <Button
            size="lg"
            variant="outlined"
            color="pink"
            className="px-8"
            placeholder={undefined}
            onPointerEnterCapture={undefined}
            onPointerLeaveCapture={undefined}
          >
            Tüm Organizasyonları Görüntüle
          </Button>
        </div>
      </div>
    </section>
  );
}