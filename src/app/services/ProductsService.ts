import type { Product } from '../types/shop.js';

const BASE_URL = '/api';

export default class ProductsService {
    private cache?: Product[];

    async getAll(): Promise<Product[]> {
        if (this.cache) return this.cache;
        const res = await fetch(`${BASE_URL}/products`);
        if (!res.ok) {
            throw new Error('Impossible de charger la liste des produits.');
        }
        this.cache = await res.json() as Product[];
        return this.cache;
    }
}