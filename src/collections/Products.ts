import { slateEditor } from "@payloadcms/richtext-slate";
import { PRODUCT_CATEGORIES } from "../config";
import {
  CollectionBeforeChangeHook,
  CollectionConfig,
  FieldAccess,
} from "payload/types";
import { Product } from "../payload-types";
import Stripe from "stripe";

const isAdmin: FieldAccess = ({ req: { user } }) =>
  user.role === "admin" || user.role === "super_admin";

const addUser: CollectionBeforeChangeHook<Product> = async ({ req, data }) => {
  const user = req.user;

  return { ...data, user: user.id };
};

export const Products: CollectionConfig = {
  slug: "products",
  admin: {
    useAsTitle: "name",
  },
  access: {
    read: isAdmin,
    update: isAdmin,
    delete: isAdmin,
  },
  hooks: {
    beforeChange: [
      addUser,
      async (args) => {

        const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? "", {
          apiVersion: "2025-02-24.acacia",
          typescript: true,
        });

        if (args.operation === "create") {
          const data = args.data as Product;

          const createdProduct = await stripe.products.create({
            name: data.name,
            default_price_data: {
              currency: "USD",
              unit_amount: Math.round(data.price * 100), // product price in cents
            },
          });

          const updated: Product = {
            ...data,
            stripeId: createdProduct.id,
            priceId: createdProduct.default_price as string,
          };

          return updated;
        } else if (args.operation === "update") {
          const data = args.data as Product;

          const updatedProduct = await stripe.products.update(data.stripeId!, {
            name: data.name,
            default_price: data.priceId!,
          });

          const updated: Product = {
            ...data,
            stripeId: updatedProduct.id,
            priceId: updatedProduct.default_price as string,
          };

          return updated;
        }
      },
    ],
  },
  fields: [
    {
      name: "user",
      type: "relationship",
      relationTo: "users",
      required: true,
      hasMany: false,
      admin: {
        condition: () => false,
      },
    },
    {
      name: "name",
      label: "Name",
      type: "text",
      required: true,
    },
    {
      name: "description",
      label: "Product Details",
      type: "textarea",
      // TODO: Implement richText editor and rendering
      // type: "richText",
      // editor: slateEditor({
      //   admin: {
      //     elements: [
      //       'link', 'ol', 'ul'
      //     ],
      //     leaves: ['bold', 'italic', 'code', 'strikethrough', 'underline']
      //   }
      // })
    },
    {
      name: "price",
      label: "Price in USD",
      min: 0,
      max: 1000,
      type: "number",
      required: true,
    },
    {
      name: "category",
      label: "Category",
      type: "select",
      options: PRODUCT_CATEGORIES.map(({ label, value }) => ({ label, value })),
      required: true,
    },
    {
      name: "product_files",
      label: "Product File(s)",
      type: "relationship",
      required: true,
      relationTo: "product_files",
      hasMany: false,
    },
    {
      name: "approvedForSale",
      label: "Product Status",
      type: "select",
      defaultValue: "pending",
      options: [
        { label: "Pending verification", value: "pending" },
        { label: "Approved", value: "approved" },
        { label: "Denied", value: "denied" },
      ],
      access: {
        create: isAdmin,
        read: isAdmin,
        update: isAdmin,
      },
    },
    {
      name: "priceId",
      type: "text",
      admin: { hidden: true },
      access: {
        create: () => false,
        read: () => false,
        update: () => false,
      },
    },
    {
      name: "stripeId",
      type: "text",
      admin: { hidden: true },
      access: {
        create: () => false,
        read: () => false,
        update: () => false,
      },
    },
    {
      name: "images",
      label: "Product Images",
      type: "array",
      minRows: 1,
      maxRows: 4,
      required: true,
      labels: {
        singular: "Image",
        plural: "Images",
      },
      fields: [
        {
          name: "image",
          type: "upload",
          relationTo: "media",
          required: true,
        },
      ],
    },
  ],
};
