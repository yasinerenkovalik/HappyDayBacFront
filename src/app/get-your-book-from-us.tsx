// @ts-nocheck
"use client";

import React from "react";
import { Typography } from "@material-tailwind/react";
import FeatureCard from "@/components/feature-card";
import {
  GiftIcon,
  UsersIcon,
  CalendarDaysIcon,
} from "@heroicons/react/24/solid";

const FEATURES = [
  {
    icon: CalendarDaysIcon,
    title: "Etkinlik Planlaması",
    description:
      "Düğün, nişan, kına, doğum günü ve daha fazlası için kolayca organizasyon planlayın. Size özel çözümlerle hizmetinizdeyiz.",
  },
  {
    icon: UsersIcon,
    title: "Uzman Ekiplerle Çalışın",
    description:
      "Deneyimli firma ve profesyoneller ile hayalinizdeki günü güvenle organize edin. Her detayı sizin için düşünüyoruz.",
  },
  {
    icon: GiftIcon,
    title: "Kampanyaları Kaçırmayın",
    description:
      "MutluGünüm’e özel indirimler, hediye çekleri ve sürpriz fırsatlarla özel günlerinizi daha da özel hale getirin.",
  },
];

export function GetYourServiceFromUs() {
  return (
    <section className="px-8 py-20 bg-gray-50">
      <div className="container mx-auto mb-16 text-center">
        <Typography variant="h2" color="blue-gray" className="mb-4 font-bold">
          Sizin İçin En Güzel Günü Planlıyoruz
        </Typography>
        <Typography
          variant="lead"
          className="mx-auto w-full px-4 !text-gray-600 lg:w-6/12"
        >
          MutluGünüm ile en özel anlarınız emin ellerde. Türkiye’nin dört bir
          yanındaki güvenilir organizasyon firmaları ile tanışın.
        </Typography>
      </div>

      <div className="container mx-auto grid grid-cols-1 gap-y-12 md:grid-cols-2 lg:grid-cols-3">
        {FEATURES.map(({ icon, title, description }) => (
          <FeatureCard key={title} icon={icon} title={title}>
            {description}
          </FeatureCard>
        ))}
      </div>
    </section>
  );
}

export default GetYourServiceFromUs;
