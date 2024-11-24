import { createAdminClient } from "@/appwrite/config";
import { ID } from "node-appwrite";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const { databases } = createAdminClient();
        const databaseId = process.env.NEXT_PUBLIC_DATABASE_ID;
        const collectionId = 'cart_items';

        try {
            // Create cart items collection
            const collection = await databases.createCollection(
                databaseId,
                ID.unique(),
                'cart_items',
                []
            );

            // Create required attributes
            await databases.createStringAttribute(
                databaseId,
                collection.$id,
                'cart_id',
                255,
                true
            );

            await databases.createStringAttribute(
                databaseId,
                collection.$id,
                'product_id',
                255,
                true
            );

            await databases.createStringAttribute(
                databaseId,
                collection.$id,
                'variant_id',
                255,
                false
            );

            await databases.createIntegerAttribute(
                databaseId,
                collection.$id,
                'quantity',
                true
            );

            await databases.createDatetimeAttribute(
                databaseId,
                collection.$id,
                'created_at',
                true
            );

            await databases.createDatetimeAttribute(
                databaseId,
                collection.$id,
                'updated_at',
                true
            );

            // Create indexes
            await databases.createIndex(
                databaseId,
                collection.$id,
                'cart_id_idx',
                'key',
                ['cart_id']
            );

            await databases.createIndex(
                databaseId,
                collection.$id,
                'product_variant_idx',
                'key',
                ['product_id', 'variant_id']
            );

            return NextResponse.json({ 
                success: true, 
                message: 'Cart collection initialized successfully' 
            });
        } catch (error) {
            if (error.code === 409) {
                return NextResponse.json({ 
                    success: true, 
                    message: 'Cart collection already exists' 
                });
            }
            throw error;
        }
    } catch (error) {
        console.error('Error initializing cart collection:', error);
        return NextResponse.json({ 
            success: false, 
            error: error.message 
        }, { status: 500 });
    }
}
