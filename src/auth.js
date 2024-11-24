import { cookies } from "next/headers"
import { createAdminClient, createSessionClient } from "./appwrite/config"
import { redirect } from "next/navigation"

const auth = {
    user: null,
    sessionCookie: null,

    getUser: async () => {
        auth.sessionCookie = cookies().get('session')
        try {
            const {account} = await createSessionClient(auth.sessionCookie?.value)
            auth.user = await account.get()
             // Get user role from database
             const { databases } = createAdminClient();
             const userData = await databases.getDocument(
                 process.env.NEXT_PUBLIC_DATABASE_ID,
                 process.env.NEXT_PUBLIC_COLLECTION_USERS,
                 auth.user.$id
             );
             auth.user.role = userData.role;
        } catch (error) {
            console.error(error)
            auth.user = null
            auth.sessionCookie = null
        }

        return auth.user
    },

    isSeller: async () => {
        const user = await auth.getUser();
        return user?.role === 'seller';
    },

    deleteSession: async () => {
        "use server";
        auth.sessionCookie = cookies().get('session')
        try {
            const {account} = await createSessionClient(auth.sessionCookie?.value)
            await account.deleteSession('current')
        } catch (error) {
            console.error(error)
            cookies().delete('session')
            auth.user = null
            auth.sessionCookie = null
            redirect('/login')
        }
    }
}

export default auth