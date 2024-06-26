import Link from "next/link"
import MaxWidthWrapper from "./MaxWidthWrapper"
import { buttonVariants } from "./ui/button"
import { LoginLink ,RegisterLink, getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server"
import { ArrowRight } from "lucide-react"
import UserAccountNav from "./UserAccountNav"
import MobileNav from "./MobileNav"



const Navbar = async() => {

    const {getUser} = getKindeServerSession()
    const user = await getUser();
    //console.log(user);
  return (
    <nav className="sticky h-14 inset-x-0 top-0 z-30 w-full border-b border-gray-200 bg-white/75 backdrop-blur-lg transition-all">
        <MaxWidthWrapper>
            <div className="flex h-14 items-center justify-between border-b border-zinc-200">
                <Link href="/" className="flex z-40 font-semibold">
                    <span className="font-extrabold text-3xl">ChatDocs</span>
                </Link>
                <MobileNav isAuth={!!user}/>
                <div className="hidden items-center space-x-4 sm:flex">
                   { !user ?(<>
                        <Link className={buttonVariants({
                            variant: "ghost",
                            size: "sm",

                        })} href="/pricing">
                            Pricing
                        </Link>
                       <LoginLink orgCode="org_76c6b3112f9" className={buttonVariants({
                            variant: "ghost",
                            size: "sm",

                        })}>
                            Sign in
                        </LoginLink>
                        <RegisterLink orgCode="org_76c6b3112f9" className={buttonVariants({
                            size: "sm",

                        })}>
                             
                             Get Started <ArrowRight className="ml-1.5 h-5 w-5" />                  
                              </RegisterLink>
                    </>):
                    (<>
                    <Link className={buttonVariants({
                            variant: "ghost",
                            size: "sm",

                        })} href="/dashboard">
                         Dashboard
                        </Link>

                        <UserAccountNav  
                        name={
                            !user.given_name || !user.family_name ? "Your Account":
                            `${user.given_name} ${user.family_name}`
                        }
                        email={user.email ?? ''}
                        imageUrl={user.picture ?? ''}
                        />
                    </>)}
                </div>
            </div>
        </MaxWidthWrapper>
    </nav>
  )
}

export default Navbar