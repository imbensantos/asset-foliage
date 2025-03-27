import { PRODUCT_CATEGORIES } from "../config";
import {
  Access,
  CollectionBeforeChangeHook,
  CollectionConfig,
  FieldAccess,
} from "payload/types";
import { Product, User } from "../payload-types";
import Stripe from "stripe";
import { AfterChangeHook } from "payload/dist/collections/config/types";
import { isSuperOrAdmin } from "../lib/payload-utils";

const isSuperOrAdminFieldAccess: FieldAccess = ({ req: { user } }) => isSuperOrAdmin(user);

const isSuperOrAdminOrHasAccess = (): Access => ({ req: { user: _user } }) => {
  const user = _user as User | undefined;

  if (!user) return false;
  if (isSuperOrAdmin(user)) return true;

  // Allow access to products where the user is the owner
  return {
    user: {
      equals: user.id,
    },
  };
};

const addUser: CollectionBeforeChangeHook<Product> = async ({ req, data }) => {
  const user = req.user;

  return { ...data, user: user.id };
};

const syncUser: AfterChangeHook<Product> = async ({ req, doc }) => {
  const fullUser = await req.payload.findByID({
    collection: "users",
    id: req.user.id,
  });

  if (fullUser && typeof fullUser === "object") {
    const { products } = fullUser;

    const allIDs = [
      ...((products as Product[])?.map((product) =>
        typeof product === "object" ? product.id : product,
      ) ?? []),
    ];

    const createdProductIDs = allIDs.filter(
      (id, index) => allIDs.indexOf(id) === index,
    );

    const dataToUpdate = [...createdProductIDs, doc.id];

    await req.payload.update({
      collection: "users",
      id: fullUser.id,
      data: {
        products: dataToUpdate,
      },
    });
  }
};

export const Products: CollectionConfig = {
  slug: "products",
  admin: {
    useAsTitle: "name",
  },
  access: {
    read: isSuperOrAdminOrHasAccess(),
    update: isSuperOrAdminOrHasAccess(),
    delete: isSuperOrAdminOrHasAccess(),
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
    afterChange: [syncUser],
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
        create: isSuperOrAdminFieldAccess,
        read: isSuperOrAdminFieldAccess,
        update: isSuperOrAdminFieldAccess,
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
