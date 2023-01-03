export interface IProduct {
    _id: string,
    title: string,
    price: number,
    numberOfReviews: number,
    averageRating: number,
    dateFirstListed: Date,
    dateFristListedTimestamp: number,
    createdAt?: number,
    updateAt?: number,
}