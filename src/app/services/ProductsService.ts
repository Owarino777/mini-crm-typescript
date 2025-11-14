import type { Product } from '../types/shop.js';

const BASE_URL = '/data';

export default class ProductsService {
    async getAll(): Promise<Product[]> {
        const res = await fetch(`${BASE_URL}/products.json`);
        if (!res.ok) {
            throw new Error('Impossible de charger la liste des produits.');
        }
        return await res.json() as Product[];
    }
}