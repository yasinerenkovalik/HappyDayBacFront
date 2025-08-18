"use client";
import React from "react";
import {
  Typography,
  Accordion,
  AccordionHeader,
  AccordionBody,
} from "@material-tailwind/react";

const FAQS = [
  {
    title: "MutluGünüm nedir ve ne işe yarar?",
    desc: "MutluGünüm, düğün, kına, doğum günü ve diğer özel günler için organizasyon firmalarını kullanıcılarla buluşturan bir platformdur. Size en uygun firmayı kolayca bulmanızı sağlar.",
  },
  {
    title: "Firmalarla doğrudan iletişime geçebilir miyim?",
    desc: "Evet! Platform üzerinden firmaların detay sayfasına giderek iletişim bilgilerine ulaşabilir, rezervasyon yapabilir veya mesaj gönderebilirsiniz.",
  },
  {
    title: "MutluGünüm üzerinden nasıl rezervasyon yapılır?",
    desc: "İlgilendiğiniz organizasyon firmasıyla profil sayfasından 'Rezervasyon Yap' butonuna tıklayarak kolayca rezervasyon oluşturabilirsiniz.",
  },
  {
    title: "Hangi şehirlerde hizmet veriyorsunuz?",
    desc: "Şu an Türkiye genelinde birçok şehirde hizmet veriyoruz. Filtreleme seçenekleriyle il ve ilçe bazlı firmaları kolayca listeleyebilirsiniz.",
  },
  {
    title: "Kampanya ve indirimleri nereden takip edebilirim?",
    desc: "Ana sayfamızdaki 'Kampanyalar' bölümünden güncel indirimleri ve avantajları takip edebilirsiniz. Ayrıca e-posta bildirimleri ile haberdar olabilirsiniz.",
  },
];

export function Faq() {
  const [open, setOpen] = React.useState(0);
  const handleOpen = (value: number) => setOpen(open === value ? 0 : value);

  return (
    <section className="px-8 py-40 bg-white">
      <div className="container mx-auto">
        <div className="text-center">
          <Typography variant="h1" color="blue-gray" className="mb-4 font-bold">
            Sıkça Sorulan Sorular
          </Typography>
          <Typography
            variant="lead"
            className="mx-auto mb-24 w-full max-w-2xl !text-gray-600"
          >
            Organizasyon süreciyle ilgili merak ettiğiniz her şeyi burada
            bulabilirsiniz.
          </Typography>
        </div>
        <div className="mx-auto lg:max-w-screen-lg lg:px-20">
          {FAQS.map(({ title, desc }, key) => (
            <Accordion
              key={key}
              open={open === key + 1}
              onClick={() => handleOpen(key + 1)}
            >
              <AccordionHeader className="text-left text-gray-900 text-lg font-medium">
                {title}
              </AccordionHeader>
              <AccordionBody>
                <Typography
                  color="blue-gray"
                  className="font-normal text-gray-600"
                >
                  {desc}
                </Typography>
              </AccordionBody>
            </Accordion>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Faq;
