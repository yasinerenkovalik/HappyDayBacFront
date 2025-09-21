// @ts-nocheck
"use client";

import React, { useEffect, useState, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Typography, Button } from "@material-tailwind/react";
import { GiftIcon } from "@heroicons/react/24/outline";
import { getAllCategories } from "@/lib/api";
import type { Category } from "@/entities/category.entity";

export default function Categories() {
    const router = useRouter();
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    const fetchCategories = useCallback(async () => {
        try {
            setLoading(true);
            const data = await getAllCategories();
            setCategories(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error("Kategoriler alınırken hata:", err);
            setCategories([]);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchCategories();
    }, [fetchCategories]);

    const handleClick = (categoryId: number) => {
        router.push(`/organization-list?categoryId=${categoryId}`);
    };

    // Optional external image mapping via env JSON
    const envImageMap = useMemo(() => {
        try {
            const raw = process.env.NEXT_PUBLIC_CATEGORY_IMAGE_MAP;
            if (!raw) return {} as Record<string, string>;
            const parsed = JSON.parse(raw);
            return typeof parsed === 'object' && parsed !== null ? parsed as Record<string, string> : {};
        } catch {
            return {} as Record<string, string>;
        }
    }, []);

    // Optional subtitle and count maps
    const envSubtitleMap = useMemo(() => {
        try {
            const raw = process.env.NEXT_PUBLIC_CATEGORY_SUBTITLE_MAP;
            if (!raw) return {} as Record<string, string>;
            const parsed = JSON.parse(raw);
            return typeof parsed === 'object' && parsed !== null ? parsed as Record<string, string> : {};
        } catch {
            return {} as Record<string, string>;
        }
    }, []);

    const envCountMap = useMemo(() => {
        try {
            const raw = process.env.NEXT_PUBLIC_CATEGORY_COUNT_MAP;
            if (!raw) return {} as Record<string, number | string>;
            const parsed = JSON.parse(raw);
            return typeof parsed === 'object' && parsed !== null ? parsed as Record<string, number | string> : {};
        } catch {
            return {} as Record<string, number | string>;
        }
    }, []);

    const slugify = (value: string) =>
        value
            .toLowerCase()
            .normalize('NFD')
            .replace(/\p{Diacritic}/gu, '')
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '');

    // Built-in default web image map for common categories (can be overridden by env/public)
    const defaultWebImageMap: Record<string, string> = {
        'dugun': 'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=400&h=400&fit=crop&crop=center',
        'nisan': 'https://images.unsplash.com/photo-1519741497674-611481863552?w=400&h=400&fit=crop&crop=center',
        'soz': 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=400&h=400&fit=crop&crop=center',
        'dogum-gunu': 'https://image.milimaj.com/i/milliyet/75/0x0/6007fc8b55428022f47980a7.jpg',
        'kurumsal': 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=400&h=400&fit=crop&crop=center',
        'konser': 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop&crop=center',
        'muzik': 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop&crop=center',
        'mezuniyet': 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=400&h=400&fit=crop&crop=center',
        'isteme': 'https://altinbaslife.com/wp-content/uploads/2020/06/k%C4%B1z-isteme3.jpg',
        'kina': 'https://mir-s3-cdn-cf.behance.net/projects/404/11835505.5481f3c70f5d7.jpg',
        'after-parti': 'https://images.unsplash.com/photo-1506157786151-b8491531f063?w=400&h=400&fit=crop&crop=center',
        'ekipman-kiralama': 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=400&h=400&fit=crop&crop=center',
        'balo-ve-davet-salonlari': 'https://i.dugun.com/gallery/43847/preview_salon-elisa_UasG7W5D.jpg',
        'dekorlar': 'https://images.unsplash.com/photo-1519710164239-da123dc03ef4?w=400&h=400&fit=crop&crop=center'
    };

    const getCategoryImage = (cat: Category) => {
        // Priority: by id, then by name
        const byId = envImageMap[String(cat.id)];
        if (byId) return byId;
        const byName = envImageMap[cat.name];
        if (byName) return byName;
        // Built-in defaults based on normalized name keywords
        const slug = slugify(cat.name || 'kategori');
        for (const key of Object.keys(defaultWebImageMap)) {
            if (slug.includes(key)) return defaultWebImageMap[key];
        }
        // Fallback to public images by slug convention
        return `/image/categories/${slug}.webp`;
    };

    return (
        <section className="py-16 bg-gray-50">
            <div className="container mx-auto px-4">
                {/* Header */}
                <div className="text-center mb-12">
                    <Typography
                        variant="h2"
                        className="mb-4 text-3xl lg:text-4xl font-bold text-gray-900"
                        placeholder={undefined}
                        onPointerEnterCapture={undefined}
                        onPointerLeaveCapture={undefined}
                    >
                        Organizasyon Kategorileri
                    </Typography>
                    <Typography
                        variant="lead"
                        className="text-gray-700 max-w-2xl mx-auto"
                        placeholder={undefined}
                        onPointerEnterCapture={undefined}
                        onPointerLeaveCapture={undefined}
                    >
                        Her türlü özel gününüz için profesyonel organizasyon hizmetleri
                    </Typography>
                </div>

                {/* Compact horizontal list */}
                <div className="-mx-4 px-4 relative">
                    {/* edge fades for scroll hint */}
                    <div className="pointer-events-none absolute left-0 top-0 h-full w-6 bg-gradient-to-r from-gray-50 to-transparent" />
                    <div className="pointer-events-none absolute right-0 top-0 h-full w-6 bg-gradient-to-l from-gray-50 to-transparent" />
                    <div className="flex items-stretch gap-4 overflow-x-auto no-scrollbar py-2">
                        {loading ? (
                            Array.from({ length: 8 }).map((_, i) => (
                                <div key={i} className="flex-shrink-0 h-14 w-48 rounded-full bg-gray-200 animate-pulse" />
                            ))
                        ) : (
                            categories.map((category) => {
                                const img = getCategoryImage(category);
                                const subtitle = envSubtitleMap[String(category.id)] || envSubtitleMap[category.name];
                                const countValue = envCountMap[String(category.id)] || envCountMap[category.name];
                                return (
                                    <button
                                        key={category.id}
                                        onClick={() => handleClick(category.id)}
                                        className="flex-shrink-0 group inline-flex items-center gap-3 pl-3 pr-4 h-14 rounded-full bg-white border border-gray-300 shadow-sm hover:shadow-md hover:border-pink-400 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-pink-500"
                                        aria-label={`Kategori: ${category.name}`}
                                        role="link"
                                    >
                                        {/* gradient ring */}
                                        <span className="p-[2px] rounded-full bg-gradient-to-br from-pink-500 via-fuchsia-500 to-purple-600 shadow-sm">
                                          {/* Avatar - perfectly circular */}
                                          <div className="relative w-12 h-12 rounded-full overflow-hidden bg-white">
                                            <Image
                                              src={img}
                                              alt={category.name}
                                              width={48}
                                              height={48}
                                              className="w-full h-full object-cover rounded-full"
                                              unoptimized
                                              onError={(e) => {
                                                (e.currentTarget as HTMLImageElement).style.display = 'none';
                                              }}
                                            />
                                          </div>
                                        </span>
                                        {/* Label */}
                                        <div className="flex items-center gap-2">
                                            <span className="text-base font-medium text-gray-900 whitespace-nowrap group-hover:text-pink-700" title={subtitle || undefined}>
                                                {category.name}
                                            </span>
                                            {countValue !== undefined && (
                                                <span className="text-[11px] px-2 py-0.5 rounded-full bg-pink-100 text-pink-800 border border-pink-300">
                                                    {String(countValue)}
                                                </span>
                                            )}
                                            <span className="opacity-0 group-hover:opacity-100 transition-opacity text-sm text-pink-700">Keşfet →</span>
                                        </div>
                                    </button>
                                );
                            })
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
}