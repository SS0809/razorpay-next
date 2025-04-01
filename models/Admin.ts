// models/Admin.ts
import mongoose, { Schema, Document } from 'mongoose';

// Define the interface for Admin document
export interface IAdmin extends Document {
  email: string;
  name?: string;
  role: string;
  dateCreated: Date;
}

// Create the schema
const AdminSchema: Schema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: false
  },
  role: {
    type: String,
    required: true,
    default: 'admin'
  },
  dateCreated: {
    type: Date,
    default: Date.now
  }
});

// Check if the model exists before creating it to prevent overwrite errors
export const Admin = mongoose.models.Admin || mongoose.model<IAdmin>('Admin', AdminSchema);