// @ts-nocheck
"use client";

import React, { useState, useEffect } from "react";
import {
  Card,
  CardBody,
  Typography,
  Button,
  IconButton,
  Chip,
  Alert,
  Avatar
} from "@material-tailwind/react";
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
  ExclamationTriangleIcon,
  MapPinIcon,
  UserGroupIcon,
  ClockIcon,
  PhotoIcon
} from "@heroicons/react/24/outline";
import AdminLayout from "../components/AdminLayout";
import ProtectedRoute from "../components/ProtectedRoute";
import { getAllOrganizations, getAllCompanies, Organization, Company } from "@/lib/auth";

export default function OrganizationsPage() {
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch organizations and companies from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [orgResponse, compResponse] = await Promise.all([
          getAllOrganizations(),
          getAllCompanies()
        ]);

        if (orgResponse.isSuccess) {
          setOrganizations(orgResponse.data);
        } else {
          setError(orgResponse.message || "Organizasyonlar yüklenirken hata oluştu");
        }

        if (compResponse.isSuccess) {
          setCompanies(compResponse.data);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Bağlantı hatası. Lütfen tekrar deneyin.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const getCompanyName = (companyId: string) => {
    const company = companies.find(c => c.id === companyId);
    return company ? company.name : "Bilinmeyen Şirket";
  };

  const handleDelete = (id: string) => {
    setOrganizations(prev => prev.filter(org => org.id !== id));
  };

  return (
    <ProtectedRoute requiredUserType="admin">
      <AdminLayout userType="admin">
        <div className="p-6">
          {/* Header */}
          <div className="mb-8 flex items-center justify-between">
            <div>
              <Typography
                variant="h3"
                color="blue-gray"
                className="mb-2"
                placeholder={undefined}
                onPointerEnterCapture={undefined}
                onPointerLeaveCapture={undefined}
              >
                Organizasyon Yönetimi
              </Typography>
              <Typography
                color="gray"
                placeholder={undefined}
                onPointerEnterCapture={undefined}
                onPointerLeaveCapture={undefined}
              >
                Tüm organizasyonları görüntüleyin ve yönetin
              </Typography>
            </div>
            <Button
              className="flex items-center gap-2 bg-gradient-to-r from-pink-500 to-purple-600"
              onClick={() => window.location.href = '/admin/organizations/create'}
              placeholder={undefined}
              onPointerEnterCapture={undefined}
              onPointerLeaveCapture={undefined}
            >
              <PlusIcon className="h-4 w-4" />
              Organizasyon Ekle
            </Button>
          </div>

          {/* Error Alert */}
          {error && (
            <Alert
              color="red"
              className="mb-6"
              icon={<ExclamationTriangleIcon className="h-6 w-6" />}
              onClose={() => setError("")}
            >
              {error}
            </Alert>
          )}

          {/* Organizations Table */}
          <Card
            className="shadow-lg"
            placeholder={undefined}
            onPointerEnterCapture={undefined}
            onPointerLeaveCapture={undefined}
          >
            <CardBody
              className="p-6"
              placeholder={undefined}
              onPointerEnterCapture={undefined}
              onPointerLeaveCapture={undefined}
            >
              <div className="flex items-center justify-between mb-6">
                <Typography
                  variant="h5"
                  color="blue-gray"
                  placeholder={undefined}
                  onPointerEnterCapture={undefined}
                  onPointerLeaveCapture={undefined}
                >
                  Organizasyonlar ({organizations.length})
                </Typography>
                <Button
                  className="flex items-center gap-2 bg-gradient-to-r from-pink-500 to-purple-600"
                  placeholder={undefined}
                  onPointerEnterCapture={undefined}
                  onPointerLeaveCapture={undefined}
                >
                  <PlusIcon className="h-4 w-4" />
                  Yeni Organizasyon Ekle
                </Button>
              </div>

              {loading ? (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto mb-4"></div>
                  <Typography
                    placeholder={undefined}
                    onPointerEnterCapture={undefined}
                    onPointerLeaveCapture={undefined}
                  >
                    Organizasyonlar yükleniyor...
                  </Typography>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-4 px-4 font-semibold text-gray-700">Organizasyon</th>
                        <th className="text-left py-4 px-4 font-semibold text-gray-700">Şirket</th>
                        <th className="text-left py-4 px-4 font-semibold text-gray-700">Fiyat</th>
                        <th className="text-left py-4 px-4 font-semibold text-gray-700">Detaylar</th>
                        <th className="text-left py-4 px-4 font-semibold text-gray-700">Mekan</th>
                        <th className="text-left py-4 px-4 font-semibold text-gray-700">İşlemler</th>
                      </tr>
                    </thead>
                    <tbody>
                      {organizations.map((org, index) => (
                        <tr
                          key={org.id}
                          className={`border-b border-gray-100 hover:bg-gray-50 transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'
                            }`}
                        >
                          <td className="py-4 px-4">
                            <div className="flex items-center gap-3">
                              {org.coverPhotoPath ? (
                                <Avatar
                                  src={`${process.env.NEXT_PUBLIC_IMAGE_BASE_URL}${org.coverPhotoPath}`}
                                  alt={org.title}
                                  size="md"
                                  className="rounded-lg"
                                  placeholder={undefined}
                                  onPointerEnterCapture={undefined}
                                  onPointerLeaveCapture={undefined}
                                />
                              ) : (
                                <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
                                  <PhotoIcon className="h-6 w-6 text-gray-400" />
                                </div>
                              )}
                              <div>
                                <Typography
                                  variant="small"
                                  className="font-semibold text-gray-900"
                                  placeholder={undefined}
                                  onPointerEnterCapture={undefined}
                                  onPointerLeaveCapture={undefined}
                                >
                                  {org.title}
                                </Typography>
                                <Typography
                                  variant="small"
                                  className="text-gray-500 text-xs max-w-xs truncate"
                                  placeholder={undefined}
                                  onPointerEnterCapture={undefined}
                                  onPointerLeaveCapture={undefined}
                                >
                                  {org.description}
                                </Typography>
                              </div>
                            </div>
                          </td>
                          <td className="py-4 px-4">
                            <Typography
                              variant="small"
                              className="text-gray-700 font-medium"
                              placeholder={undefined}
                              onPointerEnterCapture={undefined}
                              onPointerLeaveCapture={undefined}
                            >
                              {getCompanyName(org.companyId)}
                            </Typography>
                          </td>
                          <td className="py-4 px-4">
                            <Typography
                              variant="small"
                              className="font-semibold text-green-600"
                              placeholder={undefined}
                              onPointerEnterCapture={undefined}
                              onPointerLeaveCapture={undefined}
                            >
                              ₺{org.price.toLocaleString()}
                            </Typography>
                          </td>
                          <td className="py-4 px-4">
                            <div className="space-y-1">
                              <div className="flex items-center gap-1 text-xs text-gray-600">
                                <UserGroupIcon className="h-3 w-3" />
                                <span>Max {org.maxGuestCount} kişi</span>
                              </div>
                              <div className="flex items-center gap-1 text-xs text-gray-600">
                                <ClockIcon className="h-3 w-3" />
                                <span>{org.duration}</span>
                              </div>
                              {org.location && (
                                <div className="flex items-center gap-1 text-xs text-gray-600">
                                  <MapPinIcon className="h-3 w-3" />
                                  <span className="truncate max-w-20">{org.location}</span>
                                </div>
                              )}
                            </div>
                          </td>
                          <td className="py-4 px-4">
                            <Chip
                              value={org.isOutdoor ? "Dış Mekan" : "İç Mekan"}
                              color={org.isOutdoor ? "green" : "blue"}
                              size="sm"
                              variant="ghost"
                            />
                          </td>
                          <td className="py-4 px-4">
                            <div className="flex gap-2">
                              <IconButton
                                size="sm"
                                variant="text"
                                color="blue"
                                className="hover:bg-blue-50"
                                placeholder={undefined}
                                onPointerEnterCapture={undefined}
                                onPointerLeaveCapture={undefined}
                              >
                                <EyeIcon className="h-4 w-4" />
                              </IconButton>
                              <IconButton
                                size="sm"
                                variant="text"
                                color="green"
                                className="hover:bg-green-50"
                                onClick={() => window.location.href = `/admin/organizations/edit/${org.id}`}
                                placeholder={undefined}
                                onPointerEnterCapture={undefined}
                                onPointerLeaveCapture={undefined}
                              >
                                <PencilIcon className="h-4 w-4" />
                              </IconButton>
                              <IconButton
                                size="sm"
                                variant="text"
                                color="red"
                                className="hover:bg-red-50"
                                onClick={() => handleDelete(org.id)}
                                placeholder={undefined}
                                onPointerEnterCapture={undefined}
                                onPointerLeaveCapture={undefined}
                              >
                                <TrashIcon className="h-4 w-4" />
                              </IconButton>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  {organizations.length === 0 && !loading && (
                    <div className="text-center py-12">
                      <Typography
                        color="gray"
                        className="text-lg"
                        placeholder={undefined}
                        onPointerEnterCapture={undefined}
                        onPointerLeaveCapture={undefined}
                      >
                        Henüz organizasyon bulunamadı.
                      </Typography>
                      <Typography
                        variant="small"
                        color="gray"
                        className="mt-2"
                        placeholder={undefined}
                        onPointerEnterCapture={undefined}
                        onPointerLeaveCapture={undefined}
                      >
                        Yeni organizasyon eklemek için yukarıdaki butonu kullanın.
                      </Typography>
                    </div>
                  )}
                </div>
              )}
            </CardBody>
          </Card>

          {/* Services Section */}
          {organizations.length > 0 && (
            <Card
              className="shadow-lg mt-6"
              placeholder={undefined}
              onPointerEnterCapture={undefined}
              onPointerLeaveCapture={undefined}
            >
              <CardBody
                className="p-6"
                placeholder={undefined}
                onPointerEnterCapture={undefined}
                onPointerLeaveCapture={undefined}
              >
                <Typography
                  variant="h5"
                  color="blue-gray"
                  className="mb-4"
                  placeholder={undefined}
                  onPointerEnterCapture={undefined}
                  onPointerLeaveCapture={undefined}
                >
                  Organizasyon İstatistikleri
                </Typography>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <Typography
                      variant="h4"
                      color="blue"
                      className="font-bold"
                      placeholder={undefined}
                      onPointerEnterCapture={undefined}
                      onPointerLeaveCapture={undefined}
                    >
                      {organizations.length}
                    </Typography>
                    <Typography
                      variant="small"
                      color="blue-gray"
                      placeholder={undefined}
                      onPointerEnterCapture={undefined}
                      onPointerLeaveCapture={undefined}
                    >
                      Toplam Organizasyon
                    </Typography>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <Typography
                      variant="h4"
                      color="green"
                      className="font-bold"
                      placeholder={undefined}
                      onPointerEnterCapture={undefined}
                      onPointerLeaveCapture={undefined}
                    >
                      {organizations.filter(org => org.isOutdoor).length}
                    </Typography>
                    <Typography
                      variant="small"
                      color="blue-gray"
                      placeholder={undefined}
                      onPointerEnterCapture={undefined}
                      onPointerLeaveCapture={undefined}
                    >
                      Dış Mekan
                    </Typography>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <Typography
                      variant="h4"
                      color="purple"
                      className="font-bold"
                      placeholder={undefined}
                      onPointerEnterCapture={undefined}
                      onPointerLeaveCapture={undefined}
                    >
                      ₺{Math.round(organizations.reduce((sum, org) => sum + org.price, 0) / organizations.length).toLocaleString()}
                    </Typography>
                    <Typography
                      variant="small"
                      color="blue-gray"
                      placeholder={undefined}
                      onPointerEnterCapture={undefined}
                      onPointerLeaveCapture={undefined}
                    >
                      Ortalama Fiyat
                    </Typography>
                  </div>
                  <div className="text-center p-4 bg-pink-50 rounded-lg">
                    <Typography
                      variant="h4"
                      color="pink"
                      className="font-bold"
                      placeholder={undefined}
                      onPointerEnterCapture={undefined}
                      onPointerLeaveCapture={undefined}
                    >
                      {Math.round(organizations.reduce((sum, org) => sum + org.maxGuestCount, 0) / organizations.length)}
                    </Typography>
                    <Typography
                      variant="small"
                      color="blue-gray"
                      placeholder={undefined}
                      onPointerEnterCapture={undefined}
                      onPointerLeaveCapture={undefined}
                    >
                      Ortalama Kapasite
                    </Typography>
                  </div>
                </div>
              </CardBody>
            </Card>
          )}
        </div>
      </AdminLayout>
    </ProtectedRoute>
  );
}