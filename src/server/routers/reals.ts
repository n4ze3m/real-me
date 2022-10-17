import { uploadRealHandler,exploreRealsHandler, deleteRealHandler } from '../controllers/reals.controller';
import { realByIdSchema, uploadRealSchema } from '../schema/reals.schema';
import { router, baseProcedure } from '../trpc';

export const realRouter = router({
    createReal: baseProcedure.input(uploadRealSchema).mutation(uploadRealHandler),
    exploreReals: baseProcedure.query(exploreRealsHandler),
    deleteReal: baseProcedure.input(realByIdSchema).mutation(deleteRealHandler),
});