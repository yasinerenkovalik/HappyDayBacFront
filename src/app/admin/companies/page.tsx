// @ts-nocheck
"use client";

import React, { useState, useEffect } from "react";
import {
  Card,
  CardBody,
  Typography,
  Button,
  IconButton,
  Alert
} from "@material-tailwind/react";
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
  ExclamationTriangleIcon
} from "@heroicons/react/24/outline";
import AdminLayout from "../components/AdminLayout";
import ProtectedRoute from "../components/ProtectedRoute";
import { getAllCompanies, Company } from "@/lib/auth";

export default function CompaniesPage() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch companies from API
  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        setLoading(true);
        const response = await getAllCompanies();

        if (response.isSuccess) {
          setCompanies(response.data);
        } else {
          setError(response.message || "Şirketler yüklenirken hata oluştu");
        }
      } catch (error) {
        console.error("Error fetching companies:", error);
        setError("Bağlantı hatası. Lütfen tekrar deneyin.");
      } finally {
        setLoading(false);
      }
    };

    fetchCompanies();
  }, []);

  const handleDelete = (id: string) => {
    setCompanies(prev => prev.filter(comp => comp.id !== id));
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
              Şirket Yönetimi
            </Typography>
            <Typography
              color="gray"
              className="text-sm sm:text-base"
              placeholder={undefined}
              onPointerEnterCapture={undefined}
              onPointerLeaveCapture={undefined}
            >
              Tüm şirketleri görüntüleyin ve yönetin
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

          {/* Companies Table */}
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
                  Şirketler ({companies.length})
                </Typography>
                <Button
                  className="flex items-center justify-center gap-2 bg-gradient-to-r from-pink-500 to-purple-600 w-full sm:w-auto"
                  size="sm"
                  placeholder={undefined}
                  onPointerEnterCapture={undefined}
                  onPointerLeaveCapture={undefined}
                >
                  <PlusIcon className="h-4 w-4" />
                  <span className="hidden sm:inline">Yeni Şirket Ekle</span>
                  <span className="sm:hidden">Yeni Şirket</span>
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
                    Şirketler yükleniyor...
                  </Typography>
                </div>
              ) : companies.length === 0 ? (
                <div className="text-center py-12">
                  <Typography
                    color="gray"
                    className="text-lg"
                    placeholder={undefined}
                    onPointerEnterCapture={undefined}
                    onPointerLeaveCapture={undefined}
                  >
                    Henüz şirket bulunamadı.
                  </Typography>
                  <Typography
                    variant="small"
                    color="gray"
                    className="mt-2"
                    placeholder={undefined}
                    onPointerEnterCapture={undefined}
                    onPointerLeaveCapture={undefined}
                  >
                    Yeni şirket eklemek için yukarıdaki butonu kullanın.
                  </Typography>
                </div>
              ) : (
                <>
                  {/* Desktop Table View */}
                  <div className="hidden lg:block overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-gray-200">
                          <th className="text-left py-4 px-4 font-semibold text-gray-700">Şirket Adı</th>
                          <th className="text-left py-4 px-4 font-semibold text-gray-700">E-posta</th>
                          <th className="text-left py-4 px-4 font-semibold text-gray-700">Telefon</th>
                          <th className="text-left py-4 px-4 font-semibold text-gray-700">Adres</th>
                          <th className="text-left py-4 px-4 font-semibold text-gray-700">Açıklama</th>
                          <th className="text-left py-4 px-4 font-semibold text-gray-700">İşlemler</th>
                        </tr>
                      </thead>
                      <tbody>
                        {companies.map((company, index) => (
                          <tr
                            key={company.id}
                            className={`border-b border-gray-100 hover:bg-gray-50 transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'
                              }`}
                          >
                            <td className="py-4 px-4">
                              <div>
                                <Typography
                                  variant="small"
                                  className="font-semibold text-gray-900"
                                  placeholder={undefined}
                                  onPointerEnterCapture={undefined}
                                  onPointerLeaveCapture={undefined}
                                >
                                  {company.name}
                                </Typography>
                                <Typography
                                  variant="small"
                                  className="text-gray-500 text-xs"
                                  placeholder={undefined}
                                  onPointerEnterCapture={undefined}
                                  onPointerLeaveCapture={undefined}
                                >
                                  ID: {company.id.slice(0, 8)}...
                                </Typography>
                              </div>
                            </td>
                            <td className="py-4 px-4">
                              <Typography
                                variant="small"
                                className="text-gray-700"
                                placeholder={undefined}
                                onPointerEnterCapture={undefined}
                                onPointerLeaveCapture={undefined}
                              >
                                {company.email}
                              </Typography>
                            </td>
                            <td className="py-4 px-4">
                              <Typography
                                variant="small"
                                className="text-gray-700"
                                placeholder={undefined}
                                onPointerEnterCapture={undefined}
                                onPointerLeaveCapture={undefined}
                              >
                                {company.phoneNumber}
                              </Typography>
                            </td>
                            <td className="py-4 px-4">
                              <Typography
                                variant="small"
                                className="text-gray-700 max-w-xs truncate"
                                placeholder={undefined}
                                onPointerEnterCapture={undefined}
                                onPointerLeaveCapture={undefined}
                              >
                                {company.adress}
                              </Typography>
                            </td>
                            <td className="py-4 px-4">
                              <Typography
                                variant="small"
                                className="text-gray-700 max-w-xs truncate"
                                placeholder={undefined}
                                onPointerEnterCapture={undefined}
                                onPointerLeaveCapture={undefined}
                              >
                                {company.description}
                              </Typography>
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
                                  onClick={() => window.location.href = `/admin/companies/edit/${company.id}`}
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
                                  onClick={() => handleDelete(company.id)}
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
                  <div className="lg:hidden space-y-4">
                    {companies.map((company) => (
                      <Card
                        key={company.id}
                        className="shadow-sm border border-gray-200"
                        placeholder={undefined}
                        onPointerEnterCapture={undefined}
                        onPointerLeaveCapture={undefined}
                      >
                        <CardBody
                          className="p-4"
                          placeholder={undefined}
                          onPointerEnterCapture={undefined}
                          onPointerLeaveCapture={undefined}
                        >
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex-1 min-w-0">
                              <Typography
                                variant="h6"
                                className="font-semibold text-gray-900 mb-1"
                                placeholder={undefined}
                                onPointerEnterCapture={undefined}
                                onPointerLeaveCapture={undefined}
                              >
                                {company.name}
                              </Typography>
                              <Typography
                                variant="small"
                                color="gray"
                                className="text-xs mb-2"
                                placeholder={undefined}
                                onPointerEnterCapture={undefined}
                                onPointerLeaveCapture={undefined}
                              >
                                ID: {company.id.slice(0, 8)}...
                              </Typography>
                            </div>
                            <div className="flex items-center gap-1 ml-2">
                              <IconButton
                                variant="text"
                                color="blue"
                                size="sm"
                                className="hover:bg-blue-50"
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
                                className="hover:bg-green-50"
                                onClick={() => window.location.href = `/admin/companies/edit/${company.id}`}
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
                                className="hover:bg-red-50"
                                onClick={() => handleDelete(company.id)}
                                placeholder={undefined}
                                onPointerEnterCapture={undefined}
                                onPointerLeaveCapture={undefined}
                              >
                                <TrashIcon className="h-4 w-4" />
                              </IconButton>
                            </div>
                          </div>

                          {/* Company Info Grid */}
                          <div className="space-y-3">
                            <div>
                              <Typography
                                variant="small"
                                color="gray"
                                className="text-xs font-medium mb-1"
                                placeholder={undefined}
                                onPointerEnterCapture={undefined}
                                onPointerLeaveCapture={undefined}
                              >
                                E-posta
                              </Typography>
                              <Typography
                                variant="small"
                                className="font-medium text-blue-600"
                                placeholder={undefined}
                                onPointerEnterCapture={undefined}
                                onPointerLeaveCapture={undefined}
                              >
                                {company.email}
                              </Typography>
                            </div>

                            <div>
                              <Typography
                                variant="small"
                                color="gray"
                                className="text-xs font-medium mb-1"
                                placeholder={undefined}
                                onPointerEnterCapture={undefined}
                                onPointerLeaveCapture={undefined}
                              >
                                Telefon
                              </Typography>
                              <Typography
                                variant="small"
                                className="font-medium"
                                placeholder={undefined}
                                onPointerEnterCapture={undefined}
                                onPointerLeaveCapture={undefined}
                              >
                                {company.phoneNumber}
                              </Typography>
                            </div>

                            <div>
                              <Typography
                                variant="small"
                                color="gray"
                                className="text-xs font-medium mb-1"
                                placeholder={undefined}
                                onPointerEnterCapture={undefined}
                                onPointerLeaveCapture={undefined}
                              >
                                Adres
                              </Typography>
                              <Typography
                                variant="small"
                                className="font-medium line-clamp-2"
                                placeholder={undefined}
                                onPointerEnterCapture={undefined}
                                onPointerLeaveCapture={undefined}
                              >
                                {company.adress}
                              </Typography>
                            </div>

                            {company.description && (
                              <div>
                                <Typography
                                  variant="small"
                                  color="gray"
                                  className="text-xs font-medium mb-1"
                                  placeholder={undefined}
                                  onPointerEnterCapture={undefined}
                                  onPointerLeaveCapture={undefined}
                                >
                                  Açıklama
                                </Typography>
                                <Typography
                                  variant="small"
                                  className="text-gray-600 line-clamp-2"
                                  placeholder={undefined}
                                  onPointerEnterCapture={undefined}
                                  onPointerLeaveCapture={undefined}
                                >
                                  {company.description}
                                </Typography>
                              </div>
                            )}
                          </div>
                        </CardBody>
                      </Card>
                    ))}
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