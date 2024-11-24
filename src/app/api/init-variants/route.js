import { createAdminClient } from "@/appwrite/config";
import { ID } from "node-appwrite";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const { databases } = createAdminClient();
        const databaseId = process.env.NEXT_PUBLIC_DATABASE_ID;

        try {
            // Create variants collection
            const collection = await databases.createCollection(
                databaseId,
                ID.unique(),
                'variants',
                []
            );

            // Create required attributes
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
                'name',
                255,
                true
            );

            await databases.createFloatAttribute(
                databaseId,
                collection.$id,
                'price_adjustment',
                true
            );

            await databases.createIntegerAttribute(
                databaseId,
                collection.$id,
                'stock',
                true
            );

            await databases.createStringAttribute(
                databaseId,
                collection.$id,
                'sku',
                255,
                false
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
                'product_id_idx',
                'key',
                ['product_id']
            );

            await databases.createIndex(
                databaseId,
                collection.$id,
                'sku_idx',
                'key',
                ['sku']
            );

            return NextResponse.json({ 
                success: true, 
                message: 'Variants collection initialized successfully',
                collectionId: collection.$id
            });
        } catch (error) {
            if (error.code === 409) {
                return NextResponse.json({ 
                    success: true, 
                    message: 'Variants collection already exists' 
                });
            }
            throw error;
        }
    } catch (error) {
        console.error('Error initializing variants collection:', error);
        return NextResponse.json({ 
            success: false, 
            error: error.message 
        }, { status: 500 });
    }
}
