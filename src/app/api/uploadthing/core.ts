import { db } from "@/db";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server"
import { createUploadthing, type FileRouter } from "uploadthing/next";
import { PDFLoader } from "langchain/document_loaders/fs/pdf";
import { pinecone} from "@/lib/pinecone";
import { PineconeStore } from "@langchain/pinecone";
import { OpenAIEmbeddings } from "@langchain/openai";
import { getUserSubscriptionPlan } from "@/lib/stripe";
import { PLANS } from "@/config/stripe";
const f = createUploadthing();
 

const middleware = async () => {
  const {getUser} = getKindeServerSession();
  const user =await getUser()
  

  if(!user || !user.id ) throw new Error("Unauthorized")

  const subscriptionPlan = await getUserSubscriptionPlan();

  
  return {subscriptionPlan,userId : user.id};
}

const onUploadComplete = async ( {metadata, file}: 
  {metadata: Awaited<ReturnType<typeof middleware>>
  file: {
    key: string,
    name: string,
    url: string
  }
  }) => {

    const isFileExist = await db.file.findFirst({
      where:{
        key: file.key
      }
    })

    if(isFileExist) return;
  const createdFile = await db.file.create({
    data: {
      key: file.key,
      name : file.name,
      userId: metadata.userId,
      url: `https://kafy9fomqi.ufs.sh/f/${file.key}`,
      uploadStatus: "PROCESSING"
    }
  })  

 // console.log(createdFile)
 

  // console.log(createdFile.id , createdFile.userId)

  console.log("file upload ho gyi")

  try {
    const response  = await fetch (`https://kafy9fomqi.ufs.sh/f/${file.key}`)
    //console.log(response)
    const blob = await response.blob()
    //console.log("blobed => ",blob);
    const loader = new PDFLoader(blob)
    const pageLevelDocs = await loader.load();
    console.log("laoded")

    const pagesAmt = pageLevelDocs.length;
    const {subscriptionPlan} = metadata
    const {isSubscribed} = subscriptionPlan;
    //pro features
    const isProExceeded = pagesAmt > PLANS.find((plan) => plan.name ==="Pro")!.pagesPerPdf;
    const isFreeExceeded = pagesAmt > PLANS.find((plan) => plan.name ==="Free")!.pagesPerPdf;

    if((isSubscribed && isProExceeded) || (!isSubscribed && isFreeExceeded)){
    //  console.log("isSubscribed && isProExceeded) || (!isSubscribed && isFreeExceeded)")
      await db.file.update({
        data: {
          uploadStatus: "FAILED"
        },
        where: {
          id: createdFile.id
        }
      })
    }
    //vectorize and index entire documentation.
    const pineconeIndex = pinecone.Index("chat-docs")
    console.log("setup pinecone gui")

    const embeddings = new OpenAIEmbeddings({
      apiKey: process.env.OpenAI_API_KEY!
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

    const checkfile = await db.file.findFirst({
      where: {
        id: createdFile.id
      }
    })
    console.log(checkfile)
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
}
export const ourFileRouter = {
  freePlanUploader: f({ pdf: { maxFileSize: "4MB" } })
    .middleware(middleware)
    .onUploadComplete(onUploadComplete),
  ProPlanUploader: f({ pdf: { maxFileSize: "16MB" } })
    .middleware(middleware)
    .onUploadComplete(onUploadComplete),
  
} satisfies FileRouter;
 
export type OurFileRouter = typeof ourFileRouter;