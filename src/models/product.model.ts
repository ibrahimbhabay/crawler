import { prop, getModelForClass } from '@typegoose/typegoose';
import { IProduct } from 'src/product/interface/product.interface';


export class Product implements IProduct {

    @prop({required: true, unique: true})
    _id: string;

    @prop()
    title: string;

    @prop({required: false})
    price: number;

    @prop({required: false})
    numberOfReviews: number;

    @prop({required: false})
    averageRating: number;

    @prop({required: false})
    dateFirstListed: Date;

    @prop({required: false})
    dateFristListedTimestamp: number;

    @prop({required: false})
    createdAt: number;

    @prop({required: false})
    updateAt: number;

}

export const ProductModel = getModelForClass(Product)