"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const events_js_1 = require("./events.js");
const shop_js_1 = require("./shop.js");
document.addEventListener('DOMContentLoaded', () => {
    (0, events_js_1.setupEventListeners)();
    (0, shop_js_1.setupShopUI)();
});
