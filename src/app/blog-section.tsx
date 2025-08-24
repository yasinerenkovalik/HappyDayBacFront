// @ts-nocheck
"use client";

import React from "react";
import { Typography, Card, CardBody, Button, Chip } from "@material-tailwind/react";
import { CalendarDaysIcon, ClockIcon } from "@heroicons/react/24/outline";
import Link from "next/link";

const BLOG_POSTS = [
  {
    id: 1,
    title: "2024 Düğün Trendleri: En Popüler Konseptler",
    excerpt: "Bu yılın en çok tercih edilen düğün konseptlerini ve dekorasyon trendlerini keşfedin.",
    image: "/image/blogs/blog-1.jpg",
    category: "Trendler",
    date: "15 Mart 2024",
    readTime: "5 dk",
  },
  {
    id: 2,
    title: "Düğün Bütçesi Nasıl Planlanır?",
    excerpt: "Hayalinizdeki düğünü bütçenize uygun şekilde planlamanın ipuçları.",
    image: "/image/blogs/blog-2.jpg",
    category: "Planlama",
    date: "12 Mart 2024",
    readTime: "7 dk",
  },
  {
    id: 3,
    title: "Kır Düğünü Organizasyonu Rehberi",
    excerpt: "Doğa içinde romantik bir düğün için bilmeniz gereken her şey.",
    image: "/image/blogs/blog-3.png",
    category: "Konsept",
    date: "10 Mart 2024",
    readTime: "6 dk",
  },
];

export function BlogSection() {
  return (
    <section className="py-20 px-8 bg-gray-50">
      <div className="container mx-auto">
        <div className="mb-16 text-center">
          <Typography variant="h2" color="blue-gray" className="mb-4 font-bold">
            Blog & Rehberler
          </Typography>
          <Typography variant="lead" className="mx-auto lg:w-8/12 !text-gray-600">
            Düğün ve etkinlik planlaması hakkında faydalı ipuçları ve güncel trendler.
          </Typography>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {BLOG_POSTS.map((post) => (
            <Card key={post.id} className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="relative overflow-hidden">
                <img
                  src={post.image}
                  alt={post.title}
                  className="h-48 w-full object-cover transition-transform duration-500 hover:scale-105"
                />
                <div className="absolute top-4 left-4">
                  <Chip
                    value={post.category}
                    className="bg-pink-500 text-white"
                    size="sm"
                  />
                </div>
              </div>
              
              <CardBody className="p-6">
                <div className="mb-3 flex items-center gap-4 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <CalendarDaysIcon className="h-4 w-4" />
                    {post.date}
                  </div>
                  <div className="flex items-center gap-1">
                    <ClockIcon className="h-4 w-4" />
                    {post.readTime}
                  </div>
                </div>
                
                <Typography variant="h5" color="blue-gray" className="mb-3 font-bold">
                  {post.title}
                </Typography>
                
                <Typography className="mb-4 text-gray-600">
                  {post.excerpt}
                </Typography>
                
                <Link href={`/blog/${post.id}`}>
                  <Button variant="text" className="p-0 text-pink-500 hover:text-pink-700">
                    Devamını Oku →
                  </Button>
                </Link>
              </CardBody>
            </Card>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link href="/blog">
            <Button size="lg" variant="outlined" color="pink">
              Tüm Blog Yazılarını Gör
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}

export default BlogSection;