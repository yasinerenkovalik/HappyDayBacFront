// @ts-nocheck
"use client";

import React from "react";
import { 
  Card, 
  CardBody, 
  Typography, 
  Button
} from "@material-tailwind/react";
import { 
  ClockIcon,
  SparklesIcon
} from "@heroicons/react/24/outline";
import { useRouter } from "next/navigation";
import AdminLayout from "../components/AdminLayout";
import ProtectedRoute from "../components/ProtectedRoute";

export default function Bookings() {
  const router = useRouter();

  return (
    <ProtectedRoute requiredUserType="company">
      <AdminLayout userType="company">
        <div className="p-4 sm:p-6">
          {/* Header */}
          <div className="mb-6 sm:mb-8">
            <Typography 
              variant="h3" 
              color="blue-gray" 
              className="mb-2 text-2xl sm:text-3xl"
              placeholder={undefined}
              onPointerEnterCapture={undefined}
              onPointerLeaveCapture={undefined}
            >
              Rezervasyonlar
            </Typography>
            <Typography 
              color="gray"
              className="text-sm sm:text-base"
              placeholder={undefined}
              onPointerEnterCapture={undefined}
              onPointerLeaveCapture={undefined}
            >
              Organizasyon rezervasyonlarınızı görüntüleyin ve yönetin
            </Typography>
          </div>

          {/* Coming Soon Card */}
          <Card 
            className="shadow-lg"
            placeholder={undefined}
            onPointerEnterCapture={undefined}
            onPointerLeaveCapture={undefined}
          >
            <CardBody 
              className="p-8 sm:p-12 text-center"
              placeholder={undefined}
              onPointerEnterCapture={undefined}
              onPointerLeaveCapture={undefined}
            >
              <div className="mb-6">
                <div className="w-20 h-20 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <ClockIcon className="h-10 w-10 text-white" />
                </div>
                <SparklesIcon className="h-8 w-8 text-yellow-500 mx-auto animate-pulse" />
              </div>

              <Typography 
                variant="h4" 
                color="blue-gray"
                className="mb-4"
                placeholder={undefined}
                onPointerEnterCapture={undefined}
                onPointerLeaveCapture={undefined}
              >
                Çok Yakında Hizmetinizde!
              </Typography>

              <Typography 
                color="gray"
                className="mb-6 max-w-md mx-auto text-lg"
                placeholder={undefined}
                onPointerEnterCapture={undefined}
                onPointerLeaveCapture={undefined}
              >
                Rezervasyon yönetimi özelliği üzerinde çalışıyoruz. 
                Çok yakında organizasyon rezervasyonlarınızı buradan 
                kolayca yönetebileceksiniz.
              </Typography>

              <div className="bg-gradient-to-r from-pink-50 to-purple-50 rounded-lg p-6 mb-6">
                <Typography 
                  variant="h6" 
                  color="blue-gray"
                  className="mb-3"
                  placeholder={undefined}
                  onPointerEnterCapture={undefined}
                  onPointerLeaveCapture={undefined}
                >
                  Gelecek Özellikler:
                </Typography>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-left">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-pink-500 rounded-full"></div>
                    <Typography variant="small" color="gray">
                      Rezervasyon takibi
                    </Typography>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                    <Typography variant="small" color="gray">
                      Müşteri iletişimi
                    </Typography>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-pink-500 rounded-full"></div>
                    <Typography variant="small" color="gray">
                      Ödeme durumu
                    </Typography>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                    <Typography variant="small" color="gray">
                      Takvim entegrasyonu
                    </Typography>
                  </div>
                </div>
              </div>

              <Button 
                className="bg-gradient-to-r from-pink-500 to-purple-600"
                onClick={() => router.push('/admin/my-organizations')}
                placeholder={undefined}
                onPointerEnterCapture={undefined}
                onPointerLeaveCapture={undefined}
              >
                Organizasyonlarıma Dön
              </Button>
            </CardBody>
          </Card>
        </div>
      </AdminLayout>
    </ProtectedRoute>
  );
}