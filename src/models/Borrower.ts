import mongoose, { Schema, Document } from 'mongoose';

export interface IBorrower extends Document {
  name: string;
  email: string;
}

const borrowerSchema = new Schema<IBorrower>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
});

const Borrower = mongoose.model<IBorrower>('Borrower', borrowerSchema);
export default Borrower;