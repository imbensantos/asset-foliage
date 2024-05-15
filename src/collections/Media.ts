import { User } from "../payload-types";
import { Access, AccessArgs, CollectionConfig } from "payload/types";

const isAdminOrHasAccessToImages =
  (): Access =>
  async ({ req }) => {
    const user = req.user as User | undefined;

    if (!user) return false;
    if (user.role === "admin" || user.role === "super_admin") return true;

    // If the user owns the image
    return {
      user: {
        equals: req.user.id,
      },
    };
  };

export const Media: CollectionConfig = {
  slug: "media",
  hooks: {
    beforeChange: [
      ({ req, data }) => {
        return { ...data, user: req.user.id };
      },
    ],
  },
  admin: { hidden: ({ user }) => (user.role !== "admin") },
  access: {
    read: async ({ req }) => {
      const referer = req.headers.referer;

      // If users aren't logged in or not in admin dashboard, they can view all images
      if (!req.user || !referer?.includes("sell")) {
        return true;
      }

      return await isAdminOrHasAccessToImages()({req});
    },
    delete: isAdminOrHasAccessToImages(),
    update: isAdminOrHasAccessToImages()
  },
  upload: {
    staticURL: "/storage/media",
    staticDir: "storage/media",
    imageSizes: [
      {
        name: "thumbnail",
        width: 400,
        height: 300,
        position: "centre",
      },
      {
        name: "card",
        width: 768,
        height: 1024,
        position: "centre",
      },
      {
        name: "tablet",
        width: 1024,
        height: undefined,
        position: "centre",
      },
    ],
    mimeTypes: ["image/*"],
  },
  fields: [
    {
      name: "user",
      type: "relationship",
      relationTo: "users",
      required: true,
      hasMany: false,
      admin: { condition: () => false },
    },
  ],
};
