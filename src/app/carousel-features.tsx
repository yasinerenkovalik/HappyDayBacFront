// @ts-nocheck
"use client";

import Image from "next/image";
import { Typography, Carousel } from "@material-tailwind/react";

export function CarouselFeatures() {
  return (
    <div className="px-4 py-28 bg-gray-100">
      <section
        className="container mx-auto rounded-lg bg-cover bg-center shadow-lg py-10 lg:px-16 relative"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1495610015663-83e7e5246070?fm=jpg&q=60&w=3000')",
        }}
      >
        {/* ARKA PLAN ÜZERİNE KOYU ŞEFFAF TABAKA */}
        <div className="absolute inset-0 bg-black/40 rounded-lg z-10"></div>

        <Carousel
          transition={{ duration: 1 }}
          nextArrow={() => <></>}
          prevArrow={() => <></>}
          className="relative z-20"
          navigation={({ setActiveIndex, activeIndex, length }) => (
            <div className="absolute left-1/2 bottom-0 z-50 flex h-5 w-20 -translate-x-2/4 gap-2">
              {new Array(length).fill("").map((_, i) => (
                <span
                  key={i}
                  className={`block h-1 w-10 cursor-pointer transition-all ${
                    activeIndex === i ? "bg-white" : "bg-white/50"
                  }`}
                  onClick={() => setActiveIndex(i)}
                />
              ))}
            </div>
          )}
        >
          {/* SLIDE 1 */}
          <div className="flex flex-col-reverse md:grid md:grid-cols-5 gap-8 px-6 py-12 text-white">
            <div className="col-span-3 flex flex-col justify-center">
              <Typography className="mb-4 text-3xl lg:text-4xl font-bold drop-shadow-md">
                Hayalinizdeki Organizasyon Bir Tık Uzağınızda!
              </Typography>
              <Typography className="mb-5 text-lg drop-shadow-md">
                MutluGünüm ile düğün, nişan, kına ve özel davetlerinizi kolayca planlayın.
                Türkiye’nin dört bir yanından en iyi firmaları tek platformda keşfedin.
              </Typography>
              <div className="flex items-center gap-2 mt-2">
                💍
                <Typography className="text-sm font-semibold uppercase drop-shadow-md">
                  Mutlu Anlar İçin Buradayız
                </Typography>
              </div>
            </div>
            <div className="col-span-2 flex justify-end">
              <Image
                width={768}
                height={768}
                src="/image/organizations/organizations4.jpg"
                alt="wedding couple"
                className="w-4/5 object-contain rounded-lg shadow-md"
              />
            </div>
          </div>

          {/* SLIDE 2 */}
          <div className="flex flex-col-reverse md:grid md:grid-cols-5 gap-8 px-6 py-12 text-white">
            <div className="col-span-3 flex flex-col justify-center">
              <Typography className="mb-4 text-3xl lg:text-4xl font-bold drop-shadow-md">
                Size Özel Kampanyaları Kaçırmayın
              </Typography>
              <Typography className="mb-5 text-lg drop-shadow-md">
                MutluGünüm’e özel %25’e varan indirimler ve hediye çekleriyle hayalinizdeki
                organizasyon daha uygun fiyatlarla elinizin altında!
              </Typography>
              <div className="flex items-center gap-2 mt-2">
                🎁
                <Typography className="text-sm font-semibold uppercase drop-shadow-md">
                  Özel Fırsatlar
                </Typography>
              </div>
            </div>
            <div className="col-span-2 flex justify-end">
              <Image
                width={768}
                height={768}
                src="https://i.dugun.com/articles/body/tarihi-yer-gelin-damat-pozu.jpg"
                alt="kampanya görseli"
                className="w-4/5 object-contain rounded-lg shadow-md"
              />
            </div>
          </div>
        </Carousel>
      </section>
    </div>
  );
}

export default CarouselFeatures;
