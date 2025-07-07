"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const borrowController_1 = require("../controllers/borrowController");
const router = (0, express_1.Router)();
router.post('/', borrowController_1.borrowBook);
router.get('/', borrowController_1.borrowSummary);
// You can add GET for aggregation summary here later
exports.default = router;
