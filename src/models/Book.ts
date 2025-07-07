import mongoose, { Schema, Document } from 'mongoose';

export type Genre = 'FICTION' | 'NON_FICTION' | 'SCIENCE' | 'HISTORY' | 'BIOGRAPHY' | 'FANTASY';

export interface IBook extends Document {
  title: string;
  author: string;
  genre: Genre;
  isbn: string;
  description?: string;
  copies: number;
  available: boolean;
  createdAt: Date;
  updatedAt: Date;
  borrow: (quantity: number) => Promise<void>;
}

const bookSchema = new Schema<IBook>(
  {
    title: { type: String, required: true },
    author: { type: String, required: true },
    genre: {
      type: String,
      required: true,
      enum: ['FICTION', 'NON_FICTION', 'SCIENCE', 'HISTORY', 'BIOGRAPHY', 'FANTASY'],
    },
    isbn: { type: String, required: true, unique: true },
    description: { type: String },
    copies: { type: Number, required: true, min: 0 },
    available: { type: Boolean, default: true },
  },
  { timestamps: true }
);

// Add instance method for borrowing
bookSchema.methods.borrow = async function(quantity: number) {
  if (this.copies < quantity) throw new Error('Not enough copies');
  this.copies -= quantity;
  if (this.copies === 0) this.available = false;
  await this.save();
};

// Add post middleware to log borrow events
bookSchema.post('save', function(doc) {
  if (doc.copies === 0 && !doc.available) {
    console.log(`Book '${doc.title}' is now unavailable.`);
  }
});

const Book = mongoose.model<IBook>('Book', bookSchema);
export default Book;