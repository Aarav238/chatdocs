

import { useSearchParams , useRouter } from "next/navigation"
import { trpc } from "../_trpc/client"
const Page = () => {

    const router = useRouter()

    const searchParams = useSearchParams()
    const origin = searchParams.get("origin")


    
    

    trpc.authCallback.useQuery(undefined, {
        onSuccess : ({ success }) => {
          if (success) {
            // if user is synced to our database
            router.push(origin ? `/${origin}` : `/dashboard`);
          }
        },
        onError: (err) => {
          if (err.data?.code === "UNAUTHORIZED") router.push("/sign-in");
        },
        retry: true,
        retryDelay: 500,
      });

  return (
    <div>page </div>
  )
}

export default Page


