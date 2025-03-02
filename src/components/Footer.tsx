"use client"

import MaxWidthWrapper from "./MaxWidthWrapper";
import { usePathname } from "next/navigation";
import Icons from "./Icons";
import Link from "next/link";

function Footer() {
  const pathName = usePathname();
  const pathsToMinimize = ["/verify-email", "/sign-up", "/login"];

  return (
    <footer className="flex-grow-0 bg-white">
      <MaxWidthWrapper>
        <div className="border-t border-gray-200">
          {pathsToMinimize.includes(pathName) ? null : (
            <div className="flex justify-center pb-8 pt-16 items-center">
              <Icons.Logo className="h-10 w-auto" />
              <span className="ml-3 font-black text-xl align-middle">Asset<span className="text-green-600">Foliage</span></span>
            </div>
          )}

          {
            pathsToMinimize.includes(pathName) ? null : (
              <div className="relative flex items-center p-6 sm:py-8 lg:mt-0">
                <div className="absolute inset-0 overflow-hidden rounded-lg">
                  <div aria-hidden="true" className="absolute bg-zinc-50 inset-0 bg-gradient-to-br bg-opacity-90" />
                </div>

                <div className="text-center relative mx-auto max-w-sm">
                  <h3 className="font-semibold text-gray-900">Become a seller</h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    If you&apos;d like to sell high-quality digital products, you can do so in minutes.{' '}
                    <Link href="/login?as=seller" className="whitespace-nowrap font-medium text-black hover:text-zinc-900">Get started &rarr;</Link>
                  </p>
                </div>
              </div>
            )
          }
        </div>

        <div className="py-10 md:flex md:items-center md:justify-between">
          <div className="text-center md:text-left">
            <p className="text-sm text-muted-foreground">&copy; {new Date().getFullYear()} All rights reserved.</p>
          </div>
          <div className="mt-4 flex items-center justify-center md:mt-0">
            <div className="flex space-x-8">
              <Link href="#" className="text-sm text-muted-foreground hover:text-gray-900">Terms of Service</Link>
              <Link href="#" className="text-sm text-muted-foreground hover:text-gray-900">Privacy Policy</Link>
              <Link href="#" className="text-sm text-muted-foreground hover:text-gray-900">Cookie Policy</Link>
            </div>
          </div>
        </div>
      </MaxWidthWrapper>
    </footer>
  );
}

export default Footer;
