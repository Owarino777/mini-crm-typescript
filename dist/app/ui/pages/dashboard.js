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
exports.renderDashboard = renderDashboard;
function renderDashboard() {
    return __awaiter(this, void 0, void 0, function* () {
        const root = document.getElementById('dashboard-cards');
        if (!root)
            return;
        root.innerHTML = `
    <div class="stat-card"><div class="stat-label">Contacts</div><div id="stat-contacts" class="stat-value">—</div></div>
    <div class="stat-card"><div class="stat-label">Clients</div><div id="stat-customers" class="stat-value">—</div></div>
    <div class="stat-card"><div class="stat-label">Commandes</div><div id="stat-orders" class="stat-value">—</div></div>
    <div class="stat-card"><div class="stat-label">CA total</div><div id="stat-revenue" class="stat-value">—</div></div>
  `;
        try {
            const [contactsRes, customersRes, ordersRes] = yield Promise.all([
                fetch('/api/contacts'),
                fetch('/api/customers'),
                fetch('/api/orders'),
            ]);
            const [contacts, customers, orders] = yield Promise.all([
                contactsRes.json(),
                customersRes.json(),
                ordersRes.json(),
            ]);
            const revenue = orders.reduce((sum, o) => { var _a; return sum + ((_a = o.total) !== null && _a !== void 0 ? _a : 0); }, 0);
            (document.getElementById('stat-contacts')).textContent = String(contacts.length);
            (document.getElementById('stat-customers')).textContent = String(customers.length);
            (document.getElementById('stat-orders')).textContent = String(orders.length);
            (document.getElementById('stat-revenue')).textContent = `${revenue.toFixed(2)} €`;
        }
        catch (_a) {
            // silencieux: le dashboard est informatif
        }
    });
}
