// @ts-nocheck
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Typography } from "@material-tailwind/react";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredUserType?: "admin" | "company";
}

export default function ProtectedRoute({ children, requiredUserType }: ProtectedRouteProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const router = useRouter();

  const parseJWT = (token: string) => {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));
      return JSON.parse(jsonPayload);
    } catch (error) {
      return null;
    }
  };

  const isTokenValid = (token: string) => {
    const payload = parseJWT(token);
    if (!payload) return false;
    
    const currentTime = Date.now() / 1000;
    return payload.exp > currentTime;
  };

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem("authToken");
      const userType = localStorage.getItem("userType");
      const userRole = localStorage.getItem("userRole");
      
      // Token kontrolü
      if (!token || !isTokenValid(token)) {
        localStorage.clear();
        router.push("/admin/login");
        return;
      }

      // User type kontrolü
      if (!userType) {
        localStorage.clear();
        router.push("/admin/login");
        return;
      }

      // Required user type kontrolü
      if (requiredUserType && userType !== requiredUserType) {
        router.push("/admin/login");
        return;
      }

      // Role kontrolü (ek güvenlik)
      if (userType === "admin" && userRole !== "Admin") {
        localStorage.clear();
        router.push("/admin/login");
        return;
      }

      if (userType === "company" && userRole !== "Company") {
        localStorage.clear();
        router.push("/admin/login");
        return;
      }

      setIsAuthorized(true);
      setIsLoading(false);
    };

    checkAuth();

    // Token süresini kontrol etmek için interval
    const interval = setInterval(() => {
      const token = localStorage.getItem("authToken");
      if (token && !isTokenValid(token)) {
        localStorage.clear();
        router.push("/admin/login");
      }
    }, 60000); // Her dakika kontrol et

    return () => clearInterval(interval);
  }, [router, requiredUserType]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto mb-4"></div>
          <Typography
            placeholder={undefined}
            onPointerEnterCapture={undefined}
            onPointerLeaveCapture={undefined}
          >
            Yükleniyor...
          </Typography>
        </div>
      </div>
    );
  }

  if (!isAuthorized) {
    return null;
  }

  return <>{children}</>;
}