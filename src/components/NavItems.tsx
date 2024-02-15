"use client";
import { PRODUCT_CATEGORIES } from "@/config";
import React, { useState } from "react";
import NavItem from "@/components/NavItem";

type Props = {};

function NavItems({}: Props) {
  const [activeIndex, setActiveIndex] = useState<null | number>(null);

  const isAnyOpen = activeIndex !== null;

  return (
    <div className="flex h-full gap-4">
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
