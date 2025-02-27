import express from "express";
import { getPayloadClient } from "./get-payload";
import { nextApp, nextHandler } from "./next-utils";
import * as trpcExpress from "@trpc/server/adapters/express";
import { appRouter } from "./trpc";
import { inferAsyncReturnType } from "@trpc/server";
import bodyParser from "body-parser";
import { IncomingMessage } from "http";
import { stripeWebhookHandler } from "./webhooks";
import nextBuild from "next/dist/build";
import path from "path";

const app = express();
const PORT = Number(process.env.PORT) || 3000;

const createContext = ({
  req,
  res,
}: trpcExpress.CreateExpressContextOptions) => ({
  req,
  res,
});

export type ExpressContext = inferAsyncReturnType<typeof createContext>;
export type WebhookRequest = IncomingMessage & { rawBody: Buffer };

const start = async (): Promise<void> => {
  const webhookMiddleware = bodyParser.json({
    verify: (req: WebhookRequest, _, buffer) => {
      req.rawBody = buffer;
    },
  });

  app.post("/api/webhooks/stripe", webhookMiddleware, stripeWebhookHandler);

  // 👉 Run Next.js build if needed (before Payload starts)
  if (process.env.NEXT_BUILD) {
    try {
      console.log("📦 Building Next.js...");
      // @ts-expect-error
      await nextBuild(path.join(__dirname, "../"));
      console.log("✅ Next.js build complete");
    } catch (error) {
      console.error("❌ Next.js build failed", error);
      process.exit(1);
    }
  }

  // 👉 Initialize Payload (AFTER Next.js build)
  const payload = await getPayloadClient({
    initOptions: {
      express: app,
      onInit: async (cms) => {
        cms.logger.info(`Admin URL ${cms.getAdminURL()}`);
      },
    },
  });

  // 👉 TRPC Middleware
  app.use(
    "/api/trpc",
    trpcExpress.createExpressMiddleware({
      router: appRouter,
      createContext,
    })
  );

  // 👉 Start Next.js server
  await nextApp.prepare();
  payload.logger.info("🚀 NextJS started");

  app.use((req, res) => nextHandler(req, res));

  app.listen(PORT, () => {
    payload.logger.info(`🌐 NextJS App URL: ${process.env.NEXT_PUBLIC_SERVER_URL}`);
  });
};

start();