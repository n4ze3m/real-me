import { uploadRealHandler } from '../controllers/reals.controller';
import { uploadRealSchema } from '../schema/reals.schema';
import { router, baseProcedure } from '../trpc';

export const realRouter = router({
    createReal: baseProcedure.input(uploadRealSchema).mutation(uploadRealHandler)
});