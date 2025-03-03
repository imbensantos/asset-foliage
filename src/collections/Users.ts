import { isSuperAdmin, isSuperOrAdmin } from "../lib/payload-utils";
import { PrimaryActionEmailHtml } from "../components/emails/PrimaryActionEmail";
import { AccessResult } from "payload/config";
import { CollectionConfig } from "payload/types";

export const Users: CollectionConfig = {
  slug: "users",
  auth: {
    verify: {
      generateEmailHTML: ({ token }) => {
        return PrimaryActionEmailHtml({
          actionLabel: "verify your email and get started",
          buttonText: "Verify Account",
          href: `${process.env.NEXT_PUBLIC_SERVER_URL}/verify-email?token=${token}`
        })
      },
    },
  },
  access: {
    // READ ACESS
    read: ({ req: { user } }): AccessResult => {
      // Deny access if no user is logged in
      if (!user) return false;

      // Super admins can read all users
      if (isSuperAdmin(user)) return true;

      // Admins can read all users except super_admins
      if (user.role === "admin") {
        return {
          role: { not_in: ["super_admin"] },
          is_super_admin: { not_equals: true },
        };
      }

      // Normal users can only read their own data
      return {
        id: { equals: user.id },
      };
    },

    // CREATE ACCESS
    create: () => true,

    // UPDATE ACCESS
    update: ({ req: { user } }): AccessResult => {
      // Super admins can update anything
      if (isSuperAdmin(user)) return true;

      // Admins can update non-super_admin users
      if (user.role === "admin") {
        return {
          role: { not_in: ["super_admin"] },
          is_super_admin: { not_equals: true },
        };
      }

      // Users can only update themselves
      return {
        id: { equals: user.id },
      };
    },

    // DELETE ACCESS
    delete: ({ req: { user } }): AccessResult => {
      // Super admins can delete anything
      if (isSuperAdmin(user)) return true;

      // Admins can delete non-super_admin users
      if (user.role === "admin") {
        return {
          role: { not_in: ["super_admin"] },
          is_super_admin: { not_equals: true },
        };
      }

      // Users can only delete themselves
      return {
        id: { equals: user.id },
      };
    },
  },

  admin: {
    hidden: ({user}) => user.role === "user",
    defaultColumns: ["id"]
  },
  
  fields: [
    {
      name: "products",
      label: "Products",
      admin: {
        condition: () => false,
      
      },
      type: "relationship",
      relationTo: "products",
      hasMany: true,
    },
    {
      name: "product_files",
      label: "Products Files",
      admin: {
        condition: () => false,
      
      },
      type: "relationship",
      relationTo: "product_files",
      hasMany: true,
    },
    {
      name: "role",
      admin: {
        // Condition will check if user is admin
        condition: (_, __, { user }) =>
          (isSuperOrAdmin(user)),
        components: {},
      },
      required: true,
      defaultValue: "user",
      type: "select",
      options: [
        { label: "Admin", value: "admin" },
        { label: "User", value: "user" },
        // Super Admin option should only be added through admin panel by super admins
      ],
    },
    {
      name: "is_super_admin",
      label: "Super Admin Privilege",
      type: "checkbox",
      defaultValue: false,
      admin: {
        condition: (_, __, {user}) => isSuperAdmin(user)
      }
    },
  ],
};
