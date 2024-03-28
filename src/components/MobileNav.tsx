"use client"
import { Menu } from "lucide-react"
import { useState } from "react"

const MobileNav = () => {

    const[isOpen,setOpen] = useState<boolean>(false);

    const toggleOpen = () => setOpen((prev) => !prev)
  return (
   <div className="sm:hidden">
    <Menu onClick={toggleOpen} className="relative z-50 h-5 w-5 text-zinc-700"/>
   </div>
  )
}

export default MobileNav