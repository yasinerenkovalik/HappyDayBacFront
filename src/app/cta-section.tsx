// @ts-nocheck
"use client";

import React from "react";
import { Typography, Button, Input } from "@material-tailwind/react";
import { 
  PhoneIcon, 
  ChatBubbleLeftRightIcon, 
  SparklesIcon,
  CheckCircleIcon,
  ClockIcon,
  ShieldCheckIcon
} from "@heroicons/react/24/solid";

export function CtaSection() {
  return (
    <section className="relative py-20 px-8 bg-gradient-to-br from-gray-900 via-purple-900 to-pink-900 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-full h-full opacity-20"></div>
        <div className="absolute top-20 left-20 w-96 h-96 bg-pink-500/20 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-500/20 rounded-full mix-blend-multiply filter blur-xl animate-pulse delay-1000"></div>
      </div>

      <div className="container mx-auto text-center relative z-10">
        <div className="mx-auto max-w-5xl">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm text-white px-6 py-2 rounded-full text-sm font-semibold mb-8">
            <SparklesIcon className="h-4 w-4" />
            Hayalinizdeki Etkinlik Bir Tık Uzağınızda
          </div>

          <Typography variant="h1" className="mb-6 text-4xl lg:text-6xl font-bold text-white leading-tight">
            Özel Günlerinizi
            <br />
            <span className="bg-gradient-to-r from-pink-300 to-purple-300 bg-clip-text text-transparent">
              Unutulmaz Kılalım
            </span>
          </Typography>
          
          <Typography variant="lead" className="mb-12 text-xl text-gray-200 max-w-3xl mx-auto leading-relaxed">
            Uzman ekibimiz ile ücretsiz danışmanlık alın. Size özel teklifler hazırlayalım ve 
            hayalinizdeki etkinliği birlikte planlayalım.
          </Typography>

          {/* Quick Contact Form */}
          <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 mb-12 max-w-2xl mx-auto border border-white/20">
            <Typography variant="h5" className="text-white mb-6 font-semibold">
              Hızlı Teklif Alın
            </Typography>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <Input
                label="Adınız Soyadınız"
                className="!border-white/30 text-white"
                labelProps={{
                  className: "text-white/70",
                }}
                crossOrigin={undefined}
              />
              <Input
                label="Telefon Numaranız"
                className="!border-white/30 text-white"
                labelProps={{
                  className: "text-white/70",
                }}
                crossOrigin={undefined}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <Input
                label="Etkinlik Türü"
                className="!border-white/30 text-white"
                labelProps={{
                  className: "text-white/70",
                }}
                crossOrigin={undefined}
              />
              <Input
                label="Tarih"
                type="date"
                className="!border-white/30 text-white"
                labelProps={{
                  className: "text-white/70",
                }}
                crossOrigin={undefined}
              />
            </div>
            <Button
              size="lg"
              className="w-full bg-gradient-to-r from-pink-500 to-purple-600 shadow-2xl hover:shadow-pink-500/25 transition-all duration-300"
              placeholder={undefined}
              onPointerEnterCapture={undefined}
              onPointerLeaveCapture={undefined}
            >
              Ücretsiz Teklif Al
            </Button>
          </div>
          
          {/* Action Buttons */}
          <div className="flex flex-col gap-4 sm:flex-row sm:justify-center mb-16">
            <Button
              size="lg"
              className="bg-white text-gray-900 hover:bg-gray-100 flex items-center gap-3 shadow-2xl hover:shadow-white/25 transition-all duration-300"
              placeholder={undefined}
              onPointerEnterCapture={undefined}
              onPointerLeaveCapture={undefined}
            >
              <PhoneIcon className="h-5 w-5" />
              Hemen Ara: 0850 123 45 67
            </Button>
            
            <Button
              size="lg"
              variant="outlined"
              className="border-white/50 text-white hover:bg-white/10 flex items-center gap-3 backdrop-blur-sm"
              placeholder={undefined}
              onPointerEnterCapture={undefined}
              onPointerLeaveCapture={undefined}
            >
              <ChatBubbleLeftRightIcon className="h-5 w-5" />
              WhatsApp ile İletişim
            </Button>
          </div>
          
          {/* Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center group">
              <div className="w-20 h-20 bg-gradient-to-br from-pink-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <ClockIcon className="h-10 w-10 text-white" />
              </div>
              <Typography 
                variant="h5" 
                className="mb-2 font-bold text-white"
                placeholder={undefined}
                onPointerEnterCapture={undefined}
                onPointerLeaveCapture={undefined}
              >
                24/7 Destek
              </Typography>
              <Typography 
                className="text-gray-300"
                placeholder={undefined}
                onPointerEnterCapture={undefined}
                onPointerLeaveCapture={undefined}
              >
                Her zaman yanınızdayız. Sorularınız için 7/24 destek hattımız açık.
              </Typography>
            </div>
            
            <div className="text-center group">
              <div className="w-20 h-20 bg-gradient-to-br from-pink-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <CheckCircleIcon className="h-10 w-10 text-white" />
              </div>
              <Typography 
                variant="h5" 
                className="mb-2 font-bold text-white"
                placeholder={undefined}
                onPointerEnterCapture={undefined}
                onPointerLeaveCapture={undefined}
              >
                Ücretsiz Danışmanlık
              </Typography>
              <Typography 
                className="text-gray-300"
                placeholder={undefined}
                onPointerEnterCapture={undefined}
                onPointerLeaveCapture={undefined}
              >
                İlk görüşme tamamen ücretsiz. Size en uygun seçenekleri sunuyoruz.
              </Typography>
            </div>
            
            <div className="text-center group">
              <div className="w-20 h-20 bg-gradient-to-br from-pink-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <ShieldCheckIcon className="h-10 w-10 text-white" />
              </div>
              <Typography 
                variant="h5" 
                className="mb-2 font-bold text-white"
                placeholder={undefined}
                onPointerEnterCapture={undefined}
                onPointerLeaveCapture={undefined}
              >
                %100 Memnuniyet
              </Typography>
              <Typography 
                className="text-gray-300"
                placeholder={undefined}
                onPointerEnterCapture={undefined}
                onPointerLeaveCapture={undefined}
              >
                Memnun kalmazsanız paranızı iade ediyoruz. Garantili hizmet.
              </Typography>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default CtaSection;