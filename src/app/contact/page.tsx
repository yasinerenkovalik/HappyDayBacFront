// @ts-nocheck
"use client";

import React, { useState } from "react";
import { Navbar, Footer } from "@/components";
import {
  Card,
  CardBody,
  Typography,
  Input,
  Textarea,
  Button,
  Alert
} from "@material-tailwind/react";
import {
  PhoneIcon,
  EnvelopeIcon,
  MapPinIcon,
  ClockIcon
} from "@heroicons/react/24/outline";
import { CONTACT_INFO } from "@/constants/contact";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    surName: "",
    email: "",
    phone: "",
    mesaage: ""
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const handleInputChange = (name: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      // Form validation
      const trimmedData = {
        name: formData.name.trim(),
        surName: formData.surName.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        mesaage: formData.mesaage.trim()
      };

      if (!trimmedData.name || trimmedData.name.length === 0) {
        setError("Ad alanı gereklidir.");
        setLoading(false);
        return;
      }

      if (!trimmedData.surName || trimmedData.surName.length === 0) {
        setError("Soyad alanı gereklidir.");
        setLoading(false);
        return;
      }

      if (!trimmedData.email || trimmedData.email.length === 0) {
        setError("E-posta alanı gereklidir.");
        setLoading(false);
        return;
      }

      if (!trimmedData.phone || trimmedData.phone.length === 0) {
        setError("Telefon alanı gereklidir.");
        setLoading(false);
        return;
      }

      if (!trimmedData.mesaage || trimmedData.mesaage.length === 0) {
        setError("Mesaj alanı gereklidir.");
        setLoading(false);
        return;
      }

      // Email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(trimmedData.email)) {
        setError("Geçerli bir e-posta adresi giriniz.");
        setLoading(false);
        return;
      }

      // Phone validation (basic)
      const phoneRegex = /^[0-9\s\-\+\(\)]{10,}$/;
      if (!phoneRegex.test(trimmedData.phone.replace(/\s/g, ""))) {
        setError("Geçerli bir telefon numarası giriniz.");
        setLoading(false);
        return;
      }

      // FormData oluştur (multipart/form-data için)
      const formDataToSend = new FormData();
      formDataToSend.append('Name', trimmedData.name);
      formDataToSend.append('SurName', trimmedData.surName);
      formDataToSend.append('Email', trimmedData.email);
      formDataToSend.append('Phone', trimmedData.phone);
      formDataToSend.append('Mesaage', trimmedData.mesaage);

      console.log('🚀 Sending contact form data:', trimmedData);
      console.log('📤 FormData contents:');
      for (let [key, value] of formDataToSend.entries()) {
        console.log(`${key}:`, value);
      }

      // Direkt API çağrısı yap
      let response;
      try {
        response = await fetch('/api/proxy/Concat/add', {
          method: 'POST',
          body: formDataToSend // FormData kullan, Content-Type header'ı otomatik ayarlanır
        });
      } catch (fetchError) {
        console.error('❌ Fetch error:', fetchError);
        setError('Backend\'e bağlanılamıyor. Backend servisinin çalıştığından emin olun.');
        setLoading(false);
        return;
      }

      console.log('📡 Response status:', response.status);
      console.log('📡 Response headers:', Object.fromEntries(response.headers.entries()));

      const result = await response.json();
      console.log('📡 API Response:', result);

      if (!response.ok) {
        console.error('❌ API Error Response:', result);

        // Validation hatalarını daha detaylı göster
        if (result.errors && typeof result.errors === 'object') {
          const errorMessages = Object.entries(result.errors)
            .map(([field, messages]) => `${field}: ${Array.isArray(messages) ? messages.join(', ') : messages}`)
            .join('\n');
          setError(`Validation Hataları:\n${errorMessages}`);
        } else if (result.title && result.detail) {
          setError(`${result.title}: ${result.detail}`);
        } else if (result.message) {
          setError(result.message);
        } else {
          setError(`API Hatası (${response.status}): ${JSON.stringify(result)}`);
        }
        return;
      }

      if (result.isSuccess) {
        setSuccess("Mesajınız başarıyla gönderildi! En kısa sürede size dönüş yapacağız.");
        // Form'u temizle
        setFormData({
          name: "",
          surName: "",
          email: "",
          phone: "",
          mesaage: ""
        });
      } else {
        setError(result.message || result.errors?.join(', ') || "Mesaj gönderilirken hata oluştu");
      }
    } catch (error) {
      console.error("Submit error:", error);
      if (error instanceof TypeError && error.message.includes('fetch')) {
        setError("Sunucuya bağlanılamıyor. İnternet bağlantınızı kontrol edin ve tekrar deneyin.");
      } else if (error instanceof Error) {
        setError(`Hata: ${error.message}`);
      } else {
        setError("Beklenmeyen bir hata oluştu. Lütfen tekrar deneyin.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-pink-500 to-purple-600 py-16">
        <div className="container mx-auto px-4 text-center">
          <Typography variant="h1" className="text-white font-bold mb-4">
            İletişim
          </Typography>
          <Typography variant="lead" className="text-pink-100 mb-8 max-w-2xl mx-auto">
            Sorularınız mı var? Size yardımcı olmaktan mutluluk duyarız. Bizimle iletişime geçin!
          </Typography>
        </div>
      </section>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div>
            <Card className="shadow-lg">
              <CardBody className="p-8">
                <Typography variant="h4" color="blue-gray" className="mb-6">
                  Bize Ulaşın
                </Typography>

                {error && (
                  <Alert color="red" className="mb-6">
                    {error}
                  </Alert>
                )}

                {success && (
                  <Alert color="green" className="mb-6">
                    {success}
                  </Alert>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Input
                      label="Ad *"
                      value={formData.name}
                      onChange={(e) => handleInputChange("name", e.target.value)}
                      required
                      size="lg"
                      minLength={1}
                    />
                    <Input
                      label="Soyad *"
                      value={formData.surName}
                      onChange={(e) => handleInputChange("surName", e.target.value)}
                      required
                      size="lg"
                      minLength={1}
                    />
                  </div>

                  <Input
                    label="E-posta *"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    required
                    size="lg"
                    minLength={1}
                  />

                  <Input
                    label="Telefon *"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    required
                    size="lg"
                    minLength={1}
                  />

                  <Textarea
                    label="Mesajınız *"
                    value={formData.mesaage}
                    onChange={(e) => handleInputChange("mesaage", e.target.value)}
                    required
                    rows={6}
                    size="lg"
                    minLength={1}
                  />

                  <Button
                    type="submit"
                    size="lg"
                    className="w-full bg-gradient-to-r from-pink-500 to-purple-600"
                    disabled={loading}
                  >
                    {loading ? "Gönderiliyor..." : "Mesaj Gönder"}
                  </Button>
                </form>
              </CardBody>
            </Card>
          </div>

          {/* Contact Info */}
          <div className="space-y-8">
            <div>
              <Typography variant="h4" color="blue-gray" className="mb-6">
                İletişim Bilgileri
              </Typography>
              <Typography color="gray" className="mb-8">
                Size en iyi hizmeti verebilmek için buradayız. Aşağıdaki iletişim kanallarından bize ulaşabilirsiniz.
              </Typography>
            </div>

            <div className="space-y-6">
              <Card className="shadow-md">
                <CardBody className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center">
                      <PhoneIcon className="h-6 w-6 text-pink-600" />
                    </div>
                    <div>
                      <Typography variant="h6" color="blue-gray">
                        Telefon
                      </Typography>
                      <Typography color="gray">
                        {CONTACT_INFO.phone}
                      </Typography>
                    </div>
                  </div>
                </CardBody>
              </Card>

              <Card className="shadow-md">
                <CardBody className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                      <EnvelopeIcon className="h-6 w-6 text-purple-600" />
                    </div>
                    <div>
                      <Typography variant="h6" color="blue-gray">
                        E-posta
                      </Typography>
                      <Typography color="gray">
                        {CONTACT_INFO.email}
                      </Typography>
                    </div>
                  </div>
                </CardBody>
              </Card>

              <Card className="shadow-md">
                <CardBody className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                      <MapPinIcon className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <Typography variant="h6" color="blue-gray">
                        Adres
                      </Typography>
                      <Typography color="gray">
                        {CONTACT_INFO.address.street}<br />
                        {CONTACT_INFO.address.detail}
                      </Typography>
                    </div>
                  </div>
                </CardBody>
              </Card>

              <Card className="shadow-md">
                <CardBody className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                      <ClockIcon className="h-6 w-6 text-green-600" />
                    </div>
                    <div>
                      <Typography variant="h6" color="blue-gray">
                        Çalışma Saatleri
                      </Typography>
                      <Typography color="gray">
                        {CONTACT_INFO.workingHours.weekdays}<br />
                        {CONTACT_INFO.workingHours.saturday}
                      </Typography>
                    </div>
                  </div>
                </CardBody>
              </Card>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}