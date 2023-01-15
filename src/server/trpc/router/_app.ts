import { router } from "../trpc";
import { adventureRouter } from "./adventure";
import { authRouter } from "./auth";
import { exampleRouter } from "./example";
import { gridRouter } from "./grid";

export const appRouter = router({
  example: exampleRouter,
  auth: authRouter,
  grid: gridRouter,
  adventure: adventureRouter
});

// export type definition of API
export type AppRouter = typeof appRouter;
