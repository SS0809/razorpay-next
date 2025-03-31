import mongoose, { Document, Schema } from 'mongoose';

interface Plan extends Document {
  title: string;
  price: number;
  description: string;
  features: string[];
  unavailableFeatures: string[];
  actionLabel: string;
}

const planSchema: Schema<Plan> = new Schema({
  title: { type: String, required: true },
  price: { type: Number, required: true },
  description: { type: String, required: true },
  features: [{ type: String }],
  unavailableFeatures: [{ type: String }],
  actionLabel: { type: String, required: true }
}, { collection: 'plan' }); 

const Plan = mongoose.models.Plan || mongoose.model<Plan>('Plan', planSchema);

export default Plan;
