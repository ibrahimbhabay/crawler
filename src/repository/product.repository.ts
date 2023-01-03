import { nanoid } from "nanoid";
import { ProductModel } from "../models/product.model";
import { IProduct } from "../product/interface/product.interface";

export const addMany = async (productsData: Partial<IProduct>[]) : Promise<void> => {
    try{
        await ProductModel.create(productsData);
        console.log(`Number of products successfully added to the collection: ${productsData.length}`)
    } catch(error){
        console.log(`Unable to save products to database`);
        console.log(error);
    }
}

export const add = async (productData: Partial<IProduct>) : Promise<void> => {
    try{
        productData._id = nanoid();
        productData.createdAt = Date.now();
        await ProductModel.create(productData);
        console.log(`product successfully added to the collection: ${productData._id}`)
    } catch(error){
        console.log(`Unable to create a product document for ${productData.title} in the collection.`);
        console.log(error);
    }
}