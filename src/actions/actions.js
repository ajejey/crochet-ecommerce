"use server";
import dbConnect from "@/lib/mongodb";
import Product from "@/models/Product";

export async function addProduct(product) {
    "use server";
    await dbConnect()
    console.log("connected to mongodb db...", product)
    try {
        const newProduct = new Product(product)
        const createdProduct = await newProduct.save()
        console.log("newProduct submitted to db", createdProduct)
        return JSON.stringify(createdProduct)
    } catch (error) {
        console.error("Error adding product: ", error)
        return { statusCode: 500, body: "Error adding product" }
    }
}
