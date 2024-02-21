import { publicProcedure, router } from "./trpc";

export const appRouter = router({
  anyApiRoute: publicProcedure.query(() => {
    return "hello"
  })
})

export type TAppRouter = typeof appRouter