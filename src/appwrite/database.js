import { Client, Databases, ID, Permission, Role } from 'node-appwrite';
import { createAdminClient } from './config';

const DATABASE_ID = process.env.NEXT_PUBLIC_DATABASE_ID;

// Collection IDs
export const COLLECTIONS = {
    USERS: 'users',
    SELLER_PROFILES: 'seller_profiles',
    PRODUCTS: 'products',
    ORDERS: 'orders',
    ORDER_ITEMS: 'order_items',
    REVIEWS: 'reviews'
};

// Initialize database
const initializeDatabase = async () => {
    try {
        const { databases } = createAdminClient();
        
        // Create collections if they don't exist
        await createUsersCollection(databases);
        await createSellerProfilesCollection(databases);
        await createProductsCollection(databases);
        await createOrdersCollection(databases);
        await createOrderItemsCollection(databases);
        await createReviewsCollection(databases);
        
        return true;
    } catch (error) {
        console.error('Database initialization failed:', error);
        return false;
    }
};

// Create Users Collection
const createUsersCollection = async (databases) => {
    try {
        await databases.createCollection(
            DATABASE_ID,
            ID.unique(),
            COLLECTIONS.USERS,
            [
                Permission.create(Role.user()),
                Permission.read(Role.user()),
                Permission.update(Role.user()),
                Permission.delete(Role.admin())
            ]
        );

        // Add required attributes
        await databases.createStringAttribute(DATABASE_ID, COLLECTIONS.USERS, 'name', 255, true);
        await databases.createStringAttribute(DATABASE_ID, COLLECTIONS.USERS, 'email', 255, true);
        await databases.createStringAttribute(DATABASE_ID, COLLECTIONS.USERS, 'phone', 20, false);
        await databases.createEnumAttribute(DATABASE_ID, COLLECTIONS.USERS, 'role', ['buyer', 'seller', 'admin'], true);
        await databases.createDatetimeAttribute(DATABASE_ID, COLLECTIONS.USERS, 'created_at', true);
        await databases.createDatetimeAttribute(DATABASE_ID, COLLECTIONS.USERS, 'updated_at', true);

    } catch (error) {
        if (error.code !== 409) { // Skip if collection already exists
            console.error('Error creating users collection:', error);
            throw error;
        }
    }
};

// Create Seller Profiles Collection
const createSellerProfilesCollection = async (databases) => {
    try {
        await databases.createCollection(
            DATABASE_ID,
            ID.unique(),
            COLLECTIONS.SELLER_PROFILES,
            [
                Permission.create(Role.users()),
                Permission.read(Role.any()),
                Permission.update(Role.user()),
                Permission.delete(Role.admin())
            ]
        );

        // Add required attributes
        await databases.createStringAttribute(DATABASE_ID, COLLECTIONS.SELLER_PROFILES, 'user_id', 255, true);
        await databases.createStringAttribute(DATABASE_ID, COLLECTIONS.SELLER_PROFILES, 'business_name', 255, true);
        await databases.createStringAttribute(DATABASE_ID, COLLECTIONS.SELLER_PROFILES, 'pan_number', 255, true);
        await databases.createEnumAttribute(DATABASE_ID, COLLECTIONS.SELLER_PROFILES, 'status', ['pending', 'approved', 'suspended'], true);
        await databases.createStringAttribute(DATABASE_ID, COLLECTIONS.SELLER_PROFILES, 'razorpay_account_id', 255, false);
        await databases.createFloatAttribute(DATABASE_ID, COLLECTIONS.SELLER_PROFILES, 'commission_rate', true);
        await databases.createDatetimeAttribute(DATABASE_ID, COLLECTIONS.SELLER_PROFILES, 'created_at', true);
        await databases.createDatetimeAttribute(DATABASE_ID, COLLECTIONS.SELLER_PROFILES, 'verification_date', false);

    } catch (error) {
        if (error.code !== 409) {
            console.error('Error creating seller profiles collection:', error);
            throw error;
        }
    }
};

// Create Products Collection
const createProductsCollection = async (databases) => {
    try {
        await databases.createCollection(
            DATABASE_ID,
            ID.unique(),
            COLLECTIONS.PRODUCTS,
            [
                Permission.create(Role.users()),
                Permission.read(Role.any()),
                Permission.update(Role.user()),
                Permission.delete(Role.user())
            ]
        );

        // Add required attributes
        await databases.createStringAttribute(DATABASE_ID, COLLECTIONS.PRODUCTS, 'seller_id', 255, true);
        await databases.createStringAttribute(DATABASE_ID, COLLECTIONS.PRODUCTS, 'name', 255, true);
        await databases.createStringAttribute(DATABASE_ID, COLLECTIONS.PRODUCTS, 'description', 5000, true);
        await databases.createFloatAttribute(DATABASE_ID, COLLECTIONS.PRODUCTS, 'price', true);
        await databases.createFloatAttribute(DATABASE_ID, COLLECTIONS.PRODUCTS, 'sale_price', false);
        await databases.createStringAttribute(DATABASE_ID, COLLECTIONS.PRODUCTS, 'category', 100, true);
        await databases.createStringAttribute(DATABASE_ID, COLLECTIONS.PRODUCTS, 'images', 255, true, true); // Array of image URLs
        await databases.createIntegerAttribute(DATABASE_ID, COLLECTIONS.PRODUCTS, 'stock', true);
        await databases.createEnumAttribute(DATABASE_ID, COLLECTIONS.PRODUCTS, 'status', ['active', 'inactive', 'deleted'], true);
        await databases.createFloatAttribute(DATABASE_ID, COLLECTIONS.PRODUCTS, 'rating', false);
        await databases.createIntegerAttribute(DATABASE_ID, COLLECTIONS.PRODUCTS, 'reviews_count', false);
        await databases.createDatetimeAttribute(DATABASE_ID, COLLECTIONS.PRODUCTS, 'created_at', true);
        await databases.createDatetimeAttribute(DATABASE_ID, COLLECTIONS.PRODUCTS, 'updated_at', true);

    } catch (error) {
        if (error.code !== 409) {
            console.error('Error creating products collection:', error);
            throw error;
        }
    }
};

// Create Orders Collection
const createOrdersCollection = async (databases) => {
    try {
        await databases.createCollection(
            DATABASE_ID,
            ID.unique(),
            COLLECTIONS.ORDERS,
            [
                Permission.create(Role.users()),
                Permission.read(Role.user()),
                Permission.update(Role.user()),
                Permission.delete(Role.admin())
            ]
        );

        // Add required attributes
        await databases.createStringAttribute(DATABASE_ID, COLLECTIONS.ORDERS, 'buyer_id', 255, true);
        await databases.createStringAttribute(DATABASE_ID, COLLECTIONS.ORDERS, 'seller_id', 255, true);
        await databases.createFloatAttribute(DATABASE_ID, COLLECTIONS.ORDERS, 'total_amount', true);
        await databases.createFloatAttribute(DATABASE_ID, COLLECTIONS.ORDERS, 'platform_fee', true);
        await databases.createFloatAttribute(DATABASE_ID, COLLECTIONS.ORDERS, 'seller_amount', true);
        await databases.createEnumAttribute(DATABASE_ID, COLLECTIONS.ORDERS, 'status', ['pending', 'processing', 'shipped', 'delivered', 'cancelled'], true);
        await databases.createEnumAttribute(DATABASE_ID, COLLECTIONS.ORDERS, 'payment_status', ['pending', 'paid', 'failed', 'refunded'], true);
        await databases.createStringAttribute(DATABASE_ID, COLLECTIONS.ORDERS, 'razorpay_order_id', 255, false);
        await databases.createStringAttribute(DATABASE_ID, COLLECTIONS.ORDERS, 'razorpay_payment_id', 255, false);
        await databases.createDatetimeAttribute(DATABASE_ID, COLLECTIONS.ORDERS, 'created_at', true);
        await databases.createDatetimeAttribute(DATABASE_ID, COLLECTIONS.ORDERS, 'updated_at', true);

    } catch (error) {
        if (error.code !== 409) {
            console.error('Error creating orders collection:', error);
            throw error;
        }
    }
};

// Create Order Items Collection
const createOrderItemsCollection = async (databases) => {
    try {
        await databases.createCollection(
            DATABASE_ID,
            ID.unique(),
            COLLECTIONS.ORDER_ITEMS,
            [
                Permission.create(Role.users()),
                Permission.read(Role.user()),
                Permission.update(Role.user()),
                Permission.delete(Role.admin())
            ]
        );

        // Add required attributes
        await databases.createStringAttribute(DATABASE_ID, COLLECTIONS.ORDER_ITEMS, 'order_id', 255, true);
        await databases.createStringAttribute(DATABASE_ID, COLLECTIONS.ORDER_ITEMS, 'product_id', 255, true);
        await databases.createStringAttribute(DATABASE_ID, COLLECTIONS.ORDER_ITEMS, 'variant_id', 255, false);
        await databases.createIntegerAttribute(DATABASE_ID, COLLECTIONS.ORDER_ITEMS, 'quantity', true);
        await databases.createFloatAttribute(DATABASE_ID, COLLECTIONS.ORDER_ITEMS, 'price', true);

        return true;
    } catch (error) {
        console.error('Failed to create order items collection:', error);
        return false;
    }
};

// Create Reviews Collection
const createReviewsCollection = async (databases) => {
    try {
        await databases.createCollection(
            DATABASE_ID,
            COLLECTIONS.REVIEWS,
            ID.unique(),
            [
                Permission.create(Role.users()),
                Permission.read(Role.any()),
                Permission.update(Role.user()),
                Permission.delete(Role.user())
            ]
        );

        // Add required attributes
        await databases.createStringAttribute(DATABASE_ID, COLLECTIONS.REVIEWS, 'product_id', 255, true);
        await databases.createStringAttribute(DATABASE_ID, COLLECTIONS.REVIEWS, 'buyer_id', 255, true);
        await databases.createIntegerAttribute(DATABASE_ID, COLLECTIONS.REVIEWS, 'rating', true);
        await databases.createStringAttribute(DATABASE_ID, COLLECTIONS.REVIEWS, 'comment', 1000, false);
        await databases.createStringAttribute(DATABASE_ID, COLLECTIONS.REVIEWS, 'images', 255, false, true); // Array of image URLs
        await databases.createEnumAttribute(DATABASE_ID, COLLECTIONS.REVIEWS, 'status', ['active', 'reported', 'hidden'], true);
        await databases.createDatetimeAttribute(DATABASE_ID, COLLECTIONS.REVIEWS, 'created_at', true);

    } catch (error) {
        if (error.code !== 409) {
            console.error('Error creating reviews collection:', error);
            throw error;
        }
    }
};

// Export database operations
export const database = {
    initialize: initializeDatabase,
    
    // User operations
    createUser: async (userData) => {
        const { databases } = createAdminClient();
        return await databases.createDocument(
            DATABASE_ID,
            COLLECTIONS.USERS,
            ID.unique(),
            {
                ...userData,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
            }
        );
    },

    // Seller operations
    createSellerProfile: async (sellerData) => {
        const { databases } = createAdminClient();
        return await databases.createDocument(
            DATABASE_ID,
            COLLECTIONS.SELLER_PROFILES,
            ID.unique(),
            {
                ...sellerData,
                status: 'pending',
                created_at: new Date().toISOString()
            }
        );
    },

    // Product operations
    createProduct: async (productData) => {
        const { databases } = createAdminClient();
        return await databases.createDocument(
            DATABASE_ID,
            COLLECTIONS.PRODUCTS,
            ID.unique(),
            {
                ...productData,
                status: 'active',
                rating: 0,
                reviews_count: 0,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
            }
        );
    },

    // Order operations
    createOrder: async (orderData) => {
        const { databases } = createAdminClient();
        return await databases.createDocument(
            DATABASE_ID,
            COLLECTIONS.ORDERS,
            ID.unique(),
            {
                ...orderData,
                status: 'pending',
                payment_status: 'pending',
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
            }
        );
    },

    // Review operations
    createReview: async (reviewData) => {
        const { databases } = createAdminClient();
        return await databases.createDocument(
            DATABASE_ID,
            COLLECTIONS.REVIEWS,
            ID.unique(),
            {
                ...reviewData,
                status: 'active',
                created_at: new Date().toISOString()
            }
        );
    }
};

export default database;