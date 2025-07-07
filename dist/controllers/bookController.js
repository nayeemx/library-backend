"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteBook = exports.updateBook = exports.getBookById = exports.getBooks = exports.createBook = void 0;
const Book_1 = __importDefault(require("../models/Book"));
// Create Book
const createBook = async (req, res) => {
    try {
        const book = await Book_1.default.create(req.body);
        const bookObj = book.toObject ? book.toObject() : book;
        if (bookObj && typeof bookObj === 'object' && '__v' in bookObj) {
            delete bookObj.__v;
        }
        res.status(201).json({
            success: true,
            message: 'Book created successfully',
            data: bookObj,
        });
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: 'Validation failed',
            error,
        });
    }
};
exports.createBook = createBook;
// Get All Books
const getBooks = async (req, res) => {
    try {
        const { filter, sortBy = 'createdAt', sort = 'desc', limit = 10 } = req.query;
        const query = {};
        if (filter)
            query.genre = filter;
        const books = await Book_1.default.find(query)
            .sort({ [sortBy]: sort === 'asc' ? 1 : -1 })
            .limit(Number(limit));
        const booksClean = books.map((b) => {
            const obj = b.toObject ? b.toObject() : b;
            if (obj && typeof obj === 'object' && '__v' in obj) {
                delete obj.__v;
            }
            return obj;
        });
        res.json({
            success: true,
            message: 'Books retrieved successfully',
            data: booksClean,
        });
    }
    catch (error) {
        res.status(500).json({ success: false, message: 'Failed to get books', error });
    }
};
exports.getBooks = getBooks;
// Get Book by ID
const getBookById = async (req, res) => {
    try {
        const { bookId } = req.params;
        const book = await Book_1.default.findById(bookId).lean();
        if (!book) {
            return res.status(404).json({
                success: false,
                message: 'Book not found',
                error: null,
            });
        }
        if (book && typeof book === 'object' && '__v' in book) {
            delete book.__v;
        }
        res.json({
            success: true,
            message: 'Book retrieved successfully',
            data: book,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to retrieve book',
            error,
        });
    }
};
exports.getBookById = getBookById;
// Update Book
const updateBook = async (req, res) => {
    try {
        const book = await Book_1.default.findByIdAndUpdate(req.params.bookId, req.body, { new: true, runValidators: true });
        if (!book)
            return res.status(404).json({ success: false, message: 'Book not found', data: null });
        const bookObj = book.toObject ? book.toObject() : book;
        if (bookObj && typeof bookObj === 'object' && '__v' in bookObj) {
            delete bookObj.__v;
        }
        res.json({ success: true, message: 'Book updated successfully', data: bookObj });
    }
    catch (error) {
        res.status(400).json({ success: false, message: 'Failed to update book', error });
    }
};
exports.updateBook = updateBook;
// Delete Book
const deleteBook = async (req, res) => {
    try {
        const book = await Book_1.default.findByIdAndDelete(req.params.bookId);
        if (!book)
            return res.status(404).json({ success: false, message: 'Book not found', data: null });
        res.json({ success: true, message: 'Book deleted successfully', data: null });
    }
    catch (error) {
        res.status(500).json({ success: false, message: 'Failed to delete book', error });
    }
};
exports.deleteBook = deleteBook;
