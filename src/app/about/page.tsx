// @ts-nocheck
"use client";

import React from "react";
import {
  Typography,
  Card,
  CardBody,
  Avatar,
} from "@material-tailwind/react";
import { 
  Navbar, 
  Footer, 
  ErrorBoundary 
} from "@/components";
import { 
  HeartIcon, 
  UserGroupIcon, 
  StarIcon,
  CheckBadgeIcon 
} from "@heroicons/react/24/solid";

export default function About() {


  const values = [
    {
      icon: HeartIcon,
      title: "Tutku",
      description: "Her organizasyonun özel olduğuna inanıyoruz ve bu tutkuyla çalışıyoruz."
    },
    {
      icon: UserGroupIcon,
      title: "Topluluk",
      description: "Güçlü bir topluluk oluşturarak birlikte büyüyoruz."
    },
    {
      icon: StarIcon,
      title: "Kalite",
      description: "En yüksek kalite standartlarını koruyarak hizmet veriyoruz."
    },
    {
      icon: CheckBadgeIcon,
      title: "Güven",
      description: "Şeffaflık ve güvenilirlik bizim temel değerlerimizdir."
    }
  ];

  const stats = [
    { number: "1000+", label: "Mutlu Müşteri" },
    { number: "500+", label: "Başarılı Etkinlik" },
    { number: "50+", label: "Partner Mekan" },
    { number: "50+", label: "Şehir" }
  ];

  return (
    <ErrorBoundary>
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative py-20 px-4 bg-gradient-to-br from-pink-50 to-purple-50">
        <div className="max-w-6xl mx-auto text-center">
          <Typography
            variant="h1"
            className="mb-6 text-4xl md:text-5xl font-bold text-gray-900"
            placeholder={undefined}
            onPointerEnterCapture={undefined}
            onPointerLeaveCapture={undefined}
          >
            Hakkımızda
          </Typography>
          <Typography
            variant="lead"
            className="mb-8 text-lg text-gray-700 max-w-3xl mx-auto"
            placeholder={undefined}
            onPointerEnterCapture={undefined}
            onPointerLeaveCapture={undefined}
          >
            MutluGünüm, hayalinizdeki organizasyonu gerçeğe dönüştürmek için kuruldu. 
            2024 yılından beri binlerce mutlu anıya imza atıyoruz.
          </Typography>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <Typography
                variant="h2"
                className="mb-6 text-3xl font-bold text-gray-900"
                placeholder={undefined}
                onPointerEnterCapture={undefined}
                onPointerLeaveCapture={undefined}
              >
                Hikayemiz
              </Typography>
              <Typography
                className="mb-4 text-gray-700 leading-relaxed"
                placeholder={undefined}
                onPointerEnterCapture={undefined}
                onPointerLeaveCapture={undefined}
              >
                MutluGünüm, organizasyon sektöründe yaşanan zorlukları fark eden bir grup tutkulu girişimci 
                tarafından kuruldu. Müşterilerin ideal mekanı bulma sürecini kolaylaştırmak ve organizasyon 
                firmalarını doğru müşterilerle buluşturmak amacıyla yola çıktık.
              </Typography>
              <Typography
                className="mb-4 text-gray-700 leading-relaxed"
                placeholder={undefined}
                onPointerEnterCapture={undefined}
                onPointerLeaveCapture={undefined}
              >
                Bugün Türkiye&apos;nin dört bir yanında 500&apos;den fazla partner mekanımız ve 
                binlerce mutlu müşterimiz var. Her geçen gün büyüyen ailemizle birlikte, 
                daha nice güzel anılara imza atmaya devam ediyoruz.
              </Typography>
            </div>
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=600&h=400&fit=crop"
                alt="Ekip çalışması"
                className="w-full h-80 object-cover rounded-xl shadow-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <Typography
              variant="h2"
              className="mb-4 text-3xl font-bold text-gray-900"
              placeholder={undefined}
              onPointerEnterCapture={undefined}
              onPointerLeaveCapture={undefined}
            >
              Değerlerimiz
            </Typography>
            <Typography
              className="text-gray-700 max-w-2xl mx-auto"
              placeholder={undefined}
              onPointerEnterCapture={undefined}
              onPointerLeaveCapture={undefined}
            >
              Bizi biz yapan ve her gün daha iyi olmaya iten temel değerlerimiz
            </Typography>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <Card key={index} className="text-center shadow-lg">
                <CardBody 
                  className="p-8"
                  placeholder={undefined}
                  onPointerEnterCapture={undefined}
                  onPointerLeaveCapture={undefined}
                >
                  <div className="mx-auto w-16 h-16 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full flex items-center justify-center mb-4">
                    <value.icon className="w-8 h-8 text-white" />
                  </div>
                  <Typography
                    variant="h5"
                    className="mb-3 font-bold text-gray-900"
                    placeholder={undefined}
                    onPointerEnterCapture={undefined}
                    onPointerLeaveCapture={undefined}
                  >
                    {value.title}
                  </Typography>
                  <Typography
                    className="text-gray-700"
                    placeholder={undefined}
                    onPointerEnterCapture={undefined}
                    onPointerLeaveCapture={undefined}
                  >
                    {value.description}
                  </Typography>
                </CardBody>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-pink-500 to-purple-600">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <Typography
              variant="h2"
              className="mb-4 text-3xl font-bold text-white"
              placeholder={undefined}
              onPointerEnterCapture={undefined}
              onPointerLeaveCapture={undefined}
            >
              Rakamlarla MutluGünüm
            </Typography>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <Typography
                  variant="h2"
                  className="mb-2 text-4xl font-bold text-white"
                  placeholder={undefined}
                  onPointerEnterCapture={undefined}
                  onPointerLeaveCapture={undefined}
                >
                  {stat.number}
                </Typography>
                <Typography
                  className="text-pink-100 text-lg"
                  placeholder={undefined}
                  onPointerEnterCapture={undefined}
                  onPointerLeaveCapture={undefined}
                >
                  {stat.label}
                </Typography>
              </div>
            ))}
          </div>
        </div>
      </section>

  

      {/* Mission Section */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-4xl mx-auto text-center">
          <Typography
            variant="h2"
            className="mb-6 text-3xl font-bold text-gray-900"
            placeholder={undefined}
            onPointerEnterCapture={undefined}
            onPointerLeaveCapture={undefined}
          >
            Misyonumuz
          </Typography>
          <Typography
            variant="lead"
            className="mb-8 text-xl text-gray-700 leading-relaxed"
            placeholder={undefined}
            onPointerEnterCapture={undefined}
            onPointerLeaveCapture={undefined}
          >
            Hayatın özel anlarını unutulmaz kılmak için, en kaliteli organizasyon hizmetlerini 
            herkesin kolayca bulabileceği bir platform yaratmak. Müşterilerimizin hayallerini 
            gerçeğe dönüştürürken, iş ortaklarımızın da büyümesine katkıda bulunmak.
          </Typography>
          <Card className="shadow-lg">
            <CardBody 
              className="p-8 bg-gradient-to-r from-pink-50 to-purple-50"
              placeholder={undefined}
              onPointerEnterCapture={undefined}
              onPointerLeaveCapture={undefined}
            >
              <Typography
                variant="h4"
                className="mb-4 font-bold text-gray-900"
                placeholder={undefined}
                onPointerEnterCapture={undefined}
                onPointerLeaveCapture={undefined}
              >
                Vizyonumuz
              </Typography>
              <Typography
                className="text-gray-700 text-lg leading-relaxed"
                placeholder={undefined}
                onPointerEnterCapture={undefined}
                onPointerLeaveCapture={undefined}
              >
                Türkiye&apos;nin en güvenilir ve kapsamlı organizasyon platformu olmak. 
                Her bütçeye uygun, her zevke hitap eden seçeneklerle, ülkemizin dört bir 
                yanındaki mutlu anılara imza atmaya devam etmek.
              </Typography>
            </CardBody>
          </Card>
        </div>
      </section>

      <Footer />
    </ErrorBoundary>
  );
}