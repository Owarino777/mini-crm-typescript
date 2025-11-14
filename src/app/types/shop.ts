export interface Product {
    id: number;
    name: string;
    description: string;
    price: number;
    image: string;
    category: string;
    featured: boolean;
    stock: number;
}

export type ProductPreview = Pick<Product, 'id' | 'name' | 'price' | 'category'>;
export type NewProduct = Omit<Product, 'id'>;
export type ReadonlyProduct = Readonly<Product>;
export type PartialProduct = Partial<Product>;
export type StockByProductId = Record<number, number>;

export interface Customer {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    role: 'customer' | 'admin';
    password: string;
}

export type CustomerPublic = Omit<Customer, 'password'>;
export type ReadonlyCustomer = Readonly<Customer>;
export type CustomersById = Record<number, CustomerPublic>;

export interface Order {
    id: number;
    userId: number;
    productIds: number[];
    total: number;
    status: 'pending' | 'paid' | 'cancelled' | string;
    createdAt: string;
}

export type PartialOrder = Partial<Order>;
export type OrdersByCustomerId = Record<number, Order[]>;