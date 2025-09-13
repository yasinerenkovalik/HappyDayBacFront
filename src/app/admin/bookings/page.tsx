// @ts-nocheck
"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  Card,
  CardBody,
  Typography,
  Button,
  Alert,
  Chip,
  IconButton
} from "@material-tailwind/react";
import {
  EyeIcon,
  EnvelopeIcon,
  PhoneIcon,
  UserIcon,
  CalendarDaysIcon,
  BuildingOfficeIcon
} from "@heroicons/react/24/outline";
import AdminLayout from "../components/AdminLayout";
import ProtectedRoute from "../components/ProtectedRoute";
import { getAuthToken, parseJWT } from "@/lib/auth";
import { getEmailLink, getPhoneLink } from "@/constants/contact";

interface CompanyContactMessage {
  fullName: string;
  phone: string;
  email: string;
  message: string;
  organizationId: string;
  companyId: string;
  createdAt?: string;
}

export default function BookingsPage() {
  const [messages, setMessages] = useState<CompanyContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [companyId, setCompanyId] = useState<string | null>(null);
  const [initialized, setInitialized] = useState(false);

  // JWT'den companyId'yi al - sadece bir kez
  useEffect(() => {
    if (initialized) return;
    
    const token = getAuthToken();
    if (token) {
      const tokenPayload = parseJWT(token);
      if (tokenPayload && tokenPayload.CompanyId) {
        console.log('🏢 Company ID from token:', tokenPayload.CompanyId);
        setCompanyId(tokenPayload.CompanyId);
      } else {
        setError("Şirket bilgisi bulunamadı. Lütfen tekrar giriş yapın.");
        setLoading(false);
      }
    } else {
      setError("Oturum bilgisi bulunamadı. Lütfen giriş yapın.");
      setLoading(false);
    }
    setInitialized(true);
  }, [initialized]);

  // Fetch company contact messages - sadece companyId değiştiğinde çalışır
  const fetchCompanyMessages = useCallback(async () => {
    if (!companyId || !initialized) {
      console.log('⏸️ Skipping fetch - companyId:', companyId, 'initialized:', initialized);
      return;
    }

    try {
      setLoading(true);
      setError("");

      const token = getAuthToken();
      const headers: Record<string, string> = {};
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      console.log('🔍 Fetching company messages for company ID:', companyId);

      // FormData oluştur
      const formData = new FormData();
      formData.append('CompanyId', companyId);

      const response = await fetch('/api/proxy/ContactMessage/CompanyContactMessage', {
        method: 'POST',
        headers,
        body: formData
      });

      console.log('📡 Response status:', response.status);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log('📡 API Response:', result);

      if (result.isSuccess && result.data) {
        setMessages(Array.isArray(result.data) ? result.data : []);
        console.log('✅ Company messages loaded:', result.data.length);
      } else {
        console.warn('⚠️ No messages found:', result.message);
        setMessages([]);
        if (result.message) {
          setError(result.message);
        }
      }
    } catch (error) {
      console.error('❌ Error fetching company messages:', error);
      setError('İletişim mesajları yüklenirken hata oluştu: ' + (error as Error).message);
      setMessages([]);
    } finally {
      setLoading(false);
    }
  }, [companyId, initialized]);

  // İlk yükleme - sadece companyId set edildiğinde çalışır
  useEffect(() => {
    if (companyId && initialized) {
      console.log('🚀 Initial fetch triggered for companyId:', companyId);
      fetchCompanyMessages();
    }
  }, [companyId, initialized]); // fetchCompanyMessages'i dependency'den çıkardık

  // Manuel refresh fonksiyonu
  const handleRefresh = () => {
    if (companyId && initialized) {
      console.log('🔄 Manual refresh triggered');
      fetchCompanyMessages();
    }
  };

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

  const handleEmailClick = (email: string, fullName: string) => {
    const subject = 'MutluGünüm.com - Rezervasyon Yanıtı';
    const body = `Merhaba ${fullName},\n\nMesajınız için teşekkür ederiz.\n\n`;
    window.open(getEmailLink(email, subject, body), '_blank');
  };

  const handlePhoneClick = (phone: string) => {
    window.open(getPhoneLink(phone), '_blank');
  };

  return (
    <ProtectedRoute requiredUserType="company">
      <AdminLayout userType="company">
        <div className="p-6">
          {/* Header */}
          <div className="mb-8 flex items-center justify-between">
            <div>
              <Typography variant="h3" color="blue-gray" className="mb-2">
                Rezervasyon Talepleri
              </Typography>
              <Typography color="gray">
                Organizasyonlarınız için gelen iletişim ve rezervasyon taleplerini görüntüleyin
              </Typography>
            </div>
            <Button
              onClick={handleRefresh}
              className="bg-gradient-to-r from-pink-500 to-purple-600"
              disabled={loading || !companyId}
            >
              {loading ? "Yükleniyor..." : "Yenile"}
            </Button>
          </div>

          {error && (
            <Alert color="red" className="mb-6">
              {error}
            </Alert>
          )}

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="shadow-lg">
              <CardBody className="p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <EnvelopeIcon className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <Typography variant="h4" color="blue-gray">
                      {messages.length}
                    </Typography>
                    <Typography color="gray">
                      Toplam Talep
                    </Typography>
                  </div>
                </div>
              </CardBody>
            </Card>

            <Card className="shadow-lg">
              <CardBody className="p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <UserIcon className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <Typography variant="h4" color="blue-gray">
                      {new Set(messages.map(m => m.email)).size}
                    </Typography>
                    <Typography color="gray">
                      Benzersiz Müşteri
                    </Typography>
                  </div>
                </div>
              </CardBody>
            </Card>

            <Card className="shadow-lg">
              <CardBody className="p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                    <CalendarDaysIcon className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <Typography variant="h4" color="blue-gray">
                      {messages.filter(m => {
                        if (!m.createdAt) return false;
                        const today = new Date();
                        const messageDate = new Date(m.createdAt);
                        return messageDate.toDateString() === today.toDateString();
                      }).length}
                    </Typography>
                    <Typography color="gray">
                      Bugünkü Talepler
                    </Typography>
                  </div>
                </div>
              </CardBody>
            </Card>
          </div>

          {/* Messages List */}
          <Card className="shadow-lg">
            <CardBody className="p-0">
              {loading ? (
                <div className="text-center py-12">
                  <div className="flex items-center justify-center space-x-2">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-500"></div>
                    <Typography>Yükleniyor...</Typography>
                  </div>
                </div>
              ) : messages.length === 0 ? (
                <div className="text-center py-12">
                  <EnvelopeIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <Typography variant="h6" color="gray">
                    Henüz rezervasyon talebi bulunmuyor.
                  </Typography>
                  <Typography color="gray" className="mt-2">
                    Müşteriler organizasyonlarınız için iletişime geçtiğinde burada görünecek.
                  </Typography>
                </div>
              ) : (
                <>
                  {/* Mobile: card list */}
                  <div className="block md:hidden divide-y divide-gray-200">
                    {messages.map((message, index) => (
                      <div key={index} className="p-4">
                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                            <UserIcon className="h-5 w-5 text-white" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center justify-between">
                              <Typography className="font-medium text-gray-900 truncate">
                                {message.fullName}
                              </Typography>
                              {message.createdAt && (
                                <Typography variant="small" color="gray" className="ml-2 flex-shrink-0">
                                  {formatDate(message.createdAt)}
                                </Typography>
                              )}
                            </div>
                            <div className="mt-2 space-y-1">
                              <div className="flex items-center gap-2 text-sm text-gray-600">
                                <EnvelopeIcon className="h-4 w-4 text-gray-400" />
                                <span className="truncate">{message.email}</span>
                              </div>
                              <div className="flex items-center gap-2 text-sm text-gray-600">
                                <PhoneIcon className="h-4 w-4 text-gray-400" />
                                <span className="truncate">{message.phone}</span>
                              </div>
                              <div className="text-sm text-gray-700 line-clamp-2">
                                {message.message}
                              </div>
                              <div className="flex items-center gap-2 text-sm text-gray-600">
                                <BuildingOfficeIcon className="h-4 w-4 text-gray-400" />
                                <span className="truncate">{message.organizationId.substring(0, 8)}...</span>
                              </div>
                            </div>
                            <div className="mt-3 flex items-center gap-2">
                              <Button
                                size="sm"
                                variant="outlined"
                                className="flex items-center gap-1"
                                onClick={() => handleEmailClick(message.email, message.fullName)}
                              >
                                <EnvelopeIcon className="h-4 w-4" />
                                E-posta
                              </Button>
                              <Button
                                size="sm"
                                variant="outlined"
                                className="flex items-center gap-1"
                                onClick={() => handlePhoneClick(message.phone)}
                              >
                                <PhoneIcon className="h-4 w-4" />
                                Ara
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Desktop: table */}
                  <div className="hidden md:block overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Müşteri Bilgileri</th>
                          <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">İletişim</th>
                          <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mesaj Önizleme</th>
                          <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Organizasyon</th>
                          <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">İşlemler</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {messages.map((message, index) => (
                          <tr key={index} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <div className="w-10 h-10 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full flex items-center justify-center">
                                  <UserIcon className="h-5 w-5 text-white" />
                                </div>
                                <div className="ml-4">
                                  <Typography variant="small" className="font-medium text-gray-900">{message.fullName}</Typography>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                  <EnvelopeIcon className="h-4 w-4 text-gray-400" />
                                  <Typography variant="small" color="gray">{message.email}</Typography>
                                </div>
                                <div className="flex items-center gap-2">
                                  <PhoneIcon className="h-4 w-4 text-gray-400" />
                                  <Typography variant="small" color="gray">{message.phone}</Typography>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <Typography variant="small" color="gray" className="max-w-xs truncate">{message.message}</Typography>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center gap-2">
                                <BuildingOfficeIcon className="h-4 w-4 text-gray-400" />
                                <Typography variant="small" color="gray">{message.organizationId.substring(0, 8)}...</Typography>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center gap-2">
                                <Button size="sm" variant="outlined" className="flex items-center gap-1" onClick={() => handleEmailClick(message.email, message.fullName)}>
                                  <EnvelopeIcon className="h-4 w-4" />E-posta
                                </Button>
                                <Button size="sm" variant="outlined" className="flex items-center gap-1" onClick={() => handlePhoneClick(message.phone)}>
                                  <PhoneIcon className="h-4 w-4" />Ara
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </>
              )}
            </CardBody>
          </Card>
        </div>
      </AdminLayout>
    </ProtectedRoute>
  );
}