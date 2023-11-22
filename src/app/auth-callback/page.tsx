import { useSearchParams , useRouter } from "next/navigation"
import { trpc } from "../_trpc/client"

const Page = async () => {

    const router = useRouter()

    const searchParams = useSearchParams()
    const origin = searchParams.get("origin")


    
    

    const {data , isLoading} = trpc.authCallBack.useQuery(undefined,{
        onSuccess: ({success}) => {
            if(success){
                router.push(origin ? `/${origin}` : '/dashboard')
            }
        }
    })

  return (
    <div>page </div>
  )
}

export default Page


