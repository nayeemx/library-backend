"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const bookController_1 = require("../controllers/bookController");
const router = (0, express_1.Router)();
router.post('/', bookController_1.createBook); // <-- This is required for POST /api/books
router.get('/', bookController_1.getBooks);
router.get('/:bookId', bookController_1.getBookById);
router.put('/:bookId', bookController_1.updateBook);
router.delete('/:bookId', bookController_1.deleteBook);
exports.default = router;
