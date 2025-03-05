import Image from "next/image";
import React from "react";
import VerifyEmail from "@/components/VerifyEmail";

type Props = {
  searchParams: { [key: string]: string | undefined };
};

function VerifyEmailPage({ searchParams }: Props) {
  const token = searchParams.token;
  const toEmail = searchParams.to;

  return (
    <div className="container relative flex flex-col items-center justify-center pt-20 lg:px-0">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-96">
        {token && typeof token === "string" ? (
          <div className="grid gap-6">
            <VerifyEmail token={token} />
          </div>
        ) : (
          <div className="flex h-full flex-col items-center justify-center space-y-1">
            <div className="relative mb-4 h-60 w-60 text-muted-foreground">
              <Image
                src="/email-sent.webp"
                fill
                alt="Chameleon Email Sent image"
                unoptimized
              />
            </div>

            <h3 className="text-2xl font-semibold">Check your email</h3>

            <p className="text-center text-muted-foreground">
              We&apos;ve sent a verification link to{" "}
              {toEmail ? (
                <span className="font-semibold">{toEmail && toEmail?.replace(" ", "+")}</span>
              ) : (
                "your email"
              )}
              .
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default VerifyEmailPage;
