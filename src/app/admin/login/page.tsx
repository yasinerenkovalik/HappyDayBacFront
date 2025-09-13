// @ts-nocheck
"use client";

import React, { useState, useEffect } from "react";
import {
    Card,
    CardBody,
    Typography,
    Input,
    Button,
    Tabs,
    TabsHeader,
    Tab,
    TabsBody,
    TabPanel,
    Alert
} from "@material-tailwind/react";
import {
    UserIcon,
    BuildingOfficeIcon,
    EyeIcon,
    EyeSlashIcon,
    SparklesIcon,
    ExclamationTriangleIcon
} from "@heroicons/react/24/outline";
import { useRouter } from "next/navigation";
import { login, companyLogin } from "@/lib/auth";

export default function AdminLogin() {
    const [activeTab, setActiveTab] = useState("company");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });
    const router = useRouter();

    // Giriş yapmış kullanıcıları yönlendir
    useEffect(() => {
        const checkExistingAuth = () => {
            const token = localStorage.getItem("authToken");
            const userType = localStorage.getItem("userType");
            
            if (token && userType) {
                // Token geçerliliğini kontrol et
                try {
                    const base64Url = token.split('.')[1];
                    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
                    const jsonPayload = decodeURIComponent(
                        atob(base64)
                            .split('')
                            .map(function (c) {
                                return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
                            })
                            .join('')
                    );
                    const payload = JSON.parse(jsonPayload);
                    const currentTime = Date.now() / 1000;
                    
                    // Token geçerliyse yönlendir
                    if (payload.exp > currentTime) {
                        if (userType === "admin") {
                            router.push("/admin/dashboard");
                        } else if (userType === "company") {
                            router.push("/admin/company-dashboard");
                        }
                    }
                } catch (error) {
                    // Token geçersizse localStorage'ı temizle
                    localStorage.clear();
                }
            }
        };

        checkExistingAuth();
    }, [router]);

    const handleInputChange = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        if (error) setError(""); // Clear error when user starts typing
    };

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.email || !formData.password) {
            setError("Lütfen tüm alanları doldurun");
            return;
        }

        setLoading(true);
        setError("");

        try {
            let data;

            // Tab'a göre farklı login fonksiyonu kullan
            if (activeTab === "admin") {
                data = await login(formData.email, formData.password);
            } else {
                data = await companyLogin(formData.email, formData.password);
            }

            if (data.isSuccess && data.data.token) {
                // Debug: Backend response'unu kontrol et
                console.log("🔍 Login Response Debug:", {
                    isSuccess: data.isSuccess,
                    data: data.data,
                    isEmailConfirmed: data.data.isEmailConfirmed,
                    fullResponse: data
                });
                
                // Token zaten login utility'sinde parse edildi ve localStorage'a kaydedildi
                const userType = localStorage.getItem("userType");
                
                // Şirket girişi için email doğrulama kontrolü
                if (activeTab === "company" && data.data.isEmailConfirmed === false) {
                    console.log("📧 Email not confirmed, redirecting to verification page");
                    // Email doğrulanmamışsa özel sayfaya yönlendir
                    router.push("/email-verification");
                    return;
                }

                // Role'e göre yönlendirme
                if (userType === "admin") {
                    router.push("/admin/dashboard");
                } else if (userType === "company") {
                    console.log("✅ Email verified or not checked, redirecting to dashboard");
                    router.push("/admin/company-dashboard");
                } else {
                    setError("Geçersiz kullanıcı rolü");
                }
            } else {
                setError(data.message || "Giriş başarısız");
            }
        } catch (error) {
            console.error("Login error:", error);
            setError("Bağlantı hatası. Lütfen tekrar deneyin.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50 flex items-center justify-center p-4">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-5">
                <div className="absolute top-20 left-20 w-96 h-96 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
                <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl animate-pulse delay-1000"></div>
            </div>

            <div className="w-full max-w-md relative z-10">
                {/* Logo */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center gap-2 mb-4">
                        <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-purple-600 rounded-xl flex items-center justify-center">
                            <SparklesIcon className="h-7 w-7 text-white" />
                        </div>
                        <Typography
                            variant="h4"
                            className="bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent font-bold"
                            placeholder={undefined}
                            onPointerEnterCapture={undefined}
                            onPointerLeaveCapture={undefined}
                        >
                            MutluGünüm
                        </Typography>
                    </div>
                    <Typography
                        variant="h5"
                        color="blue-gray"
                        className="font-semibold"
                        placeholder={undefined}
                        onPointerEnterCapture={undefined}
                        onPointerLeaveCapture={undefined}
                    >
                        Admin Paneli
                    </Typography>
                    <Typography
                        color="gray"
                        className="mt-2"
                        placeholder={undefined}
                        onPointerEnterCapture={undefined}
                        onPointerLeaveCapture={undefined}
                    >
                        Hesabınıza giriş yapın
                    </Typography>
                </div>

                <Card
                    className="shadow-2xl border border-white/20 bg-white/80 backdrop-blur-sm"
                    placeholder={undefined}
                    onPointerEnterCapture={undefined}
                    onPointerLeaveCapture={undefined}
                >
                    <CardBody
                        className="p-8"
                        placeholder={undefined}
                        onPointerEnterCapture={undefined}
                        onPointerLeaveCapture={undefined}
                    >
                        {error && (
                            <Alert
                                color="red"
                                className="mb-4"
                                icon={<ExclamationTriangleIcon className="h-6 w-6" />}
                            >
                                {error}
                            </Alert>
                        )}

                        <Tabs value={activeTab} className="mb-6">
                            <TabsHeader
                                className="bg-gray-100"
                                placeholder={undefined}
                                onPointerEnterCapture={undefined}
                                onPointerLeaveCapture={undefined}
                            >
                                <Tab
                                    value="admin"
                                    onClick={() => setActiveTab("admin")}
                                    className="flex items-center gap-2"
                                    placeholder={undefined}
                                    onPointerEnterCapture={undefined}
                                    onPointerLeaveCapture={undefined}
                                >
                                    <UserIcon className="h-4 w-4" />
                                    Admin
                                </Tab>
                                <Tab
                                    value="company"
                                    onClick={() => setActiveTab("company")}
                                    className="flex items-center gap-2"
                                    placeholder={undefined}
                                    onPointerEnterCapture={undefined}
                                    onPointerLeaveCapture={undefined}
                                >
                                    <BuildingOfficeIcon className="h-4 w-4" />
                                    Şirket
                                </Tab>
                            </TabsHeader>

                            <TabsBody
                                placeholder={undefined}
                                onPointerEnterCapture={undefined}
                                onPointerLeaveCapture={undefined}
                            >
                                <TabPanel value="admin" className="p-0">
                                    <form onSubmit={handleLogin}>
                                        <div className="space-y-4">
                                            <div>
                                                <Input
                                                    label="Admin E-posta"
                                                    type="email"
                                                    value={formData.email}
                                                    onChange={(e) => handleInputChange("email", e.target.value)}
                                                    required
                                                    disabled={loading}
                                                    crossOrigin={undefined}
                                                    onPointerEnterCapture={undefined}
                                                    onPointerLeaveCapture={undefined}
                                                />
                                            </div>

                                            <div className="relative">
                                                <Input
                                                    label="Şifre"
                                                    type={showPassword ? "text" : "password"}
                                                    value={formData.password}
                                                    onChange={(e) => handleInputChange("password", e.target.value)}
                                                    required
                                                    disabled={loading}
                                                    crossOrigin={undefined}
                                                    onPointerEnterCapture={undefined}
                                                    onPointerLeaveCapture={undefined}
                                                />
                                                <button
                                                    type="button"
                                                    className="absolute right-3 top-1/2 transform -translate-y-1/2"
                                                    onClick={() => setShowPassword(!showPassword)}
                                                >
                                                    {showPassword ? (
                                                        <EyeSlashIcon className="h-5 w-5 text-gray-400" />
                                                    ) : (
                                                        <EyeIcon className="h-5 w-5 text-gray-400" />
                                                    )}
                                                </button>
                                            </div>

                                            <Button
                                                type="submit"
                                                className="w-full bg-gradient-to-r from-pink-500 to-purple-600"
                                                size="lg"
                                                loading={loading}
                                                placeholder={undefined}
                                                onPointerEnterCapture={undefined}
                                                onPointerLeaveCapture={undefined}
                                            >
                                                {loading ? "Giriş yapılıyor..." : "Admin Girişi"}
                                            </Button>
                                        </div>
                                    </form>
                                </TabPanel>

                                <TabPanel value="company" className="p-0">
                                    <form onSubmit={handleLogin}>
                                        <div className="space-y-4">
                                            <div>
                                                <Input
                                                    label="Şirket E-posta"
                                                    type="email"
                                                    value={formData.email}
                                                    onChange={(e) => handleInputChange("email", e.target.value)}
                                                    required
                                                    disabled={loading}
                                                    crossOrigin={undefined}
                                                    onPointerEnterCapture={undefined}
                                                    onPointerLeaveCapture={undefined}
                                                />
                                            </div>

                                            <div className="relative">
                                                <Input
                                                    label="Şifre"
                                                    type={showPassword ? "text" : "password"}
                                                    value={formData.password}
                                                    onChange={(e) => handleInputChange("password", e.target.value)}
                                                    required
                                                    disabled={loading}
                                                    crossOrigin={undefined}
                                                    onPointerEnterCapture={undefined}
                                                    onPointerLeaveCapture={undefined}
                                                />
                                                <button
                                                    type="button"
                                                    className="absolute right-3 top-1/2 transform -translate-y-1/2"
                                                    onClick={() => setShowPassword(!showPassword)}
                                                >
                                                    {showPassword ? (
                                                        <EyeSlashIcon className="h-5 w-5 text-gray-400" />
                                                    ) : (
                                                        <EyeIcon className="h-5 w-5 text-gray-400" />
                                                    )}
                                                </button>
                                            </div>

                                            <Button
                                                type="submit"
                                                className="w-full bg-gradient-to-r from-blue-500 to-indigo-600"
                                                size="lg"
                                                loading={loading}
                                                placeholder={undefined}
                                                onPointerEnterCapture={undefined}
                                                onPointerLeaveCapture={undefined}
                                            >
                                                {loading ? "Giriş yapılıyor..." : "Şirket Girişi"}
                                            </Button>
                                        </div>
                                    </form>
                                </TabPanel>
                            </TabsBody>
                        </Tabs>

                        <div className="text-center mt-6 space-y-2">
                            <Typography
                                variant="small"
                                color="gray"
                                placeholder={undefined}
                                onPointerEnterCapture={undefined}
                                onPointerLeaveCapture={undefined}
                            >
                                Şirket girişi yapıyorsanız ve şifrenizi unuttuysanız{" "}
                                <a href="/auth/request-password-reset" className="text-blue-500 hover:text-blue-700 font-medium">
                                    Şifremi Unuttum
                                </a>
                            </Typography>
                            <Typography
                                variant="small"
                                color="gray"
                                placeholder={undefined}
                                onPointerEnterCapture={undefined}
                                onPointerLeaveCapture={undefined}
                            >
                                Hesabınız yok mu?{" "}
                                <a href="#" className="text-pink-500 hover:text-pink-700 font-medium">
                                    Kayıt olun
                                </a>
                            </Typography>
                        </div>
                    </CardBody>
                </Card>
            </div>
        </div>
    );
}