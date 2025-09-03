// @ts-nocheck
"use client";

import React from "react";
import { Card, CardBody, Typography, Button } from "@material-tailwind/react";
import {
    HeartIcon,
    CakeIcon,
    BuildingOfficeIcon,
    GiftIcon,
    MusicalNoteIcon,
    AcademicCapIcon
} from "@heroicons/react/24/outline";

const categories = [
    {
        id: 1,
        title: "Düğün Organizasyonu",
        description: "Hayalinizdeki düğünü gerçekleştirin",
        icon: HeartIcon,
        color: "pink",
        count: "150+ Organizasyon",
        image: "https://images.unsplash.com/photo-1519741497674-611481863552?w=400&h=300&fit=crop&crop=center"
    },
    {
        id: 2,
        title: "Doğum Günü",
        description: "Unutulmaz doğum günü partileri",
        icon: CakeIcon,
        color: "purple",
        count: "80+ Organizasyon",
        image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop&crop=center"
    },
    {
        id: 3,
        title: "Kurumsal Etkinlik",
        description: "Profesyonel iş etkinlikleri",
        icon: BuildingOfficeIcon,
        color: "blue",
        count: "60+ Organizasyon",
        image: "https://images.unsplash.com/photo-1511578314322-379afb476865?w=400&h=300&fit=crop&crop=center"
    },
    {
        id: 4,
        title: "Nişan & Söz",
        description: "Romantik nişan organizasyonları",
        icon: GiftIcon,
        color: "red",
        count: "45+ Organizasyon",
        image: "https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=400&h=300&fit=crop&crop=center"
    },
    {
        id: 5,
        title: "Konser & Müzik",
        description: "Canlı müzik etkinlikleri",
        icon: MusicalNoteIcon,
        color: "green",
        count: "30+ Organizasyon",
        image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=300&fit=crop&crop=center"
    },
    {
        id: 6,
        title: "Mezuniyet",
        description: "Mezuniyet törenleri ve partileri",
        icon: AcademicCapIcon,
        color: "indigo",
        count: "25+ Organizasyon",
        image: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=400&h=300&fit=crop&crop=center"
    }
];

export default function Categories() {
    return (
        <section className="py-16 bg-white">
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
                        className="text-gray-600 max-w-2xl mx-auto"
                        placeholder={undefined}
                        onPointerEnterCapture={undefined}
                        onPointerLeaveCapture={undefined}
                    >
                        Her türlü özel gününüz için profesyonel organizasyon hizmetleri
                    </Typography>
                </div>

                {/* Categories Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {categories.map((category) => {
                        const IconComponent = category.icon;
                        return (
                            <Card
                                key={category.id}
                                className="group hover:shadow-xl transition-all duration-300 cursor-pointer border border-gray-100 hover:border-pink-200 overflow-hidden"
                                placeholder={undefined}
                                onPointerEnterCapture={undefined}
                                onPointerLeaveCapture={undefined}
                            >
                                {/* Background Image */}
                                <div className="relative h-48 overflow-hidden">
                                    <img
                                        src={category.image}
                                        alt={category.title}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                    />
                                    <div className="absolute inset-0 bg-black bg-opacity-40 group-hover:bg-opacity-30 transition-all duration-300"></div>
                                    
                                    {/* Icon Overlay */}
                                    <div className="absolute top-4 left-4">
                                        <div className={`w-12 h-12 rounded-full bg-gradient-to-r from-${category.color}-500 to-${category.color}-600 flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                                            <IconComponent className="h-6 w-6 text-white" />
                                        </div>
                                    </div>

                                    {/* Count Badge */}
                                    <div className="absolute top-4 right-4">
                                        <div className="bg-white bg-opacity-90 rounded-full px-3 py-1">
                                            <Typography
                                                variant="small"
                                                className="font-semibold text-gray-800"
                                                placeholder={undefined}
                                                onPointerEnterCapture={undefined}
                                                onPointerLeaveCapture={undefined}
                                            >
                                                {category.count}
                                            </Typography>
                                        </div>
                                    </div>
                                </div>

                                <CardBody
                                    className="p-6 text-center"
                                    placeholder={undefined}
                                    onPointerEnterCapture={undefined}
                                    onPointerLeaveCapture={undefined}
                                >
                                    <Typography
                                        variant="h5"
                                        className="mb-2 font-bold text-gray-900 group-hover:text-pink-600 transition-colors"
                                        placeholder={undefined}
                                        onPointerEnterCapture={undefined}
                                        onPointerLeaveCapture={undefined}
                                    >
                                        {category.title}
                                    </Typography>

                                    <Typography
                                        variant="small"
                                        className="mb-4 text-gray-600"
                                        placeholder={undefined}
                                        onPointerEnterCapture={undefined}
                                        onPointerLeaveCapture={undefined}
                                    >
                                        {category.description}
                                    </Typography>

                                    <Button
                                        size="sm"
                                        variant="outlined"
                                        color="pink"
                                        className="group-hover:bg-pink-500 group-hover:text-white transition-colors"
                                        placeholder={undefined}
                                        onPointerEnterCapture={undefined}
                                        onPointerLeaveCapture={undefined}
                                    >
                                        Keşfet
                                    </Button>
                                </CardBody>
                            </Card>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}