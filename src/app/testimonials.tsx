"use client";

import React, { useState } from "react";
import { Typography, Card, CardBody, Avatar, IconButton, Chip } from "@material-tailwind/react";
import { StarIcon, ChevronLeftIcon, ChevronRightIcon, HeartIcon } from "@heroicons/react/24/solid";
import { CalendarDaysIcon, MapPinIcon } from "@heroicons/react/24/outline";

const TESTIMONIALS = [
    {
        name: "Ayşe & Mehmet Demir",
        role: "Düğün",
        location: "İstanbul",
        image: "/image/avatar/avatar-1.jpg",
        rating: 5,
        comment: "Düğünümüz tam bir rüya gibiydi! MutluGünüm ekibi her detayı mükemmel planladı. 200 kişilik düğünümüzde hiçbir aksaklık yaşamadık. Herkese gönül rahatlığıyla tavsiye ederim.",
        event: "Kır Düğünü",
        date: "Haziran 2024",
        verified: true,
    },
    {
        name: "Elif & Can Yılmaz",
        role: "Nişan",
        location: "Ankara",
        image: "/image/avatar/avatar-2.jpg",
        rating: 5,
        comment: "Nişan organizasyonumuz için MutluGünüm'ü seçtiğimiz için çok memnunuz. Profesyonel ekip, uygun fiyat ve mükemmel hizmet. Düğünümüzü de onlarla yapacağız.",
        event: "Nişan Töreni",
        date: "Mayıs 2024",
        verified: true,
    },
    {
        name: "Fatma Özkan",
        role: "Doğum Günü",
        location: "İzmir",
        image: "/image/avatar/avatar-3.jpg",
        rating: 5,
        comment: "Kızımın 18. yaş doğum günü partisi unutulmazdı. Tema dekorasyondan yemeklere kadar her şey harikaydı. Misafirlerimiz hala konuşuyor!",
        event: "Doğum Günü Partisi",
        date: "Mart 2024",
        verified: true,
    },
    {
        name: "Ahmet & Selin Kara",
        role: "Düğün",
        location: "Antalya",
        image: "/image/avatar/avatar-1.jpg",
        rating: 5,
        comment: "Kumsal düğünümüz tam hayal ettiğimiz gibiydi. Gün batımında deniz kenarında 'evet' demek paha biçilemezdi. Organizasyon ekibi süper profesyoneldi.",
        event: "Kumsal Düğünü",
        date: "Eylül 2024",
        verified: true,
    },
    {
        name: "Merve Şahin",
        role: "Kına Gecesi",
        location: "Bursa",
        image: "/image/avatar/avatar-2.jpg",
        rating: 5,
        comment: "Geleneksel kına gecemiz çok güzel geçti. Müzik, yemekler, dekorasyon... Her şey mükemmeldi. Ailece çok mutlu olduk.",
        event: "Kına Gecesi",
        date: "Ağustos 2024",
        verified: true,
    },
    {
        name: "Okan Yıldız",
        role: "Kurumsal Etkinlik",
        location: "İstanbul",
        image: "/image/avatar/avatar-3.jpg",
        rating: 5,
        comment: "Şirketimizin 10. yıl kutlaması için MutluGünüm ile çalıştık. 500 kişilik etkinlik kusursuzdu. Çalışanlarımız çok memnun kaldı.",
        event: "Kurumsal Etkinlik",
        date: "Ekim 2024",
        verified: true,
    },
];

export function Testimonials() {
    const [currentIndex, setCurrentIndex] = useState(0);
    const visibleCount = 3;

    const nextTestimonials = () => {
        setCurrentIndex((prev) => (prev + visibleCount) % TESTIMONIALS.length);
    };

    const prevTestimonials = () => {
        setCurrentIndex((prev) => (prev - visibleCount + TESTIMONIALS.length) % TESTIMONIALS.length);
    };

    const visibleTestimonials = TESTIMONIALS.slice(currentIndex, currentIndex + visibleCount);

    return (
        <section className="py-20 px-8 bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50 relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-5">
                <div className="absolute top-20 left-20 w-96 h-96 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
                <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl animate-pulse delay-1000"></div>
            </div>

            <div className="container mx-auto relative z-10">
                <div className="mb-16 text-center">
                    <div className="inline-flex items-center gap-2 bg-gradient-to-r from-pink-500 to-purple-600 text-white px-6 py-2 rounded-full text-sm font-semibold mb-6">
                        <HeartIcon className="h-4 w-4" />
                        Mutlu Müşterilerimiz
                    </div>

                    <Typography
                        variant="h2"
                        className="mb-6 text-4xl lg:text-5xl font-bold bg-gradient-to-r from-gray-900 via-purple-900 to-pink-900 bg-clip-text text-transparent"
                        placeholder={undefined}
                        onPointerEnterCapture={undefined}
                        onPointerLeaveCapture={undefined}
                    >
                        Binlerce Mutlu Anının
                        <br />
                        <span className="bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
                            Mimarları
                        </span>
                    </Typography>

                    <Typography
                        variant="lead"
                        className="mx-auto lg:w-8/12 text-gray-600 text-xl"
                        placeholder={undefined}
                        onPointerEnterCapture={undefined}
                        onPointerLeaveCapture={undefined}
                    >
                        Özel günlerinde bizimle çalışan müşterilerimizin gerçek deneyimlerini okuyun.
                    </Typography>
                </div>

                {/* Testimonials Carousel */}
                <div className="relative">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
                        {visibleTestimonials.map((testimonial, key) => (
                            <Card
                                key={key}
                                className="shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 bg-white/80 backdrop-blur-sm border border-white/20"
                                placeholder={undefined}
                                onPointerEnterCapture={undefined}
                                onPointerLeaveCapture={undefined}
                            >
                                <CardBody
                                    className="p-8"
                                    placeholder={undefined}
                                    onPointerEnterCapture={undefined}
                                    onPointerLeaveCapture={undefined}
                                >
                                    {/* Header */}
                                    <div className="flex items-start justify-between mb-6">
                                        <div className="flex items-center gap-4">
                                            <div className="relative">
                                                <Avatar
                                                    src={testimonial.image}
                                                    alt={testimonial.name}
                                                    size="lg"
                                                    className="ring-4 ring-pink-100"
                                                    placeholder={undefined}
                                                    onPointerEnterCapture={undefined}
                                                    onPointerLeaveCapture={undefined}
                                                />
                                                {testimonial.verified && (
                                                    <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                                                        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                        </svg>
                                                    </div>
                                                )}
                                            </div>
                                            <div>
                                                <Typography
                                                    variant="h6"
                                                    className="font-bold text-gray-900 mb-1"
                                                    placeholder={undefined}
                                                    onPointerEnterCapture={undefined}
                                                    onPointerLeaveCapture={undefined}
                                                >
                                                    {testimonial.name}
                                                </Typography>
                                                <div className="flex items-center gap-2 mb-2">
                                                    <Chip
                                                        value={testimonial.event}
                                                        size="sm"
                                                        className="bg-gradient-to-r from-pink-500 to-purple-600 text-white"
                                                    />
                                                </div>
                                                <div className="flex items-center gap-4 text-sm text-gray-500">
                                                    <div className="flex items-center gap-1">
                                                        <MapPinIcon className="h-3 w-3" />
                                                        {testimonial.location}
                                                    </div>
                                                    <div className="flex items-center gap-1">
                                                        <CalendarDaysIcon className="h-3 w-3" />
                                                        {testimonial.date}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Rating */}
                                    <div className="flex items-center gap-1 mb-4">
                                        {[...Array(testimonial.rating)].map((_, i) => (
                                            <StarIcon key={i} className="h-5 w-5 text-yellow-400" />
                                        ))}
                                        <Typography
                                            variant="small"
                                            className="ml-2 text-gray-600 font-medium"
                                            placeholder={undefined}
                                            onPointerEnterCapture={undefined}
                                            onPointerLeaveCapture={undefined}
                                        >
                                            {testimonial.rating}.0
                                        </Typography>
                                    </div>

                                    {/* Comment */}
                                    <Typography
                                        className="text-gray-700 leading-relaxed italic text-lg"
                                        placeholder={undefined}
                                        onPointerEnterCapture={undefined}
                                        onPointerLeaveCapture={undefined}
                                    >
                                        "{testimonial.comment}"
                                    </Typography>
                                </CardBody>
                            </Card>
                        ))}
                    </div>

                    {/* Navigation */}
                    <div className="flex items-center justify-center gap-4">
                        <IconButton
                            variant="outlined"
                            size="lg"
                            onClick={prevTestimonials}
                            className="border-pink-500 text-pink-500 hover:bg-pink-50"
                            placeholder={undefined}
                            onPointerEnterCapture={undefined}
                            onPointerLeaveCapture={undefined}
                        >
                            <ChevronLeftIcon className="h-6 w-6" />
                        </IconButton>

                        <div className="flex gap-2">
                            {Array.from({ length: Math.ceil(TESTIMONIALS.length / visibleCount) }).map((_, index) => (
                                <button
                                    key={index}
                                    onClick={() => setCurrentIndex(index * visibleCount)}
                                    className={`w-3 h-3 rounded-full transition-all duration-300 ${Math.floor(currentIndex / visibleCount) === index
                                            ? 'bg-gradient-to-r from-pink-500 to-purple-600'
                                            : 'bg-gray-300 hover:bg-gray-400'
                                        }`}
                                />
                            ))}
                        </div>

                        <IconButton
                            variant="outlined"
                            size="lg"
                            onClick={nextTestimonials}
                            className="border-pink-500 text-pink-500 hover:bg-pink-50"
                            placeholder={undefined}
                            onPointerEnterCapture={undefined}
                            onPointerLeaveCapture={undefined}
                        >
                            <ChevronRightIcon className="h-6 w-6" />
                        </IconButton>
                    </div>
                </div>

                {/* Stats */}
                <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                    <div>
                        <Typography
                            variant="h3"
                            className="font-bold text-gray-900 mb-2"
                            placeholder={undefined}
                            onPointerEnterCapture={undefined}
                            onPointerLeaveCapture={undefined}
                        >
                            4.9/5
                        </Typography>
                        <Typography
                            className="text-gray-600"
                            placeholder={undefined}
                            onPointerEnterCapture={undefined}
                            onPointerLeaveCapture={undefined}
                        >
                            Ortalama Puan
                        </Typography>
                    </div>
                    <div>
                        <Typography
                            variant="h3"
                            className="font-bold text-gray-900 mb-2"
                            placeholder={undefined}
                            onPointerEnterCapture={undefined}
                            onPointerLeaveCapture={undefined}
                        >
                            2,500+
                        </Typography>
                        <Typography
                            className="text-gray-600"
                            placeholder={undefined}
                            onPointerEnterCapture={undefined}
                            onPointerLeaveCapture={undefined}
                        >
                            Mutlu Müşteri
                        </Typography>
                    </div>
                    <div>
                        <Typography
                            variant="h3"
                            className="font-bold text-gray-900 mb-2"
                            placeholder={undefined}
                            onPointerEnterCapture={undefined}
                            onPointerLeaveCapture={undefined}
                        >
                            5,000+
                        </Typography>
                        <Typography
                            className="text-gray-600"
                            placeholder={undefined}
                            onPointerEnterCapture={undefined}
                            onPointerLeaveCapture={undefined}
                        >
                            Başarılı Etkinlik
                        </Typography>
                    </div>
                    <div>
                        <Typography
                            variant="h3"
                            className="font-bold text-gray-900 mb-2"
                            placeholder={undefined}
                            onPointerEnterCapture={undefined}
                            onPointerLeaveCapture={undefined}
                        >
                            %98
                        </Typography>
                        <Typography
                            className="text-gray-600"
                            placeholder={undefined}
                            onPointerEnterCapture={undefined}
                            onPointerLeaveCapture={undefined}
                        >
                            Memnuniyet Oranı
                        </Typography>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default Testimonials;