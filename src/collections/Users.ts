import { CollectionConfig } from "payload/types";

export const Users: CollectionConfig = {
  slug: "users",
  auth: {
    verify: {
      generateEmailHTML: ({ token }) => {
        return `<a href='${process.env.NEXT_PUBLIC_SERVER_URL}/verify-email?token=${token}'>Verify account</a>`;
      },
    },
  },
  access: {
    // Read: Allow normal users to read, but they cannot read super_admins
    read: ({ req: { user } }) => {
      if (!user) return false; // Deny if no user is logged in
      if (user.role === "super_admin") return true; // Super admins can read everyone
      return {
        role: {
          not_in: ["super_admin"], // Prevent normal users from reading super_admins
        },
      };
    },
    // Create: Allow normal users to create, but they cannot create super_admins
    create: ({ req: { user }, data }) => {
      if (!user) return false; // Deny if no user is logged in
      if (user.role === "super_admin") return true; // Super admins can create anything
      if (data.role === "super_admin") return false; // Prevent normal users from creating super_admins
      return true; // Normal users can create regular users
    },
  },
  fields: [
    {
      name: "role",
      admin: {
        // Condition will check if user is admin
        condition: (_, __, { user }) => user.role === "admin" || user.role === "super_admin",
        components: {
        }
      },
      required: true,
      defaultValue: "user",
      type: "select",
      options: [
        { label: "Admin", value: "admin" },
        { label: "User", value: "user" },
      ],
    },
  ],
};
