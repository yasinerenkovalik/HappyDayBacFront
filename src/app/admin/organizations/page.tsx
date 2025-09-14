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
        <div className="p-4 sm:p-6">
          {/* Header */}
          <div className="mb-6 sm:mb-8">
            <Typography
              variant="h3"
              color="blue-gray"
              className="mb-2 text-2xl sm:text-3xl"
              placeholder={undefined}
              onPointerEnterCapture={undefined}
              onPointerLeaveCapture={undefined}
            >
              Organizasyon Yönetimi
            </Typography>
            <Typography
              color="gray"
              className="text-sm sm:text-base"
              placeholder={undefined}
              onPointerEnterCapture={undefined}
              onPointerLeaveCapture={undefined}
            >
              Tüm organizasyonları görüntüleyin ve yönetin
            </Typography>
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
              className="p-4 sm:p-6"
              placeholder={undefined}
              onPointerEnterCapture={undefined}
              onPointerLeaveCapture={undefined}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <Typography
                  variant="h5"
                  color="blue-gray"
                  className="text-lg sm:text-xl"
                  placeholder={undefined}
                  onPointerEnterCapture={undefined}
                  onPointerLeaveCapture={undefined}
                >
                  Organizasyonlar ({organizations.length})
                </Typography>
                <Button
                  className="flex items-center justify-center gap-2 bg-gradient-to-r from-pink-500 to-purple-600 w-full sm:w-auto"
                  size="sm"
                  placeholder={undefined}
                  onPointerEnterCapture={undefined}
                  onPointerLeaveCapture={undefined}
                >
                  <PlusIcon className="h-4 w-4" />
                  <span className="hidden sm:inline">Yeni Organizasyon Ekle</span>
                  <span className="sm:hidden">Yeni Ekle</span>
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
                <>
                  {/* Desktop Table View */}
                  <div className="hidden md:block overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-gray-200">
                          <th className="text-left py-3 px-4 font-semibold text-gray-700">Organizasyon</th>
                          <th className="text-left py-3 px-4 font-semibold text-gray-700">Şirket</th>
                          <th className="text-left py-3 px-4 font-semibold text-gray-700">Fiyat</th>
                          <th className="text-left py-3 px-4 font-semibold text-gray-700">Kapasite</th>
                          <th className="text-left py-3 px-4 font-semibold text-gray-700">Mekan</th>
                          <th className="text-left py-3 px-4 font-semibold text-gray-700">İşlemler</th>
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
                                  <img
                                    src={`/api/images/${org.coverPhotoPath.startsWith('/') ? org.coverPhotoPath.substring(1) : org.coverPhotoPath}`}
                                    alt={org.title}
                                    className="w-16 h-16 object-cover rounded-lg"
                                    onError={(e) => {
                                      console.log('❌ Image load error:', e.currentTarget.src);
                                      e.currentTarget.src = '/api/images/placeholder.jpg';
                                    }}
                                  />
                                ) : (
                                  <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                                    <PhotoIcon className="h-8 w-8 text-gray-400" />
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
                            <td className="py-3 px-4">
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
                            <td className="py-3 px-4">
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
                            <td className="py-3 px-4">
                              <Typography
                                variant="small"
                                placeholder={undefined}
                                onPointerEnterCapture={undefined}
                                onPointerLeaveCapture={undefined}
                              >
                                {org.maxGuestCount} kişi
                              </Typography>
                            </td>
                            <td className="py-3 px-4">
                              <Chip
                                value={org.isOutdoor ? "Dış" : "İç"}
                                color={org.isOutdoor ? "green" : "blue"}
                                size="sm"
                                variant="ghost"
                              />
                            </td>
                            <td className="py-3 px-4">
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
                  </div>

                  {/* Mobile Card View */}
                  <div className="md:hidden space-y-3">
                    {organizations.map((org) => (
                      <Card
                        key={org.id}
                        className="shadow-sm border border-gray-200"
                        placeholder={undefined}
                        onPointerEnterCapture={undefined}
                        onPointerLeaveCapture={undefined}
                      >
                        <CardBody
                          className="p-3"
                          placeholder={undefined}
                          onPointerEnterCapture={undefined}
                          onPointerLeaveCapture={undefined}
                        >
                          <div className="flex gap-3">
                            {/* Image */}
                            <div className="flex-shrink-0">
                              {org.coverPhotoPath ? (
                                <img
                                  src={`/api/images/${org.coverPhotoPath.startsWith('/') ? org.coverPhotoPath.substring(1) : org.coverPhotoPath}`}
                                  alt={org.title}
                                  className="w-20 h-20 object-cover rounded-lg"
                                  onError={(e) => {
                                    console.log('❌ Mobile image load error:', e.currentTarget.src);
                                    e.currentTarget.src = '/api/images/placeholder.jpg';
                                  }}
                                />
                              ) : (
                                <div className="w-20 h-20 bg-gray-200 rounded-lg flex items-center justify-center">
                                  <PhotoIcon className="h-8 w-8 text-gray-400" />
                                </div>
                              )}
                            </div>

                            {/* Content */}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between mb-2">
                                <div className="flex-1 min-w-0 pr-2">
                                  <Typography
                                    variant="small"
                                    className="font-semibold text-gray-900 truncate text-sm"
                                    placeholder={undefined}
                                    onPointerEnterCapture={undefined}
                                    onPointerLeaveCapture={undefined}
                                  >
                                    {org.title}
                                  </Typography>
                                  <Typography
                                    variant="small"
                                    className="text-gray-500 text-xs truncate"
                                    placeholder={undefined}
                                    onPointerEnterCapture={undefined}
                                    onPointerLeaveCapture={undefined}
                                  >
                                    {getCompanyName(org.companyId)}
                                  </Typography>
                                  <Typography
                                    variant="small"
                                    className="font-semibold text-green-600 text-sm"
                                    placeholder={undefined}
                                    onPointerEnterCapture={undefined}
                                    onPointerLeaveCapture={undefined}
                                  >
                                    ₺{org.price.toLocaleString()}
                                  </Typography>
                                </div>
                                <div className="flex items-center gap-1">
                                  <IconButton
                                    variant="text"
                                    color="blue"
                                    size="sm"
                                    className="p-1"
                                    placeholder={undefined}
                                    onPointerEnterCapture={undefined}
                                    onPointerLeaveCapture={undefined}
                                  >
                                    <EyeIcon className="h-4 w-4" />
                                  </IconButton>
                                  <IconButton
                                    variant="text"
                                    color="green"
                                    size="sm"
                                    onClick={() => window.location.href = `/admin/organizations/edit/${org.id}`}
                                    className="p-1"
                                    placeholder={undefined}
                                    onPointerEnterCapture={undefined}
                                    onPointerLeaveCapture={undefined}
                                  >
                                    <PencilIcon className="h-4 w-4" />
                                  </IconButton>
                                  <IconButton
                                    variant="text"
                                    color="red"
                                    size="sm"
                                    onClick={() => handleDelete(org.id)}
                                    className="p-1"
                                    placeholder={undefined}
                                    onPointerEnterCapture={undefined}
                                    onPointerLeaveCapture={undefined}
                                  >
                                    <TrashIcon className="h-4 w-4" />
                                  </IconButton>
                                </div>
                              </div>

                              {/* Compact Info */}
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                  <Typography
                                    variant="small"
                                    color="gray"
                                    className="text-xs"
                                    placeholder={undefined}
                                    onPointerEnterCapture={undefined}
                                    onPointerLeaveCapture={undefined}
                                  >
                                    {org.maxGuestCount} kişi
                                  </Typography>
                                  <Chip
                                    value={org.isOutdoor ? "Dış" : "İç"}
                                    color={org.isOutdoor ? "green" : "blue"}
                                    size="sm"
                                    className="text-xs px-2 py-1"
                                    variant="ghost"
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        </CardBody>
                      </Card>
                    ))}
                  </div>

                  {organizations.length === 0 && !loading && (
                    <div className="text-center py-12">
                      <PhotoIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                      <Typography
                        variant="h6"
                        color="gray"
                        className="mb-2"
                        placeholder={undefined}
                        onPointerEnterCapture={undefined}
                        onPointerLeaveCapture={undefined}
                      >
                        Henüz organizasyon bulunamadı
                      </Typography>
                      <Typography
                        variant="small"
                        color="gray"
                        className="mb-4"
                        placeholder={undefined}
                        onPointerEnterCapture={undefined}
                        onPointerLeaveCapture={undefined}
                      >
                        Yeni organizasyon eklemek için butona tıklayın
                      </Typography>
                    </div>
                  )}
                </>
              )}
            </CardBody>
          </Card>

          {/* Statistics Section */}
          {organizations.length > 0 && (
            <Card
              className="shadow-lg mt-4 sm:mt-6"
              placeholder={undefined}
              onPointerEnterCapture={undefined}
              onPointerLeaveCapture={undefined}
            >
              <CardBody
                className="p-4 sm:p-6"
                placeholder={undefined}
                onPointerEnterCapture={undefined}
                onPointerLeaveCapture={undefined}
              >
                <Typography
                  variant="h5"
                  color="blue-gray"
                  className="mb-4 text-lg sm:text-xl"
                  placeholder={undefined}
                  onPointerEnterCapture={undefined}
                  onPointerLeaveCapture={undefined}
                >
                  Organizasyon İstatistikleri
                </Typography>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
                  <div className="text-center p-3 sm:p-4 bg-blue-50 rounded-lg">
                    <Typography
                      variant="h4"
                      color="blue"
                      className="font-bold text-2xl sm:text-3xl"
                      placeholder={undefined}
                      onPointerEnterCapture={undefined}
                      onPointerLeaveCapture={undefined}
                    >
                      {organizations.length}
                    </Typography>
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className="text-xs sm:text-sm"
                      placeholder={undefined}
                      onPointerEnterCapture={undefined}
                      onPointerLeaveCapture={undefined}
                    >
                      Toplam
                    </Typography>
                  </div>
                  <div className="text-center p-3 sm:p-4 bg-green-50 rounded-lg">
                    <Typography
                      variant="h4"
                      color="green"
                      className="font-bold text-2xl sm:text-3xl"
                      placeholder={undefined}
                      onPointerEnterCapture={undefined}
                      onPointerLeaveCapture={undefined}
                    >
                      {organizations.filter(org => org.isOutdoor).length}
                    </Typography>
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className="text-xs sm:text-sm"
                      placeholder={undefined}
                      onPointerEnterCapture={undefined}
                      onPointerLeaveCapture={undefined}
                    >
                      Dış Mekan
                    </Typography>
                  </div>
                  <div className="text-center p-3 sm:p-4 bg-purple-50 rounded-lg">
                    <Typography
                      variant="h4"
                      color="purple"
                      className="font-bold text-xl sm:text-2xl"
                      placeholder={undefined}
                      onPointerEnterCapture={undefined}
                      onPointerLeaveCapture={undefined}
                    >
                      ₺{Math.round(organizations.reduce((sum, org) => sum + org.price, 0) / organizations.length).toLocaleString()}
                    </Typography>
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className="text-xs sm:text-sm"
                      placeholder={undefined}
                      onPointerEnterCapture={undefined}
                      onPointerLeaveCapture={undefined}
                    >
                      Ort. Fiyat
                    </Typography>
                  </div>
                  <div className="text-center p-3 sm:p-4 bg-pink-50 rounded-lg">
                    <Typography
                      variant="h4"
                      color="pink"
                      className="font-bold text-2xl sm:text-3xl"
                      placeholder={undefined}
                      onPointerEnterCapture={undefined}
                      onPointerLeaveCapture={undefined}
                    >
                      {Math.round(organizations.reduce((sum, org) => sum + org.maxGuestCount, 0) / organizations.length)}
                    </Typography>
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className="text-xs sm:text-sm"
                      placeholder={undefined}
                      onPointerEnterCapture={undefined}
                      onPointerLeaveCapture={undefined}
                    >
                      Ort. Kapasite
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