import { db } from "@/db";
import {OpenAIStream , StreamingTextResponse} from "ai"
import { openai } from "@/lib/openai";
import { pinecone } from "@/lib/pinecone";
import { sendMessageValidator } from "@/lib/validators/SendMessageValidator";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { PineconeStore } from "@langchain/pinecone";
import { OpenAIEmbeddings } from "@langchain/openai";
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


    const embeddings = new OpenAIEmbeddings({
        apiKey: process.env.OpenAI_API_KEY!
      })


    const pineconeIndex = pinecone.Index("chat-docs")

    const vectorStore = await PineconeStore.fromExistingIndex(embeddings , 
        {
          pineconeIndex,
          namespace: file.id
        })

    const results = await vectorStore.similaritySearch(message,4)

    const prevMessages = await db.message.findMany({
        where: {
            fileId: fileId
        },
        orderBy: {
            createdAt: "asc"
        }, 
        take: 6
    })

    const formattedMessage = prevMessages.map((msg) => ({
        role: msg.isUserMessage ? "user" as const : "assistant" as const ,
        content: msg.text
    }))

    const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        temperature: 0,
        stream: true,
        messages: [
            {
              role: 'system',
              content:
                'Use the following pieces of context (or previous conversaton if needed) to answer the users question in markdown format.',
            },
            {
              role: 'user',
              content: `Use the following pieces of context (or previous conversaton if needed) to answer the users question in markdown format. \nIf you don't know the answer, just say that you don't know, don't try to make up an answer.
              
        \n----------------\n
        
        PREVIOUS CONVERSATION:
        ${formattedMessage.map((message) => {
          if (message.role === 'user') return `User: ${message.content}\n`
          return `Assistant: ${message.content}\n`
        })}
        
        \n----------------\n
        
        CONTEXT:
        ${results.map((r) => r.pageContent).join('\n\n')}
        
        USER INPUT: ${message}`,
            },
          ],
    })


    //console.log("response -------" , response)





    const stream = OpenAIStream(response, {
        async onCompletion(completion) {
          //  console.log("completion----" , completion)
            await db.message.create({
                data: {
                    text: completion,
                    isUserMessage: false,
                    fileId,
                    userId
                }
            })
        }
    })



    return new StreamingTextResponse(stream)

    // semantic search

    // "the dog is brown" is converted into vector (1536)
    // like this [0.5,-0.5, ........] using ai model.
    // then we find semantic similarity in the sentences like this.
}