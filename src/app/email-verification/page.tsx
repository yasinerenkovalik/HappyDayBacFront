// @ts-nocheck
"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardBody,
  Typography,
  Button,
  Alert,
} from "@material-tailwind/react";
import {
  EnvelopeIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  ArrowPathIcon,
} from "@heroicons/react/24/outline";

export default function EmailVerificationPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [userEmail, setUserEmail] = useState("");

  useEffect(() => {
    // Token varsa email adresini çıkarmaya çalış
    const token = localStorage.getItem("authToken");
    if (token) {
      try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
        
        const decodedToken = JSON.parse(jsonPayload);
        
        // Email adresini token'dan al (muhtemel field'lar)
        const email = decodedToken.email || decodedToken.Email || decodedToken.sub || decodedToken.unique_name;
        if (email) {
          setUserEmail(email);
        }
      } catch (error) {
        console.error("Token parsing error:", error);
      }
    }
    
    // Eğer token yoksa login sayfasına yönlendir
    if (!token) {
      router.push("/admin/login");
    }
  }, [router]);

  const handleResendVerification = async () => {
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const token = localStorage.getItem("authToken");
      
      const response = await fetch("/api/proxy/auth/resend-verification", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (data.isSuccess || response.ok) {
        setSuccess("Doğrulama e-postası tekrar gönderildi! Lütfen e-posta kutunuzu kontrol edin.");
      } else {
        setError(data.message || "E-posta gönderilirken hata oluştu.");
      }
    } catch (error) {
      console.error("Resend verification error:", error);
      setError("Bağlantı hatası. Lütfen tekrar deneyin.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    // Auth data'yı temizle
    localStorage.removeItem("authToken");
    localStorage.removeItem("userRole");
    localStorage.removeItem("userType");
    localStorage.removeItem("companyId");
    localStorage.removeItem("userId");
    localStorage.removeItem("companyName");
    
    // Login sayfasına yönlendir
    router.push("/admin/login");
  };

  const handleCheckVerification = async () => {
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const token = localStorage.getItem("authToken");
      
      const response = await fetch("/api/proxy/auth/check-verification-status", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (data.isSuccess && data.data && data.data.isEmailConfirmed) {
        // Email doğrulandıysa localStorage'ı güncelle ve dashboard'a yönlendir
        localStorage.setItem("isEmailConfirmed", "true");
        
        const userType = localStorage.getItem("userType");
        if (userType === "company") {
          router.push("/admin/company-dashboard");
        } else {
          router.push("/admin/dashboard");
        }
      } else {
        setError("E-posta adresiniz henüz doğrulanmamış. Lütfen e-posta kutunuzu kontrol edin.");
      }
    } catch (error) {
      console.error("Check verification error:", error);
      setError("Bağlantı hatası. Lütfen tekrar deneyin.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-pink-50 flex items-center justify-center p-4">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-20 w-96 h-96 bg-orange-300 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-red-300 rounded-full mix-blend-multiply filter blur-xl animate-pulse delay-1000"></div>
      </div>

      <div className="w-full max-w-md relative z-10">
        <Card className="shadow-2xl border border-white/20 bg-white/80 backdrop-blur-sm">
          <CardBody className="p-8 text-center">
            {/* Icon */}
            <div className="w-20 h-20 bg-gradient-to-r from-orange-500 to-red-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <EnvelopeIcon className="h-10 w-10 text-white" />
            </div>

            {/* Title */}
            <Typography variant="h4" color="blue-gray" className="mb-3">
              E-posta Doğrulama Gerekli
            </Typography>

            {/* Description */}
            <Typography color="gray" className="mb-6 text-sm leading-relaxed">
              Hesabınızı kullanmaya devam etmek için e-posta adresinizi doğrulamanız gerekiyor.
              {userEmail && (
                <>
                  <br />
                  <strong className="text-blue-600">{userEmail}</strong> adresine gönderilen doğrulama linkine tıklayın.
                </>
              )}
            </Typography>

            {/* Alerts */}
            {error && (
              <Alert
                color="red"
                className="mb-4 text-left"
                icon={<ExclamationTriangleIcon className="h-6 w-6" />}
              >
                {error}
              </Alert>
            )}

            {success && (
              <Alert
                color="green"
                className="mb-4 text-left"
                icon={<CheckCircleIcon className="h-6 w-6" />}
              >
                {success}
              </Alert>
            )}

            {/* Action Buttons */}
            <div className="space-y-3">
              <Button
                onClick={handleResendVerification}
                disabled={loading}
                className="w-full bg-gradient-to-r from-orange-500 to-red-600"
                size="lg"
              >
                {loading ? (
                  <div className="flex items-center justify-center gap-2">
                    <ArrowPathIcon className="h-4 w-4 animate-spin" />
                    Gönderiliyor...
                  </div>
                ) : (
                  "Doğrulama E-postasını Tekrar Gönder"
                )}
              </Button>

              <Button
                onClick={handleCheckVerification}
                variant="outlined"
                color="blue"
                size="lg"
                className="w-full"
                disabled={loading}
              >
                E-postamı Doğruladım
              </Button>

              <Button
                onClick={handleLogout}
                variant="text"
                color="gray"
                size="sm"
                className="w-full"
              >
                Çıkış Yap
              </Button>
            </div>

            {/* Help Text */}
            <div className="mt-6 pt-4 border-t border-gray-200">
              <Typography variant="small" color="gray" className="text-xs">
                E-posta gelmedi mi? Spam klasörünü kontrol edin veya tekrar gönder butonuna tıklayın.
              </Typography>
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}