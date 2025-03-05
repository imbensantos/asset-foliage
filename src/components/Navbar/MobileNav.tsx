"use client";

import { PRODUCT_CATEGORIES } from "@/config";
import { Menu, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import Icons from "../Icons";

const MobileNav = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isClosing, setIsClosing] = useState<boolean>(false);

  const pathname = usePathname();

  const closeMenu = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsOpen(false);
      setIsClosing(false);
    }, 200); // Timeout duration should match the animation duration
  };

  // whenever we click an item in the menu and navigate away, we want to close the menu
  useEffect(() => {
    closeMenu();
  }, [pathname]);

  // when we click the path we are currently on, we still want the mobile menu to close,
  // however we cant rely on the pathname for it because that won't change (we're already there)
  const closeOnCurrent = (href: string) => {
    if (pathname === href) {
      closeMenu();
    }
  };

  // remove second scrollbar when mobile menu is open
  useEffect(() => {
    if (isOpen) document.body.classList.add("overflow-hidden");
    else document.body.classList.remove("overflow-hidden");
  }, [isOpen]);

  return (
    <>
      {/** Hamburger button */}
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="relative -m-2 inline-flex items-center justify-center rounded-md p-2 text-gray-400 lg:hidden"
      >
        <Menu className="h-6 w-6" aria-hidden="true" />
      </button>

      {isOpen ? (
        <div>

          {/** Background Overlay */}
          <div className="relative z-40 lg:hidden">
            <div
              className={`fixed inset-0 bg-black ${isClosing ? "bg-opacity-0" : "bg-opacity-25"}`}
              onClick={closeMenu}
            />
          </div>

          {/** Menu */}
          <div
            className={`fixed inset-0 z-40 flex w-4/5 overflow-y-scroll overscroll-y-none ${isClosing ? "animate-slideOut" : "animate-slideIn"}`}
          >
            <div className="relative flex w-full max-w-sm flex-col overflow-y-auto bg-white pb-12 shadow-xl">
              <div className="flex items-center px-4 pb-2 pt-3">
                <button
                  type="button"
                  onClick={closeMenu}
                  className="relative -m-2 inline-flex items-center justify-center rounded-md p-2 text-gray-400"
                >
                  <X className="h-6 w-6" aria-hidden="true" />
                </button>
                <Icons.Logo className="ml-3 inline-block h-10 w-10" />
                <span className="ml-3 align-middle text-xl font-black">
                  Asset<span className="text-green-600">Foliage</span>
                </span>
              </div>

              <div className="mt-2">
                <ul>
                  {PRODUCT_CATEGORIES.map((category) => (
                    <li
                      key={category.label}
                      className="space-y-10 px-4 pb-8 pt-10"
                    >
                      <div className="border-b border-gray-200">
                        <div className="-mb-px flex">
                          <p className="flex-1 whitespace-nowrap border-b-2 border-transparent py-4 text-base font-medium text-gray-900">
                            {category.label}
                          </p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-x-4 gap-y-10">
                        {category.featured.map((item) => (
                          <div
                            key={item.name}
                            className="group relative text-sm"
                          >
                            <div className="relative aspect-square overflow-hidden rounded-lg bg-gray-100 group-hover:opacity-75">
                              <Image
                                fill
                                src={item.imageSrc}
                                alt="product category image"
                                className="object-cover object-center"
                                unoptimized
                              />
                            </div>
                            <Link
                              href={item.href}
                              className="mt-6 block font-medium text-gray-900"
                            >
                              {item.name}
                            </Link>
                          </div>
                        ))}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="space-y-6 border-t border-gray-200 px-4 py-6">
                <div className="flow-root">
                  <Link
                    onClick={() => closeOnCurrent("/sign-in")}
                    href="/login"
                    className="-m-2 block p-2 font-medium text-gray-900"
                  >
                    Login
                  </Link>
                </div>
                <div className="flow-root">
                  <Link
                    onClick={() => closeOnCurrent("/sign-up")}
                    href="/sign-up"
                    className="-m-2 block p-2 font-medium text-gray-900"
                  >
                    Sign up
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
};

export default MobileNav;
