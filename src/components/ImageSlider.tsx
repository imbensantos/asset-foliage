"use client";

import Image from "next/image";
import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import type SwiperType from "swiper";
import { Pagination } from "swiper/modules";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";
import "swiper/css";
import "swiper/css/pagination";

interface Props {
  urls: string[];
}

const ImageSlider = ({ urls }: Props) => {
  const [swiper, setSwiper] = useState<null | SwiperType>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const [slideConfig, setSlideConfig] = useState({
    isBeginning: true,
    isEnd: activeIndex === (urls.length ?? 0) - 1,
  });

  const activeStyles =
    "active:scale-[0.97] grid opacity-100 hover:scale-105 absolute top-1/2 -translate-y-1/2 aspect-square h-8 w-8 z-50 place-items-center rounded-full border-2 bg-white border-zinc-300";

  const inactiveStyles = "hidden text-gray-4000";

  useEffect(() => {
    swiper?.on("slideChange", ({ activeIndex }) => {
      setActiveIndex(activeIndex);
      setSlideConfig({
        isBeginning: activeIndex === 0,
        isEnd: activeIndex === (urls.length ?? 0) - 1,
      });
    });
  }, [swiper, urls]);

  return (
    <div className="group relative aspect-square overflow-hidden rounded-xl bg-zinc-100">
      <div className="absolute inset-0 opacity-0 transition group-hover:opacity-100">
        <button
          onClick={(e) => {
            e.preventDefault();
            swiper?.slideNext();
          }}
          className={cn(activeStyles, "right-3 transition", {
            [inactiveStyles]: slideConfig.isEnd,
            "hover:bg-primary-300 text-primary-800 opacity-100":
              !slideConfig.isEnd,
          })}
        >
          <ChevronRight
            className="h-4 w-4 text-zinc-700"
            aria-label="next image"
          ></ChevronRight>
        </button>
        <button
          onClick={(e) => {
            e.preventDefault();
            swiper?.slidePrev();
          }}
          className={cn(activeStyles, "left-3 transition", {
            [inactiveStyles]: slideConfig.isBeginning,
            "hover:bg-primary-300 text-primary-800 opacity-100":
              !slideConfig.isBeginning,
          })}
        >
          <ChevronLeft
            className="h-4 w-4 text-zinc-700"
            aria-label="previous image"
          ></ChevronLeft>
        </button>
      </div>
      <Swiper
        draggable="true"
        pagination={{
          renderBullet: (_, className) =>
            `<span class="rounded-full transition ${className}"></span>`,
          clickable: true,
        }}
        onSwiper={(swiper) => setSwiper(swiper)}
        spaceBetween={50}
        modules={[Pagination]}
        slidesPerView={1}
        className="h-full w-full"
      >
        {urls.map((url, i) => (
          <SwiperSlide key={i} className="relative -z-10 h-full w-full">
            <Image
              alt="Product Image"
              className="-z-10 h-full w-full object-cover object-center"
              fill
              loading="eager"
              src={url}
              unoptimized
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default ImageSlider;
