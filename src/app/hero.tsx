"use client";

import Image from "next/image";
import { Button, Typography, Input } from "@material-tailwind/react";
import { MagnifyingGlassIcon, MapPinIcon, CalendarDaysIcon } from "@heroicons/react/24/outline";
import { SparklesIcon } from "@heroicons/react/24/solid";

function Hero() {
  return (
    <header className="relative min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-20 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
        <div className="absolute top-40 right-20 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-20 left-1/2 w-72 h-72 bg-indigo-300 rounded-full mix-blend-multiply filter blur-xl animate-pulse delay-2000"></div>
      </div>

      <div className="container mx-auto px-8 pt-20 pb-16 relative z-10">
        <div className="grid h-full min-h-[80vh] w-full grid-cols-1 place-items-center gap-y-16 lg:grid-cols-2">
          {/* SOL ALAN */}
          <div className="text-center lg:text-left">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-pink-500 to-purple-600 text-white px-6 py-2 rounded-full text-sm font-semibold mb-6 shadow-lg">
              <SparklesIcon className="h-4 w-4" />
              Türkiye'nin #1 Organizasyon Platformu
            </div>

            <Typography
              variant="h1"
              className="mb-6 text-4xl lg:text-6xl xl:text-7xl font-bold bg-gradient-to-r from-gray-900 via-purple-900 to-pink-900 bg-clip-text text-transparent leading-tight"
            >
              Hayalinizdeki
              <br />
              <span className="bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
                Özel Günü
              </span>
              <br />
              Yaşayın
            </Typography>

            <Typography
              variant="lead"
              className="mb-8 text-xl text-gray-600 max-w-lg mx-auto lg:mx-0 leading-relaxed"
            >
              Düğün, nişan, kına gecesi, doğum günü ve tüm özel anlarınız için 
              <span className="font-semibold text-pink-600"> binlerce organizasyon seçeneği</span> arasından 
              size en uygun olanı bulun.
            </Typography>

            {/* Search Bar */}
            <div className="bg-white rounded-2xl shadow-2xl p-6 mb-8 max-w-2xl mx-auto lg:mx-0">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="relative">
                  <Input
                    label="Ne arıyorsunuz?"
                    icon={<MagnifyingGlassIcon className="h-5 w-5" />}
                    className="!border-gray-200"
                  />
                </div>
                <div className="relative">
                  <Input
                    label="Şehir"
                    icon={<MapPinIcon className="h-5 w-5" />}
                    className="!border-gray-200"
                  />
                </div>
                <div className="relative">
                  <Input
                    label="Tarih"
                    type="date"
                    icon={<CalendarDaysIcon className="h-5 w-5" />}
                    className="!border-gray-200"
                  />
                </div>
              </div>
              <Button 
                size="lg" 
                className="w-full mt-4 bg-gradient-to-r from-pink-500 to-purple-600 shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Organizasyon Ara
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 text-center lg:text-left">
              <div>
                <Typography variant="h4" className="font-bold text-gray-900 mb-1">
                  2,500+
                </Typography>
                <Typography variant="small" className="text-gray-600">
                  Mutlu Çift
                </Typography>
              </div>
              <div>
                <Typography variant="h4" className="font-bold text-gray-900 mb-1">
                  150+
                </Typography>
                <Typography variant="small" className="text-gray-600">
                  Partner Firma
                </Typography>
              </div>
              <div>
                <Typography variant="h4" className="font-bold text-gray-900 mb-1">
                  5,000+
                </Typography>
                <Typography variant="small" className="text-gray-600">
                  Etkinlik
                </Typography>
              </div>
            </div>
          </div>

          {/* SAĞ GÖRSELLER */}
          <div className="relative">
            {/* Ana Görsel */}
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-pink-500/20 to-purple-600/20 rounded-3xl"></div>
              <Image
                width={600}
                height={700}
                src="/image/organizations/organizations1.jpg"
                className="rounded-3xl shadow-2xl relative z-10 w-full h-auto"
                alt="Düğün organizasyonu"
              />
              
              {/* Floating Cards */}
              <div className="absolute -top-6 -left-6 bg-white rounded-2xl shadow-xl p-4 z-20 animate-bounce">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full flex items-center justify-center">
                    <SparklesIcon className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <Typography variant="small" className="font-bold text-gray-900">
                      Premium Hizmet
                    </Typography>
                    <Typography variant="small" className="text-gray-600">
                      7/24 Destek
                    </Typography>
                  </div>
                </div>
              </div>

              <div className="absolute -bottom-6 -right-6 bg-white rounded-2xl shadow-xl p-4 z-20 animate-pulse">
                <div className="text-center">
                  <Typography variant="h6" className="font-bold text-pink-600 mb-1">
                    4.9/5
                  </Typography>
                  <div className="flex gap-1 mb-2">
                    {[...Array(5)].map((_, i) => (
                      <div key={i} className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                    ))}
                  </div>
                  <Typography variant="small" className="text-gray-600">
                    2,500+ Değerlendirme
                  </Typography>
                </div>
              </div>
            </div>

            {/* Küçük Görseller */}
            <div className="grid grid-cols-3 gap-4 mt-8">
              <Image
                width={200}
                height={150}
                src="/image/organizations/organizations2.jpg"
                className="rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300"
                alt="Nişan organizasyonu"
              />
              <Image
                width={200}
                height={150}
                src="/image/organizations/organizations3.jpg"
                className="rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300"
                alt="Kına gecesi"
              />
              <Image
                width={200}
                height={150}
                src="/image/organizations/organizations4.jpg"
                className="rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300"
                alt="Doğum günü"
              />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
export default Hero;
