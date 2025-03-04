"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PRODUCT_CATEGORIES = void 0;
exports.PRODUCT_CATEGORIES = [
    {
        label: "UI Kits",
        value: "ui_kits",
        featured: [
            {
                name: "Editor Picks",
                href: "/products?category=ui_kits",
                imageSrc: "/nav/ui-kits/mixed.webp"
            },
            {
                name: "New Arrivals",
                href: "/products?category=ui_kits&sort=desc",
                imageSrc: "/nav/ui-kits/blue.webp"
            },
            {
                name: "Bestsellers",
                href: "/products?category=ui_kits",
                imageSrc: "/nav/ui-kits/purple.webp"
            }
        ]
    },
    {
        label: "Icons",
        value: "icons",
        featured: [
            {
                name: "Favorite Icon Picks",
                href: "/products?category=icons",
                imageSrc: "/nav/icons/picks.webp"
            },
            {
                name: "New Arrivals",
                href: "/products?category=icons&sort=desc",
                imageSrc: "/nav/icons/new.webp"
            },
            {
                name: "Bestselling Icons",
                href: "/products?category=icons",
                imageSrc: "/nav/icons/bestsellers.webp"
            }
        ]
    }
];
