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
    Alert,
    Select,
    Option
} from "@material-tailwind/react";
import {
    ArrowLeftIcon,
    ExclamationTriangleIcon,
    CheckCircleIcon,
    BuildingOfficeIcon,
    MapPinIcon
} from "@heroicons/react/24/outline";

import AdminLayout from "../../../components/AdminLayout";
// Map functionality simplified for stability
import ProtectedRoute from "../../../components/ProtectedRoute";
import { getCompanyDetails, updateCompany, CompanyUpdateData } from "@/lib/auth";

interface Company {
    id: string;
    name: string;
    email: string;
    adress: string;
    phoneNumber: string;
    description: string;
    latitude?: number;
    longitude?: number;
    cityId?: number;
    districtId?: number;
}

interface City {
    id: number;
    cityName: string;
}

interface District {
    id: number;
    districtName: string;
    cityId: number;
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
    const [cities, setCities] = useState<City[]>([]);
    const [districts, setDistricts] = useState<District[]>([]);
    const [loadingCities, setLoadingCities] = useState(false);
    const [loadingDistricts, setLoadingDistricts] = useState(false);

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        adress: "",
        phoneNumber: "",
        description: "",
        latitude: 41.0082, // İstanbul default
        longitude: 28.9784,
        cityId: "",
        districtId: ""
    });

    const [mapPosition, setMapPosition] = useState<[number, number]>([41.0082, 28.9784]);

    // Fetch cities from API
    const fetchCities = async () => {
        try {
            setLoadingCities(true);
            const response = await fetch('/api/proxy/City/CityGetAll');
            const data = await response.json();
            
            if (data.isSuccess && data.data) {
                setCities(data.data);
            } else {
                console.error('Failed to fetch cities:', data.message);
            }
        } catch (error) {
            console.error('Error fetching cities:', error);
        } finally {
            setLoadingCities(false);
        }
    };

    // Fetch districts from API
    const fetchDistricts = async (cityId: number) => {
        try {
            setLoadingDistricts(true);
            console.log('🔍 Fetching districts for city ID:', cityId);
            
            // API'nin beklediği request format: GetAllDisctrictByCityRequest
            const requestBody = {
                CityId: cityId
            };
            console.log('📤 Request body:', requestBody);
            
            const response = await fetch(`/api/proxy/District/GetAllDisctrictByCity`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestBody)
            });
            
            console.log('📡 Response status:', response.status);
            const data = await response.json();
            console.log('📡 Response data:', data);
            
            if (data.isSuccess && data.data) {
                setDistricts(data.data);
                console.log('✅ Districts loaded for city', cityId, ':', data.data);
            } else {
                console.error('❌ Failed to fetch districts:', data.message || 'API returned isSuccess: false');
                console.error('❌ Full response:', data);
                setDistricts([]);
            }
        } catch (error) {
            console.error('Error fetching districts:', error);
            setDistricts([]);
        } finally {
            setLoadingDistricts(false);
        }
    };

    // Load cities on component mount
    useEffect(() => {
        fetchCities();
    }, []);

    // Load districts when city changes
    useEffect(() => {
        if (formData.cityId) {
            console.log('🔄 City changed to:', formData.cityId);
            fetchDistricts(parseInt(formData.cityId));
        } else {
            console.log('🔄 No city selected, clearing districts');
            setDistricts([]);
        }
    }, [formData.cityId]);

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
                setError("");
                
                if (!companyId) {
                    setError("Geçersiz şirket ID'si.");
                    return;
                }

                // JWT token'ı kontrol et
                const token = localStorage.getItem("authToken");
                const userRole = localStorage.getItem("userRole");
                const userType = localStorage.getItem("userType");
                const currentCompanyId = localStorage.getItem("companyId");
                
                console.log("🔍 Current user info:");
                console.log("- User Role:", userRole);
                console.log("- User Type:", userType);
                console.log("- Current Company ID:", currentCompanyId);
                console.log("- Requested Company ID:", companyId);
                console.log("- Can access?", userRole === "Admin" || currentCompanyId === companyId);
                
                // JWT token'ı console'a yazdır (test için)
                if (token) {
                    console.log("🔑 Full JWT Token for curl test:");
                    console.log(`curl -X 'GET' 'http://193.111.77.142/api/Company/getbyid?Id=${companyId}' -H 'Authorization: Bearer ${token}'`);
                    
                    // Token'ı parse et ve içeriğini göster
                    try {
                        const payload = JSON.parse(atob(token.split('.')[1]));
                        console.log("🔍 JWT Payload:", payload);
                        console.log("🕐 Token expires at:", new Date(payload.exp * 1000));
                        console.log("🕐 Current time:", new Date());
                        console.log("⏰ Token valid?", payload.exp * 1000 > Date.now());
                    } catch (e) {
                        console.error("❌ Failed to parse JWT:", e);
                    }
                }
                
                // Global test fonksiyonu ekle
                (window as any).testCompanyAPI = async () => {
                    const token = localStorage.getItem('authToken');
                    console.log('🧪 Testing Company API...');
                    
                    // Test 1: No auth
                    try {
                        const response1 = await fetch(`http://193.111.77.142/api/Company/getbyid?Id=${companyId}`);
                        console.log('✅ No Auth Test:', response1.status, await response1.text());
                    } catch (e) {
                        console.log('❌ No Auth Test failed:', e);
                    }
                    
                    // Test 2: With auth
                    if (token) {
                        try {
                            const response2 = await fetch(`http://193.111.77.142/api/Company/getbyid?Id=${companyId}`, {
                                headers: { 'Authorization': `Bearer ${token}` }
                            });
                            console.log('✅ With Auth Test:', response2.status, await response2.text());
                        } catch (e) {
                            console.log('❌ With Auth Test failed:', e);
                        }
                    }
                };

                // Yetki kontrolü
                if (userRole !== "Admin" && currentCompanyId !== companyId) {
                    setError("Bu şirketin bilgilerine erişim yetkiniz bulunmamaktadır. Sadece kendi şirketinizin bilgilerini düzenleyebilirsiniz.");
                    return;
                }

                console.log("Fetching company with ID:", companyId);
                const response = await getCompanyDetails(companyId);
                console.log("Company response:", response);

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
                            description: companyData.description || "",
                            latitude: companyData.latitude || 41.0082,
                            longitude: companyData.longitude || 28.9784,
                            cityId: companyData.cityId ? companyData.cityId.toString() : "",
                            districtId: companyData.districtId ? companyData.districtId.toString() : ""
                        });

                        // Harita pozisyonunu güncelle
                        if (companyData.latitude && companyData.longitude) {
                            setMapPosition([companyData.latitude, companyData.longitude]);
                        }
                    } else {
                        setError("Şirket bilgileri bulunamadı.");
                    }
                } else {
                    setError(response.message || response.errors?.join(', ') || "Şirket bilgileri yüklenirken hata oluştu.");
                }
            } catch (error) {
                console.error("Error fetching company:", error);
                if (error instanceof Error) {
                    setError(`Hata: ${error.message}`);
                } else {
                    setError("Beklenmeyen bir hata oluştu. Lütfen tekrar deneyin.");
                }
            } finally {
                setLoading(false);
            }
        };

        fetchCompany();
    }, [companyId]);

    const handleInputChange = (field: string, value: string | number) => {
        console.log('🔄 Input changed:', field, '=', value);
        setFormData(prev => {
            const newData = { ...prev, [field]: value };
            
            // If city changes, reset district (but don't clear districts list, useEffect will handle it)
            if (field === 'cityId') {
                newData.districtId = '';
            }
            
            return newData;
        });
        if (error) setError("");
        if (success) setSuccess("");
    };

    const handleLocationSelect = (lat: number, lng: number) => {
        setFormData(prev => ({ ...prev, latitude: lat, longitude: lng }));
        setMapPosition([lat, lng]);
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
                description: formData.description,
                latitude: formData.latitude,
                longitude: formData.longitude,
                cityId: formData.cityId ? parseInt(formData.cityId) : undefined,
                districtId: formData.districtId ? parseInt(formData.districtId) : undefined
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

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                            <div>
                                                <Select
                                                    label="Şehir"
                                                    value={formData.cityId}
                                                    onChange={(value) => handleInputChange("cityId", value || "")}
                                                    disabled={saving || loadingCities}
                                                    placeholder={undefined}
                                                    onPointerEnterCapture={undefined}
                                                    onPointerLeaveCapture={undefined}
                                                >
                                                    {cities.map((city) => (
                                                        <Option key={city.id} value={city.id.toString()}>
                                                            {city.cityName}
                                                        </Option>
                                                    ))}
                                                </Select>
                                                {loadingCities && (
                                                    <Typography
                                                        variant="small"
                                                        color="gray"
                                                        className="mt-1"
                                                        placeholder={undefined}
                                                        onPointerEnterCapture={undefined}
                                                        onPointerLeaveCapture={undefined}
                                                    >
                                                        Şehirler yükleniyor...
                                                    </Typography>
                                                )}
                                            </div>
                                            <div>
                                                <Select
                                                    label="İlçe"
                                                    value={formData.districtId}
                                                    onChange={(value) => handleInputChange("districtId", value || "")}
                                                    disabled={saving || loadingDistricts || !formData.cityId}
                                                    placeholder={undefined}
                                                    onPointerEnterCapture={undefined}
                                                    onPointerLeaveCapture={undefined}
                                                >
                                                    {districts.map((district) => (
                                                        <Option key={district.id} value={district.id.toString()}>
                                                            {district.districtName}
                                                        </Option>
                                                    ))}
                                                </Select>
                                                {loadingDistricts && (
                                                    <Typography
                                                        variant="small"
                                                        color="gray"
                                                        className="mt-1"
                                                        placeholder={undefined}
                                                        onPointerEnterCapture={undefined}
                                                        onPointerLeaveCapture={undefined}
                                                    >
                                                        İlçeler yükleniyor...
                                                    </Typography>
                                                )}
                                                {!formData.cityId && (
                                                    <Typography
                                                        variant="small"
                                                        color="gray"
                                                        className="mt-1"
                                                        placeholder={undefined}
                                                        onPointerEnterCapture={undefined}
                                                        onPointerLeaveCapture={undefined}
                                                    >
                                                        Önce şehir seçin
                                                    </Typography>
                                                )}
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

                                        {/* Konum Bilgileri */}
                                        <div className="mb-6">
                                            <Typography
                                                variant="h6"
                                                color="blue-gray"
                                                className="mb-4 flex items-center gap-2"
                                                placeholder={undefined}
                                                onPointerEnterCapture={undefined}
                                                onPointerLeaveCapture={undefined}
                                            >
                                                <MapPinIcon className="h-5 w-5" />
                                                Konum Bilgileri
                                            </Typography>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                                <div>
                                                    <Input
                                                        label="Enlem (Latitude)"
                                                        type="number"
                                                        step="any"
                                                        value={formData.latitude}
                                                        onChange={(e) => handleInputChange("latitude", parseFloat(e.target.value) || 0)}
                                                        disabled={saving}
                                                        crossOrigin={undefined}
                                                        onPointerEnterCapture={undefined}
                                                        onPointerLeaveCapture={undefined}
                                                    />
                                                </div>
                                                <div>
                                                    <Input
                                                        label="Boylam (Longitude)"
                                                        type="number"
                                                        step="any"
                                                        value={formData.longitude}
                                                        onChange={(e) => handleInputChange("longitude", parseFloat(e.target.value) || 0)}
                                                        disabled={saving}
                                                        crossOrigin={undefined}
                                                        onPointerEnterCapture={undefined}
                                                        onPointerLeaveCapture={undefined}
                                                    />
                                                </div>
                                            </div>

                                            {/* Harita */}
                                            <div className="mb-4">
                                                <Typography
                                                    variant="small"
                                                    color="gray"
                                                    className="mb-2"
                                                    placeholder={undefined}
                                                    onPointerEnterCapture={undefined}
                                                    onPointerLeaveCapture={undefined}
                                                >
                                                    Konum: {mapPosition[0].toFixed(6)}, {mapPosition[1].toFixed(6)}
                                                </Typography>
                                                <div className="w-full h-64 rounded-lg overflow-hidden border border-gray-300 bg-gray-100 flex items-center justify-center">
                                                    <div className="text-center">
                                                        <Typography variant="h6" color="gray" className="mb-2">
                                                            Konum Bilgisi
                                                        </Typography>
                                                        <Typography variant="small" color="gray">
                                                            Enlem: {mapPosition[0].toFixed(6)}
                                                        </Typography>
                                                        <Typography variant="small" color="gray">
                                                            Boylam: {mapPosition[1].toFixed(6)}
                                                        </Typography>
                                                    </div>
                                                </div>
                                            </div>
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

                                        {/* Şirket ID bölümü kaldırıldı */}
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