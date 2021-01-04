export interface Category {
    categoryId?: number;
    name: string;
    reqName?: number;
}

export interface Banner {
    bannerId?: number;
    name: string;
    price: number;
    content: string;
    category: Category;
}

export interface Request {
    requestId?: number;
    userAgent: string;
    ipAddress: number;
    date: Date;
    banner: Banner;
}
