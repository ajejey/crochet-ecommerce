import { Client, Databases, ID, Permission, Role } from 'node-appwrite';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const client = new Client()
    .setEndpoint(process.env.NEXT_PUBLIC_ENDPOINT)
    .setProject(process.env.NEXT_PUBLIC_PROJECT_ID)
    .setKey(process.env.NEXT_PUBLIC_API_KEY);

const databases = new Databases(client);
const DATABASE_ID = process.env.NEXT_PUBLIC_DATABASE_ID;

// Collection IDs
const COLLECTIONS = {
    USERS: 'users',
    SELLER_PROFILES: 'seller_profiles',
    PRODUCTS: 'products',
    ORDERS: 'orders',
    REVIEWS: 'reviews'
};

// Create Users Collection
const createUsersCollection = async () => {
    try {
        const collection = await databases.createCollection(
            DATABASE_ID,
            ID.unique(),
            COLLECTIONS.USERS,
            [
                Permission.create(Role.users()),
                Permission.read(Role.users()),
                Permission.update(Role.users()),
                Permission.delete(Role.users())  // Changed from 'role:admin'
            ]
        );

        // Add required attributes
        await databases.createStringAttribute(DATABASE_ID, collection.$id, 'name', 255, true);
        await databases.createStringAttribute(DATABASE_ID, collection.$id, 'email', 255, true);
        await databases.createStringAttribute(DATABASE_ID, collection.$id, 'phone', 20, false);
        await databases.createEnumAttribute(DATABASE_ID, collection.$id, 'role', ['buyer', 'seller', 'admin'], true);
        await databases.createDatetimeAttribute(DATABASE_ID, collection.$id, 'created_at', true);
        await databases.createDatetimeAttribute(DATABASE_ID, collection.$id, 'updated_at', true);

        console.log('Users collection created successfully');
    } catch (error) {
        if (error.code === 409) {
            console.log('Users collection already exists');
        } else {
            console.error('Error creating users collection:', error);
            throw error;
        }
    }
};

// Create Seller Profiles Collection
const createSellerProfilesCollection = async () => {
    try {
        const collection = await databases.createCollection(
            DATABASE_ID,
            ID.unique(),
            COLLECTIONS.SELLER_PROFILES,
            [
                Permission.create(Role.users()),
                Permission.read(Role.any()),
                Permission.update(Role.users()),
                Permission.delete(Role.users())  // Changed from 'role:admin'
            ]
        );

        // Add required attributes
        await databases.createStringAttribute(DATABASE_ID, collection.$id, 'user_id', 255, true);
        await databases.createStringAttribute(DATABASE_ID, collection.$id, 'business_name', 255, true);
        await databases.createStringAttribute(DATABASE_ID, collection.$id, 'pan_number', 255, true);
        await databases.createEnumAttribute(DATABASE_ID, collection.$id, 'status', ['pending', 'approved', 'suspended'], true);
        await databases.createStringAttribute(DATABASE_ID, collection.$id, 'razorpay_account_id', 255, false);
        await databases.createFloatAttribute(DATABASE_ID, collection.$id, 'commission_rate', true);
        await databases.createDatetimeAttribute(DATABASE_ID, collection.$id, 'created_at', true);
        await databases.createDatetimeAttribute(DATABASE_ID, collection.$id, 'verification_date', false);

        console.log('Seller Profiles collection created successfully');
    } catch (error) {
        if (error.code === 409) {
            console.log('Seller Profiles collection already exists');
        } else {
            console.error('Error creating seller profiles collection:', error);
            throw error;
        }
    }
};

// Create Products Collection
const createProductsCollection = async () => {
    try {
        const collection = await databases.createCollection(
            DATABASE_ID,
            ID.unique(),
            COLLECTIONS.PRODUCTS,
            [
                Permission.create(Role.users()),
                Permission.read(Role.any()),
                Permission.update(Role.users()),
                Permission.delete(Role.users())
            ]
        );

        // Add required attributes
        await databases.createStringAttribute(DATABASE_ID, collection.$id, 'seller_id', 255, true);
        await databases.createStringAttribute(DATABASE_ID, collection.$id, 'name', 255, true);
        await databases.createStringAttribute(DATABASE_ID, collection.$id, 'description', 5000, true);
        await databases.createFloatAttribute(DATABASE_ID, collection.$id, 'price', true);
        await databases.createFloatAttribute(DATABASE_ID, collection.$id, 'sale_price', false);
        await databases.createStringAttribute(DATABASE_ID, collection.$id, 'category', 100, true);
        // Fixed the images attribute
        await databases.createStringAttribute(DATABASE_ID, collection.$id, 'images', 255, false);  // Changed array handling
        await databases.createIntegerAttribute(DATABASE_ID, collection.$id, 'stock', true);
        await databases.createEnumAttribute(DATABASE_ID, collection.$id, 'status', ['active', 'inactive', 'deleted'], true);
        await databases.createFloatAttribute(DATABASE_ID, collection.$id, 'rating', false);
        await databases.createIntegerAttribute(DATABASE_ID, collection.$id, 'reviews_count', false);
        await databases.createDatetimeAttribute(DATABASE_ID, collection.$id, 'created_at', true);
        await databases.createDatetimeAttribute(DATABASE_ID, collection.$id, 'updated_at', true);

        console.log('Products collection created successfully');
    } catch (error) {
        if (error.code === 409) {
            console.log('Products collection already exists');
        } else {
            console.error('Error creating products collection:', error);
            throw error;
        }
    }
};

// Create Orders Collection
const createOrdersCollection = async () => {
    try {
        const collection = await databases.createCollection(
            DATABASE_ID,
            ID.unique(),
            COLLECTIONS.ORDERS,
            [
                Permission.create(Role.users()),
                Permission.read(Role.users()),
                Permission.update(Role.users()),
                Permission.delete(Role.users())  // Changed from 'role:admin'
            ]
        );

        // Add required attributes
        await databases.createStringAttribute(DATABASE_ID, collection.$id, 'buyer_id', 255, true);
        await databases.createStringAttribute(DATABASE_ID, collection.$id, 'seller_id', 255, true);
        await databases.createFloatAttribute(DATABASE_ID, collection.$id, 'total_amount', true);
        await databases.createFloatAttribute(DATABASE_ID, collection.$id, 'platform_fee', true);
        await databases.createFloatAttribute(DATABASE_ID, collection.$id, 'seller_amount', true);
        await databases.createEnumAttribute(DATABASE_ID, collection.$id, 'status', ['pending', 'processing', 'shipped', 'delivered', 'cancelled'], true);
        await databases.createEnumAttribute(DATABASE_ID, collection.$id, 'payment_status', ['pending', 'paid', 'failed', 'refunded'], true);
        await databases.createStringAttribute(DATABASE_ID, collection.$id, 'razorpay_order_id', 255, false);
        await databases.createStringAttribute(DATABASE_ID, collection.$id, 'razorpay_payment_id', 255, false);
        await databases.createDatetimeAttribute(DATABASE_ID, collection.$id, 'created_at', true);
        await databases.createDatetimeAttribute(DATABASE_ID, collection.$id, 'updated_at', true);

        console.log('Orders collection created successfully');
    } catch (error) {
        if (error.code === 409) {
            console.log('Orders collection already exists');
        } else {
            console.error('Error creating orders collection:', error);
            throw error;
        }
    }
};

// Create Reviews Collection
const createReviewsCollection = async () => {
    try {
        const collection = await databases.createCollection(
            DATABASE_ID,
            ID.unique(),
            COLLECTIONS.REVIEWS,
            [
                Permission.create(Role.users()),
                Permission.read(Role.any()),
                Permission.update(Role.users()),
                Permission.delete(Role.users())
            ]
        );

        // Add required attributes
        await databases.createStringAttribute(DATABASE_ID, collection.$id, 'product_id', 255, true);
        await databases.createStringAttribute(DATABASE_ID, collection.$id, 'buyer_id', 255, true);
        await databases.createIntegerAttribute(DATABASE_ID, collection.$id, 'rating', true);
        await databases.createStringAttribute(DATABASE_ID, collection.$id, 'comment', 1000, false);
        // Fixed the images attribute
        await databases.createStringAttribute(DATABASE_ID, collection.$id, 'images', 255, false);  // Changed array handling
        await databases.createEnumAttribute(DATABASE_ID, collection.$id, 'status', ['active', 'reported', 'hidden'], true);
        await databases.createDatetimeAttribute(DATABASE_ID, collection.$id, 'created_at', true);

        console.log('Reviews collection created successfully');
    } catch (error) {
        if (error.code === 409) {
            console.log('Reviews collection already exists');
        } else {
            console.error('Error creating reviews collection:', error);
            throw error;
        }
    }
};

// Initialize all collections
const initializeDatabase = async () => {
    try {
        console.log('Starting database initialization...');
        
        await createUsersCollection();
        await createSellerProfilesCollection();
        await createProductsCollection();
        await createOrdersCollection();
        await createReviewsCollection();
        
        console.log('Database initialization completed successfully!');
    } catch (error) {
        console.error('Database initialization failed:', error);
    }
};

// Run the initialization
initializeDatabase();