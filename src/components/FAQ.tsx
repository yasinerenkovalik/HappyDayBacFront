// @ts-nocheck
"use client";

import React, { useState } from "react";
import { 
  Card, 
  CardBody, 
  Typography, 
  Accordion,
  AccordionHeader,
  AccordionBody
} from "@material-tailwind/react";
import { ChevronDownIcon } from "@heroicons/react/24/outline";

const faqs = [
  {
    id: 1,
    question: "Organizasyon rezervasyonu nasıl yapılır?",
    answer: "Websitemizden beğendiğiniz organizasyonu seçin, tarih ve detayları belirleyin. Rezervasyon formunu doldurun ve onay için bekleyin. Ekibimiz 24 saat içinde sizinle iletişime geçecektir."
  },
  {
    id: 2,
    question: "Ödeme seçenekleri nelerdir?",
    answer: "Kredi kartı, banka kartı, havale/EFT ve taksitli ödeme seçenekleri mevcuttur. Ayrıca organizasyon tarihine kadar esnek ödeme planları da sunuyoruz."
  },
  {
    id: 3,
    question: "İptal politikanız nasıl?",
    answer: "Organizasyon tarihinden 30 gün öncesine kadar ücretsiz iptal hakkınız vardır. 15-30 gün arası %50, 15 günden az kala %25 iade yapılır."
  },
  {
    id: 4,
    question: "Organizasyon paketlerine neler dahil?",
    answer: "Her paket farklı hizmetler içerir. Genellikle mekan, dekorasyon, catering, müzik sistemi, fotoğraf/video çekimi ve organizasyon koordinatörü dahildir. Detaylar paket açıklamalarında belirtilmiştir."
  },
  {
    id: 5,
    question: "Özel isteklerim karşılanabilir mi?",
    answer: "Elbette! Özel tema, menü, dekorasyon ve diğer isteklerinizi organizasyon ekibimizle paylaşın. Mümkün olan her şeyi gerçekleştirmek için çalışırız."
  },
  {
    id: 6,
    question: "Organizasyon günü nasıl bir süreç işler?",
    answer: "Organizasyon günü koordinatörümüz tüm süreci yönetir. Siz sadece keyif alın, gerisini biz hallederiz. Kurulum, etkinlik yönetimi ve temizlik dahil tüm işlemler profesyonel ekibimiz tarafından yapılır."
  }
];

export default function FAQ() {
  const [openAccordion, setOpenAccordion] = useState<number | null>(1);

  const handleAccordionToggle = (id: number) => {
    setOpenAccordion(openAccordion === id ? null : id);
  };

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
            Sıkça Sorulan Sorular
          </Typography>
          <Typography
            variant="lead"
            className="text-gray-600 max-w-2xl mx-auto"
            placeholder={undefined}
            onPointerEnterCapture={undefined}
            onPointerLeaveCapture={undefined}
          >
            Organizasyon hizmetlerimiz hakkında merak ettikleriniz
          </Typography>
        </div>

        {/* FAQ Accordion */}
        <div className="max-w-4xl mx-auto">
          <Card
            className="shadow-lg"
            placeholder={undefined}
            onPointerEnterCapture={undefined}
            onPointerLeaveCapture={undefined}
          >
            <CardBody
              className="p-0"
              placeholder={undefined}
              onPointerEnterCapture={undefined}
              onPointerLeaveCapture={undefined}
            >
              {faqs.map((faq, index) => (
                <Accordion
                  key={faq.id}
                  open={openAccordion === faq.id}
                  className={`border-b border-gray-200 ${index === faqs.length - 1 ? 'border-b-0' : ''}`}
                  placeholder={undefined}
                  onPointerEnterCapture={undefined}
                  onPointerLeaveCapture={undefined}
                >
                  <AccordionHeader
                    onClick={() => handleAccordionToggle(faq.id)}
                    className="px-6 py-4 text-left hover:text-pink-600 transition-colors"
                    placeholder={undefined}
                    onPointerEnterCapture={undefined}
                    onPointerLeaveCapture={undefined}
                  >
                    <div className="flex items-center justify-between w-full">
                      <Typography
                        variant="h6"
                        className="font-semibold text-gray-900"
                        placeholder={undefined}
                        onPointerEnterCapture={undefined}
                        onPointerLeaveCapture={undefined}
                      >
                        {faq.question}
                      </Typography>
                      <ChevronDownIcon
                        className={`h-5 w-5 transition-transform ${
                          openAccordion === faq.id ? 'rotate-180' : ''
                        }`}
                      />
                    </div>
                  </AccordionHeader>
                  <AccordionBody className="px-6 pb-4 pt-0">
                    <Typography
                      variant="small"
                      className="text-gray-600 leading-relaxed"
                      placeholder={undefined}
                      onPointerEnterCapture={undefined}
                      onPointerLeaveCapture={undefined}
                    >
                      {faq.answer}
                    </Typography>
                  </AccordionBody>
                </Accordion>
              ))}
            </CardBody>
          </Card>
        </div>
      </div>
    </section>
  );
}