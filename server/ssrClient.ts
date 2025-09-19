import { appRouter } from "./";

// no context needed for now
export function createServerSideClient() {
   return appRouter.createCaller({});
}
