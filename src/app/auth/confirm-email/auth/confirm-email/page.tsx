// @ts-nocheck
"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
  Card,
  CardBody,
  Typography,
  Button,
  Alert,
} from "@material-tailwind/react";
import {
  CheckCircleIcon,
  ExclamationTriangleIcon,
  EnvelopeIcon,
  ArrowRightIcon,
} from "@heroicons/react/24/outline";

interface ConfirmationResponse {
  isSuccess?: boolean;
  success?: boolean;
  message?: string;
  title?: string;
}

function EmailConfirmationContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [confirmationMessage, setConfirmationMessage] = useState("");

  const cid = searchParams.get('cid'); // Company ID
  const token = searchParams.get('token'); // Verification Token

  useEffect(() => {
    const confirmEmail = async () => {
      // URL parametrelerini kontrol et
      if (!cid || !token) {
        setError("Geçersiz doğrulama linki. Company ID veya token eksik.");
        setLoading(false);
        return;
      }

      try {
        console.log("Email confirmation parameters:", { cid, token });

        // Backend API'ye email doğrulama isteği gönder
        const response = await fetch('/api/proxy/auth/confirm-email', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            companyId: cid,
            token: token
          }),
        });

        const data: ConfirmationResponse = await response.json();
        
        console.log("Email confirmation response:", data);

        if (data.isSuccess || data.success) {
          setSuccess(true);
          setConfirmationMessage(data.message || "Email adresiniz başarıyla doğrulandı!");
        } else {
          setError(data.message || data.title || "Email doğrulama işlemi başarısız oldu.");
        }
      } catch (error) {
        console.error("Email confirmation error:", error);
        setError("Bağlantı hatası. Lütfen daha sonra tekrar deneyin.");
      } finally {
        setLoading(false);
      }
    };

    confirmEmail();
  }, [cid, token]);

  const handleLoginRedirect = () => {
    router.push("/admin/login");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardBody className="text-center p-8">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <Typography variant="h5" color="blue-gray" className="mb-2">
              Email Doğrulanıyor
            </Typography>
            <Typography color="gray">
              Lütfen bekleyin...
            </Typography>
          </CardBody>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className={`w-16 h-16 ${success ? 'bg-gradient-to-r from-green-500 to-emerald-600' : 'bg-gradient-to-r from-red-500 to-pink-600'} rounded-full flex items-center justify-center mx-auto mb-4`}>
            {success ? (
              <CheckCircleIcon className="h-8 w-8 text-white" />
            ) : (
              <EnvelopeIcon className="h-8 w-8 text-white" />
            )}
          </div>
          <Typography variant="h3" color="blue-gray" className="mb-2">
            Email Doğrulama
          </Typography>
          <Typography color="gray">
            {success ? "Doğrulama tamamlandı" : "Doğrulama işlemi"}
          </Typography>
        </div>

        <Card>
          <CardBody className="p-8">
            {/* Debug Info (sadece development için) */}
            {process.env.NODE_ENV === 'development' && (
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6">
                <Typography variant="small" color="gray" className="font-medium mb-2">
                  Debug Bilgileri:
                </Typography>
                <Typography variant="small" className="font-mono text-xs break-all text-gray-600">
                  Company ID: {cid || 'Bulunamadı'}<br/>
                  Token: {token || 'Bulunamadı'}
                </Typography>
              </div>
            )}

            {/* Success State */}
            {success && (
              <>
                <Alert
                  color="green"
                  className="mb-6"
                  icon={<CheckCircleIcon className="h-6 w-6" />}
                >
                  {confirmationMessage}
                </Alert>

                <div className="text-center">
                  <Typography color="gray" className="mb-6">
                    Email adresiniz başarıyla doğrulandı. Artık hesabınıza giriş yapabilirsiniz.
                  </Typography>

                  <Button
                    color="green"
                    size="lg"
                    fullWidth
                    className="bg-gradient-to-r from-green-500 to-emerald-600"
                    onClick={handleLoginRedirect}
                  >
                    Giriş Sayfasına Git
                    <ArrowRightIcon className="h-4 w-4 ml-2" />
                  </Button>
                </div>
              </>
            )}

            {/* Error State */}
            {error && (
              <>
                <Alert
                  color="red"
                  className="mb-6"
                  icon={<ExclamationTriangleIcon className="h-6 w-6" />}
                >
                  {error}
                </Alert>

                <div className="text-center">
                  <Typography color="gray" className="mb-6">
                    Email doğrulama işlemi başarısız oldu. Lütfen tekrar deneyin veya yeni bir doğrulama maili isteyin.
                  </Typography>

                  <div className="space-y-3">
                    <Button
                      color="blue"
                      size="lg"
                      fullWidth
                      variant="outlined"
                      onClick={handleLoginRedirect}
                    >
                      Giriş Sayfasına Dön
                    </Button>

                    <Button
                      color="gray"
                      size="sm"
                      fullWidth
                      variant="text"
                      onClick={() => window.location.reload()}
                    >
                      Tekrar Dene
                    </Button>
                  </div>
                </div>
              </>
            )}
          </CardBody>
        </Card>

        {/* Footer */}
        <div className="mt-6 text-center">
          <Typography variant="small" color="gray">
            Sorun mu yaşıyorsunuz?{" "}
            <Button
              variant="text"
              size="sm"
              className="p-0 font-medium text-blue-500"
              onClick={() => router.push("/email-verification")}
            >
              Yeni doğrulama maili isteyin
            </Button>
          </Typography>
        </div>
      </div>
    </div>
  );
}

function LoadingFallback() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardBody className="text-center p-8">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <Typography variant="h5" color="blue-gray" className="mb-2">
            Sayfa Yükleniyor
          </Typography>
          <Typography color="gray">
            Lütfen bekleyin...
          </Typography>
        </CardBody>
      </Card>
    </div>
  );
}

export default function ConfirmEmailPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <EmailConfirmationContent />
    </Suspense>
  );
}