"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const events_js_1 = require("./events.js");
const shop_js_1 = require("./shop.js");
const router_js_1 = require("./router.js");
const dashboard_js_1 = require("./pages/dashboard.js");
const settings_js_1 = require("./pages/settings.js");
document.addEventListener('DOMContentLoaded', () => {
    (0, events_js_1.setupEventListeners)();
    (0, shop_js_1.setupShopUI)();
    (0, router_js_1.initRouter)();
    void (0, dashboard_js_1.renderDashboard)();
    (0, settings_js_1.setupSettings)();
});
