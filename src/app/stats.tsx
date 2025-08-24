// @ts-nocheck
"use client";

import React from "react";
import { Typography } from "@material-tailwind/react";
import { 
  HeartIcon, 
  UserGroupIcon, 
  BuildingOfficeIcon,
  SparklesIcon 
} from "@heroicons/react/24/solid";

const STATS = [
  {
    icon: HeartIcon,
    number: "2,500+",
    title: "Mutlu Çift",
    description: "Hayallerindeki düğünü gerçekleştirdik",
  },
  {
    icon: UserGroupIcon,
    number: "15,000+",
    title: "Misafir Ağırladık",
    description: "Unutulmaz anılar biriktirdik",
  },
  {
    icon: BuildingOfficeIcon,
    number: "150+",
    title: "Partner Firma",
    description: "Güvenilir hizmet ağımız",
  },
  {
    icon: SparklesIcon,
    number: "5,000+",
    title: "Etkinlik",
    description: "Başarıyla tamamladığımız organizasyon",
  },
];

export function Stats() {
  return (
    <section className="py-20 px-8 bg-white">
      <div className="container mx-auto">
        <div className="mb-16 text-center">
          <Typography variant="h2" color="blue-gray" className="mb-4 font-bold">
            Rakamlarla MutluGünüm
          </Typography>
          <Typography variant="lead" className="mx-auto lg:w-8/12 !text-gray-600">
            Yılların deneyimi ve binlerce mutlu müşteri ile güvenilir hizmet sunuyoruz.
          </Typography>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          {STATS.map((stat, key) => (
            <div key={key} className="text-center group">
              <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-pink-500 to-purple-600 text-white shadow-lg group-hover:shadow-xl transition-shadow duration-300">
                <stat.icon className="h-10 w-10" />
              </div>
              
              <Typography variant="h2" color="blue-gray" className="mb-2 font-bold text-4xl">
                {stat.number}
              </Typography>
              
              <Typography variant="h5" color="blue-gray" className="mb-2 font-semibold">
                {stat.title}
              </Typography>
              
              <Typography className="text-gray-600">
                {stat.description}
              </Typography>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Stats;