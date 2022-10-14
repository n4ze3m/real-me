import { authEmailSendHandler } from '../controllers/auth.controller';
import { authEmailSchema } from '../schema/user.schema';
import { router, baseProcedure } from '../trpc';

export const authRouter = router({
    sendOtp: baseProcedure.input(authEmailSchema).mutation(authEmailSendHandler),
});