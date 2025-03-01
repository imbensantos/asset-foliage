import { User } from "../payload-types";
import { ReadonlyRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies";
import { NextRequest } from "next/server";
import { Access } from "payload/config";

export const getServerSideUser = async (
  cookies: NextRequest["cookies"] | ReadonlyRequestCookies,
) => {
  try {
    const token = cookies.get("payload-token")?.value;

    if (!token) {
      return { user: null };
    }

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_SERVER_URL}/api/users/me`,
      {
        headers: {
          Authorization: `JWT ${token}`,
        },
      },
    );

    if (!response.ok) {
      console.error(
        `❌ Error fetching user: ${response.status} - ${await response.text()}`,
      );
      return { user: null };
    }

    const data = await response.json();
    return { user: data.user as User | null };
  } catch (error) {
    console.error("🚨 getServerSideUser error:", error);
    return { user: null };
  }
};

export const isSuperAdmin = (user: User | any) => user?.role === "super_admin" || !!user?.is_super_admin ? true : false;

export const isSuperOrAdmin = (user: User | any) => user?.role === "admin" || isSuperAdmin(user) ? true : false;

export const isSuperOrAdminAccess: Access = ({ req: { user } } ) => user?.role === "admin" || isSuperAdmin(user); 