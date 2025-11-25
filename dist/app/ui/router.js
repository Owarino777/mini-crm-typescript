"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initRouter = initRouter;
const SECTIONS = {
    dashboard: 'page-dashboard',
    contacts: 'page-contacts',
    atelier: 'page-atelier',
    parametres: 'page-settings',
};
function showSection(route) {
    Object.entries(SECTIONS).forEach(([key, id]) => {
        const el = document.getElementById(id);
        if (!el)
            return;
        if (key === route)
            el.removeAttribute('hidden');
        else
            el.setAttribute('hidden', 'true');
    });
}
function parseRoute() {
    const hash = (location.hash || '#/dashboard').toLowerCase();
    if (hash.startsWith('#/contacts'))
        return 'contacts';
    if (hash.startsWith('#/atelier'))
        return 'atelier';
    if (hash.startsWith('#/parametres'))
        return 'parametres';
    return 'dashboard';
}
function initRouter() {
    const apply = () => showSection(parseRoute());
    window.addEventListener('hashchange', apply);
    apply();
}
