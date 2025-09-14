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
} from "@material-tailwind/react";
import {
  BuildingOfficeIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  EyeIcon,
  EyeSlashIcon,
  PhotoIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { registerCompanyByInvite } from "@/lib/api";

interface CompanyRegistrationData {
  token: string;
  email: string;
  companyName: string;
  password: string;
  adress: string;
  phoneNumber: string;
  description: string;
}

interface RegistrationResponse {
  isSuccess?: boolean;
  message?: string;
  title?: string;
}

export default function CreateCompanyPage() {
  const params = useParams();
  const router = useRouter();
  const token = params.token as string;

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [selectedCoverPhoto, setSelectedCoverPhoto] = useState<File | null>(null);
  const [coverPhotoPreview, setCoverPhotoPreview] = useState<string | null>(null);

  const [formData, setFormData] = useState<CompanyRegistrationData>({
    token: token || "",
    email: "",
    companyName: "",
    password: "",
    adress: "",
    phoneNumber: "",
    description: "",
  });

  useEffect(() => {
    if (!token) {
      setError("Geçersiz davetiye linki. Token bulunamadı.");
      return;
    }

    // Token format kontrolü (basit)
    if (token.length < 10) {
      setError("Geçersiz token formatı.");
      return;
    }

    // Token'ı form data'ya set et
    setFormData(prev => ({ ...prev, token }));
  }, [token]);

  const handleInputChange = (field: keyof CompanyRegistrationData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleCoverPhotoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Dosya boyutu kontrolü (5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError("Cover photo boyutu 5MB'dan küçük olmalıdır.");
        return;
      }

      // Dosya tipi kontrolü
      if (!file.type.startsWith('image/')) {
        setError("Lütfen geçerli bir resim dosyası seçin.");
        return;
      }

      setSelectedCoverPhoto(file);
      
      // Preview oluştur
      const reader = new FileReader();
      reader.onload = (e) => {
        setCoverPhotoPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
      
      if (error) setError("");
    }
  };

  const clearCoverPhoto = () => {
    setSelectedCoverPhoto(null);
    setCoverPhotoPreview(null);
    // Input'u temizle
    const input = document.getElementById('coverPhotoInput') as HTMLInputElement;
    if (input) input.value = '';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Form validation
    if (!formData.email || !formData.companyName || !formData.password) {
      setError("Email, şirket adı ve şifre alanları zorunludur");
      return;
    }

    if (formData.password.length < 6) {
      setError("Şifre en az 6 karakter olmalıdır");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const requestBody = {
        token: formData.token,
        email: formData.email,
        companyName: formData.companyName,
        password: formData.password,
        adress: formData.adress,
        phoneNumber: formData.phoneNumber,
        description: formData.description,
        coverPhoto: selectedCoverPhoto || undefined,
      };

      console.log("Sending company registration request:", requestBody);

      const result = await registerCompanyByInvite(requestBody);

      console.log("Registration API Response:", result);

      if (result.isSuccess || result.success) {
        setSuccess("Şirket kaydı başarıyla tamamlandı! Giriş sayfasına yönlendiriliyorsunuz...");

        // 3 saniye sonra login sayfasına yönlendir
        setTimeout(() => {
          router.push("/admin/login");
        }, 3000);
      } else {
        const errorMsg = result.message || result.error || result.title || "Kayıt işlemi sırasında hata oluştu";
        setError(errorMsg);
      }
    } catch (error) {
      console.error("Company registration error:", error);
      setError("Bağlantı hatası. Lütfen tekrar deneyin.");
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardBody className="text-center p-8">
            <ExclamationTriangleIcon className="h-16 w-16 text-red-500 mx-auto mb-4" />
            <Typography variant="h5" color="red" className="mb-2">
              Geçersiz Davetiye
            </Typography>
            <Typography color="gray">
              Davetiye linki geçersiz veya eksik. Lütfen doğru linki kullandığınızdan emin olun.
            </Typography>
          </CardBody>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <BuildingOfficeIcon className="h-8 w-8 text-white" />
          </div>
          <Typography variant="h3" color="blue-gray" className="mb-2">
            Şirket Kaydı
          </Typography>
          <Typography color="gray">
            Davetiye ile şirket hesabınızı oluşturun
          </Typography>
        </div>

        <Card>
          <CardBody className="p-8">
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
              >
                {success}
              </Alert>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Token Info */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <Typography variant="small" color="blue" className="font-medium mb-1">
                  Davetiye Token:
                </Typography>
                <Typography variant="small" className="font-mono text-xs break-all text-gray-600">
                  {token}
                </Typography>
              </div>

              {/* Basic Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Input
                    label="Email Adresi *"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    required
                    crossOrigin={undefined}
                  />
                </div>

                <div>
                  <Input
                    label="Şirket Adı *"
                    value={formData.companyName}
                    onChange={(e) => handleInputChange("companyName", e.target.value)}
                    required
                    crossOrigin={undefined}
                  />
                </div>
              </div>

              {/* Password */}
              <div className="relative">
                <Input
                  label="Şifre *"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={(e) => handleInputChange("password", e.target.value)}
                  required
                  crossOrigin={undefined}
                />
                <Button
                  variant="text"
                  size="sm"
                  className="!absolute right-1 top-1 rounded"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeSlashIcon className="h-4 w-4" />
                  ) : (
                    <EyeIcon className="h-4 w-4" />
                  )}
                </Button>
              </div>

              {/* Contact Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Input
                    label="Telefon Numarası"
                    type="tel"
                    value={formData.phoneNumber}
                    onChange={(e) => handleInputChange("phoneNumber", e.target.value)}
                    crossOrigin={undefined}
                  />
                </div>

                <div>
                  <Input
                    label="Adres"
                    value={formData.adress}
                    onChange={(e) => handleInputChange("adress", e.target.value)}
                    crossOrigin={undefined}
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <Textarea
                  label="Şirket Açıklaması"
                  value={formData.description}
                  onChange={(e) => handleInputChange("description", e.target.value)}
                  rows={4}
                />
              </div>

              {/* Cover Photo Seçimi */}
              <div>
                <Typography
                  variant="h6"
                  color="blue-gray"
                  className="mb-4 flex items-center gap-2"
                  placeholder={undefined}
                  onPointerEnterCapture={undefined}
                  onPointerLeaveCapture={undefined}
                >
                  <PhotoIcon className="h-5 w-5" />
                  Cover Photo (Opsiyonel)
                </Typography>

                {/* Cover Photo Önizlemesi */}
                {coverPhotoPreview && (
                  <div className="mb-3">
                    <Typography
                      variant="small"
                      color="green"
                      className="mb-2"
                      placeholder={undefined}
                      onPointerEnterCapture={undefined}
                      onPointerLeaveCapture={undefined}
                    >
                      Cover Photo Önizlemesi:
                    </Typography>
                    <div className="relative w-32 h-20 rounded-lg overflow-hidden border border-green-300">
                      <img
                        src={coverPhotoPreview}
                        alt="Cover photo önizleme"
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={clearCoverPhoto}
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                      >
                        <XMarkIcon className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                )}

                {/* Dosya Seçimi */}
                <div className="space-y-2">
                  <input
                    id="coverPhotoInput"
                    type="file"
                    accept="image/*"
                    onChange={handleCoverPhotoChange}
                    disabled={loading}
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-pink-50 file:text-pink-700 hover:file:bg-pink-100 disabled:opacity-50"
                  />
                  <Typography
                    variant="small"
                    color="gray"
                    placeholder={undefined}
                    onPointerEnterCapture={undefined}
                    onPointerLeaveCapture={undefined}
                  >
                    📝 Desteklenen format: JPG, PNG, GIF (Maksimum 5MB)
                  </Typography>
                  {selectedCoverPhoto && (
                    <div className="flex items-center justify-between bg-green-50 p-2 rounded">
                      <Typography
                        variant="small"
                        color="green"
                        placeholder={undefined}
                        onPointerEnterCapture={undefined}
                        onPointerLeaveCapture={undefined}
                      >
                        ✓ {selectedCoverPhoto.name} seçildi
                      </Typography>
                      <button
                        type="button"
                        onClick={clearCoverPhoto}
                        className="text-red-500 hover:text-red-700"
                      >
                        <XMarkIcon className="h-4 w-4" />
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                color="pink"
                size="lg"
                fullWidth
                disabled={loading}
                className="bg-gradient-to-r from-pink-500 to-purple-600"
              >
                {loading ? "Kayıt Oluşturuluyor..." : "Şirket Kaydını Tamamla"}
              </Button>
            </form>

            {/* Footer */}
            <div className="mt-6 text-center">
              <Typography variant="small" color="gray">
                Zaten hesabınız var mı?{" "}
                <Button
                  variant="text"
                  size="sm"
                  className="p-0 font-medium text-pink-500"
                  onClick={() => router.push("/admin/login")}
                >
                  Giriş Yapın
                </Button>
              </Typography>
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}