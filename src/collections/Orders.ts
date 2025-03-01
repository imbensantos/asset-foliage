import { isSuperOrAdmin, isSuperOrAdminAccess } from "../lib/payload-utils";
import { Access, CollectionConfig, FieldAccess } from "payload/types";

const isYourOwn: Access = ({ req: { user } }) => {
  if (user.role === "admin") return true;

  return {
    user: { equals: user?.id },
  };
};

const isSuperOrAdminFieldAccess: FieldAccess = ({ req: { user } }) => isSuperOrAdmin(user);

export const Orders: CollectionConfig = {
  slug: "orders",
  admin: {
    useAsTitle: "Your Orders",
    description: "A summary of all your orders on Asset Foliage.",
  },
  access: {
    read: isYourOwn,
    create: isSuperOrAdminAccess,
    update: isSuperOrAdminAccess,
    delete: isSuperOrAdminAccess,
  },
  fields: [
    {
      name: "_isPaid",
      type: "checkbox",
      access: {
        read: isSuperOrAdminFieldAccess,
        create: () => false,
        update: () => false,
      },
      admin: { hidden: true },
      required: true,
    },
    {
      name: "user",
      type: "relationship",
      admin: { hidden: true },
      relationTo: "users",
      required: true,
    },
    {
      name: "products",
      type: "relationship",
      relationTo: "products",
      hasMany: true,
      required: true,
    },
  ],
};
