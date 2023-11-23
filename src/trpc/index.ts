import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import { router, publicProcedure } from './trpc';
import {TRPCError} from "@trpc/server"
export const appRouter = router({
    authCallback : publicProcedure.query(async () => {
        const {getUser} = getKindeServerSession()

        const user = await getUser()
        if(!user || !user.id || !user.email)  throw new TRPCError({code: "UNAUTHORIZED"})
        

        //check if user is in the database

        // const dbUser = await 
        return { success: true }
      
    })

});
 
// Export type router type signature,
// NOT the router itself.
export type AppRouter = typeof appRouter;