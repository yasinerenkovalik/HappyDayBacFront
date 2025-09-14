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
  Switch,
  Alert,
  Chip
} from "@material-tailwind/react";
import {
  ArrowLeftIcon,
  PhotoIcon,
  PlusIcon,
  XMarkIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  EyeIcon,
  TrashIcon,
  MapPinIcon
} from "@heroicons/react/24/outline";
import AdminLayout from "../../../components/AdminLayout";
import ProtectedRoute from "../../../components/ProtectedRoute";
import {
  getOrganizationDetail,
  updateOrganization,
  addOrganizationImages,
  OrganizationDetail,
  OrganizationUpdateData
} from "@/lib/auth";

export default function EditOrganizationPage() {
  const params = useParams();
  const router = useRouter();
  const organizationId = params.id as string;

  // Get user type from localStorage
  const [userType, setUserType] = useState<"admin" | "company">("company");
  const [organization, setOrganization] = useState<OrganizationDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [newService, setNewService] = useState("");
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [uploadingImages, setUploadingImages] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: 0,
    maxGuestCount: 0,
    categoryId: 0,
    cityId: 0,
    services: [] as string[],
    duration: "",
    isOutdoor: false,
    reservationNote: "",
    cancelPolicy: "",
    videoUrl: "",
    coverPhoto: null as File | null
  });

  // Fetch organization data
  useEffect(() => {
    // Debug: Image base URL kontrolü
    console.log('🖼️ IMAGE_BASE_URL:', process.env.NEXT_PUBLIC_IMAGE_BASE_URL);
    
    // Set user type from localStorage
    const storedUserType = localStorage.getItem("userType") as "admin" | "company";
    if (storedUserType) {
      setUserType(storedUserType);
    }

    const fetchOrganization = async () => {
      try {
        setLoading(true);
        const response = await getOrganizationDetail(organizationId);

        if (response.isSuccess) {
          const org = response.data;
          console.log('🏢 Organizasyon verileri yüklendi:', org);
          console.log('🖼️ Cover photo path:', org.coverPhotoPath);
          console.log('🖼️ Images array:', org.images);
          
          setOrganization(org);
          setFormData({
            title: org.title || "",
            description: org.description || "",
            price: org.price || 0,
            maxGuestCount: org.maxGuestCount || 0,
            categoryId: org.categoryId || 0,
            cityId: org.cityId || 0,
            services: org.services || [],
            duration: org.duration || "",
            isOutdoor: org.isOutdoor || false,
            reservationNote: org.reservationNote || "",
            cancelPolicy: org.cancelPolicy || "",
            videoUrl: org.videoUrl || "",
            coverPhoto: null
          });
        } else {
          setError(response.message || "Organizasyon yüklenirken hata oluştu");
        }
      } catch (error) {
        console.error("Error fetching organization:", error);
        setError("Bağlantı hatası. Lütfen tekrar deneyin.");
      } finally {
        setLoading(false);
      }
    };

    if (organizationId) {
      fetchOrganization();
    }
  }, [organizationId]);

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData(prev => ({ ...prev, coverPhoto: file }));
    }
  };

  const handleImageSelection = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      setSelectedImages(files);
    }
  };

  const handleAddImages = async () => {
    if (selectedImages.length === 0) {
      setError("Lütfen en az bir resim seçin");
      return;
    }

    setUploadingImages(true);
    setError("");
    setSuccess("");

    try {
      const response = await addOrganizationImages(organizationId, selectedImages);

      if (response.isSuccess) {
        setSuccess(response.message);
        setSelectedImages([]);

        // Organizasyon verilerini yeniden yükle
        const orgResponse = await getOrganizationDetail(organizationId);
        if (orgResponse.isSuccess) {
          setOrganization(orgResponse.data);
        }
      } else {
        setError(response.message || "Resim ekleme sırasında hata oluştu");
      }
    } catch (error) {
      console.error("Error adding images:", error);
      setError("Bağlantı hatası. Lütfen tekrar deneyin.");
    } finally {
      setUploadingImages(false);
    }
  };

  const removeSelectedImage = (index: number) => {
    setSelectedImages(prev => prev.filter((_, i) => i !== index));
  };

  const addService = () => {
    if (newService.trim() && !formData.services.includes(newService.trim())) {
      setFormData(prev => ({
        ...prev,
        services: [...prev.services, newService.trim()]
      }));
      setNewService("");
    }
  };

  const removeService = (serviceToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      services: prev.services.filter(service => service !== serviceToRemove)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title || !formData.description) {
      setError("Başlık ve açıklama alanları zorunludur");
      return;
    }

    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const updateData: OrganizationUpdateData = {
        id: organizationId,
        title: formData.title,
        description: formData.description,
        price: formData.price,
        maxGuestCount: formData.maxGuestCount,
        categoryId: formData.categoryId || undefined,
        cityId: formData.cityId || undefined,
        services: formData.services,
        duration: formData.duration || "1 saat",
        isOutdoor: formData.isOutdoor,
        reservationNote: formData.reservationNote || "Rezervasyon notu bulunmamaktadır.",
        cancelPolicy: formData.cancelPolicy || "İptal politikası bulunmamaktadır.",
        videoUrl: formData.videoUrl || "",
        coverPhoto: formData.coverPhoto || undefined
      };

      const response = await updateOrganization(updateData);

      if (response.isSuccess) {
        setSuccess("Organizasyon başarıyla güncellendi!");
        setTimeout(() => {
          if (userType === "admin") {
            router.push("/admin/organizations");
          } else {
            router.push("/admin/my-organizations");
          }
        }, 2000);
      } else {
        if (response.errors) {
          const errorMessages = Object.entries(response.errors)
            .map(([field, messages]: [string, any]) => `${field}: ${Array.isArray(messages) ? messages.join(', ') : messages}`)
            .join('\n');
          setError(`Validation Hataları:\n${errorMessages}`);
        } else {
          setError(response.message || response.title || "Güncelleme sırasında hata oluştu");
        }
      }
    } catch (error) {
      console.error("Error updating organization:", error);
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
              >
                Organizasyon yükleniyor...
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
            <Button
              variant="text"
              className="flex items-center gap-2"
              onClick={() => {
                if (userType === "admin") {
                  router.push("/admin/organizations");
                } else {
                  router.push("/admin/my-organizations");
                }
              }}
              placeholder={undefined}
              onPointerEnterCapture={undefined}
              onPointerLeaveCapture={undefined}
            >
              <ArrowLeftIcon className="h-4 w-4" />
              Geri Dön
            </Button>
            <div>
              <Typography
                variant="h3"
                color="blue-gray"
                className="mb-2"
                placeholder={undefined}
                onPointerEnterCapture={undefined}
                onPointerLeaveCapture={undefined}
              >
                Organizasyon Düzenle
              </Typography>
              <Typography
                color="gray"
                placeholder={undefined}
                onPointerEnterCapture={undefined}
                onPointerLeaveCapture={undefined}
              >
                {organization?.title}
              </Typography>
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
            >
              {success}
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Main Form */}
              <div className="lg:col-span-2 space-y-6">
                {/* Basic Information */}
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
                      Temel Bilgiler
                    </Typography>

                    <div className="space-y-4">
                      <Input
                        label="Organizasyon Başlığı *"
                        value={formData.title}
                        onChange={(e) => handleInputChange("title", e.target.value)}
                        required
                        crossOrigin={undefined}
                        onPointerEnterCapture={undefined}
                        onPointerLeaveCapture={undefined}
                      />

                      <Textarea
                        label="Açıklama *"
                        value={formData.description}
                        onChange={(e) => handleInputChange("description", e.target.value)}
                        rows={4}
                        required
                      />

                      <div className="grid grid-cols-2 gap-4">
                        <Input
                          label="Fiyat (₺)"
                          type="number"
                          value={formData.price.toString()}
                          onChange={(e) => handleInputChange("price", parseFloat(e.target.value) || 0)}
                          crossOrigin={undefined}
                          onPointerEnterCapture={undefined}
                          onPointerLeaveCapture={undefined}
                        />
                        <Input
                          label="Maksimum Misafir Sayısı"
                          type="number"
                          value={formData.maxGuestCount.toString()}
                          onChange={(e) => handleInputChange("maxGuestCount", parseInt(e.target.value) || 0)}
                          crossOrigin={undefined}
                          onPointerEnterCapture={undefined}
                          onPointerLeaveCapture={undefined}
                        />
                      </div>

                      <Input
                        label="Süre"
                        value={formData.duration}
                        onChange={(e) => handleInputChange("duration", e.target.value)}
                        placeholder="Örn: 4 saat (boş bırakılırsa '1 saat' olarak ayarlanır)"
                        crossOrigin={undefined}
                        onPointerEnterCapture={undefined}
                        onPointerLeaveCapture={undefined}
                      />
                    </div>
                  </CardBody>
                </Card>

                {/* Services */}
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
                      Hizmetler
                    </Typography>

                    <div className="flex gap-2 mb-4">
                      <Input
                        label="Yeni Hizmet Ekle"
                        value={newService}
                        onChange={(e) => setNewService(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addService())}
                        crossOrigin={undefined}
                        onPointerEnterCapture={undefined}
                        onPointerLeaveCapture={undefined}
                      />
                      <Button
                        onClick={addService}
                        className="flex items-center gap-2"
                        placeholder={undefined}
                        onPointerEnterCapture={undefined}
                        onPointerLeaveCapture={undefined}
                      >
                        <PlusIcon className="h-4 w-4" />
                        Ekle
                      </Button>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {formData.services.map((service, index) => (
                        <Chip
                          key={index}
                          value={service}
                          onClose={() => removeService(service)}
                          className="bg-blue-100 text-blue-800"
                        />
                      ))}
                    </div>
                  </CardBody>
                </Card>

                {/* Additional Information */}
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
                      Ek Bilgiler
                    </Typography>

                    <div className="space-y-4">
                      <Textarea
                        label="Rezervasyon Notu"
                        value={formData.reservationNote}
                        onChange={(e) => handleInputChange("reservationNote", e.target.value)}
                        rows={3}
                        placeholder="Boş bırakılırsa varsayılan not kullanılır"
                      />

                      <Textarea
                        label="İptal Politikası"
                        value={formData.cancelPolicy}
                        onChange={(e) => handleInputChange("cancelPolicy", e.target.value)}
                        rows={3}
                        placeholder="Boş bırakılırsa varsayılan politika kullanılır"
                      />

                      <Input
                        label="Video URL"
                        value={formData.videoUrl}
                        onChange={(e) => handleInputChange("videoUrl", e.target.value)}
                        placeholder="https://youtube.com/watch?v=... (opsiyonel)"
                        crossOrigin={undefined}
                        onPointerEnterCapture={undefined}
                        onPointerLeaveCapture={undefined}
                      />
                    </div>
                  </CardBody>
                </Card>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Settings */}
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
                      Ayarlar
                    </Typography>

                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <Typography
                          placeholder={undefined}
                          onPointerEnterCapture={undefined}
                          onPointerLeaveCapture={undefined}
                        >
                          Dış Mekan
                        </Typography>
                        <Switch
                          checked={formData.isOutdoor}
                          onChange={(e) => handleInputChange("isOutdoor", e.target.checked)}
                          crossOrigin={undefined}
                          onPointerEnterCapture={undefined}
                          onPointerLeaveCapture={undefined}
                        />
                      </div>
                    </div>
                  </CardBody>
                </Card>

                {/* Cover Photo */}
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
                      Kapak Fotoğrafı
                    </Typography>

                    {organization?.coverPhotoPath && (
                      <div className="mb-4">
                        <img
                          src={`/api/images/${organization.coverPhotoPath.startsWith('/') ? organization.coverPhotoPath.substring(1) : organization.coverPhotoPath}`}
                          alt="Mevcut kapak fotoğrafı"
                          className="w-full h-32 object-cover rounded-lg"
                          onError={(e) => {
                            console.log('❌ Cover image load error:', e.currentTarget.src);
                            e.currentTarget.src = '/api/images/placeholder.jpg';
                          }}
                        />
                        <Typography
                          variant="small"
                          color="gray"
                          className="mt-2"
                          placeholder={undefined}
                          onPointerEnterCapture={undefined}
                          onPointerLeaveCapture={undefined}
                        >
                          Mevcut kapak fotoğrafı
                        </Typography>
                      </div>
                    )}

                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="hidden"
                        id="coverPhoto"
                      />
                      <label htmlFor="coverPhoto" className="cursor-pointer">
                        <PhotoIcon className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                        <Typography
                          variant="small"
                          color="gray"
                          placeholder={undefined}
                          onPointerEnterCapture={undefined}
                          onPointerLeaveCapture={undefined}
                        >
                          Yeni fotoğraf seç
                        </Typography>
                      </label>
                    </div>

                    {formData.coverPhoto && (
                      <Typography
                        variant="small"
                        color="green"
                        className="mt-2"
                        placeholder={undefined}
                        onPointerEnterCapture={undefined}
                        onPointerLeaveCapture={undefined}
                      >
                        Seçilen: {formData.coverPhoto.name}
                      </Typography>
                    )}
                  </CardBody>
                </Card>

                {/* Add New Images */}
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
                      Yeni Resim Ekle
                    </Typography>

                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center mb-4">
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleImageSelection}
                        className="hidden"
                        id="galleryImages"
                      />
                      <label htmlFor="galleryImages" className="cursor-pointer">
                        <PhotoIcon className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                        <Typography
                          variant="small"
                          color="gray"
                          placeholder={undefined}
                          onPointerEnterCapture={undefined}
                          onPointerLeaveCapture={undefined}
                        >
                          Birden fazla resim seçin
                        </Typography>
                      </label>
                    </div>

                    {/* Selected Images Preview */}
                    {selectedImages.length > 0 && (
                      <div className="mb-4">
                        <Typography
                          variant="small"
                          className="mb-2 font-medium"
                          placeholder={undefined}
                          onPointerEnterCapture={undefined}
                          onPointerLeaveCapture={undefined}
                        >
                          Seçilen Resimler ({selectedImages.length}):
                        </Typography>
                        <div className="grid grid-cols-2 gap-2">
                          {selectedImages.map((file, index) => (
                            <div key={index} className="relative">
                              <img
                                src={URL.createObjectURL(file)}
                                alt={`Seçilen resim ${index + 1}`}
                                className="w-full h-16 object-cover rounded"
                              />
                              <Button
                                size="sm"
                                color="red"
                                className="absolute -top-2 -right-2 p-1 rounded-full"
                                onClick={() => removeSelectedImage(index)}
                                placeholder={undefined}
                                onPointerEnterCapture={undefined}
                                onPointerLeaveCapture={undefined}
                              >
                                <XMarkIcon className="h-3 w-3" />
                              </Button>
                              <Typography
                                variant="small"
                                className="text-xs text-gray-600 mt-1 truncate"
                                placeholder={undefined}
                                onPointerEnterCapture={undefined}
                                onPointerLeaveCapture={undefined}
                              >
                                {file.name}
                              </Typography>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <Button
                      onClick={handleAddImages}
                      disabled={selectedImages.length === 0 || uploadingImages}
                      loading={uploadingImages}
                      className="w-full bg-gradient-to-r from-green-500 to-blue-600"
                      placeholder={undefined}
                      onPointerEnterCapture={undefined}
                      onPointerLeaveCapture={undefined}
                    >
                      {uploadingImages ? "Resimler Yükleniyor..." : `${selectedImages.length} Resim Ekle`}
                    </Button>
                  </CardBody>
                </Card>

                {/* Image Gallery */}
                {organization?.images && organization.images.length > 0 && (
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
                        Mevcut Resim Galerisi ({organization.images.length})
                      </Typography>

                      <div className="grid grid-cols-2 gap-3">
                        {organization.images.map((image) => (
                          <div key={image.id} className="relative group">
                            <img
                              src={`/api/images/${image.imageUrl.startsWith('/') ? image.imageUrl.substring(1) : image.imageUrl}`}
                              alt={`Galeri resmi ${image.id}`}
                              className="w-full h-24 object-cover rounded-lg transition-transform duration-300 group-hover:scale-105"
                              onError={(e) => {
                                console.log('❌ Gallery image load error:', e.currentTarget.src);
                                e.currentTarget.src = '/api/images/placeholder.jpg';
                              }}
                            />
                            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 rounded-lg flex items-center justify-center">
                              <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex gap-2">
                                <Button
                                  size="sm"
                                  color="blue"
                                  className="p-2"
                                  onClick={() => window.open(`/api/images/${image.imageUrl.startsWith('/') ? image.imageUrl.substring(1) : image.imageUrl}`, '_blank')}
                                  placeholder={undefined}
                                  onPointerEnterCapture={undefined}
                                  onPointerLeaveCapture={undefined}
                                >
                                  <EyeIcon className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                            <div className="absolute bottom-1 left-1 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
                              ID: {image.id}
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardBody>
                  </Card>
                )}

                {/* Actions */}
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
                    <div className="space-y-3">
                      <Button
                        type="submit"
                        className="w-full bg-gradient-to-r from-pink-500 to-purple-600"
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
                            router.push("/admin/organizations");
                          } else {
                            router.push("/admin/my-organizations");
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