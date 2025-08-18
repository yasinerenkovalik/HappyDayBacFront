"use client";
import React from "react";
import Link from "next/link";
import {
  Navbar as MTNavbar,
  Collapse,
  Button,
  IconButton,
  Typography,
  Avatar,
} from "@material-tailwind/react";
import {
  HomeIcon,
  CalendarDaysIcon,
  ChatBubbleLeftRightIcon,
  XMarkIcon,
  Bars3Icon,
  PhoneIcon,
  HeartIcon,
  UserIcon,
} from "@heroicons/react/24/outline";
import { SparklesIcon } from "@heroicons/react/24/solid";

const NAV_MENU = [
  {
    name: "Ana Sayfa",
    icon: HomeIcon,
    href: "/",
  },
  {
    name: "Organizasyonlar",
    icon: CalendarDaysIcon,
    href: "/organization-list",
  },
  {
    name: "Blog",
    icon: ChatBubbleLeftRightIcon,
    href: "/blog",
  },
  {
    name: "İletişim",
    icon: PhoneIcon,
    href: "/contact",
  },
];

interface NavItemProps {
  children: React.ReactNode;
  href?: string;
}

function NavItem({ children, href }: NavItemProps) {
  return (
    <li>
      <Link href={href || "#"}>
        <Typography
          as="div"
          variant="paragraph"
          className="flex items-center gap-2 font-medium text-gray-700 hover:text-pink-600 transition-all duration-300 cursor-pointer px-3 py-2 rounded-lg hover:bg-pink-50"
        >
          {children}
        </Typography>
      </Link>
    </li>
  );
}

export function Navbar() {
  const [open, setOpen] = React.useState(false);

  function handleOpen() {
    setOpen((cur) => !cur);
  }

  React.useEffect(() => {
    window.addEventListener("resize", () => {
      if (window.innerWidth >= 960) setOpen(false);
    });
  }, []);

  return (
    <MTNavbar shadow={true} fullWidth className="border-0 sticky top-0 z-50 bg-white/95 backdrop-blur-md">
      <div className="container mx-auto flex items-center justify-between py-3">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="w-10 h-10 bg-gradient-to-r from-pink-500 to-purple-600 rounded-xl flex items-center justify-center">
            <SparklesIcon className="h-6 w-6 text-white" />
          </div>
          <Typography className="text-xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
            MutluGünüm
          </Typography>
        </Link>

        {/* Menü - büyük ekran */}
        <ul className="hidden items-center gap-2 lg:flex">
          {NAV_MENU.map(({ name, icon: Icon, href }) => (
            <NavItem key={name} href={href}>
              <Icon className="h-4 w-4" />
              {name}
            </NavItem>
          ))}
        </ul>

        {/* Sağ taraf butonları */}
        <div className="hidden lg:flex items-center gap-3">
          <IconButton variant="text" className="text-gray-600 hover:text-pink-600">
            <HeartIcon className="h-5 w-5" />
          </IconButton>
          
          <Button
            variant="outlined"
            size="sm"
            className="border-pink-500 text-pink-500 hover:bg-pink-50 flex items-center gap-2"
          >
            <UserIcon className="h-4 w-4" />
            Giriş Yap
          </Button>
          
          <Button
            size="sm"
            className="bg-gradient-to-r from-pink-500 to-purple-600 shadow-lg hover:shadow-xl transition-all duration-300"
          >
            Ücretsiz Kayıt
          </Button>
        </div>

        {/* Menü ikonu - mobil */}
        <IconButton
          variant="text"
          color="gray"
          onClick={handleOpen}
          className="ml-auto inline-block lg:hidden"
        >
          {open ? (
            <XMarkIcon strokeWidth={2} className="h-6 w-6" />
          ) : (
            <Bars3Icon strokeWidth={2} className="h-6 w-6" />
          )}
        </IconButton>
      </div>

      {/* Mobil menü */}
      <Collapse open={open}>
        <div className="container mx-auto mt-3 border-t border-gray-200 px-2 pt-4 pb-4">
          <ul className="flex flex-col gap-2 mb-4">
            {NAV_MENU.map(({ name, icon: Icon, href }) => (
              <NavItem key={name} href={href}>
                <Icon className="h-4 w-4" />
                {name}
              </NavItem>
            ))}
          </ul>
          
          <div className="flex flex-col gap-2">
            <Button
              variant="outlined"
              size="sm"
              className="border-pink-500 text-pink-500 hover:bg-pink-50 flex items-center gap-2 justify-center"
            >
              <UserIcon className="h-4 w-4" />
              Giriş Yap
            </Button>
            
            <Button
              size="sm"
              className="bg-gradient-to-r from-pink-500 to-purple-600"
            >
              Ücretsiz Kayıt
            </Button>
          </div>
        </div>
      </Collapse>
    </MTNavbar>
  );
}

export default Navbar;
