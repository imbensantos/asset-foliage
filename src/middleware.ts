import { NextRequest, NextResponse } from "next/server";
import { getServerSideUser } from "./lib/payload-utils";

// Middleware function that will run on every request
export async function middleware(req: NextRequest) {
  const { nextUrl, cookies } = req;
  const { user } = await getServerSideUser(cookies);

  // If a user is authenticated AND they try to access the login or sign-up pages,
  // redirect them to the home page.
  if (user && ["/login", "/sign-up"].includes(nextUrl.pathname)) {
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_SERVER_URL}/`);
  }

  // Otherwise continue
  return NextResponse.next();
}
