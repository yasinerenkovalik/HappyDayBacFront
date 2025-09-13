// @ts-nocheck
"use client";

import React, { useState } from "react";
import {
  Navbar as MTNavbar,
  Typography,
  Button,
  IconButton,
  Collapse,
} from "@material-tailwind/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { Logo } from "@/components";

export default function Navbar() {
  const [openNav, setOpenNav] = useState(false);

  React.useEffect(() => {
    window.addEventListener(
      "resize",
      () => window.innerWidth >= 960 && setOpenNav(false)
    );
  }, []);

  const navList = (
    <ul className="mb-4 mt-2 flex flex-col gap-3 lg:mb-0 lg:mt-0 lg:flex-row lg:items-center lg:gap-6">
      <Typography
        as="li"
        variant="small"
        color="blue-gray"
        className="p-2 lg:p-1 font-normal"
        placeholder={undefined}
        onPointerEnterCapture={undefined}
        onPointerLeaveCapture={undefined}
      >
        <Link href="/" className="flex items-center hover:text-pink-500 transition-colors py-2 lg:py-0">
          Ana Sayfa
        </Link>
      </Typography>
      <Typography
        as="li"
        variant="small"
        color="blue-gray"
        className="p-2 lg:p-1 font-normal"
        placeholder={undefined}
        onPointerEnterCapture={undefined}
        onPointerLeaveCapture={undefined}
      >
        <Link href="/organization-list" className="flex items-center hover:text-pink-500 transition-colors py-2 lg:py-0">
          Organizasyonlar
        </Link>
      </Typography>
      <Typography
        as="li"
        variant="small"
        color="blue-gray"
        className="p-2 lg:p-1 font-normal"
        placeholder={undefined}
        onPointerEnterCapture={undefined}
        onPointerLeaveCapture={undefined}
      >
        <Link href="/contact" className="flex items-center hover:text-pink-500 transition-colors py-2 lg:py-0">
          İletişim
        </Link>
      </Typography>
    </ul>
  );

  return (
    <MTNavbar
      className="sticky top-0 z-50 h-max w-full max-w-full rounded-none py-2 px-4 sm:px-6 lg:px-8 lg:py-4 border-0 shadow-md bg-white/95 backdrop-blur-sm overflow-hidden box-border"
      placeholder={undefined}
      onPointerEnterCapture={undefined}
      onPointerLeaveCapture={undefined}
    >
      <div className="flex items-center justify-between text-blue-gray-900">
        <div className="flex-shrink-0">
          <Logo size="md" showText={true} />
        </div>
        <div className="flex items-center gap-4">
          <div className="mr-4 hidden lg:block">{navList}</div>
          <Link href="/admin/login" className="hidden lg:inline-block">
            <Button
              as="span"
              variant="gradient"
              size="sm"
              className="bg-gradient-to-r from-pink-500 to-purple-600 w-full"
              placeholder={undefined}
              onPointerEnterCapture={undefined}
              onPointerLeaveCapture={undefined}
            >
              Giriş Yap
            </Button>
          </Link>
          <IconButton
            variant="text"
            className="ml-auto h-12 w-12 text-inherit hover:bg-gray-100 focus:bg-gray-100 active:bg-gray-200 lg:hidden flex items-center justify-center"
            ripple={false}
            onClick={() => setOpenNav(!openNav)}
            placeholder={undefined}
            onPointerEnterCapture={undefined}
            onPointerLeaveCapture={undefined}
          >
            {openNav ? (
              <XMarkIcon className="h-8 w-8" strokeWidth={2} />
            ) : (
              <Bars3Icon className="h-8 w-8" strokeWidth={2} />
            )}
          </IconButton>
        </div>
      </div>
      <Collapse open={openNav}>
        <div className="pt-4 pb-2">
          {navList}
          <div className="mt-4">
            <Link href="/admin/login">
              <Button
                as="span"
                variant="gradient"
                size="md"
                fullWidth
                className="mb-2 bg-gradient-to-r from-pink-500 to-purple-600 py-3"
                placeholder={undefined}
                onPointerEnterCapture={undefined}
                onPointerLeaveCapture={undefined}
              >
                Giriş Yap
              </Button>
            </Link>
          </div>
        </div>
      </Collapse>
    </MTNavbar>
  );
}