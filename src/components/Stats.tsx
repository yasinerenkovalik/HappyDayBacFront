// @ts-nocheck
"use client";

import React from "react";
import { Typography } from "@material-tailwind/react";
import { 
  HeartIcon,
  BuildingOfficeIcon,
  CalendarDaysIcon,
  StarIcon
} from "@heroicons/react/24/solid";

const stats = [
  {
    id: 1,
    title: "Mutlu Çift",
    value: "2,500+",
    icon: HeartIcon,
    color: "pink"
  },
  {
    id: 2,
    title: "Partner Firma",
    value: "150+",
    icon: BuildingOfficeIcon,
    color: "blue"
  },
  {
    id: 3,
    title: "Başarılı Etkinlik",
    value: "5,000+",
    icon: CalendarDaysIcon,
    color: "purple"
  },
  {
    id: 4,
    title: "Müşteri Memnuniyeti",
    value: "4.9/5",
    icon: StarIcon,
    color: "yellow"
  }
];

export default function Stats() {
  return (
    <section className="py-16 bg-gradient-to-r from-pink-500 via-purple-600 to-indigo-600">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <Typography
            variant="h2"
            className="mb-4 text-3xl lg:text-4xl font-bold text-white"
            placeholder={undefined}
            onPointerEnterCapture={undefined}
            onPointerLeaveCapture={undefined}
          >
            Rakamlarla MutluGünüm
          </Typography>
          <Typography
            variant="lead"
            className="text-pink-100 max-w-2xl mx-auto"
            placeholder={undefined}
            onPointerEnterCapture={undefined}
            onPointerLeaveCapture={undefined}
          >
            Binlerce mutlu müşterimizin güvenini kazandık
          </Typography>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat) => {
            const IconComponent = stat.icon;
            return (
              <div key={stat.id} className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                  <IconComponent className={`h-8 w-8 text-${stat.color}-200`} />
                </div>
                <Typography
                  variant="h3"
                  className="mb-2 font-bold text-white"
                  placeholder={undefined}
                  onPointerEnterCapture={undefined}
                  onPointerLeaveCapture={undefined}
                >
                  {stat.value}
                </Typography>
                <Typography
                  variant="small"
                  className="text-pink-100 font-medium"
                  placeholder={undefined}
                  onPointerEnterCapture={undefined}
                  onPointerLeaveCapture={undefined}
                >
                  {stat.title}
                </Typography>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}