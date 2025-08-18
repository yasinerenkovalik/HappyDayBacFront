"use client";
import { Typography, Button, Input } from "@material-tailwind/react";
import Link from "next/link";

const LINKS = ["Hakkımızda", "Kariyer", "Blog", "İletişim", "Fiyatlandırma"];
const SUB_LINKS = ["Gizlilik", "Şartlar", "Destek"];
const CURRENT_YEAR = new Date().getFullYear();

export function Footer() {
  return (
    <footer className="mt-10 px-8 pt-20 bg-gray-100">
      <div className="container mx-auto">
        <div className="flex flex-wrap items-end justify-center gap-8 md:justify-between">
          {/* Sol taraf */}
          <div className="text-center md:text-left">
            <Link
              href="/"
              className="mb-6 text-2xl font-bold text-pink-600"
            >
              MutluGünüm.com
            </Link>
            <ul className="flex flex-wrap items-center justify-center md:justify-start mt-4">
              {LINKS.map((link, idx) => (
                <li key={link}>
                  <Link
                    href="#"
                    className={`py-1 font-medium !text-gray-700 transition-colors hover:!text-pink-600 ${
                      idx === 0 ? "pr-3" : "px-3"
                    }`}
                  >
                    {link}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Sağ taraf */}
          <div className="w-full sm:w-[24rem] sm:min-w-[24rem]">
            <Typography variant="h6" color="blue-gray" className="mb-3">
              Bültenimize Kayıt Olun
            </Typography>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Input color="gray" label="E-posta adresiniz" />
              <Button color="pink" className="flex-shrink-0">
                Abone Ol
              </Button>
            </div>
          </div>
        </div>

        {/* Alt Bilgi */}
        <div className="mt-16 flex flex-wrap items-center justify-center gap-y-4 gap-x-8 border-t border-gray-300 py-6 md:justify-between">
          <Typography className="text-center font-normal !text-gray-700">
            &copy; {CURRENT_YEAR} MutluGünüm.com | Tüm hakları saklıdır.
          </Typography>

          <ul className="flex items-center">
            {SUB_LINKS.map((link, idx) => (
              <li key={link}>
                <Link
                  href="#"
                  className={`py-1 font-normal !text-gray-700 transition-colors hover:!text-pink-600 ${
                    idx === SUB_LINKS.length - 1 ? "pl-2" : "px-2"
                  }`}
                >
                  {link}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
