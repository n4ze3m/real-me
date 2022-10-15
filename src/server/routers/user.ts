import { currentUserHandler, findUserByUsernameHandler } from '../controllers/user.controller';
import { findUserByUsername } from '../schema/user.schema';
import { router, baseProcedure } from '../trpc';


export const userRouter = router({
    me: baseProcedure.query(currentUserHandler),
    findUserByUsername: baseProcedure.input(findUserByUsername).query(findUserByUsernameHandler),
})