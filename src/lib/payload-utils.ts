import { User } from "../payload-types";
import { ReadonlyRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies";
import { NextRequest } from "next/server";

export const getServerSideUser = async (
  cookies: NextRequest["cookies"] | ReadonlyRequestCookies,
) => {
  try {
    const token = cookies.get("payload-token")?.value;

    if (!token) {
      console.warn("🚨 No payload-token found in cookies");
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