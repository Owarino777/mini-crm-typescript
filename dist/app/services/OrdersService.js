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
const BASE_URL = '/api';
class OrdersService {
    getAll() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.cache)
                return this.cache;
            const res = yield fetch(`${BASE_URL}/orders`);
            if (!res.ok) {
                throw new Error('Impossible de charger la liste des commandes.');
            }
            const data = yield res.json();
            // Mapping API Prisma -> type front (avec productIds)
            const mapped = data.map(o => {
                var _a;
                return ({
                    id: o.id,
                    userId: o.userId,
                    total: o.total,
                    status: o.status,
                    createdAt: o.createdAt,
                    productIds: ((_a = o.items) !== null && _a !== void 0 ? _a : []).map(i => i.productId),
                });
            });
            this.cache = mapped;
            return this.cache;
        });
    }
}
exports.default = OrdersService;
