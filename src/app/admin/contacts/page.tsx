// @ts-nocheck
"use client";

import React, { useState, useEffect } from "react";
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
  CalendarDaysIcon
} from "@heroicons/react/24/outline";
import AdminLayout from "../components/AdminLayout";
import ProtectedRoute from "../components/ProtectedRoute";
import { getAuthToken } from "@/lib/auth";

interface Contact {
  id: string;
  name: string;
  surName: string;
  email: string;
  phone: string;
  mesaage: string;
  createdAt?: string;
}

export default function ContactsPage() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch contacts
  const fetchContacts = async () => {
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

      console.log('🔍 Fetching contacts...');

      const response = await fetch('/api/proxy/Concat/ContactGetAll', {
        method: 'GET',
        headers
      });

      console.log('📡 Response status:', response.status);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log('📡 API Response:', result);

      if (result.isSuccess && result.data) {
        setContacts(Array.isArray(result.data) ? result.data : []);
        console.log('✅ Contacts loaded:', result.data.length);
      } else {
        console.warn('⚠️ No contacts found:', result.message);
        setContacts([]);
        if (result.message) {
          setError(result.message);
        }
      }
    } catch (error) {
      console.error('❌ Error fetching contacts:', error);
      setError('İletişim mesajları yüklenirken hata oluştu: ' + error.message);
      setContacts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, []);

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

  return (
    <ProtectedRoute requiredUserType="admin">
      <AdminLayout userType="admin">
        <div className="p-6">
          {/* Header */}
          <div className="mb-8 flex items-center justify-between">
            <div>
              <Typography variant="h3" color="blue-gray" className="mb-2">
                İletişim Mesajları
              </Typography>
              <Typography color="gray">
                Kullanıcılardan gelen iletişim mesajlarını görüntüleyin ve yönetin
              </Typography>
            </div>
            <Button
              onClick={fetchContacts}
              className="bg-gradient-to-r from-pink-500 to-purple-600"
              disabled={loading}
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
                      {contacts.length}
                    </Typography>
                    <Typography color="gray">
                      Toplam Mesaj
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
                      {new Set(contacts.map(c => c.email)).size}
                    </Typography>
                    <Typography color="gray">
                      Benzersiz Kullanıcı
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
                      {contacts.filter(c => {
                        if (!c.createdAt) return false;
                        const today = new Date();
                        const messageDate = new Date(c.createdAt);
                        return messageDate.toDateString() === today.toDateString();
                      }).length}
                    </Typography>
                    <Typography color="gray">
                      Bugünkü Mesajlar
                    </Typography>
                  </div>
                </div>
              </CardBody>
            </Card>
          </div>

          {/* Contacts List */}
          <Card className="shadow-lg">
            <CardBody className="p-0">
              {loading ? (
                <div className="text-center py-12">
                  <div className="flex items-center justify-center space-x-2">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-500"></div>
                    <Typography>Yükleniyor...</Typography>
                  </div>
                </div>
              ) : contacts.length === 0 ? (
                <div className="text-center py-12">
                  <EnvelopeIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <Typography variant="h6" color="gray">
                    Henüz iletişim mesajı bulunmuyor.
                  </Typography>
                  <Typography color="gray" className="mt-2">
                    Kullanıcılar iletişim formu doldurduğunda burada görünecek.
                  </Typography>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Kişi Bilgileri
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          İletişim
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Mesaj Önizleme
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Tarih
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          İşlemler
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {contacts.map((contact) => (
                        <tr key={contact.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="w-10 h-10 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full flex items-center justify-center">
                                <UserIcon className="h-5 w-5 text-white" />
                              </div>
                              <div className="ml-4">
                                <Typography variant="small" className="font-medium text-gray-900">
                                  {contact.name} {contact.surName}
                                </Typography>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <EnvelopeIcon className="h-4 w-4 text-gray-400" />
                                <Typography variant="small" color="gray">
                                  {contact.email}
                                </Typography>
                              </div>
                              <div className="flex items-center gap-2">
                                <PhoneIcon className="h-4 w-4 text-gray-400" />
                                <Typography variant="small" color="gray">
                                  {contact.phone}
                                </Typography>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <Typography variant="small" color="gray" className="max-w-xs truncate">
                              {contact.mesaage}
                            </Typography>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <Typography variant="small" color="gray">
                              {formatDate(contact.createdAt)}
                            </Typography>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <Button
                              size="sm"
                              variant="outlined"
                              className="flex items-center gap-2"
                              onClick={() => window.open(`/admin/contacts/${contact.id}`, '_blank')}
                            >
                              <EyeIcon className="h-4 w-4" />
                              Detay
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardBody>
          </Card>
        </div>
      </AdminLayout>
    </ProtectedRoute>
  );
}