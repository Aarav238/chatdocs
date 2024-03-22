import { db } from "@/db";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server"
import { createUploadthing, type FileRouter } from "uploadthing/next";
import { PDFLoader } from "langchain/document_loaders/fs/pdf";
import { pinecone} from "@/lib/pinecone";
import { PineconeStore } from "langchain/vectorstores/pinecone";
import {OpenAIEmbeddings} from 'langchain/embeddings/openai'
const f = createUploadthing();
 
 

export const ourFileRouter = {
  pdfUploader: f({ pdf: { maxFileSize: "4MB" } })
    .middleware(async ({ req }) => {
      const {getUser} = getKindeServerSession();
      const user =await getUser()
      

      if(!user || !user.id ) throw new Error("Unauthorized")
    


      
      return {userId : user.id};
    })
    .onUploadComplete(async ({ metadata, file }) => {
      const createdFile = await db.file.create({
        data: {
          key: file.key,
          name : file.name,
          userId: metadata.userId,
          url: `https://uploadthing-prod.s3.us-west-2.amazonaws.com/${file.key}`,
          uploadStatus: "PROCESSING"
        }
      })  
      console.log("chupi chupi chapa Chapa")

      console.log(createdFile.id , createdFile.userId)

      console.log("file upload ho gyi")

      try {
        const response  = await fetch (`https://uploadthing-prod.s3.us-west-2.amazonaws.com/${file.key}`)
        const blob = await response.blob()
        console.log("blobed")

        const loader = new PDFLoader(blob)
        const pageLevelDocs = await loader.load();
        console.log("laoded")

        const pagesAmt = pageLevelDocs.length;
        //vectorize and index entire documentation.
        const pineconeIndex = pinecone.Index("chat-bot")
        console.log("setup pinecone gui")

        const embeddings = new OpenAIEmbeddings({
          openAIApiKey: process.env.OPENAI_API_KEY,
        })
        console.log(embeddings)

        await PineconeStore.fromDocuments(pageLevelDocs, embeddings, {
          pineconeIndex,
          namespace: createdFile.id
        });

        await db.file.update({
          data : {
            uploadStatus: "SUCCESS"
          },
          where: {
            id: createdFile.id
          }
        })
      } catch (error) {
        console.log("error =>",error)
        await db.file.update({
          data : {
            uploadStatus: "FAILED"
          },
          where: {
            id: createdFile.id
          }
        })
      }
    }),
} satisfies FileRouter;
 
export type OurFileRouter = typeof ourFileRouter;