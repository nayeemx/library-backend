import mongoose, { Schema, Document } from 'mongoose';

export interface IBorrowBook extends Document {
  book: mongoose.Types.ObjectId;
  quantity: number;
  borrowDate: Date;
  dueDate: Date;
  borrower: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const borrowBookSchema = new Schema<IBorrowBook>(
  {
    book: { type: Schema.Types.ObjectId, ref: 'Book', required: true },
    quantity: { type: Number, required: true, min: 1 },
    borrowDate: { type: Date, required: true },
    dueDate: { type: Date, required: true },
    borrower: { type: Schema.Types.ObjectId, ref: 'Borrower', required: true },
  },
  { timestamps: true }
);

borrowBookSchema.post('save', function(doc) {
  console.log(`Borrow record created for bookId ${doc.book} by borrowerId ${doc.borrower}`);
});

const BorrowBook = mongoose.model<IBorrowBook>('BorrowBook', borrowBookSchema);
export default BorrowBook;