import { currentUserHandler } from '../controllers/user.controller';
import { router, baseProcedure } from '../trpc';


export const userRouter = router({
    me: baseProcedure.query(currentUserHandler),
})