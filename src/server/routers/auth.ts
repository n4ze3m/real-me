import { authEmailSendHandler, authEmailVerifyHandler, authRegisterHandller, logoutHandler } from '../controllers/auth.controller';
import { authEmailSchema, authEmailVerifySchema, authRegisterSchema } from '../schema/user.schema';
import { router, baseProcedure } from '../trpc';

export const authRouter = router({
    sendOtp: baseProcedure.input(authEmailSchema).mutation(authEmailSendHandler),
    verifyOtp: baseProcedure.input(authEmailVerifySchema).mutation(authEmailVerifyHandler),
    register: baseProcedure.input(authRegisterSchema).mutation(authRegisterHandller),
    logout: baseProcedure.mutation(logoutHandler)
});