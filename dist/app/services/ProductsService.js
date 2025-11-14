"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const BASE_URL = '/data';
class ProductsService {
    getAll() {
        return __awaiter(this, void 0, void 0, function* () {
            const res = yield fetch(`${BASE_URL}/products.json`);
            if (!res.ok) {
                throw new Error('Impossible de charger la liste des produits.');
            }
            return yield res.json();
        });
    }
}
exports.default = ProductsService;
