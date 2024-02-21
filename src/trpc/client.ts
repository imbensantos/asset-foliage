import { createTRPCReact } from "@trpc/react-query";
import { TAppRouter } from ".";

export const trpc = createTRPCReact<TAppRouter>({});
