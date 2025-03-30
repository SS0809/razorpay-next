import mongoose, { Schema, Document } from "mongoose";

interface ITestimonial extends Document {
  name: string;
  feedback: string;
  image: string;
}

const TestimonialSchema = new Schema<ITestimonial>({
  name: { type: String, required: true },
  feedback: { type: String, required: true },
  image: { type: String, required: true },
});


export default mongoose.models.Testimonial ||
  mongoose.model<ITestimonial>("Testimonial", TestimonialSchema);
