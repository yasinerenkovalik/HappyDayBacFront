// @ts-nocheck
"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  Card,
  CardBody,
  Typography,
  Button,
  Alert,
  Chip
} from "@material-tailwind/react";
import {
  ArrowLeftIcon,
  EnvelopeIcon,
  PhoneIcon,
  UserIcon,
  CalendarDaysIcon,
  ChatBubbleLeftRightIcon
} from "@heroicons/react/24/outline";
import AdminLayout from "../../components/AdminLayout";
import ProtectedRoute from "../../components/ProtectedRoute";
import { useRouter } from "next/navigation";
import { getAuthToken } from "@/lib/auth";

interface ContactDetail {
  name: string;
  surName: string;
  email: string;
  phone: string;
  mesaage: string;
  createdAt?: string;
}

export default function ContactDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [contact, setContact] = useState<ContactDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch contact detail
  const fetchContactDetail = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const token = getAuthToken();
      const headers: Record<string, string> = {
        'Content-Type': 'application/json'
      };
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      console.log('🔍 Fetching contact detail for ID:', params.id);

      const response = await fetch('/api/proxy/Concat/getbyid', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          Id: params.id
        })
      });

      console.log('📡 Response status:', response.status);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log('📡 API Response:', result);

      if (result.isSuccess && result.data) {
        setContact(result.data);
        console.log('✅ Contact detail loaded:', result.data);
      } else {
        console.warn('⚠️ Contact not found:', result.message);
        setError(result.message || 'İletişim mesajı bulunamadı');
      }
    } catch (error) {
      console.error('❌ Error fetching contact detail:', error);
      setError('İletişim mesajı detayı yüklenirken hata oluştu: ' + error.message);
    } finally {
      setLoading(false);
    }
  }, [params.id]);

  useEffect(() => {
    if (params.id) {
      fetchContactDetail();
    }
  }, [params.id, fetchContactDetail]);

  const formatDate = (dateString: string) => {
    if (!dateString) return 'Tarih belirtilmemiş';
    try {
      return new Date(dateString).toLocaleDateString('tr-TR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return 'Geçersiz tarih';
    }
  };

  const handleEmailClick = () => {
    if (contact?.email) {
      window.open(`mailto:${contact.email}?subject=MutluGünüm.com - İletişim Yanıtı&body=Merhaba ${contact.name} ${contact.surName},%0D%0A%0D%0A`, '_blank');
    }
  };

  const handlePhoneClick = () => {
    if (contact?.phone) {
      window.open(`tel:${contact.phone}`, '_blank');
    }
  };

  return (
    <ProtectedRoute requiredUserType="admin">
      <AdminLayout userType="admin">
        <div className="p-6">
          {/* Header */}
          <div className="mb-8 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="outlined"
                color="gray"
                className="flex items-center gap-2"
                onClick={() => router.push("/admin/contacts")}
              >
                <ArrowLeftIcon className="h-4 w-4" />
                Geri Dön
              </Button>
              <div>
                <Typography variant="h3" color="blue-gray" className="mb-2">
                  İletişim Mesajı Detayı
                </Typography>
                <Typography color="gray">
                  İletişim mesajının tüm detaylarını görüntüleyin
                </Typography>
              </div>
            </div>
          </div>

          {error && (
            <Alert color="red" className="mb-6">
              {error}
            </Alert>
          )}

          {loading ? (
            <div className="text-center py-12">
              <div className="flex items-center justify-center space-x-2">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-500"></div>
                <Typography>Yükleniyor...</Typography>
              </div>
            </div>
          ) : !contact ? (
            <div className="text-center py-12">
              <EnvelopeIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <Typography variant="h6" color="gray">
                İletişim mesajı bulunamadı.
              </Typography>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Contact Info */}
              <div className="lg:col-span-1 space-y-6">
                <Card className="shadow-lg">
                  <CardBody className="p-6">
                    <Typography variant="h5" color="blue-gray" className="mb-6">
                      Kişi Bilgileri
                    </Typography>

                    <div className="space-y-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full flex items-center justify-center">
                          <UserIcon className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <Typography variant="h6" color="blue-gray">
                            {contact.name} {contact.surName}
                          </Typography>
                          <Typography variant="small" color="gray">
                            Ad Soyad
                          </Typography>
                        </div>
                      </div>

                      <div className="border-t pt-4">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <EnvelopeIcon className="h-5 w-5 text-gray-400" />
                            <Typography variant="small" color="gray">
                              E-posta
                            </Typography>
                          </div>
                          <Button
                            size="sm"
                            variant="outlined"
                            onClick={handleEmailClick}
                          >
                            E-posta Gönder
                          </Button>
                        </div>
                        <Typography variant="small" className="font-medium">
                          {contact.email}
                        </Typography>
                      </div>

                      <div className="border-t pt-4">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <PhoneIcon className="h-5 w-5 text-gray-400" />
                            <Typography variant="small" color="gray">
                              Telefon
                            </Typography>
                          </div>
                          <Button
                            size="sm"
                            variant="outlined"
                            onClick={handlePhoneClick}
                          >
                            Ara
                          </Button>
                        </div>
                        <Typography variant="small" className="font-medium">
                          {contact.phone}
                        </Typography>
                      </div>

                      {contact.createdAt && (
                        <div className="border-t pt-4">
                          <div className="flex items-center gap-2 mb-2">
                            <CalendarDaysIcon className="h-5 w-5 text-gray-400" />
                            <Typography variant="small" color="gray">
                              Gönderim Tarihi
                            </Typography>
                          </div>
                          <Typography variant="small" className="font-medium">
                            {formatDate(contact.createdAt)}
                          </Typography>
                        </div>
                      )}
                    </div>
                  </CardBody>
                </Card>
              </div>

              {/* Message Content */}
              <div className="lg:col-span-2">
                <Card className="shadow-lg">
                  <CardBody className="p-6">
                    <div className="flex items-center gap-3 mb-6">
                      <ChatBubbleLeftRightIcon className="h-6 w-6 text-pink-600" />
                      <Typography variant="h5" color="blue-gray">
                        Mesaj İçeriği
                      </Typography>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-6">
                      <Typography className="whitespace-pre-wrap leading-relaxed">
                        {contact.mesaage}
                      </Typography>
                    </div>

                    <div className="mt-6 flex flex-col sm:flex-row gap-4">
                      <Button
                        className="bg-gradient-to-r from-pink-500 to-purple-600"
                        onClick={handleEmailClick}
                      >
                        <EnvelopeIcon className="h-5 w-5 mr-2" />
                        E-posta ile Yanıtla
                      </Button>
                      <Button
                        variant="outlined"
                        onClick={handlePhoneClick}
                      >
                        <PhoneIcon className="h-5 w-5 mr-2" />
                        Telefon ile İletişim
                      </Button>
                    </div>
                  </CardBody>
                </Card>

                {/* Quick Actions */}
                <Card className="shadow-lg mt-6">
                  <CardBody className="p-6">
                    <Typography variant="h6" color="blue-gray" className="mb-4">
                      Hızlı İşlemler
                    </Typography>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <Button
                        variant="outlined"
                        className="flex items-center justify-center gap-2"
                        onClick={() => {
                          navigator.clipboard.writeText(contact.email);
                          // Toast notification eklenebilir
                        }}
                      >
                        E-postayı Kopyala
                      </Button>
                      <Button
                        variant="outlined"
                        className="flex items-center justify-center gap-2"
                        onClick={() => {
                          navigator.clipboard.writeText(contact.phone);
                          // Toast notification eklenebilir
                        }}
                      >
                        Telefonu Kopyala
                      </Button>
                      <Button
                        variant="outlined"
                        className="flex items-center justify-center gap-2"
                        onClick={() => {
                          navigator.clipboard.writeText(contact.mesaage);
                          // Toast notification eklenebilir
                        }}
                      >
                        Mesajı Kopyala
                      </Button>
                      <Button
                        variant="outlined"
                        className="flex items-center justify-center gap-2"
                        onClick={() => {
                          const contactInfo = `Ad: ${contact.name} ${contact.surName}\nE-posta: ${contact.email}\nTelefon: ${contact.phone}\nMesaj: ${contact.mesaage}`;
                          navigator.clipboard.writeText(contactInfo);
                          // Toast notification eklenebilir
                        }}
                      >
                        Tümünü Kopyala
                      </Button>
                    </div>
                  </CardBody>
                </Card>
              </div>
            </div>
          )}
        </div>
      </AdminLayout>
    </ProtectedRoute>
  );
}