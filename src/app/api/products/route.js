import { createSessionClient } from "@/appwrite/config"
import { cookies } from "next/headers";

export async function GET() {
    const sessionCookie = cookies().get('session');

    try {
        const { databases } = await createSessionClient(sessionCookie?.value);
    const { documents: products, total } = await databases.listDocuments(
        process.env.NEXT_PUBLIC_DATABASE_ID, 
        process.env.NEXT_PUBLIC_COLLECTION_PRODUCTS, 
    ) 
    return Response.json({products, total})
    } catch (error) {
        console.error(error)
        return Response.json("Access Denied",{status: 403})
    }

   

}