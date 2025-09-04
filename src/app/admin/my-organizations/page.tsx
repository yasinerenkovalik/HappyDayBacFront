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
  IconButton,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter
} from "@material-tailwind/react";
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
  PhotoIcon,
  ExclamationTriangleIcon
} from "@heroicons/react/24/outline";
import { useRouter } from "next/navigation";
import AdminLayout from "../components/AdminLayout";
import ProtectedRoute from "../components/ProtectedRoute";
import { getCompanyOrganizations, Organization, getAuthToken } from "@/lib/auth";

export default function MyOrganizations() {
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [organizationToDelete, setOrganizationToDelete] = useState<Organization | null>(null);
  const [deleting, setDeleting] = useState(false);
  const router = useRouter();

  // Fetch company's organizations
  useEffect(() => {
    const fetchOrganizations = async () => {
      try {
        setLoading(true);
        const response = await getCompanyOrganizations();

        if (response.isSuccess) {
          // API'den gelen organizasyonlara varsayılan değerler ekle
          const organizationsWithDefaults = response.data.map(org => ({
            ...org,
            bookings: org.bookings || 0,
            rating: org.rating || 0,
            price: org.price || 0,
            maxGuestCount: org.maxGuestCount || 0,
            duration: org.duration || "Belirtilmemiş",
            reservationNote: org.reservationNote || "",
            cancelPolicy: org.cancelPolicy || "",
            videoUrl: org.videoUrl || "",
            companyId: org.companyId || ""
          }));

          setOrganizations(organizationsWithDefaults);
        } else {
          setError(response.message || "Organizasyonlar yüklenirken hata oluştu");
        }
      } catch (error) {
        console.error("Error fetching organizations:", error);
        setError("Bağlantı hatası. Lütfen tekrar deneyin.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrganizations();
  }, []);

  const handleDeleteClick = (organization: Organization) => {
    setOrganizationToDelete(organization);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!organizationToDelete) return;

    setDeleting(true);
    try {
      const token = getAuthToken();
      const headers: Record<string, string> = {
        'Content-Type': 'application/json'
      };
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch('/api/proxy/Organization/DeleteOrganization', {
        method: 'DELETE',
        headers,
        body: JSON.stringify({
          id: organizationToDelete.id
        })
      });

      const result = await response.json();

      if (response.ok && result.isSuccess) {
        // Başarılı silme işlemi
        setOrganizations(prev => prev.filter(org => org.id !== organizationToDelete.id));
        setDeleteDialogOpen(false);
        setOrganizationToDelete(null);
      } else {
        setError(result.message || 'Organizasyon silinirken hata oluştu');
      }
    } catch (error) {
      console.error('Delete error:', error);
      setError('Bağlantı hatası. Lütfen tekrar deneyin.');
    } finally {
      setDeleting(false);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setOrganizationToDelete(null);
  };

  const handleView = (id: string) => {
    window.open(`/organizations/${id}`, '_blank');
  };

  const handleEdit = (id: string) => {
    router.push(`/admin/organizations/edit/${id}`);
  };

  return (
    <ProtectedRoute requiredUserType="company">
      <AdminLayout userType="company">
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
              Organizasyonlarım
            </Typography>
            <Typography
              color="gray"
              className="text-sm sm:text-base"
              placeholder={undefined}
              onPointerEnterCapture={undefined}
              onPointerLeaveCapture={undefined}
            >
              Organizasyonlarınızı görüntüleyin ve yönetin
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

          {/* Organizations Card */}
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
                  Organizasyon Yönetimi ({organizations.length})
                </Typography>
                <Button
                  className="flex items-center justify-center gap-2 bg-gradient-to-r from-blue-500 to-indigo-600 w-full sm:w-auto"
                  size="sm"
                  onClick={() => router.push('/admin/organizations/create')}
                  placeholder={undefined}
                  onPointerEnterCapture={undefined}
                  onPointerLeaveCapture={undefined}
                >
                  <PlusIcon className="h-4 w-4" />
                  <span className="hidden sm:inline">Yeni Organizasyon</span>
                  <span className="sm:hidden">Yeni</span>
                </Button>
              </div>

              {loading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
                  <Typography
                    placeholder={undefined}
                    onPointerEnterCapture={undefined}
                    onPointerLeaveCapture={undefined}
                  >
                    Organizasyonlar yükleniyor...
                  </Typography>
                </div>
              ) : organizations.length === 0 ? (
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
                    Henüz organizasyon eklenmemiş
                  </Typography>
                  <Typography
                    color="gray"
                    className="mb-4"
                    placeholder={undefined}
                    onPointerEnterCapture={undefined}
                    onPointerLeaveCapture={undefined}
                  >
                    İlk organizasyonunuzu oluşturmak için butona tıklayın
                  </Typography>
                  <Button
                    className="bg-gradient-to-r from-blue-500 to-indigo-600"
                    onClick={() => router.push('/admin/organizations/create')}
                    placeholder={undefined}
                    onPointerEnterCapture={undefined}
                    onPointerLeaveCapture={undefined}
                  >
                    <PlusIcon className="h-4 w-4 mr-2" />
                    Yeni Organizasyon
                  </Button>
                </div>
              ) : (
                <>
                  {/* Desktop Table View */}
                  <div className="hidden md:block overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-gray-200">
                          <th className="text-left py-3 px-4">Organizasyon</th>
                          <th className="text-left py-3 px-4">Fiyat</th>
                          <th className="text-left py-3 px-4">Kapasite</th>
                          <th className="text-left py-3 px-4">Mekan</th>
                          <th className="text-left py-3 px-4">İşlemler</th>
                        </tr>
                      </thead>
                      <tbody>
                        {organizations.map((org, index) => (
                          <tr
                            key={org.id}
                            className={`border-b border-gray-100 hover:bg-gray-50 transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'
                              }`}
                          >
                            <td className="py-3 px-4">
                              <div className="flex items-center gap-3">
                                {org.coverPhotoPath ? (
                                  <img
                                    src={`${process.env.NEXT_PUBLIC_IMAGE_BASE_URL}${org.coverPhotoPath}`}
                                    alt={org.title}
                                    className="w-12 h-12 object-cover rounded-lg"
                                  />
                                ) : (
                                  <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
                                    <PhotoIcon className="h-6 w-6 text-gray-400" />
                                  </div>
                                )}
                                <div>
                                  <Typography
                                    variant="small"
                                    className="font-medium"
                                    placeholder={undefined}
                                    onPointerEnterCapture={undefined}
                                    onPointerLeaveCapture={undefined}
                                  >
                                    {org.title}
                                  </Typography>
                                  <Typography
                                    variant="small"
                                    color="gray"
                                    className="truncate max-w-xs"
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
                                className="font-medium text-green-600"
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
                                value={org.isOutdoor ? "Açık" : "Kapalı"}
                                color={org.isOutdoor ? "green" : "blue"}
                                size="sm"
                                className="w-fit"
                              />
                            </td>
                            <td className="py-3 px-4">
                              <div className="flex items-center gap-2">
                                <IconButton
                                  variant="text"
                                  color="blue"
                                  size="sm"
                                  onClick={() => handleView(org.id)}
                                  placeholder={undefined}
                                  onPointerEnterCapture={undefined}
                                  onPointerLeaveCapture={undefined}
                                >
                                  <EyeIcon className="h-4 w-4" />
                                </IconButton>
                                <IconButton
                                  variant="text"
                                  color="orange"
                                  size="sm"
                                  onClick={() => handleEdit(org.id)}
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
                                  onClick={() => handleDeleteClick(org)}
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
                                  src={`${process.env.NEXT_PUBLIC_IMAGE_BASE_URL}${org.coverPhotoPath}`}
                                  alt={org.title}
                                  className="w-14 h-14 object-cover rounded-lg"
                                />
                              ) : (
                                <div className="w-14 h-14 bg-gray-200 rounded-lg flex items-center justify-center">
                                  <PhotoIcon className="h-6 w-6 text-gray-400" />
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
                                    onClick={() => handleView(org.id)}
                                    className="p-1"
                                    placeholder={undefined}
                                    onPointerEnterCapture={undefined}
                                    onPointerLeaveCapture={undefined}
                                  >
                                    <EyeIcon className="h-4 w-4" />
                                  </IconButton>
                                  <IconButton
                                    variant="text"
                                    color="orange"
                                    size="sm"
                                    onClick={() => handleEdit(org.id)}
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
                                    onClick={() => handleDeleteClick(org)}
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
                                    value={org.isOutdoor ? "Açık" : "Kapalı"}
                                    color={org.isOutdoor ? "green" : "blue"}
                                    size="sm"
                                    className="text-xs px-2 py-1"
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        </CardBody>
                      </Card>
                    ))}
                  </div>
                </>
              )}

            </CardBody>
          </Card>

          {/* Delete Confirmation Dialog */}
          <Dialog
            open={deleteDialogOpen}
            handler={handleDeleteCancel}
            size="sm"
            placeholder={undefined}
            onPointerEnterCapture={undefined}
            onPointerLeaveCapture={undefined}
          >
            <DialogHeader
              placeholder={undefined}
              onPointerEnterCapture={undefined}
              onPointerLeaveCapture={undefined}
            >
              <div className="flex items-center gap-3">
                <ExclamationTriangleIcon className="h-6 w-6 text-red-500" />
                <Typography variant="h5" color="red">
                  Organizasyonu Sil
                </Typography>
              </div>
            </DialogHeader>
            <DialogBody
              placeholder={undefined}
              onPointerEnterCapture={undefined}
              onPointerLeaveCapture={undefined}
            >
              <Typography color="gray" className="font-normal">
                <strong>"{organizationToDelete?.title}"</strong> organizasyonunu silmek istediğinizden emin misiniz?
              </Typography>
              <Typography color="gray" className="font-normal mt-2 text-sm">
                Bu işlem geri alınamaz ve organizasyonla ilgili tüm veriler kalıcı olarak silinecektir.
              </Typography>
            </DialogBody>
            <DialogFooter
              className="space-x-2"
              placeholder={undefined}
              onPointerEnterCapture={undefined}
              onPointerLeaveCapture={undefined}
            >
              <Button
                variant="text"
                color="gray"
                onClick={handleDeleteCancel}
                disabled={deleting}
                placeholder={undefined}
                onPointerEnterCapture={undefined}
                onPointerLeaveCapture={undefined}
              >
                Hayır, İptal Et
              </Button>
              <Button
                variant="filled"
                color="red"
                onClick={handleDeleteConfirm}
                loading={deleting}
                disabled={deleting}
                placeholder={undefined}
                onPointerEnterCapture={undefined}
                onPointerLeaveCapture={undefined}
              >
                {deleting ? "Siliniyor..." : "Evet, Sil"}
              </Button>
            </DialogFooter>
          </Dialog>
        </div>
      </AdminLayout>
    </ProtectedRoute>
  );
}