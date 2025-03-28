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
import { PayloadRequest } from "payload/types";
import { parse } from "url";
import fs from "fs";

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

  // 👉 Protect cart route to be only accessible to logged in users
  const cartRouter = express.Router();
  cartRouter.use(payload.authenticate);
  cartRouter.get("/", async (req, res) => {
    const { user, url } = req as PayloadRequest;
    if (!user) {
      return res.redirect("/login?origin=cart");
    }

    const parsedUrl = parse(url, true);
    return nextApp.render(req, res, "/cart", parsedUrl.query);
  });

  app.use("/cart", cartRouter);

  // 👉 TRPC Middleware
  app.use(
    "/api/trpc",
    trpcExpress.createExpressMiddleware({
      router: appRouter,
      createContext,
    }),
  );

  // 👉 Start Next.js server
  await nextApp.prepare();
  payload.logger.info("🚀 NextJS started");

  // Debug storage paths
  const storagePath =
    process.env.NODE_ENV === "production"
      ? process.env.RAILWAY_VOLUME_MOUNT_PATH || "/app/storage"
      : path.join(process.cwd(), "storage");

  // Create storage directory if it doesn't exist
  if (!fs.existsSync(storagePath)) {
    fs.mkdirSync(storagePath, { recursive: true });
    fs.mkdirSync(path.join(storagePath, "media"), { recursive: true });
    fs.mkdirSync(path.join(storagePath, "product_files"), { recursive: true });
  }

  console.log("Current directory:", process.cwd());
  console.log("__dirname:", __dirname);
  console.log("Storage path:", storagePath);
  console.log("Storage exists:", fs.existsSync(storagePath));
  console.log("Storage is directory:", fs.statSync(storagePath).isDirectory());
  console.log("Storage permissions:", fs.statSync(storagePath).mode);

  // Serve static files from storage directory
  app.use("/storage", express.static(storagePath));

  app.use((req, res) => nextHandler(req, res));

  app.listen(PORT, () => {
    payload.logger.info(
      `🌐 NextJS App URL: ${process.env.NEXT_PUBLIC_SERVER_URL}`,
    );
  });
};

start();
