import { Request, Response } from 'express';
import Book from '../models/Book';

// Create Book
export const createBook = async (req: Request, res: Response) => {
  try {
    const book = await Book.create(req.body);
    const bookObj = book.toObject ? book.toObject() : book;
    if (bookObj && typeof bookObj === 'object' && '__v' in bookObj) {
      delete (bookObj as { __v?: number }).__v;
    }
    res.status(201).json({
      success: true,
      message: 'Book created successfully',
      data: bookObj,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Validation failed',
      error,
    });
  }
};

// Get All Books
export const getBooks = async (req: Request, res: Response) => {
  try {
    const { filter, sortBy = 'createdAt', sort = 'desc', limit = 10 } = req.query;
    const query: Record<string, unknown> = {};
    if (filter) query.genre = filter;
    const books = await Book.find(query)
      .sort({ [sortBy as string]: sort === 'asc' ? 1 : -1 })
      .limit(Number(limit));
    const booksClean = books.map((b) => {
      const obj = b.toObject ? b.toObject() : b;
      if (obj && typeof obj === 'object' && '__v' in obj) {
        delete (obj as { __v?: number }).__v;
      }
      return obj;
    });
    res.json({
      success: true,
      message: 'Books retrieved successfully',
      data: booksClean,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to get books', error });
  }
};

// Get Book by ID
export const getBookById = async (req: Request, res: Response) => {
  try {
    const { bookId } = req.params;
    const book = await Book.findById(bookId).lean();
    if (!book) {
      return res.status(404).json({
        success: false,
        message: 'Book not found',
        error: null,
      });
    }
    if (book && typeof book === 'object' && '__v' in book) {
      delete (book as { __v?: number }).__v;
    }
    res.json({
      success: true,
      message: 'Book retrieved successfully',
      data: book,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve book',
      error,
    });
  }
};

// Update Book
export const updateBook = async (req: Request, res: Response) => {
  try {
    const book = await Book.findByIdAndUpdate(req.params.bookId, req.body, { new: true, runValidators: true });
    if (!book) return res.status(404).json({ success: false, message: 'Book not found', data: null });
    const bookObj = book.toObject ? book.toObject() : book;
    if (bookObj && typeof bookObj === 'object' && '__v' in bookObj) {
      delete (bookObj as { __v?: number }).__v;
    }
    res.json({ success: true, message: 'Book updated successfully', data: bookObj });
  } catch (error) {
    res.status(400).json({ success: false, message: 'Failed to update book', error });
  }
};

// Delete Book
export const deleteBook = async (req: Request, res: Response) => {
  try {
    const book = await Book.findByIdAndDelete(req.params.bookId);
    if (!book) return res.status(404).json({ success: false, message: 'Book not found', data: null });
    res.json({ success: true, message: 'Book deleted successfully', data: null });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to delete book', error });
  }
};