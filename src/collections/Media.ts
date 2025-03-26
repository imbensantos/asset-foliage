import { isSuperOrAdmin } from "../lib/payload-utils";
import { User } from "../payload-types";
import { Access, AccessArgs, CollectionConfig } from "payload/types";

const isSuperOrAdminOrHasAccess =
  (): Access =>
  async ({ req }) => {
    const user = req.user as User | undefined;

    if (!user) return false;
    if (isSuperOrAdmin(user)) return true;

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
  admin: { hidden: ({ user }) => (user.role === "user") },
  access: {
    read: async ({ req }) => {
      const referer = req.headers.referer;

      // If users aren't logged in or not in admin dashboard, they can view all images
      if (!req.user || !referer?.includes("sell")) {
        return true;
      }

      return await isSuperOrAdminOrHasAccess()({req});
    },
    delete: isSuperOrAdminOrHasAccess(),
    update: isSuperOrAdminOrHasAccess()
  },
  upload: {
    staticURL: "/storage/media", // URL where the files will be accessible
    staticDir: "/var/lib/containers/railwayapp/bind-mounts/511930f5-46d2-4d35-bdf8-40526398b939/vol_zpe4zo2zuryea55e/media", // Directory where the files will be stored on the server
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
