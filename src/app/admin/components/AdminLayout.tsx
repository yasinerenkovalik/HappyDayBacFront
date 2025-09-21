// @ts-nocheck
"use client";

import React, { useState, useEffect } from "react";
import { 
  Card, 
  Typography, 
  List, 
  ListItem, 
  ListItemPrefix, 
  Avatar,
  Button,
  IconButton
} from "@material-tailwind/react";
import { 
  HomeIcon,
  BuildingOfficeIcon,
  CalendarDaysIcon,
  UserGroupIcon,
  ChartBarIcon,
  CogIcon,
  ArrowRightOnRectangleIcon,
  Bars3Icon,
  XMarkIcon,
  SparklesIcon,
  UserIcon
} from "@heroicons/react/24/outline";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Logo } from "@/components";

interface AdminLayoutProps {
  children: React.ReactNode;
  userType: "admin" | "company";
}

export default function AdminLayout({ children, userType }: AdminLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [companyName, setCompanyName] = useState("Şirket Hesabı");
  const router = useRouter();

  // Get company name from localStorage or API
  useEffect(() => {
    if (userType === "company") {
      const storedCompanyName = localStorage.getItem("companyName");
      if (storedCompanyName) {
        setCompanyName(storedCompanyName);
      }
    }
  }, [userType]);

  const adminMenuItems = [
    {
      label: "Dashboard",
      icon: HomeIcon,
      href: "/admin/dashboard",
    },
    {
      label: "Şirketler",
      icon: BuildingOfficeIcon,
      href: "/admin/companies",
    },
    {
      label: "Organizasyonlar",
      icon: CalendarDaysIcon,
      href: "/admin/organizations",
    },
    {
      label: "İletişim Mesajları",
      icon: UserIcon,
      href: "/admin/contacts",
    },
    {
      label: "Davetiyeler",
      icon: SparklesIcon,
      href: "/admin/invitations",
    },
    {
      label: "Kullanıcılar",
      icon: UserGroupIcon,
      href: "/admin/users",
    },
    {
      label: "Raporlar",
      icon: ChartBarIcon,
      href: "/admin/reports",
    },
    {
      label: "Ayarlar",
      icon: CogIcon,
      href: "/admin/settings",
    },
  ];

  const companyMenuItems = [
    {
      label: "Dashboard",
      icon: HomeIcon,
      href: "/admin/company-dashboard",
    },
    {
      label: "Organizasyonlarım",
      icon: CalendarDaysIcon,
      href: "/admin/my-organizations",
    },
    {
      label: "Rezervasyonlar",
      icon: UserGroupIcon,
      href: "/admin/bookings",
    },
    {
      label: "Raporlarım",
      icon: ChartBarIcon,
      href: "/admin/my-reports",
    },
  
  ];

  const menuItems = userType === "admin" ? adminMenuItems : companyMenuItems;

  const handleLogout = () => {
    // Tüm localStorage verilerini temizle
    localStorage.removeItem("authToken");
    localStorage.removeItem("userType");
    localStorage.removeItem("userRole");
    localStorage.removeItem("companyId");
    localStorage.removeItem("userId");
    router.push("/admin/login");
  };

  const currentPath = typeof window !== "undefined" ? window.location.pathname : "";

  return (
    <div className="admin-layout min-h-screen bg-gray-50 flex overflow-hidden w-full">
      {/* Sidebar */}
      <div className={`admin-sidebar fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-xl transform ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 lg:w-64 flex flex-col`}>
        <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200 flex-shrink-0">
          <div className="flex-shrink-0">
            <Logo size="sm" showText={true} />
          </div>
          <IconButton
            variant="text"
            className="lg:hidden flex-shrink-0"
            onClick={() => setSidebarOpen(false)}
          >
            <XMarkIcon className="h-5 w-5" />
          </IconButton>
        </div>

        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="admin-sidebar-content flex-1 overflow-y-auto p-6">
            {/* User Info */}
            <div className="flex items-center gap-3 mb-6 p-3 bg-gray-50 rounded-lg">
              <Avatar
                src="/image/avatar/admin-avatar.jpg"
                alt="User"
                size="sm"
                className="ring-2 ring-pink-100 flex-shrink-0"
              />
              <div className="min-w-0 flex-1">
                <Typography variant="small" className="font-medium truncate">
                  {userType === "admin" ? "Admin User" : companyName}
                </Typography>
                <Typography variant="small" color="gray" className="truncate">
                  {userType === "admin" ? "Sistem Yöneticisi" : "Şirket Hesabı"}
                </Typography>
              </div>
            </div>

            {/* Menu Items */}
            <List className="p-0 flex-1">
              {menuItems.map((item, index) => (
                <Link key={index} href={item.href}>
                  <ListItem 
                    className={`mb-1 text-sm ${currentPath === item.href ? "bg-gradient-to-r from-pink-500 to-purple-600 text-white" : "text-gray-700 hover:bg-gray-100"}`}
                    onClick={() => setSidebarOpen(false)}
                  >
                    <ListItemPrefix>
                      <item.icon className="h-5 w-5 flex-shrink-0" />
                    </ListItemPrefix>
                    <span className="truncate">{item.label}</span>
                  </ListItem>
                </Link>
              ))}
            </List>
          </div>

          {/* Logout Button */}
          <div className="p-6 pt-0 border-t border-gray-200 flex-shrink-0">
            <Button
              variant="outlined"
              color="red"
              className="w-full flex items-center justify-center gap-2 text-sm"
              onClick={handleLogout}
            >
              <ArrowRightOnRectangleIcon className="h-4 w-4 flex-shrink-0" />
              <span className="truncate">Çıkış Yap</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="admin-main-content flex-1 flex flex-col min-w-0 overflow-auto p-6">
        {/* Top Bar */}
        <div className="bg-white shadow-sm border-b border-gray-200 px-6 py-4 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 min-w-0 flex-1">
              <IconButton
                variant="text"
                className="lg:hidden flex-shrink-0"
                onClick={() => setSidebarOpen(true)}
              >
                <Bars3Icon className="h-5 w-5" />
              </IconButton>
              <Typography variant="h6" color="blue-gray" className="truncate">
                {userType === "admin" ? "Admin Paneli" : "Şirket Paneli"}
              </Typography>
            </div>

            <div className="flex items-center gap-4 flex-shrink-0">
      
              <Button
                size="sm"
                className="bg-gradient-to-r from-pink-500 to-purple-600"
                onClick={() => router.push("/")}
              >
                <span className="hidden sm:inline">Siteyi Görüntüle</span>
                <span className="sm:hidden">Site</span>
              </Button>
            </div>
          </div>
        </div>

        {/* Page Content */}
        <main className="admin-content-area flex-1 overflow-y-auto p-6">
          <div className="max-w-full overflow-visible">
            {children}
          </div>
        </main>
      </div>

      {/* Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}