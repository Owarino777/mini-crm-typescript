import { setupEventListeners } from './events.js';
import { setupShopUI } from './shop.js';
import { initRouter } from './router.js';
import { renderDashboard } from './pages/dashboard.js';
import { setupSettings } from './pages/settings.js';
document.addEventListener('DOMContentLoaded', () => {
    setupEventListeners();
    setupShopUI();
    initRouter();
    void renderDashboard();
    setupSettings();
});
