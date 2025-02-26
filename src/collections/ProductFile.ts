import { Product, User } from "../payload-types";
import { BeforeChangeHook } from "payload/dist/collections/config/types";
import { Access, CollectionConfig } from "payload/types";

const addUser: BeforeChangeHook = ({ req, data }) => {
  const user = req.user as User | null;
  return { ...data, user: user?.id };
};

const isYourOwnAndPurchased: Access = async ({ req }) => {
  const user = req.user as User | null;

  if (user?.role === "admin" || user?.role === "super_admin") return true;
  if (!user) return false;

  const { docs: products } = await req.payload.find({
    collection: "products",
    depth: 0,
    where: {
      user: { equals: user.id },
    },
  });

  const personalProductFileIds = products
    .map((prod) => prod.product_files)
    .flat();

  const { docs: orders } = await req.payload.find({
    collection: "orders",
    depth: 2,
    where: {
      user: { equals: user.id },
    },
  });

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

  return {
    id: {
      in: [...personalProductFileIds, ...purchasedProductFileIds],
    },
  };
};

const isAdmin: Access = ({ req: { user } }) =>
  user.role === "admin" || user.role === "super_admin";

export const ProductFiles: CollectionConfig = {
  slug: "product_files",
  admin: { hidden: ({ user }) => user.role === "user" },
  hooks: {
    beforeChange: [addUser],
  },
  access: {
    read: isYourOwnAndPurchased,
    update: isAdmin,
    delete: isAdmin,
  },
  upload: {
    staticURL: "/storage/product_files", // URL where the files will be accessible
    staticDir: "storage/product_files",  // Directory where the files will be stored on the server
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
