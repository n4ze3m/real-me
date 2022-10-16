import { currentUserHandler, findUserByUsernameHandler, buddiesTimlineHandler, followBuddyHandler, buddiesList, acceptOrRemoveBuddyHandler } from '../controllers/user.controller';
import { findUserByUsername, followBuddySchema } from '../schema/user.schema';
import { router, baseProcedure } from '../trpc';


export const userRouter = router({
    me: baseProcedure.query(currentUserHandler),
    findUserByUsername: baseProcedure.input(findUserByUsername).query(findUserByUsernameHandler),
    buddiesTimeline: baseProcedure.query(buddiesTimlineHandler),
    followOrUnfollowBuddy: baseProcedure.input(followBuddySchema).mutation(followBuddyHandler),
    buddies: baseProcedure.query(buddiesList),
    acceptBuddy: baseProcedure.input(followBuddySchema).mutation(acceptOrRemoveBuddyHandler),
})