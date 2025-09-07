// @ts-nocheck
"use client";

import React from "react";
import { Typography, Button } from "@material-tailwind/react";
import Link from "next/link";
import { getWhatsAppLink } from "@/constants/contact";
import {
  SparklesIcon,
  PhoneIcon,
  EnvelopeIcon
} from "@heroicons/react/24/outline";
import { CONTACT_INFO } from "@/constants/contact";

export default function CTA() {
  return (
    <section
      className="py-16 relative overflow-hidden bg-center bg-cover"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=2048&auto=format&fit=crop')",
      }}
    >
      {/* Soft gradient overlay for readability */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-black/35 to-black/20" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-4xl mx-auto">
          {/* Icon */}
          <div className="w-20 h-20 mx-auto mb-6 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
            <SparklesIcon className="h-10 w-10 text-white" />
          </div>

          {/* Title */}
          <Typography
            variant="h2"
            className="mb-6 text-3xl lg:text-5xl font-bold text-white leading-tight"
            placeholder={undefined}
            onPointerEnterCapture={undefined}
            onPointerLeaveCapture={undefined}
          >
            Hayalinizdeki Organizasyonu
            <br />
            <span className="text-yellow-300">Gerçekleştirmeye Hazır mısınız?</span>
          </Typography>

          {/* Description */}
          <Typography
            variant="lead"
            className="mb-8 text-pink-100 max-w-2xl mx-auto text-lg"
            placeholder={undefined}
            onPointerEnterCapture={undefined}
            onPointerLeaveCapture={undefined}
          >
            Profesyonel ekibimizle birlikte unutulmaz anlar yaşayın.
            Ücretsiz danışmanlık için hemen iletişime geçin!
          </Typography>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
            <Link href="/organization-list" className="w-full sm:w-auto">
              <Button
                as="span"
                size="lg"
                className="bg-white text-pink-600 hover:bg-pink-50 font-semibold w-full sm:w-auto !h-12 !px-6 !text-base rounded-xl flex items-center justify-center gap-2 min-w-[220px]"
                placeholder={undefined}
                onPointerEnterCapture={undefined}
                onPointerLeaveCapture={undefined}
              >
                <SparklesIcon className="h-5 w-5 mr-2" />
                Organizasyonları İncele
              </Button>
            </Link>
            <a href={getWhatsAppLink()} target="_blank" rel="noopener noreferrer" className="w-full sm:w-auto">
              <Button
                as="span"
                size="lg"
                variant="outlined"
                className="border-white text-white hover:bg-white hover:text-pink-600 font-semibold w-full sm:w-auto !h-12 !px-6 !text-base rounded-xl flex items-center justify-center gap-2 min-w-[220px]"
                placeholder={undefined}
                onPointerEnterCapture={undefined}
                onPointerLeaveCapture={undefined}
              >
                WhatsApp ile İletişim
              </Button>
            </a>
          </div>

          {/* Contact Info */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center text-pink-100">
            <div className="flex items-center gap-2">
              <PhoneIcon className="h-5 w-5" />
              <Typography variant="small" className="font-medium">
                {CONTACT_INFO.phone}
              </Typography>
            </div>
            <div className="flex items-center gap-2">
              <EnvelopeIcon className="h-5 w-5" />
              <Typography variant="small" className="font-medium">
                {CONTACT_INFO.email}
              </Typography>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}