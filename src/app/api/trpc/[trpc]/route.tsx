import { appRouter } from "@/trpc";
import { fetchRequestHandler } from "@trpc/server/adapters/fetch";

const handler = async (req: Request) => {
  try {
    console.log("🔍 Incoming request:", req.method, req.url);

    return fetchRequestHandler({
      endpoint: "/api/trpc",
      req,
      router: appRouter,
      // @ts-expect-error context-already passed from express middleware
      createContext: () => ({}),
      onError({ error, path, input }) {
        console.error(`❌ tRPC Error on "${path}":`, error.message, "Input:", input);
      },
    });
  } catch (error) {
    console.error("🚨 Unhandled error:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
};

// Ensure you allow OPTIONS for CORS
export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}

export { handler as GET, handler as POST };