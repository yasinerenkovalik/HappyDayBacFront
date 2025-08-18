"use client";

import React from "react";
import CategoryCard from "@/components/category-card";

import { Card, CardBody, Typography, Button } from "@material-tailwind/react";
import {
  GlobeEuropeAfricaIcon,
  MicrophoneIcon,
  PuzzlePieceIcon,
  HeartIcon,
} from "@heroicons/react/24/solid";

const CATEGORIES = [
  {
    img: "/image/blogs/blog-3.png",
    icon: HeartIcon,
    title: "Kır Düğünü",
    desc: "Gün batımında yemyeşil doğa içinde romantik bir tören.",
  },
  {
    img: "/image/blogs/blog-12.jpeg",
    icon: PuzzlePieceIcon,
    title: "Otel Düğünü",
    desc: "Prens ve prenseslere layık ihtişamlı ve şık bir davet.",
  },
  {
    img: "/image/blogs/blog-10.jpeg",
    icon: GlobeEuropeAfricaIcon,
    title: "Kumsal Düğünü",
    desc: "Deniz kenarında, dalga sesleri eşliğinde unutulmaz bir 'evet'.",
  },
  {
    img: "/image/blogs/blog-13.png",
    icon: MicrophoneIcon,
    title: "After Party Mekanları",
    desc: "DJ performansı, dans ve sabaha kadar süren eğlence.",
  },
];

export function TopBookCategories() {
  return (
    <section className="container mx-auto px-8 py-16">
      <div className="mb-12 text-center">
        <Typography variant="h2" color="blue-gray" className="my-3 font-bold">
          Hayalinizdeki Konsepti Keşfedin
        </Typography>
        <Typography variant="lead" className="!text-gray-600 mx-auto lg:w-8/12">
          En popüler düğün ve nişan konseptlerinden ilham alarak o özel günü planlamaya başlayın. Her detayı sizin için düşündük.
        </Typography>
      </div>
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
        {CATEGORIES.map((props, key) => (
          <CategoryCard key={key} {...props} />
        ))}
      </div>
    </section>
  );
}

export default TopBookCategories;
