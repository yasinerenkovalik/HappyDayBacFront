// @ts-nocheck
"use client";

import React from "react";
import { Typography } from "@material-tailwind/react";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="container mx-auto px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo ve Açıklama */}
          <div className="col-span-1 md:col-span-2">
            <Typography 
              variant="h5" 
              className="mb-4 font-bold text-pink-400"
              placeholder={undefined}
              onPointerEnterCapture={undefined}
              onPointerLeaveCapture={undefined}
            >
              MutluGünüm
            </Typography>
            <Typography 
              className="text-gray-300 mb-4 max-w-md"
              placeholder={undefined}
              onPointerEnterCapture={undefined}
              onPointerLeaveCapture={undefined}
            >
              Hayalinizdeki organizasyonu gerçeğe dönüştürüyoruz. 
              Düğün, nişan, doğum günü ve özel günleriniz için 
              profesyonel organizasyon hizmetleri.
            </Typography>
          </div>

          {/* Hızlı Linkler */}
          <div>
            <Typography 
              variant="h6" 
              className="mb-4 font-semibold"
              placeholder={undefined}
              onPointerEnterCapture={undefined}
              onPointerLeaveCapture={undefined}
            >
              Hızlı Linkler
            </Typography>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-gray-300 hover:text-pink-400 transition-colors">
                  Ana Sayfa
                </Link>
              </li>
              <li>
                <Link href="/organization-list" className="text-gray-300 hover:text-pink-400 transition-colors">
                  Organizasyonlar
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-300 hover:text-pink-400 transition-colors">
                  İletişim
                </Link>
              </li>
              <li>
                <Link href="/admin/login" className="text-gray-300 hover:text-pink-400 transition-colors">
                  Giriş Yap
                </Link>
              </li>
            </ul>
          </div>

          {/* İletişim Bilgileri */}
          <div>
            <Typography 
              variant="h6" 
              className="mb-4 font-semibold"
              placeholder={undefined}
              onPointerEnterCapture={undefined}
              onPointerLeaveCapture={undefined}
            >
              İletişim
            </Typography>
            <ul className="space-y-2 text-gray-300">
              <li>📍 Kocaeli, Türkiye</li>
              <li>📞 +90 552 685 81 41</li>
              <li>📧 iletisim@mutlugunum.com</li>
            </ul>
          </div>
        </div>

        {/* Alt Çizgi */}
        <hr className="my-8 border-gray-700" />
        
        {/* Copyright */}
        <div className="flex flex-col md:flex-row justify-between items-center">
          <Typography 
            className="text-gray-400 text-sm"
            placeholder={undefined}
            onPointerEnterCapture={undefined}
            onPointerLeaveCapture={undefined}
          >
            © 2024 MutluGünüm. Tüm hakları saklıdır.
          </Typography>
          <div className="flex gap-4 mt-4 md:mt-0">
            <Link href="#" className="text-gray-400 hover:text-pink-400 transition-colors text-sm">
              Gizlilik Politikası
            </Link>
            <Link href="#" className="text-gray-400 hover:text-pink-400 transition-colors text-sm">
              Kullanım Şartları
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}