// @ts-nocheck
"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import {
    Card,
    CardBody,
    Typography,
    Button,
    Input,
    Textarea,
    Alert
} from "@material-tailwind/react";
import {
    ArrowLeftIcon,
    ExclamationTriangleIcon,
    CheckCircleIcon,
    BuildingOfficeIcon
} from "@heroicons/react/24/outline";
import AdminLayout from "../../../components/AdminLayout";
import ProtectedRoute from "../../../components/ProtectedRoute";
import { getCompanyDetails, updateCompany, CompanyUpdateData } from "@/lib/auth";

interface Company {
    id: string;
    name: string;
    email: string;
    adress: string;
    phoneNumber: string;
    description: string;
}

export default function EditCompanyPage() {
    const params = useParams();
    const router = useRouter();
    const companyId = params.id as string;

    const [userType, setUserType] = useState<"admin" | "company">("company");
    const [company, setCompany] = useState<Company | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        adress: "",
        phoneNumber: "",
        description: ""
    });

    // Fetch company data
    useEffect(() => {
        // Set user type from localStorage
        const storedUserType = localStorage.getItem("userType") as "admin" | "company";
        if (storedUserType) {
            setUserType(storedUserType);
        }

        const fetchCompany = async () => {
            try {
                setLoading(true);
                const response = await getCompanyDetails(companyId);

                if (response.isSuccess) {
                    // API response'u array mi yoksa tek obje mi kontrol et
                    const companyData = Array.isArray(response.data) ? response.data[0] : response.data;

                    if (companyData) {
                        setCompany(companyData);
                        setFormData({
                            name: companyData.name || "",
                            email: companyData.email || "",
                            adress: companyData.adress || "",
                            phoneNumber: companyData.phoneNumber || "",
                            description: companyData.description || ""
                        });
                    } else {
                        setError("Şirket bilgileri bulunamadı.");
                    }
                } else {
                    setError(response.message || "Şirket bilgileri yüklenirken hata oluştu.");
                }
            } catch (error) {
                console.error("Error fetching company:", error);
                setError("Bağlantı hatası. Lütfen tekrar deneyin.");
            } finally {
                setLoading(false);
            }
        };

        fetchCompany();
    }, [companyId]);

    const handleInputChange = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        if (error) setError("");
        if (success) setSuccess("");
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.name || !formData.email) {
            setError("Şirket adı ve e-posta alanları zorunludur.");
            return;
        }

        setSaving(true);
        setError("");
        setSuccess("");

        try {
            const updateData: CompanyUpdateData = {
                id: companyId,
                name: formData.name,
                email: formData.email,
                adress: formData.adress,
                phoneNumber: formData.phoneNumber,
                description: formData.description
            };

            const response = await updateCompany(updateData);

            if (response.isSuccess) {
                setSuccess("Şirket bilgileri başarıyla güncellendi!");

                // Update local state
                if (company) {
                    setCompany({
                        ...company,
                        ...formData
                    });
                }
            } else {
                setError(response.message || "Güncelleme sırasında hata oluştu.");
            }
        } catch (error) {
            console.error("Error updating company:", error);
            setError("Bağlantı hatası. Lütfen tekrar deneyin.");
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <ProtectedRoute>
                <AdminLayout userType={userType}>
                    <div className="p-6">
                        <div className="text-center py-12">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto mb-4"></div>
                            <Typography
                                placeholder={undefined}
                                onPointerEnterCapture={undefined}
                                onPointerLeaveCapture={undefined}
                                onResize={undefined}
                                onResizeCapture={undefined}
                            >
                                Şirket bilgileri yükleniyor...
                            </Typography>
                        </div>
                    </div>
                </AdminLayout>
            </ProtectedRoute>
        );
    }

    return (
        <ProtectedRoute>
            <AdminLayout userType={userType}>
                <div className="p-6">
                    {/* Header */}
                    <div className="mb-8 flex items-center gap-4">
                        {/* @ts-ignore */}
                        <Button
                            variant="text"
                            className="flex items-center gap-2"
                            onClick={() => {
                                if (userType === "admin") {
                                    router.push("/admin/companies");
                                } else {
                                    router.push("/admin/company-dashboard");
                                }
                            }}
                            placeholder={undefined}
                            onPointerEnterCapture={undefined}
                            onPointerLeaveCapture={undefined}
                        >
                            <ArrowLeftIcon className="h-4 w-4" />
                            Geri Dön
                        </Button>
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                                <BuildingOfficeIcon className="h-6 w-6 text-white" />
                            </div>
                            <div>
                                <Typography
                                    variant="h3"
                                    color="blue-gray"
                                    className="mb-1"
                                    placeholder={undefined}
                                    onPointerEnterCapture={undefined}
                                    onPointerLeaveCapture={undefined}
                                >
                                    Şirket Profili Düzenle
                                </Typography>
                                <Typography
                                    color="gray"
                                    placeholder={undefined}
                                    onPointerEnterCapture={undefined}
                                    onPointerLeaveCapture={undefined}
                                >
                                    {company?.name}
                                </Typography>
                            </div>
                        </div>
                    </div>

                    {/* Alerts */}
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

                    {success && (
                        <Alert
                            color="green"
                            className="mb-6"
                            icon={<CheckCircleIcon className="h-6 w-6" />}
                            onClose={() => setSuccess("")}
                        >
                            {success}
                        </Alert>
                    )}

                    {/* Form */}
                    <form onSubmit={handleSubmit}>
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            {/* Company Information */}
                            <div className="lg:col-span-2">
                                <Card
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
                                            className="mb-6"
                                            placeholder={undefined}
                                            onPointerEnterCapture={undefined}
                                            onPointerLeaveCapture={undefined}
                                        >
                                            Şirket Bilgileri
                                        </Typography>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                            <div>
                                                <Input
                                                    label="Şirket Adı *"
                                                    value={formData.name}
                                                    onChange={(e) => handleInputChange("name", e.target.value)}
                                                    required
                                                    disabled={saving}
                                                    crossOrigin={undefined}
                                                    onPointerEnterCapture={undefined}
                                                    onPointerLeaveCapture={undefined}
                                                />
                                            </div>
                                            <div>
                                                <Input
                                                    label="E-posta *"
                                                    type="email"
                                                    value={formData.email}
                                                    onChange={(e) => handleInputChange("email", e.target.value)}
                                                    required
                                                    disabled={saving}
                                                    crossOrigin={undefined}
                                                    onPointerEnterCapture={undefined}
                                                    onPointerLeaveCapture={undefined}
                                                />
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                            <div>
                                                <Input
                                                    label="Telefon"
                                                    value={formData.phoneNumber}
                                                    onChange={(e) => handleInputChange("phoneNumber", e.target.value)}
                                                    disabled={saving}
                                                    crossOrigin={undefined}
                                                    onPointerEnterCapture={undefined}
                                                    onPointerLeaveCapture={undefined}
                                                />
                                            </div>
                                            <div>
                                                <Input
                                                    label="Adres"
                                                    value={formData.adress}
                                                    onChange={(e) => handleInputChange("adress", e.target.value)}
                                                    disabled={saving}
                                                    crossOrigin={undefined}
                                                    onPointerEnterCapture={undefined}
                                                    onPointerLeaveCapture={undefined}
                                                />
                                            </div>
                                        </div>

                                        <div className="mb-4">
                                            <Textarea
                                                label="Açıklama"
                                                value={formData.description}
                                                onChange={(e) => handleInputChange("description", e.target.value)}
                                                rows={4}
                                                disabled={saving}
                                                onPointerEnterCapture={undefined}
                                                onPointerLeaveCapture={undefined}
                                            />
                                        </div>
                                    </CardBody>
                                </Card>
                            </div>

                            {/* Actions */}
                            <div>
                                <Card
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
                                            İşlemler
                                        </Typography>

                                        <div className="space-y-3">
                                            <Button
                                                type="submit"
                                                className="w-full bg-gradient-to-r from-blue-500 to-indigo-600"
                                                loading={saving}
                                                placeholder={undefined}
                                                onPointerEnterCapture={undefined}
                                                onPointerLeaveCapture={undefined}
                                            >
                                                {saving ? "Güncelleniyor..." : "Değişiklikleri Kaydet"}
                                            </Button>

                                            <Button
                                                variant="outlined"
                                                className="w-full"
                                                onClick={() => {
                                                    if (userType === "admin") {
                                                        router.push("/admin/companies");
                                                    } else {
                                                        router.push("/admin/company-dashboard");
                                                    }
                                                }}
                                                disabled={saving}
                                                placeholder={undefined}
                                                onPointerEnterCapture={undefined}
                                                onPointerLeaveCapture={undefined}
                                            >
                                                İptal
                                            </Button>
                                        </div>

                                        <div className="mt-6 pt-6 border-t border-gray-200">
                                            <Typography
                                                variant="small"
                                                color="gray"
                                                className="mb-2"
                                                placeholder={undefined}
                                                onPointerEnterCapture={undefined}
                                                onPointerLeaveCapture={undefined}
                                            >
                                                Şirket ID
                                            </Typography>
                                            <Typography
                                                variant="small"
                                                className="font-mono bg-gray-100 p-2 rounded"
                                                placeholder={undefined}
                                                onPointerEnterCapture={undefined}
                                                onPointerLeaveCapture={undefined}
                                            >
                                                {companyId}
                                            </Typography>
                                        </div>
                                    </CardBody>
                                </Card>
                            </div>
                        </div>
                    </form>
                </div>
            </AdminLayout>
        </ProtectedRoute>
    );
}