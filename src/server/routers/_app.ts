import { router } from '../trpc';
import { authRouter } from './auth';
import { healthRouter } from './health';
import { userRouter } from './user';

export const appRouter = router({
    health: healthRouter,
    auth: authRouter,
    user: userRouter
});

export type AppRouter = typeof appRouter;