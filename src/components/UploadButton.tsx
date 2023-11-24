"use client"

import {useState} from "react"
import { Dialog } from "./ui/dialog"
import { DialogTrigger } from "@radix-ui/react-dialog"
import { Button } from "./ui/button"



const UploadButton = () => {
    const [isOpen , setIsOpen] = useState(false)
  return (
    <Dialog open={isOpen} onOpenChange={(v) => {
        if(!v){
            setIsOpen(v)
        }
    }} >
        <DialogTrigger onClick={() => setIsOpen(true)} asChild>
            <Button>Upload PDF</Button>
        </DialogTrigger>
    </Dialog>
  )
}

export default UploadButton