"use client";
import React from "react";
import Link from "next/link";
import {
  Navbar as MTNavbar,
  Collapse,
  Button,
  IconButton,
  Typography,
} from "@material-tailwind/react";
import {
  RectangleStackIcon,
  UserCircleIcon,
  CommandLineIcon,
  XMarkIcon,
  Bars3Icon,
  PhoneIcon,
} from "@heroicons/react/24/solid";

const NAV_MENU = [
  {
    name: "Ana Sayfa",
    icon: RectangleStackIcon,
    href: "/",
  },
  {
    name: "Organizasyonlar",
    icon: UserCircleIcon,
    href: "/organization-list",
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
          color="gray"
          className="flex items-center gap-2 font-medium text-pink-500 hover:text-pink-700 transition-colors cursor-pointer"
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
    <MTNavbar shadow={false} fullWidth className="border-0 sticky top-0 z-50 bg-white">
      <div className="container mx-auto flex items-center justify-between py-2">
        <Typography color="blue-gray" className="text-lg font-bold">
          <Link href="/">Mutlu Günüm</Link>
        </Typography>

        {/* Menü - büyük ekran */}
        <ul className="ml-10 hidden items-center gap-8 lg:flex">
          {NAV_MENU.map(({ name, icon: Icon, href }) => (
            <NavItem key={name} href={href}>
              <Icon className="h-5 w-5" />
              {name}
            </NavItem>
          ))}
        </ul>

 

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
        <div className="container mx-auto mt-3 border-t border-gray-200 px-2 pt-4">
          <ul className="flex flex-col gap-4">
            {NAV_MENU.map(({ name, icon: Icon, href }) => (
              <NavItem key={name} href={href}>
                <Icon className="h-5 w-5" />
                {name}
              </NavItem>
            ))}
          </ul>
       
        </div>
      </Collapse>
    </MTNavbar>
  );
}

export default Navbar;
