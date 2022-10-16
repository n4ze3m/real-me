import { router } from '../trpc';
import { authRouter } from './auth';
import { healthRouter } from './health';
import { realRouter } from './reals';
import { userRouter } from './user';

export const appRouter = router({
    health: healthRouter,
    auth: authRouter,
    user: userRouter,
    reals: realRouter
});

export type AppRouter = typeof appRouter;