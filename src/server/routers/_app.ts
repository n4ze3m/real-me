import { router } from '../trpc';
import { authRouter } from './auth';
import { healthRouter } from './health';

export const appRouter = router({
    health: healthRouter,
    auth: authRouter
});

export type AppRouter = typeof appRouter;