"use client";

import React, { useState, useEffect } from "react";
import {
  Card,
  CardBody,
  Typography,
  Button,
  Input,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  IconButton,
  Chip,
  Alert
} from "@material-tailwind/react";
import {
  BuildingOfficeIcon,
  CalendarDaysIcon,
  UserGroupIcon,
  CurrencyDollarIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
  ExclamationTriangleIcon
} from "@heroicons/react/24/outline";
import AdminLayout from "../components/AdminLayout";
import ProtectedRoute from "../components/ProtectedRoute";
import { getAllCompanies, Company } from "@/lib/auth";
import { useSearchParams } from "next/navigation";

// Mock data for organizations
const ORGANIZATIONS = [
  {
    id: 1,
    title: "Kır Düğünü Paketi",
    company: "Elit Organizasyon",
    price: 25000,
    category: "Düğün",
    status: "active",
    bookings: 15
  },
  {
    id: 2,
    title: "Nişan Organizasyonu",
    company: "Dream Events",
    price: 15000,
    category: "Nişan",
    status: "active",
    bookings: 8
  },
  {
    id: 3,
    title: "Doğum Günü Partisi",
    company: "Perfect Wedding",
    price: 8000,
    category: "Doğum Günü",
    status: "pending",
    bookings: 3
  }
];

export default function AdminDashboard() {
  const searchParams = useSearchParams();
  const tabFromUrl = searchParams.get('tab') || 'overview';

  const [activeTab, setActiveTab] = useState(tabFromUrl);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [organizations, setOrganizations] = useState(ORGANIZATIONS);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editDialog, setEditDialog] = useState({ open: false, type: "", data: null });

  // URL parametresi değiştiğinde tab'ı güncelle
  useEffect(() => {
    setActiveTab(tabFromUrl);
  }, [tabFromUrl]);

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

  const stats = [
    {
      title: "Toplam Şirket",
      value: companies.length,
      icon: BuildingOfficeIcon,
      color: "bg-blue-500"
    },
    {
      title: "Toplam Organizasyon",
      value: organizations.length,
      icon: CalendarDaysIcon,
      color: "bg-green-500"
    },
    {
      title: "Aktif Rezervasyon",
      value: organizations.reduce((sum, org) => sum + org.bookings, 0),
      icon: UserGroupIcon,
      color: "bg-purple-500"
    },
    {
      title: "Toplam Şirket",
      value: companies.length,
      icon: CurrencyDollarIcon,
      color: "bg-pink-500"
    }
  ];

  const handleDelete = (type: string, id: string) => {
    if (type === "company") {
      setCompanies(prev => prev.filter(comp => comp.id !== id));
    } else {
      setOrganizations(prev => prev.filter(org => org.id.toString() !== id));
    }
  };

  return (
    <ProtectedRoute requiredUserType="admin">
      <AdminLayout userType="admin">
        <div className="p-6">
          {/* Header */}
          <div className="mb-8">
            <Typography
              variant="h3"
              color="blue-gray"
              className="mb-2"
              placeholder={undefined}
              onPointerEnterCapture={undefined}
              onPointerLeaveCapture={undefined}
            >
              Admin Dashboard
            </Typography>
            <Typography
              color="gray"
              placeholder={undefined}
              onPointerEnterCapture={undefined}
              onPointerLeaveCapture={undefined}
            >
              Sistem genelini yönetin ve istatistikleri görüntüleyin
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

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, index) => (
              <Card
                key={index}
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
                  <div className="flex items-center justify-between">
                    <div>
                      <Typography
                        variant="small"
                        className="text-gray-600 mb-1"
                        placeholder={undefined}
                        onPointerEnterCapture={undefined}
                        onPointerLeaveCapture={undefined}
                      >
                        {stat.title}
                      </Typography>
                      <Typography
                        variant="h4"
                        color="blue-gray"
                        placeholder={undefined}
                        onPointerEnterCapture={undefined}
                        onPointerLeaveCapture={undefined}
                      >
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
                color="pink"
                onClick={() => setActiveTab("overview")}
                placeholder={undefined}
                onPointerEnterCapture={undefined}
                onPointerLeaveCapture={undefined}
              >
                Genel Bakış
              </Button>
              <Button
                variant={activeTab === "companies" ? "filled" : "outlined"}
                color="pink"
                onClick={() => setActiveTab("companies")}
                placeholder={undefined}
                onPointerEnterCapture={undefined}
                onPointerLeaveCapture={undefined}
              >
                Şirketler
              </Button>
              <Button
                variant={activeTab === "organizations" ? "filled" : "outlined"}
                color="pink"
                onClick={() => setActiveTab("organizations")}
                placeholder={undefined}
                onPointerEnterCapture={undefined}
                onPointerLeaveCapture={undefined}
              >
                Organizasyonlar
              </Button>
            </div>
          </div>

          {/* Content */}
          {activeTab === "companies" && (
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
                    Şirket Yönetimi
                  </Typography>
                  <Button
                    className="flex items-center gap-2 bg-gradient-to-r from-pink-500 to-purple-600"
                    onClick={() => setEditDialog({ open: true, type: "company", data: null })}
                    placeholder={undefined}
                    onPointerEnterCapture={undefined}
                    onPointerLeaveCapture={undefined}
                  >
                    <PlusIcon className="h-4 w-4" />
                    Yeni Şirket
                  </Button>
                </div>

                {loading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-500 mx-auto mb-4"></div>
                    <Typography
                      placeholder={undefined}
                      onPointerEnterCapture={undefined}
                      onPointerLeaveCapture={undefined}
                    >
                      Şirketler yükleniyor...
                    </Typography>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-gray-200">
                          <th className="text-left py-3 px-4">Şirket Adı</th>
                          <th className="text-left py-3 px-4">E-posta</th>
                          <th className="text-left py-3 px-4">Telefon</th>
                          <th className="text-left py-3 px-4">Adres</th>
                          <th className="text-left py-3 px-4">Açıklama</th>
                          <th className="text-left py-3 px-4">İşlemler</th>
                        </tr>
                      </thead>
                      <tbody>
                        {companies.map((company) => (
                          <tr key={company.id} className="border-b border-gray-100">
                            <td className="py-3 px-4 font-medium">{company.name}</td>
                            <td className="py-3 px-4 text-gray-600">{company.email}</td>
                            <td className="py-3 px-4 text-gray-600">{company.phoneNumber}</td>
                            <td className="py-3 px-4 text-gray-600">{company.adress}</td>
                            <td className="py-3 px-4 text-gray-600 max-w-xs truncate">
                              {company.description}
                            </td>
                            <td className="py-3 px-4">
                              <div className="flex gap-2">
                                <IconButton
                                  size="sm"
                                  variant="text"
                                  color="blue"
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
                                  onClick={() => setEditDialog({ open: true, type: "company", data: company })}
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
                                  onClick={() => handleDelete("company", company.id)}
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

                    {companies.length === 0 && !loading && (
                      <div className="text-center py-8">
                        <Typography
                          color="gray"
                          placeholder={undefined}
                          onPointerEnterCapture={undefined}
                          onPointerLeaveCapture={undefined}
                        >
                          Henüz şirket bulunamadı.
                        </Typography>
                      </div>
                    )}
                  </div>
                )}
              </CardBody>
            </Card>
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
                    Organizasyon Yönetimi
                  </Typography>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-3 px-4">Organizasyon</th>
                        <th className="text-left py-3 px-4">Şirket</th>
                        <th className="text-left py-3 px-4">Kategori</th>
                        <th className="text-left py-3 px-4">Fiyat</th>
                        <th className="text-left py-3 px-4">Durum</th>
                        <th className="text-left py-3 px-4">Rezervasyon</th>
                        <th className="text-left py-3 px-4">İşlemler</th>
                      </tr>
                    </thead>
                    <tbody>
                      {organizations.map((org) => (
                        <tr key={org.id} className="border-b border-gray-100">
                          <td className="py-3 px-4 font-medium">{org.title}</td>
                          <td className="py-3 px-4 text-gray-600">{org.company}</td>
                          <td className="py-3 px-4 text-gray-600">{org.category}</td>
                          <td className="py-3 px-4">₺{org.price.toLocaleString()}</td>
                          <td className="py-3 px-4">
                            <Chip
                              value={org.status === "active" ? "Aktif" : "Beklemede"}
                              color={org.status === "active" ? "green" : "orange"}
                              size="sm"
                            />
                          </td>
                          <td className="py-3 px-4">{org.bookings}</td>
                          <td className="py-3 px-4">
                            <div className="flex gap-2">
                              <IconButton
                                size="sm"
                                variant="text"
                                color="blue"
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
                                onClick={() => handleDelete("organization", org.id.toString())}
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
              </CardBody>
            </Card>
          )}

          {activeTab === "overview" && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
                  <Typography
                    variant="h5"
                    color="blue-gray"
                    className="mb-4"
                    placeholder={undefined}
                    onPointerEnterCapture={undefined}
                    onPointerLeaveCapture={undefined}
                  >
                    Son Şirketler
                  </Typography>
                  <div className="space-y-3">
                    {companies.slice(0, 5).map((company) => (
                      <div key={company.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <Typography
                            variant="small"
                            className="font-medium"
                            placeholder={undefined}
                            onPointerEnterCapture={undefined}
                            onPointerLeaveCapture={undefined}
                          >
                            {company.name}
                          </Typography>
                          <Typography
                            variant="small"
                            color="gray"
                            placeholder={undefined}
                            onPointerEnterCapture={undefined}
                            onPointerLeaveCapture={undefined}
                          >
                            {company.email}
                          </Typography>
                        </div>
                        <Chip
                          value="Aktif"
                          color="green"
                          size="sm"
                        />
                      </div>
                    ))}
                  </div>
                </CardBody>
              </Card>

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
                  <Typography
                    variant="h5"
                    color="blue-gray"
                    className="mb-4"
                    placeholder={undefined}
                    onPointerEnterCapture={undefined}
                    onPointerLeaveCapture={undefined}
                  >
                    Popüler Organizasyonlar
                  </Typography>
                  <div className="space-y-3">
                    {organizations.slice(0, 5).map((org) => (
                      <div key={org.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
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
                            placeholder={undefined}
                            onPointerEnterCapture={undefined}
                            onPointerLeaveCapture={undefined}
                          >
                            {org.company}
                          </Typography>
                        </div>
                        <Typography
                          variant="small"
                          className="font-medium text-green-600"
                          placeholder={undefined}
                          onPointerEnterCapture={undefined}
                          onPointerLeaveCapture={undefined}
                        >
                          {org.bookings} rezervasyon
                        </Typography>
                      </div>
                    ))}
                  </div>
                </CardBody>
              </Card>
            </div>
          )}
        </div>
      </AdminLayout>
    </ProtectedRoute>
  );
}