import { setupEventListeners } from './events.js';
import { setupShopUI } from './shop.js';

document.addEventListener('DOMContentLoaded', () => {
    setupEventListeners();
    setupShopUI();
});