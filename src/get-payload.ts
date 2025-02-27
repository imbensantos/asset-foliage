import dotenv from "dotenv";
import path from "path";
import payload, { Payload } from "payload";
import type { InitOptions } from "payload/config";
import nodemailer from "nodemailer";

dotenv.config({
  path: path.resolve(__dirname, "../.env"),
});

const { PAYLOAD_SECRET, RESEND_API_KEY } = process.env

let cached = (global as any).payload;

if (!cached) {
  cached = (global as any).payload = {
    client: null,
    promise: null,
  };
}

const transporter = nodemailer.createTransport({
  host: "smtp.resend.com",
  secure: true,
  port: 465,
  auth: {
    user: "resend",
    pass: RESEND_API_KEY,
  },
});

interface Args {
  initOptions?: Partial<InitOptions>;
}

export const getPayloadClient = async ({
  initOptions,
}: Args = {}): Promise<Payload> => {

  // if (!PAYLOAD_SECRET) {
  //   throw new Error("PAYLOAD_SECRET env variable is missing");
  // }

  if (cached.client) {
    return cached.client;
  }

  if (!cached.promise) {
    cached.promise = await payload.init({
      email: {
        transport: transporter,
        fromAddress: "assetfoliage@imbensantos.com",
        fromName: "Asset Foliage"
      },
      secret: PAYLOAD_SECRET as string,
      local: initOptions?.express ? false : true,
      ...(initOptions || {}),
    });
  }

  try {
    cached.client = await cached.promise;
  } catch (error: unknown) {
    cached.promise = null;
    throw error;
  }

  return cached.client;
};
