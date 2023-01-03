import { IProduct } from "../product/interface/product.interface";
import { addMany, add } from "../repository/product.repository";


export const saveAllProducts = async (productsData: Partial<IProduct>[]) : Promise<void>=> {
    try{
      await addMany(productsData)
    }catch(error){
      console.log(error)
      console.log(`Failed to save products`)
    }
}

export const saveProduct = async (productData: Partial<IProduct>) : Promise<void>=> {
    try{
      await add(productData)
    }catch(error){
      console.log(error);
      console.log(`Failed to save ${productData.title} product.`)
    }
}