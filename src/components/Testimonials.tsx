// @ts-nocheck
"use client";

import React from "react";
import { Card, CardBody, Typography, Avatar } from "@material-tailwind/react";
import { StarIcon } from "@heroicons/react/24/solid";

const testimonials = [
  {
    id: 1,
    name: "Ayşe & Mehmet Yılmaz",
    role: "Düğün Organizasyonu",
    content: "MutluGünüm sayesinde hayalimizdekilerin çok üzerinde bir düğün gerçekleştirdik. Profesyonel ekip, mükemmel organizasyon. Herkese tavsiye ederim!",
    rating: 5,
    avatar: "/image/testimonials/couple-1.jpg",
    date: "Haziran 2024"
  },
  {
    id: 2,
    name: "Zeynep Kaya",
    role: "Doğum Günü Partisi",
    content: "Kızımın 5. yaş doğum günü için harika bir parti organize ettiler. Çocuklar çok eğlendi, her detay mükemmeldi. Teşekkürler MutluGünüm!",
    rating: 5,
    avatar: "/image/testimonials/mother-1.jpg",
    date: "Mayıs 2024"
  },
  {
    id: 3,
    name: "ABC Şirketi",
    role: "Kurumsal Etkinlik",
    content: "Şirket yıl sonu etkinliğimiz için aldığımız hizmet mükemmeldi. Profesyonel yaklaşım, zamanında teslimat ve kaliteli hizmet.",
    rating: 5,
    avatar: "/image/testimonials/company-1.jpg",
    date: "Aralık 2023"
  }
];

export default function Testimonials() {
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
            Müşteri Yorumları
          </Typography>
          <Typography
            variant="lead"
            className="text-gray-600 max-w-2xl mx-auto"
            placeholder={undefined}
            onPointerEnterCapture={undefined}
            onPointerLeaveCapture={undefined}
          >
            Mutlu müşterilerimizin deneyimlerini okuyun
          </Typography>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial) => (
            <Card
              key={testimonial.id}
              className="shadow-lg hover:shadow-xl transition-shadow duration-300"
              placeholder={undefined}
              onPointerEnterCapture={undefined}
              onPointerLeaveCapture={undefined}
            >
              <CardBody
                className="p-6"
                placeholder={undefined}
                onPointerEnterCapture={undefined}
                onPointerLeaveCapture={undefined}
              >
                {/* Stars */}
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, index) => (
                    <StarIcon key={index} className="h-5 w-5 text-yellow-500" />
                  ))}
                </div>

                {/* Content */}
                <Typography
                  variant="small"
                  className="mb-6 text-gray-700 italic leading-relaxed"
                  placeholder={undefined}
                  onPointerEnterCapture={undefined}
                  onPointerLeaveCapture={undefined}
                >
                  "{testimonial.content}"
                </Typography>

                {/* User Info */}
                <div className="flex items-center gap-3">
                  <Avatar
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    size="sm"
                    className="ring-2 ring-pink-100"
                    placeholder={undefined}
                    onPointerEnterCapture={undefined}
                    onPointerLeaveCapture={undefined}
                  />
                  <div>
                    <Typography
                      variant="small"
                      className="font-semibold text-gray-900"
                      placeholder={undefined}
                      onPointerEnterCapture={undefined}
                      onPointerLeaveCapture={undefined}
                    >
                      {testimonial.name}
                    </Typography>
                    <Typography
                      variant="small"
                      color="gray"
                      placeholder={undefined}
                      onPointerEnterCapture={undefined}
                      onPointerLeaveCapture={undefined}
                    >
                      {testimonial.role} • {testimonial.date}
                    </Typography>
                  </div>
                </div>
              </CardBody>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}