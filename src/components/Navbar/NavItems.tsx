"use client";
import React, { useEffect, useRef, useState } from "react";
import { PRODUCT_CATEGORIES } from "@/config";
import { useOnClickOutside } from "usehooks-ts";
import NavItem from "./NavItem";

type Props = {};

function NavItems({}: Props) {
  const [activeIndex, setActiveIndex] = useState<null | number>(null);
  const navRef = useRef<HTMLDivElement | null>(null);
  const isAnyOpen = activeIndex !== null;

  useOnClickOutside(navRef, () => setActiveIndex(null));

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setActiveIndex(null);
      }
    };

    document.addEventListener("keydown", handler);

    return () => {
      document.removeEventListener("keydown", handler);
    };
  }, []);

  return (
    <div ref={navRef} className="flex h-full gap-4">
      {PRODUCT_CATEGORIES.map((category, i) => {
        const isOpen = i === activeIndex;

        const handleOpen = () => {
          if (activeIndex === i) setActiveIndex(null);
          else setActiveIndex(i);
        };

        return (
          <NavItem
            key={category.value}
            category={category}
            handleOpen={handleOpen}
            isAnyOpen={isAnyOpen}
            isOpen={isOpen}
          />
        );
      })}
    </div>
  );
}

export default NavItems;
