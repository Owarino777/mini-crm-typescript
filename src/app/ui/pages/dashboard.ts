export async function renderDashboard(): Promise<void> {
    const root = document.getElementById('dashboard-cards');
    if (!root) return;

    root.innerHTML = `
    <div class="stat-card"><div class="stat-label">Contacts</div><div id="stat-contacts" class="stat-value">—</div></div>
    <div class="stat-card"><div class="stat-label">Clients</div><div id="stat-customers" class="stat-value">—</div></div>
    <div class="stat-card"><div class="stat-label">Commandes</div><div id="stat-orders" class="stat-value">—</div></div>
    <div class="stat-card"><div class="stat-label">CA total</div><div id="stat-revenue" class="stat-value">—</div></div>
  `;

    try {
        const [contactsRes, customersRes, ordersRes] = await Promise.all([
            fetch('/api/contacts'),
            fetch('/api/customers'),
            fetch('/api/orders'),
        ]);

        const [contacts, customers, orders] = await Promise.all([
            contactsRes.json(),
            customersRes.json(),
            ordersRes.json(),
        ]);

        const revenue = (orders as any[]).reduce((sum, o) => sum + (o.total ?? 0), 0);
        (document.getElementById('stat-contacts')!).textContent = String(contacts.length);
        (document.getElementById('stat-customers')!).textContent = String(customers.length);
        (document.getElementById('stat-orders')!).textContent = String(orders.length);
        (document.getElementById('stat-revenue')!).textContent = `${revenue.toFixed(2)} €`;
    } catch {
        // silencieux: le dashboard est informatif
    }
}