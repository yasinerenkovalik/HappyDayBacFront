// @ts-nocheck
"use client";

import React, { useState } from "react";
import {
  Card,
  CardBody,
  Typography,
  Button,
  Input,
  Alert,
  Textarea,
} from "@material-tailwind/react";
import {
  PlusIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  ClipboardDocumentIcon,
} from "@heroicons/react/24/outline";
import AdminLayout from "../components/AdminLayout";
import ProtectedRoute from "../components/ProtectedRoute";
import { getAuthToken } from "@/lib/auth";

interface InvitationData {
  email: string;
  companyNameHint: string;
  expiresAt: string;
}

interface InvitationResponse {
  token: string;
  expiresAt: string;
  message?: string;
  title?: string;
}

export default function InvitationsPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [generatedToken, setGeneratedToken] = useState("");
  
  const [formData, setFormData] = useState<InvitationData>({
    email: "",
    companyNameHint: "",
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 16), // 7 gün sonra
  });

  const handleInputChange = (field: keyof InvitationData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.email || !formData.companyNameHint) {
      setError("Email ve şirket adı alanları zorunludur");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");
    setGeneratedToken("");

    try {
      const token = getAuthToken();
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      };
      
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      // ISO string'i backend için uygun formata çevir
      const expiresAtISO = new Date(formData.expiresAt).toISOString();

      const requestBody = {
        email: formData.email,
        companyNameHint: formData.companyNameHint,
        expiresAt: expiresAtISO,
      };

      console.log("Sending invitation request:", requestBody);

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/admin/invitations/create`, {
        method: "POST",
        headers,
        body: JSON.stringify(requestBody),
      });

      const result = await response.json();

      console.log("API Response:", result);

      if (response.ok && result.token) {
        // Backend direkt token döndürüyor
        setSuccess("Davetiye başarıyla oluşturuldu!");
        setGeneratedToken(result.token);
        
        // Formu temizle
        setFormData({
          email: "",
          companyNameHint: "",
          expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 16),
        });
      } else {
        setError(result.message || result.title || "Davetiye oluşturulurken hata oluştu");
      }
    } catch (error) {
      console.error("Invitation creation error:", error);
      setError("Bağlantı hatası. Lütfen tekrar deneyin.");
    } finally {
      setLoading(false);
    }
  };

  const copyTokenToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(generatedToken);
      setSuccess("Token panoya kopyalandı!");
    } catch (error) {
      console.error("Copy failed:", error);
    }
  };

  return (
    <ProtectedRoute>
      <AdminLayout userType="admin">
        <div className="p-6">
          {/* Header */}
          <div className="mb-8">
            <Typography variant="h3" color="blue-gray" className="mb-2">
              Şirket Davetiyesi Oluştur
            </Typography>
            <Typography color="gray">
              Yeni şirketler için davetiye token'ı oluşturun
            </Typography>
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

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Form */}
            <Card>
              <CardBody className="p-6">
                <Typography variant="h5" color="blue-gray" className="mb-6">
                  Davetiye Bilgileri
                </Typography>

                <form onSubmit={handleSubmit} className="space-y-4">
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
                      label="Şirket Adı İpucu *"
                      value={formData.companyNameHint}
                      onChange={(e) => handleInputChange("companyNameHint", e.target.value)}
                      required
                      crossOrigin={undefined}
                    />
                  </div>

                  <div>
                    <Input
                      label="Son Kullanma Tarihi *"
                      type="datetime-local"
                      value={formData.expiresAt}
                      onChange={(e) => handleInputChange("expiresAt", e.target.value)}
                      required
                      crossOrigin={undefined}
                    />
                  </div>

                  <Button
                    type="submit"
                    color="pink"
                    size="lg"
                    fullWidth
                    disabled={loading}
                    className="flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      "Oluşturuluyor..."
                    ) : (
                      <>
                        <PlusIcon className="h-5 w-5" />
                        Davetiye Oluştur
                      </>
                    )}
                  </Button>
                </form>
              </CardBody>
            </Card>

            {/* Generated Token */}
            {generatedToken && (
              <Card>
                <CardBody className="p-6">
                  <Typography variant="h5" color="blue-gray" className="mb-6">
                    Oluşturulan Token
                  </Typography>

                  <div className="space-y-4">
                    <div>
                      <Typography variant="small" color="gray" className="mb-2">
                        Davetiye Token'ı:
                      </Typography>
                      <Textarea
                        value={generatedToken}
                        readOnly
                        rows={6}
                        className="font-mono text-sm"
                      />
                    </div>

                    <div className="space-y-2">
                      <Button
                        onClick={copyTokenToClipboard}
                        color="blue"
                        variant="outlined"
                        fullWidth
                        className="flex items-center justify-center gap-2"
                      >
                        <ClipboardDocumentIcon className="h-5 w-5" />
                        Token'ı Kopyala
                      </Button>

                      <Button
                        onClick={() => {
                          const registrationLink = `${window.location.origin}/create-company/${generatedToken}`;
                          navigator.clipboard.writeText(registrationLink);
                          setSuccess("Kayıt linki panoya kopyalandı!");
                        }}
                        color="green"
                        variant="outlined"
                        fullWidth
                        className="flex items-center justify-center gap-2"
                      >
                        <ClipboardDocumentIcon className="h-5 w-5" />
                        Kayıt Linkini Kopyala
                      </Button>
                    </div>

                    <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                      <Typography variant="small" color="blue" className="font-medium mb-2">
                        📧 Kayıt Linki:
                      </Typography>
                      <Typography variant="small" className="font-mono text-xs break-all text-gray-600">
                        {`${typeof window !== 'undefined' ? window.location.origin : ''}/create-company/${generatedToken}`}
                      </Typography>
                    </div>

                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                      <Typography variant="small" color="amber" className="font-medium mb-2">
                        ⚠️ Önemli Notlar:
                      </Typography>
                      <ul className="text-sm text-gray-700 space-y-1">
                        <li>• Bu token'ı güvenli bir şekilde saklayın</li>
                        <li>• Token sadece bir kez kullanılabilir</li>
                        <li>• Belirtilen tarihte otomatik olarak geçersiz olur</li>
                        <li>• Şirket kaydı için bu token gereklidir</li>
                      </ul>
                    </div>
                  </div>
                </CardBody>
              </Card>
            )}
          </div>
        </div>
      </AdminLayout>
    </ProtectedRoute>
  );
}