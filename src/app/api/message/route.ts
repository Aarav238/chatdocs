import { db } from "@/db";
import { sendMessageValidator } from "@/lib/validators/SendMessageValidator";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { NextRequest } from "next/server";

export const POST =async (req: NextRequest) => {
    // endpoint for asking a question from pdf

    const body = await req.json();

    const {getUser}= getKindeServerSession();

    const user = await getUser();
    console.log(user)
    const userId = user?.id;

    if (!userId ){
        return new Response("Unauthorized", {status: 401})
    }

    const {fileId , message} = sendMessageValidator.parse(body);


    const file = await db.file.findFirst({
        where: {
            id: fileId,
            userId
        }
    })

    if(!file) 
        return new Response("Not found", {status: 404})

    

    await db.message.create({
        data : {
            text: message ,
            isUserMessage: true,
            userId,
            fileId
        }
    })




    // semantic search

    // "the dog is brown" is converted into vector (1536)
    // like this [0.5,-0.5, ........] using ai model.
    // then we find semantic similarity in the sentences like this.
}