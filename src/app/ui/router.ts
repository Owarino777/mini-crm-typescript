type RouteId = 'dashboard' | 'contacts' | 'atelier' | 'parametres';

const SECTIONS: Record<RouteId, string> = {
    dashboard: 'page-dashboard',
    contacts: 'page-contacts',
    atelier: 'page-atelier',
    parametres: 'page-settings',
};

function showSection(route: RouteId) {
    Object.entries(SECTIONS).forEach(([key, id]) => {
        const el = document.getElementById(id);
        if (!el) return;
        if (key === route) el.removeAttribute('hidden');
        else el.setAttribute('hidden', 'true');
    });
}

function parseRoute(): RouteId {
    const hash = (location.hash || '#/dashboard').toLowerCase();
    if (hash.startsWith('#/contacts')) return 'contacts';
    if (hash.startsWith('#/atelier')) return 'atelier';
    if (hash.startsWith('#/parametres')) return 'parametres';
    return 'dashboard';
}

export function initRouter(): void {
    const apply = () => showSection(parseRoute());
    window.addEventListener('hashchange', apply);
    apply();
}