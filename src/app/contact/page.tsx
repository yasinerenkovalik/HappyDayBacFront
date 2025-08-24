// @ts-nocheck
"use client";
import React from "react";
import { Input, Textarea, Button, Typography, Card } from "@material-tailwind/react";
import { Navbar, Footer } from "@/components";

export default function Contact() {
  return (
    <>
      <Navbar />

      <section className="px-8 py-24 bg-gray-50 min-h-screen">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <Typography variant="h2" color="blue-gray" className="mb-4">
              Bize Ulaşın
            </Typography>
            <Typography variant="lead" className="text-gray-600 mx-auto max-w-2xl">
              Herhangi bir sorunuz veya iş birliği teklifiniz varsa, aşağıdaki formu doldurarak bizimle iletişime geçebilirsiniz.
            </Typography>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* İletişim Formu */}
            <Card shadow={false} className="p-6 bg-white">
              <form className="flex flex-col gap-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input size="lg" label="Ad" required />
                  <Input size="lg" label="Soyad" required />
                </div>
                <Input size="lg" label="E-posta" type="email" required />
                <Textarea label="Mesajınız" rows={6} required />
                <Button color="pink" size="lg" type="submit">
                  Gönder
                </Button>
              </form>
            </Card>

            {/* İletişim Bilgileri */}
            <Card shadow={false} className="p-6 bg-white">
              <Typography variant="h5" color="blue-gray" className="mb-4">
                İletişim Bilgilerimiz
              </Typography>
              <ul className="text-gray-700 space-y-3">
                <li>📍 <strong>Adres:</strong> İstanbul, Türkiye</li>
                <li>📞 <strong>Telefon:</strong> +90 555 123 4567</li>
                <li>📧 <strong>E-posta:</strong> iletisim@mutlugunum.com</li>
                <li>🕐 <strong>Çalışma Saatleri:</strong> Hafta içi 09:00 - 18:00</li>
              </ul>
            </Card>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
