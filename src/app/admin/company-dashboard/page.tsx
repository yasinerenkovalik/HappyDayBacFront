// @ts-nocheck
"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardBody,
  Typography,
  Button,
  Input,
  Textarea,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  IconButton,
  Chip,
  Select,
  Option,
  Alert
} from "@material-tailwind/react";
import {
  CalendarDaysIcon,
  UserGroupIcon,
  CurrencyDollarIcon,
  ChartBarIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
  PhotoIcon,
  ExclamationTriangleIcon
} from "@heroicons/react/24/outline";
import AdminLayout from "../components/AdminLayout";
import ProtectedRoute from "../components/ProtectedRoute";
import { getCompanyOrganizations, Organization } from "@/lib/auth";

// Mock data
const COMPANY_PROFILE = {
  id: 1,
  name: "Elit Organizasyon",
  email: "info@elitorg.com",
  phone: "0532 123 45 67",
  address: "Beşiktaş, İstanbul",
  description: "Profesyonel organizasyon hizmetleri sunuyoruz.",
  website: "www.elitorg.com",
  logo: "/image/company-logo.jpg"
};

const MY_ORGANIZATIONS = [
  {
    id: 1,
    title: "Kır Düğünü Paketi",
    price: 25000,
    category: "Düğün",
    status: "active",
    bookings: 15,
    rating: 4.8,
    images: ["/image/organizations/organizations1.jpg"]
  },
  {
    id: 2,
    title: "Lüks Nişan Organizasyonu",
    price: 18000,
    category: "Nişan",
    status: "active",
    bookings: 8,
    rating: 4.9,
    images: ["/image/organizations/organizations2.jpg"]
  },
  {
    id: 3,
    title: "Kına Gecesi Paketi",
    price: 12000,
    category: "Kına",
    status: "pending",
    bookings: 3,
    rating: 4.7,
    images: ["/image/organizations/organizations3.jpg"]
  }
];

export default function CompanyDashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [profile, setProfile] = useState(COMPANY_PROFILE);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editDialog, setEditDialog] = useState({ open: false, type: "", data: null });
  const [companyId, setCompanyId] = useState("");
  const [newOrganization, setNewOrganization] = useState({
    title: "",
    description: "",
    price: "",
    category: "",
    duration: "",
    maxGuests: "",
    location: "",
    isOutdoor: false
  });

  const router = useRouter();

  // Fetch company's organizations
  useEffect(() => {
    // Get company ID from localStorage
    const storedCompanyId = localStorage.getItem("companyId");
    if (storedCompanyId) {
      setCompanyId(storedCompanyId);
    }

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

  const stats = [
    {
      title: "Toplam Organizasyon",
      value: organizations.length,
      icon: CalendarDaysIcon,
      color: "bg-blue-500"
    },
    {
      title: "Toplam Rezervasyon",
      value: organizations.reduce((sum, org) => sum + (org.bookings || 0), 0),
      icon: UserGroupIcon,
      color: "bg-green-500"
    },
    {
      title: "Toplam Gelir",
      value: `₺${organizations.reduce((sum, org) => sum + ((org.price || 0) * (org.bookings || 0)), 0).toLocaleString()}`,
      icon: CurrencyDollarIcon,
      color: "bg-purple-500"
    },
    {
      title: "Ortalama Puan",
      value: organizations.length > 0
        ? (organizations.reduce((sum, org) => sum + (org.rating || 0), 0) / organizations.length).toFixed(1)
        : "0.0",
      icon: ChartBarIcon,
      color: "bg-pink-500"
    }
  ];



  const handleOrganizationSubmit = () => {
    if (editDialog.data) {
      // Update existing
      setOrganizations(prev => prev.map(org =>
        org.id === editDialog.data.id ? { ...org, ...newOrganization } : org
      ));
    } else {
      // Add new
      const newOrg = {
        id: Date.now(),
        ...newOrganization,
        price: parseInt(newOrganization.price),
        bookings: 0,
        rating: 0,
        status: "pending",
        images: []
      };
      setOrganizations(prev => [...prev, newOrg]);
    }
    setEditDialog({ open: false, type: "", data: null });
    setNewOrganization({
      title: "",
      description: "",
      price: "",
      category: "",
      duration: "",
      maxGuests: "",
      location: "",
      isOutdoor: false
    });
  };

  const handleDelete = (id: string) => {
    setOrganizations(prev => prev.filter(org => org.id !== id));
  };

  return (
    <ProtectedRoute requiredUserType="company">
      <AdminLayout userType="company">
        <div className="p-6">
          {/* Header */}
          <div className="mb-8">
            <Typography variant="h3" color="blue-gray" className="mb-2">
              Şirket Dashboard
            </Typography>
            <Typography color="gray">
              Organizasyonlarınızı yönetin ve profilinizi güncelleyin
            </Typography>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, index) => (
              <Card key={index} className="shadow-lg">
                <CardBody className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <Typography variant="small" className="text-gray-600 mb-1">
                        {stat.title}
                      </Typography>
                      <Typography variant="h4" color="blue-gray">
                        {stat.value}
                      </Typography>
                    </div>
                    <div className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center`}>
                      <stat.icon className="h-6 w-6 text-white" />
                    </div>
                  </div>
                </CardBody>
              </Card>
            ))}
          </div>

          {/* Tabs */}
          <div className="mb-6">
            <div className="flex gap-4">
              <Button
                variant={activeTab === "overview" ? "filled" : "outlined"}
                color="blue"
                onClick={() => setActiveTab("overview")}
              >
                Genel Bakış
              </Button>
              <Button
                variant={activeTab === "organizations" ? "filled" : "outlined"}
                color="blue"
                onClick={() => setActiveTab("organizations")}
              >
                Organizasyonlarım
              </Button>
              <Button
                variant="outlined"
                color="blue"
                onClick={() => {
                  if (companyId) {
                    router.push(`/admin/companies/edit/${companyId}`);
                  }
                }}
              >
                Profil Ayarları
              </Button>
            </div>
          </div>

          {/* Content */}
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

          {activeTab === "organizations" && (
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
                    Organizasyon Yönetimi ({organizations.length})
                  </Typography>
                  <Button
                    className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-indigo-600"
                    onClick={() => setEditDialog({ open: true, type: "organization", data: null })}
                    placeholder={undefined}
                    onPointerEnterCapture={undefined}
                    onPointerLeaveCapture={undefined}
                  >
                    <PlusIcon className="h-4 w-4" />
                    Yeni Organizasyon
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
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-gray-200">
                          <th className="text-left py-3 px-4">Organizasyon</th>
                          <th className="text-left py-3 px-4">Fiyat</th>
                          <th className="text-left py-3 px-4">Kapasite</th>
                          <th className="text-left py-3 px-4">Süre</th>
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
                                    src={`http://localhost:5268${org.coverPhotoPath}`}
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
                                    className="max-w-xs truncate"
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
                              <Typography
                                variant="small"
                                placeholder={undefined}
                                onPointerEnterCapture={undefined}
                                onPointerLeaveCapture={undefined}
                              >
                                {org.duration}
                              </Typography>
                            </td>
                            <td className="py-3 px-4">
                              <Chip
                                value={org.isOutdoor ? "Dış Mekan" : "İç Mekan"}
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
                                  onClick={() => window.location.href = `/organization-detail/${org.id}`}
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
                      <div className="text-center py-8">
                        <Typography
                          color="gray"
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
          )}



          {activeTab === "overview" && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="shadow-lg">
                <CardBody className="p-6">
                  <Typography variant="h5" color="blue-gray" className="mb-4">
                    Son Rezervasyonlar
                  </Typography>
                  <div className="space-y-3">
                    {organizations.slice(0, 5).map((org) => (
                      <div key={org.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <Typography variant="small" className="font-medium">
                            {org.title}
                          </Typography>
                          <Typography variant="small" color="gray">
                            {org.category}
                          </Typography>
                        </div>
                        <Typography variant="small" className="font-medium text-green-600">
                          {org.bookings} rezervasyon
                        </Typography>
                      </div>
                    ))}
                  </div>
                </CardBody>
              </Card>

              <Card className="shadow-lg">
                <CardBody className="p-6">
                  <Typography variant="h5" color="blue-gray" className="mb-4">
                    Performans Özeti
                  </Typography>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <Typography variant="small">Bu Ay Rezervasyon</Typography>
                      <Typography variant="small" className="font-medium">12</Typography>
                    </div>
                    <div className="flex justify-between items-center">
                      <Typography variant="small">Bu Ay Gelir</Typography>
                      <Typography variant="small" className="font-medium">₺85,000</Typography>
                    </div>
                    <div className="flex justify-between items-center">
                      <Typography variant="small">Ortalama Puan</Typography>
                      <Typography variant="small" className="font-medium">4.8/5</Typography>
                    </div>
                    <div className="flex justify-between items-center">
                      <Typography variant="small">Aktif Organizasyon</Typography>
                      <Typography variant="small" className="font-medium">
                        {organizations.filter(org => org.status === "active").length}
                      </Typography>
                    </div>
                  </div>
                </CardBody>
              </Card>
            </div>
          )}

          {/* Organization Dialog */}
          <Dialog open={editDialog.open} handler={() => setEditDialog({ open: false, type: "", data: null })}>
            <DialogHeader>
              {editDialog.data ? "Organizasyon Düzenle" : "Yeni Organizasyon Ekle"}
            </DialogHeader>
            <DialogBody className="space-y-4">
              <Input
                label="Organizasyon Başlığı"
                value={newOrganization.title}
                onChange={(e) => setNewOrganization(prev => ({ ...prev, title: e.target.value }))}
                crossOrigin={undefined}
              />
              <Textarea
                label="Açıklama"
                value={newOrganization.description}
                onChange={(e) => setNewOrganization(prev => ({ ...prev, description: e.target.value }))}
                rows={3}
              />
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Fiyat (₺)"
                  type="number"
                  value={newOrganization.price}
                  onChange={(e) => setNewOrganization(prev => ({ ...prev, price: e.target.value }))}
                  crossOrigin={undefined}
                />
                <Select
                  label="Kategori"
                  value={newOrganization.category}
                  onChange={(value) => setNewOrganization(prev => ({ ...prev, category: value }))}
                >
                  <Option value="Düğün">Düğün</Option>
                  <Option value="Nişan">Nişan</Option>
                  <Option value="Kına">Kına Gecesi</Option>
                  <Option value="Doğum Günü">Doğum Günü</Option>
                  <Option value="Kurumsal">Kurumsal Etkinlik</Option>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Süre"
                  value={newOrganization.duration}
                  onChange={(e) => setNewOrganization(prev => ({ ...prev, duration: e.target.value }))}
                  crossOrigin={undefined}
                />
                <Input
                  label="Max Misafir"
                  type="number"
                  value={newOrganization.maxGuests}
                  onChange={(e) => setNewOrganization(prev => ({ ...prev, maxGuests: e.target.value }))}
                  crossOrigin={undefined}
                />
              </div>
              <Input
                label="Konum"
                value={newOrganization.location}
                onChange={(e) => setNewOrganization(prev => ({ ...prev, location: e.target.value }))}
                crossOrigin={undefined}
              />
            </DialogBody>
            <DialogFooter>
              <Button
                variant="text"
                color="red"
                onClick={() => setEditDialog({ open: false, type: "", data: null })}
              >
                İptal
              </Button>
              <Button
                variant="gradient"
                color="blue"
                onClick={handleOrganizationSubmit}
              >
                {editDialog.data ? "Güncelle" : "Ekle"}
              </Button>
            </DialogFooter>
          </Dialog>
        </div>
      </AdminLayout>
    </ProtectedRoute>
  );
}