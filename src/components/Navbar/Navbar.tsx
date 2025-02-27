import React from "react";
import Link from "next/link";
import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import Icons from "@/components/Icons";
import { buttonVariants } from "@/components/ui/button";
import NavItems from "./NavItems";
import Cart from "@/components/Cart";
import { getServerSideUser } from "@/lib/payload-utils";
import { cookies } from "next/headers";
import UserAccountNav from "./UserAccountNav";

type Props = {};

async function Navbar({}: Props) {
  const nextCookies = cookies();
  const { user } = (await getServerSideUser(nextCookies)) || { user: null };

  return (
    <div className="sticky inset-x-0 top-0 z-50 h-16 bg-white">
      <header className="relative bg-white">
        <MaxWidthWrapper>
          <div className="border-b border-gray-200">
            <div className="flex h-16 items-center">
              {/* TODO: Mobile Nav */}

              <div className="ml-4 flex lg:ml-0">
                <Link href="/">
                  <Icons.Logo className="h-10 w-10" />
                </Link>
              </div>

              <div className="z-50 hidden lg:ml-8 lg:block lg:self-stretch">
                <NavItems />
              </div>

              <div className="ml-auto flex items-center">
                <div className="hidden lg:flex lg:flex-1 lg:items-center lg:justify-end lg:space-x-6">
                  {user ? null : (
                    <>
                      <Link
                        href="/login"
                        className={buttonVariants({ variant: "ghost" })}
                      >
                        Login
                      </Link>
                      <span
                        className="h-6 w-px bg-gray-200"
                        aria-hidden="true"
                      />
                      <Link
                        href="/sign-up"
                        className={buttonVariants({ variant: "ghost" })}
                      >
                        Create account
                      </Link>
                    </>
                  )}

                  {user ? (
                    <>
                      <UserAccountNav user={user} />
                      <span
                        className="h-6 w-px bg-gray-200"
                        aria-hidden="true"
                      />
                    </>
                  ) : null}

                  {user ? null : (
                    <div className="flex lg:ml-6">
                      <span
                        className="h-6 w-px bg-gray-200"
                        aria-hidden="true"
                      />
                    </div>
                  )}

                  <div className="ml-4 flow-root lg:ml-6">{<Cart />}</div>
                </div>
              </div>
            </div>
          </div>
        </MaxWidthWrapper>
      </header>
    </div>
  );
}

export default Navbar;
