"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const books_1 = __importDefault(require("./routes/books"));
const borrow_1 = __importDefault(require("./routes/borrow"));
const requestLogger_1 = require("./middlewares/requestLogger");
dotenv_1.default.config();
const app = (0, express_1.default)();
// Middleware
app.use(requestLogger_1.requestLogger);
// CORS setup (fix for both local and production frontend)
app.use((0, cors_1.default)({
    origin: [
        'http://localhost:5173',
        'https://library-frontend-blush.vercel.app',
        'https://*.vercel.app'
    ],
    credentials: true,
}));
app.use(express_1.default.json());
// Add your routes here
app.get('/', (req, res) => {
    res.send('📚 Library Management API is running!');
});
app.use('/api/books', books_1.default);
app.use('/api/borrow-summary', borrow_1.default);
// MongoDB connection
const uri = process.env.MONGODB_URI;
console.log('MongoDB URI:', uri);
mongoose_1.default.connect(uri)
    .then(() => console.log('Connected to MongoDB Atlas'))
    .catch((err) => console.error('MongoDB connection error:', err));
exports.default = app;
