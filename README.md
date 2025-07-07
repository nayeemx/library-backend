# Library Management Backend

A RESTful backend for managing a library system, built with Express, TypeScript, and MongoDB (Mongoose). This application allows you to manage books, borrowers, and borrowing activities, supporting CRUD operations and summary reporting.

## Features
- Add, update, delete, and list books
- Borrow books and track borrowing records
- Get a summary of borrowed books (aggregation)
- Filter and sort books by genre, creation date, etc.
- Input validation and error handling

## How the Code Works

- **Architecture:**
  - Built with Express.js for routing and middleware, TypeScript for type safety, and Mongoose for MongoDB data modeling.
  - Follows RESTful API design for clear, predictable endpoints.

- **Controllers:**
  - `bookController.ts` handles all book-related logic: create, read, update, delete, and filtering/sorting.
  - `borrowController.ts` manages borrowing logic, including validation, borrower creation, and aggregation for summary reports.

- **Models:**
  - Mongoose schemas define the structure for books, borrowers, and borrow records, ensuring data consistency and validation at the database level.

- **Routes:**
  - Each resource (books, borrow) has its own route file, mapping HTTP methods and endpoints to controller functions.

- **Validation & Error Handling:**
  - All endpoints validate input and return structured error responses with clear messages and HTTP status codes.
  - Errors are caught and handled gracefully, so the API never crashes on bad input.

- **Aggregation:**
  - The borrowed books summary uses MongoDB's aggregation pipeline to efficiently group and join data, returning total quantities and book details in a single query.

- **TypeScript Best Practices:**
  - Types are used throughout for request/response objects and database models, reducing runtime errors and improving maintainability.
  - Linting and strict compiler options enforce code quality.

- **Extensibility:**
  - The modular structure makes it easy to add new features, models, or endpoints without breaking existing functionality.

## Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```
2. **Configure environment:**
   Create a `.env` file in `library-backend/`:
   ```env
   MONGODB_URI=your_mongodb_uri
   PORT=5000
   ```
3. **Start the development server:**
   ```bash
   npm run dev
   ```

## Project Structure
- `src/controllers/` — Route controllers (business logic)
- `src/middlewares/` — Express middlewares
- `src/models/` — Mongoose models (Book, BorrowBook, Borrower)
- `src/routes/` — Express routes for API endpoints
- `src/app.ts` — Express app and MongoDB connection
- `src/server.ts` — Server entry point

## API Endpoints

### Books
- **Create Book**
  - `POST /api/books`
  - Request body:
    ```json
    {
      "title": "string",
      "author": "string",
      "genre": "string",
      "isbn": "string",
      "description": "string",
      "copies": number,
      "available": boolean
    }
    ```
  - Response: Book object

- **Get All Books**
  - `GET /api/books?filter=GENRE&sortBy=createdAt&sort=desc&limit=10`
  - Query params:
    - `filter`: Filter by genre
    - `sortBy`: Field to sort by (default: createdAt)
    - `sort`: asc or desc (default: desc)
    - `limit`: Number of results (default: 10)
  - Response: List of books

- **Get Book by ID**
  - `GET /api/books/:bookId`
  - Response: Book object

- **Update Book**
  - `PUT /api/books/:bookId`
  - Request body: Any updatable book fields (e.g., `{ "copies": 5 }`)
  - Response: Updated book object

- **Delete Book**
  - `DELETE /api/books/:bookId`
  - Response: Success message

### Borrowing
- **Borrow Book**
  - `POST /api/borrow`
  - Request body:
    ```json
    {
      "book": "BOOK_ID",
      "quantity": number,
      "borrowDate": "YYYY-MM-DDTHH:mm:ss.sssZ",
      "dueDate": "YYYY-MM-DDTHH:mm:ss.sssZ",
      "borrowerName": "string",
      "borrowerEmail": "string"
    }
    ```
  - Response: Borrow record

- **Borrowed Books Summary**
  - `GET /api/borrow`
  - Response:
    ```json
    {
      "success": true,
      "message": "Borrowed books summary retrieved successfully",
      "data": [
        {
          "book": {
            "title": "string",
            "isbn": "string"
          },
          "totalQuantity": number
        }
      ]
    }
    ```

## Error Handling
- All endpoints return meaningful error messages and appropriate HTTP status codes for validation errors, not found, and server errors.

## Example BorrowBook JSON
```json
{
  "book": "BOOK_ID",
  "quantity": 2,
  "borrowDate": "2025-06-22T10:00:00.000Z",
  "dueDate": "2025-07-01T10:00:00.000Z",
  "borrowerName": "John Doe",
  "borrowerEmail": "john@example.com"
}
```