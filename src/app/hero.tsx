"use client";

import Image from "next/image";
import { Button, Typography } from "@material-tailwind/react";

function Hero() {
  return (
    <header className="mt-12 bg-white px-8">
      <div className="container mx-auto grid h-full min-h-[65vh] w-full grid-cols-1 place-items-center gap-y-10 lg:grid-cols-2">
        {/* SOL ALAN */}
        <div className="row-start-2 lg:row-auto lg:-mt-40">
          <Typography
            variant="h1"
            color="pink"
            className="text-3xl !leading-snug text-pink-500"
          >
            %40 İNDİRİM
          </Typography>

          <Typography
            variant="h1"
            color="blue-gray"
            className="mb-2 max-w-sm text-3xl !leading-snug lg:mb-3 lg:text-5xl text-gray-800"
          >
            Hayalinizdeki Etkinliği Planlayın
          </Typography>

          <Typography
            variant="lead"
            className="mb-6 font-normal text-gray-600 md:pr-16 xl:pr-28"
          >
            Düğün, nişan, kına, doğum günü gibi tüm özel günler için MutluGünüm yanınızda.
          </Typography>

          <Button size="lg" color="pink">
            FİRMALARI GÖR
          </Button>
        </div>

        {/* SAĞ GÖRSELLER */}
        <div className="mt-40 grid gap-6 lg:mt-0">
          <div className="grid grid-cols-4 gap-6">
            <Image
              width={768}
              height={768}
              src="/image/organizations/organizations1.jpg"
              className="rounded-lg shadow-md"
              alt="flowers"
            />
            <Image
              width={768}
              height={768}
              src="/image/organizations/organizations2.jpg"
              className="-mt-28 rounded-lg shadow-md"
              alt="flowers"
            />
            <Image
              width={768}
              height={768}
              src="/image/organizations/organizations3.jpg"
              className="-mt-14 rounded-lg shadow-md"
              alt="flowers"
            />
            <Image
              width={768}
              height={768}
              src="/image/organizations/organizations4.jpg"
              className="-mt-20 rounded-lg shadow-md"
              alt="flowers"
            />
          </div>

          <div className="grid grid-cols-4 gap-6">
            <div></div>
            <Image
              width={768}
              height={768}
              src="/image/organizations/organizations5.jpg"
              className="-mt-28 rounded-lg shadow-md"
              alt="flowers"
            />
            <Image
              width={768}
              height={768}
              src="/image/organizations/organizations6.jpg"
              className="-mt-14 rounded-lg shadow-md"
              alt="flowers"
            />
            <Image
              width={768}
              height={768}
              src="/image/books/Rectangle14.svg"
              className="-mt-20 rounded-lg shadow-md"
              alt="flowers"
            />
          </div>
        </div>
      </div>
    </header>
  );
}
export default Hero;
