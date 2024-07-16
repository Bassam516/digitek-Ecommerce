export interface Products {
    _id:string,
    imageCover: string,
    images: string[],
    price: number,
    ratingsAverage: number,
    title: string,
    description: string,
    category: {
        _id?:string,
        name:string
    },
    subcategory: {
        _id?: string,
        name:string
    }[],

}
