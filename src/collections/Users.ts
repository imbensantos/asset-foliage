import { AccessResult } from "payload/config";
import { CollectionConfig } from "payload/types";

export const Users: CollectionConfig = {
  slug: "users",
  auth: {
    verify: {
      generateEmailHTML: ({ token }) => {
        return (
          `<body>
            <h1>Hi!</h1>
            <p>Thanks for signing up for <b>Asset Foliage</b>! We’re excited to have you on board. Please verify your email address to complete your registration.</p>
            <p>Click the link below to verify your email and get started:</p>
            <p>👉<a href='${process.env.NEXT_PUBLIC_SERVER_URL}/verify-email?token=${token}'>Verify account</a></p>
            <br />
            <p>If you didn’t sign up for an account, you can safely ignore this email.</p>
            <p>Thanks, <br /><b>The Asset Foliage Team</b></p>
          </body>`
        );
      },
    },
  },
  access: {
    // READ ACESS
    read: ({ req: { user } }): AccessResult => {
      // Deny access if no user is logged in
      if (!user) return false;

      // Super admins can read all users
      if (user.role === "super_admin") return true;

      // Admins can read all users except super_admins
      if (user.role === "admin") {
        return {
          role: { not_in: ["super_admin"] },
        };
      }

      // Normal users can only read their own data
      return {
        id: { equals: user.id },
      };
    },

    // CREATE ACCESS
    create: ({ req: { user, context }, data }) => {
      console.log("Request Context: ", context);

      // Allow public sign ups (unauthenticated users)
      if (!user) return true;

      // Super admins can create anything
      if (user.role === "super_admin") return true;

      // Prevent creation of super_admins by other roles
      if (data?.role === "super_admin") return false;

      // Admins can create admins and users
      if (user.role === "admin") return true;

      // Regular users cannot create anyone
      return false;
    },

    // UPDATE ACCESS
    update: ({ req: { user } }): AccessResult => {
      if (!user) return false;

      // Super admins can update anything
      if (user.role === "super_admin") return true;

      // Admins can update non-super_admin users
      if (user.role === "admin") {
        return {
          role: { not_in: ["super_admin"] },
        };
      }

      // Users can only update themselves
      return {
        id: { equals: user.id },
      };
    },

    // DELETE ACCESS
    delete: ({ req: { user } }): AccessResult => {
      if (!user) return false;

      // Super admins can delete anything
      if (user.role === "super_admin") return true;

      // Admins can delete non-super_admin users
      if (user.role === "admin") {
        return {
          role: { not_in: ["super_admin"] },
        };
      }

      // Users can only delete themselves
      return {
        id: { equals: user.id },
      };
    },
  },

  
  fields: [
    {
      name: "role",
      admin: {
        // Condition will check if user is admin
        condition: (_, __, { user }) =>
          (user?.role === "admin") || user?.role === "super_admin",
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
  ],
};
