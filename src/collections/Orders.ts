import { Access, CollectionConfig, FieldAccess } from "payload/types";

const isYourOwn: Access = ({ req: { user } }) => {
  if (user.role === "admin") return true;

  return {
    user: { equals: user?.id },
  };
};

const isAdmin: Access = ({ req: { user } }) =>
  user.role === "admin" || user.role === "super_admin";
const isFieldAdmin: FieldAccess = ({ req: { user } }) =>
  user.role === "admin" || user.role === "super_admin";

export const Orders: CollectionConfig = {
  slug: "orders",
  admin: {
    useAsTitle: "Your Orders",
    description: "A summary of all your orders on Asset Foliage.",
  },
  access: {
    read: isYourOwn,
    create: isAdmin,
    update: isAdmin,
    delete: isAdmin,
  },
  fields: [
    {
      name: "_isPaid",
      type: "checkbox",
      access: {
        read: isFieldAdmin,
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
