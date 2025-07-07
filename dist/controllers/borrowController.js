"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.borrowSummary = exports.borrowBook = void 0;
const BorrowBook_1 = __importDefault(require("../models/BorrowBook"));
const Book_1 = __importDefault(require("../models/Book"));
const Borrower_1 = __importDefault(require("../models/Borrower"));
const borrowBook = async (req, res) => {
    try {
        const { book, quantity, borrowDate, dueDate, borrowerName, borrowerEmail } = req.body;
        if (!book || !quantity || !borrowDate || !dueDate || !borrowerName || !borrowerEmail) {
            return res.status(400).json({
                message: 'Validation failed',
                success: false,
                error: {
                    name: 'ValidationError',
                    errors: {
                        book: !book ? { message: 'Book is required' } : undefined,
                        quantity: !quantity ? { message: 'Quantity is required' } : undefined,
                        borrowDate: !borrowDate ? { message: 'Borrow date is required' } : undefined,
                        dueDate: !dueDate ? { message: 'Due date is required' } : undefined,
                        borrowerName: !borrowerName ? { message: 'Borrower name is required' } : undefined,
                        borrowerEmail: !borrowerEmail ? { message: 'Borrower email is required' } : undefined,
                    },
                },
            });
        }
        if (quantity <= 0) {
            return res.status(400).json({
                message: 'Negative or zero quantity cannot be borrowed',
                success: false,
                error: {
                    name: 'ValidationError',
                    errors: {
                        quantity: {
                            name: 'ValidatorError',
                            message: 'Quantity must be a positive number',
                            properties: {
                                message: 'Quantity must be a positive number',
                                type: 'min',
                                min: 1
                            },
                            kind: 'min',
                            path: 'quantity',
                            value: quantity
                        }
                    }
                }
            });
        }
        const foundBook = await Book_1.default.findById(book);
        if (!foundBook) {
            return res.status(404).json({ success: false, message: 'Book not found', error: null });
        }
        if (!foundBook.available || foundBook.copies < quantity) {
            return res.status(400).json({
                message: 'Cannot borrow more than available copies',
                success: false,
                error: {
                    name: 'ValidationError',
                    errors: {
                        copies: {
                            message: 'Not enough copies available',
                            name: 'ValidatorError',
                            properties: {
                                message: 'Not enough copies available',
                                type: 'min',
                                min: 0
                            },
                            kind: 'min',
                            path: 'copies',
                            value: foundBook.copies
                        }
                    }
                }
            });
        }
        // Find or create borrower
        let borrower = await Borrower_1.default.findOne({ email: borrowerEmail });
        if (!borrower) {
            borrower = await Borrower_1.default.create({ name: borrowerName, email: borrowerEmail });
        }
        await foundBook.borrow(quantity); // use instance method
        const borrow = await BorrowBook_1.default.create({ book, quantity, borrowDate, dueDate, borrower: borrower._id });
        const borrowObj = borrow.toObject ? borrow.toObject() : borrow;
        if (borrowObj && typeof borrowObj === 'object' && Object.prototype.hasOwnProperty.call(borrowObj, '__v')) {
            delete borrowObj.__v;
        }
        res.status(201).json({
            success: true,
            message: 'Book borrowed successfully',
            data: borrowObj,
        });
    }
    catch (error) {
        res.status(400).json({
            message: 'Validation failed',
            success: false,
            error,
        });
    }
};
exports.borrowBook = borrowBook;
// Borrow Summary
const borrowSummary = async (req, res) => {
    try {
        const summary = await BorrowBook_1.default.aggregate([
            {
                $lookup: {
                    from: 'books',
                    localField: 'book',
                    foreignField: '_id',
                    as: 'bookInfo'
                }
            },
            { $unwind: '$bookInfo' },
            {
                $group: {
                    _id: '$book',
                    totalQuantity: { $sum: '$quantity' },
                    book: { $first: '$bookInfo' }
                }
            },
            {
                $project: {
                    _id: 0,
                    book: {
                        title: '$book.title',
                        isbn: '$book.isbn',
                        author: '$book.author',
                        genre: '$book.genre',
                        description: '$book.description',
                        copies: '$book.copies',
                        available: '$book.available'
                    },
                    totalQuantity: 1
                }
            }
        ]);
        res.json({ success: true, message: 'Borrowed books summary retrieved successfully', data: summary });
    }
    catch (error) {
        res.status(500).json({ success: false, message: 'Failed to get summary', error });
    }
};
exports.borrowSummary = borrowSummary;
