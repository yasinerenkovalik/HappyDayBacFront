// @ts-nocheck
"use client";

import React from "react";
import {
  Typography,
  Card,
  CardBody,
} from "@material-tailwind/react";
import {
  ShieldCheckIcon,
  ClockIcon,
  UserGroupIcon,
  StarIcon,
  CurrencyDollarIcon,
  GlobeAltIcon,
} from "@heroicons/react/24/solid";

export default function WhyUs() {
  const features = [
    {
      icon: ShieldCheckIcon,
      title: "Güvenilir Platform",
      description: "Tüm organizasyon firmaları doğrulanmış ve güvenilir. %100 güvenli ödeme sistemi.",
      color: "bg-blue-600"
    },
    {
      icon: ClockIcon,
      title: "7/24 Destek",
      description: "Hafta sonu dahil 7 gün 24 saat müşteri destek hizmeti sunuyoruz.",
      color: "bg-green-600"
    },
    {
      icon: UserGroupIcon,
      title: "Uzman Ekip",
      description: "Alanında uzman organizasyon profesyonelleri ile çalışıyoruz.",
      color: "bg-purple-600"
    },
    {
      icon: StarIcon,
      title: "Kaliteli Hizmet",
      description: "Sadece 4+ yıldızlı ve müşteri memnuniyeti yüksek firmalar.",
      color: "bg-yellow-600"
    },
    {
      icon: CurrencyDollarIcon,
      title: "En İyi Fiyat",
      description: "Piyasanın en uygun fiyatları ve şeffaf ücretlendirme politikası.",
      color: "bg-pink-600"
    },
    {
      icon: GlobeAltIcon,
      title: "Geniş Seçenek",
      description: "Türkiye'nin her yerinden 500+ farklı mekan ve organizasyon seçeneği.",
      color: "bg-indigo-600"
    }
  ];

  return (
    <section className="py-20 px-4 bg-gray-100">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <Typography
            variant="h2"
            className="mb-4 text-3xl md:text-4xl font-bold text-gray-900"
          >
            Neden MutluGünüm?
          </Typography>
          <Typography
            variant="lead"
            className="text-gray-800 max-w-3xl mx-auto text-lg"
          >
            Binlerce müşterimizin tercih ettiği platform olmamızın sebeplerini keşfedin. 
            Organizasyon dünyasında fark yaratan özelliklerimiz.
          </Typography>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card 
              key={index} 
              className="h-full shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-200"
            >
              <CardBody className="p-8 text-center h-full flex flex-col">
                <div className={`mx-auto w-16 h-16 ${feature.color} rounded-full flex items-center justify-center mb-6 transform transition-transform duration-300 hover:scale-110`}>
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                
                <Typography
                  variant="h5"
                  className="mb-4 font-bold text-gray-900"
                >
                  {feature.title}
                </Typography>
                
                <Typography
                  className="text-gray-800 leading-relaxed flex-grow"
                >
                  {feature.description}
                </Typography>
              </CardBody>
            </Card>
          ))}
        </div>

        {/* İstatistik Bölümü */}
        <div className="mt-16 bg-gradient-to-r from-pink-600 to-purple-700 rounded-2xl p-8 text-center">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <Typography
                variant="h2"
                className="text-white font-bold mb-2"
              >
                10,000+
              </Typography>
              <Typography
                className="text-pink-100"
              >
                Mutlu Müşteri
              </Typography>
            </div>
            
            <div>
              <Typography
                variant="h2"
                className="text-white font-bold mb-2"
              >
                5,000+
              </Typography>
              <Typography
                className="text-pink-100"
              >
                Başarılı Etkinlik
              </Typography>
            </div>
            
            <div>
              <Typography
                variant="h2"
                className="text-white font-bold mb-2"
              >
                500+
              </Typography>
              <Typography
                className="text-pink-100"
              >
                Partner Mekan
              </Typography>
            </div>
            
            <div>
              <Typography
                variant="h2"
                className="text-white font-bold mb-2"
              >
                50+
              </Typography>
              <Typography
                className="text-pink-100"
              >
                Şehir
              </Typography>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}