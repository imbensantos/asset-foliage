import { isSuperOrAdmin, isSuperOrAdminAccess } from "../lib/payload-utils";
import { Product, User } from "../payload-types";
import { BeforeChangeHook } from "payload/dist/collections/config/types";
import { Access, CollectionConfig } from "payload/types";
import path from "path";

const addUser: BeforeChangeHook = ({ req, data }) => {
  const user = req.user as User | null;
  return { ...data, user: user?.id };
};

const isYourOwnAndPurchased: Access = async ({ req }) => {
  const user = req.user as User | null;

  // Super admins and admins can see everything
  if (isSuperOrAdmin(user)) return true;

  // If no user, they can still see files of available products
  if (!user) return true;

  // Get all products where the user is the owner
  const { docs: products } = await req.payload.find({
    collection: "products",
    depth: 0,
    where: {
      user: { equals: user.id },
    },
  });

  // Get all orders where the user is the buyer
  const { docs: orders } = await req.payload.find({
    collection: "orders",
    depth: 2,
    where: {
      user: { equals: user.id },
    },
  });

  // Get all product files from user's products
  const personalProductFileIds = products
    .map((prod) => prod.product_files)
    .flat();

  // Get all product files from user's purchases
  const purchasedProductFileIds = orders
    .map((order) => {
      return (order.products as Product[]).map((product) => {
        if (typeof product === "string")
          return req.payload.logger.error(
            "Search depth not sufficient to find purchased file IDs",
          );

        return typeof product.product_files === "string"
          ? product.product_files
          : product.product_files.id;
      });
    })
    .filter(Boolean)
    .flat();

  // Allow access to:
  // 1. Files owned by the user
  // 2. Files purchased by the user
  // 3. Files that are part of available products (not owned by the user)
  return {
    or: [
      {
        id: {
          in: [...personalProductFileIds, ...purchasedProductFileIds],
        },
      },
      {
        user: {
          not_equals: user.id,
        },
      },
    ],
  } as const;
};

export const ProductFiles: CollectionConfig = {
  slug: "product_files",
  admin: { hidden: ({ user }) => user.role === "user" },
  hooks: {
    beforeChange: [addUser],
  },
  access: {
    read: isYourOwnAndPurchased,
    update: isSuperOrAdminAccess,
    delete: isSuperOrAdminAccess,
  },
  upload: {
    staticURL: "/storage/product_files", // URL where the files will be accessible
    staticDir: process.env.NODE_ENV === "production" 
      ? path.join(process.env.RAILWAY_VOLUME_MOUNT_PATH || "/app/storage", "product_files")
      : path.join(process.cwd(), "storage", "product_files"),  // Directory where the files will be stored on the server
    mimeTypes: [
      "image/*",                   // Allow all image types
      "font/*",                     // Allow all font types
      "application/postscript",     // Allow postscript files
      "application/x-zip-compressed", // Allow zip files
      "application/zip"             // Specifically allow zip files
    ],
  },
  fields: [
    {
      name: "user",
      type: "relationship",
      relationTo: "users",
      admin: { condition: () => false },
      hasMany: false,
      required: true,
    },
  ],
};
