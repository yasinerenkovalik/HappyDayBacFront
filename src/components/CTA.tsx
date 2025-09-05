// @ts-nocheck
"use client";

import React from "react";
import { Typography, Button } from "@material-tailwind/react";
import {
  SparklesIcon,
  PhoneIcon,
  EnvelopeIcon
} from "@heroicons/react/24/outline";

export default function CTA() {
  return (
    <section className="py-16 bg-gradient-to-r from-pink-500 via-purple-600 to-indigo-600 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-32 h-32 bg-white rounded-full"></div>
        <div className="absolute top-32 right-20 w-24 h-24 bg-white rounded-full"></div>
        <div className="absolute bottom-20 left-1/3 w-40 h-40 bg-white rounded-full"></div>
        <div className="absolute bottom-10 right-10 w-28 h-28 bg-white rounded-full"></div>
      </div>

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
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Button
              size="lg"
              className="bg-white text-pink-600 hover:bg-pink-50 font-semibold px-8 py-3"
              placeholder={undefined}
              onPointerEnterCapture={undefined}
              onPointerLeaveCapture={undefined}
            >
              <SparklesIcon className="h-5 w-5 mr-2" />
              Ücretsiz Danışmanlık
            </Button>
            <Button
              size="lg"
              variant="outlined"
              className="border-white text-white hover:bg-white hover:text-pink-600 font-semibold px-8 py-3"
              placeholder={undefined}
              onPointerEnterCapture={undefined}
              onPointerLeaveCapture={undefined}
            >
              Organizasyonları İncele
            </Button>
          </div>

          {/* Contact Info */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center text-pink-100">
            <div className="flex items-center gap-2">
              <PhoneIcon className="h-5 w-5" />
              <Typography variant="small" className="font-medium">
                0850 123 45 67
              </Typography>
            </div>
            <div className="flex items-center gap-2">
              <EnvelopeIcon className="h-5 w-5" />
              <Typography variant="small" className="font-medium">
                info@mutlugunum.com
              </Typography>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}