"use client";
import { Typography, Button, Input, IconButton } from "@material-tailwind/react";
import Link from "next/link";
import {
  MapPinIcon,
  PhoneIcon,
  EnvelopeIcon,
  CalendarDaysIcon,
  HeartIcon,
  ChatBubbleLeftRightIcon,
} from "@heroicons/react/24/outline";
import { SparklesIcon } from "@heroicons/react/24/solid";

const COMPANY_LINKS = [
  { name: "Hakkımızda", href: "/about" },
  { name: "Kariyer", href: "/career" },
  { name: "Basın", href: "/press" },
  { name: "İletişim", href: "/contact" },
];

const SERVICE_LINKS = [
  { name: "Düğün Organizasyonu", href: "/services/wedding" },
  { name: "Nişan Organizasyonu", href: "/services/engagement" },
  { name: "Doğum Günü", href: "/services/birthday" },
  { name: "Kurumsal Etkinlik", href: "/services/corporate" },
];

const SUPPORT_LINKS = [
  { name: "Yardım Merkezi", href: "/help" },
  { name: "SSS", href: "/faq" },
  { name: "Gizlilik Politikası", href: "/privacy" },
  { name: "Kullanım Şartları", href: "/terms" },
];

const CURRENT_YEAR = new Date().getFullYear();

export function Footer() {
  return (
    <footer className="bg-gradient-to-br from-gray-900 via-purple-900 to-pink-900 text-white">
      <div className="container mx-auto px-8 pt-16 pb-8">
        {/* Ana İçerik */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Şirket Bilgileri */}
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-6">
              <div className="w-10 h-10 bg-gradient-to-r from-pink-500 to-purple-600 rounded-xl flex items-center justify-center">
                <SparklesIcon className="h-6 w-6 text-white" />
              </div>
              <Typography className="text-2xl font-bold">
                MutluGünüm
              </Typography>
            </Link>
            
            <Typography className="text-gray-300 mb-6 leading-relaxed">
              Türkiye'nin en güvenilir organizasyon platformu. Hayalinizdeki özel günü 
              gerçekleştirmek için buradayız.
            </Typography>

            {/* İletişim Bilgileri */}
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-gray-300">
                <MapPinIcon className="h-5 w-5 text-pink-400" />
                <Typography variant="small">
                  İstanbul, Türkiye
                </Typography>
              </div>
              <div className="flex items-center gap-3 text-gray-300">
                <PhoneIcon className="h-5 w-5 text-pink-400" />
                <Typography variant="small">
                  0850 123 45 67
                </Typography>
              </div>
              <div className="flex items-center gap-3 text-gray-300">
                <EnvelopeIcon className="h-5 w-5 text-pink-400" />
                <Typography variant="small">
                  info@mutlugunum.com
                </Typography>
              </div>
            </div>
          </div>

          {/* Şirket */}
          <div>
            <Typography variant="h6" className="mb-4 text-pink-300">
              Şirket
            </Typography>
            <ul className="space-y-2">
              {COMPANY_LINKS.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-gray-300 hover:text-pink-300 transition-colors duration-300"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Hizmetler */}
          <div>
            <Typography variant="h6" className="mb-4 text-pink-300">
              Hizmetlerimiz
            </Typography>
            <ul className="space-y-2">
              {SERVICE_LINKS.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-gray-300 hover:text-pink-300 transition-colors duration-300"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Destek & Newsletter */}
          <div>
            <Typography variant="h6" className="mb-4 text-pink-300">
              Destek
            </Typography>
            <ul className="space-y-2 mb-6">
              {SUPPORT_LINKS.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-gray-300 hover:text-pink-300 transition-colors duration-300"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>

            {/* Newsletter */}
            <div className="bg-white/10 rounded-2xl p-4 backdrop-blur-sm">
              <Typography variant="h6" className="mb-3 text-white">
                Bülten
              </Typography>
              <Typography variant="small" className="text-gray-300 mb-4">
                Özel fırsatları kaçırmayın!
              </Typography>
              <div className="flex flex-col gap-2">
                <Input
                  label="E-posta"
                  className="!border-white/20 text-white"
                  labelProps={{
                    className: "text-white/70",
                  }}
                />
                <Button
                  size="sm"
                  className="bg-gradient-to-r from-pink-500 to-purple-600"
                >
                  Abone Ol
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Sosyal Medya & Alt Bilgi */}
        <div className="border-t border-white/20 pt-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <Typography className="text-gray-300 text-center md:text-left">
              &copy; {CURRENT_YEAR} MutluGünüm.com - Tüm hakları saklıdır.
            </Typography>

            {/* Sosyal Medya */}
            <div className="flex items-center gap-3">
              <Typography variant="small" className="text-gray-300 mr-2">
                Bizi takip edin:
              </Typography>
              <IconButton
                variant="text"
                className="text-gray-300 hover:text-pink-300 hover:bg-white/10"
                size="sm"
              >
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                </svg>
              </IconButton>
              <IconButton
                variant="text"
                className="text-gray-300 hover:text-pink-300 hover:bg-white/10"
                size="sm"
              >
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z"/>
                </svg>
              </IconButton>
              <IconButton
                variant="text"
                className="text-gray-300 hover:text-pink-300 hover:bg-white/10"
                size="sm"
              >
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.402.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.357-.629-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24.009 12.017 24.009c6.624 0 11.99-5.367 11.99-11.988C24.007 5.367 18.641.001.012.001z"/>
                </svg>
              </IconButton>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
