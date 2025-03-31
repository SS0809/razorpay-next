import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import Testimonial from "@/models/Testimonial";
import { ObjectId } from "mongodb";

export async function GET(req: NextRequest) {
  await connectToDatabase();
  try {
    const testimonials = await Testimonial.find({});
    return NextResponse.json(testimonials, { status: 200 });
  } catch (error) {
    console.error("Error fetching testimonials:", error);
    return NextResponse.json({ error: "Failed to fetch testimonials" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  await connectToDatabase();
  try {
    const body = await req.json();
    const { name, feedback, image } = body;

    if (!name || !feedback) {
      return NextResponse.json({ error: "Name and feedback are required" }, { status: 400 });
    }

    const newTestimonial = new Testimonial({ name, feedback, image });
    await newTestimonial.save();
    return NextResponse.json(newTestimonial, { status: 201 });
  } catch (error) {
    console.error("Error saving testimonial:", error);
    return NextResponse.json({ error: "Error saving testimonial" }, { status: 400 });
  }
}

export async function PUT(req: NextRequest) {
  await connectToDatabase();

  try {
    const body = await req.json();
    const { _id, name, feedback, image } = body;

    console.log("Received update request with ID:", _id);

    if (!_id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }

    if (!ObjectId.isValid(_id)) {
      return NextResponse.json({ error: "Invalid ID format" }, { status: 400 });
    }

    const existingTestimonial = await Testimonial.findById(_id);
    console.log("Existing testimonial:", existingTestimonial);

    if (!existingTestimonial) {
      return NextResponse.json({ error: "Testimonial not found" }, { status: 404 });
    }

    const updatedTestimonial = await Testimonial.findByIdAndUpdate(
      _id,
      { name, feedback, image },
      { new: true }
    );

    console.log("Updated testimonial:", updatedTestimonial);

    return NextResponse.json(updatedTestimonial, { status: 200 });
  } catch (error) {
    console.error("Error updating testimonial:", error);
    return NextResponse.json({ error: "Error updating testimonial" }, { status: 400 });
  }
}

export async function DELETE(req: NextRequest) {
  await connectToDatabase();
  try {
    const body = await req.json();
    const { _id } = body;

    if (!_id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }

    if (!ObjectId.isValid(_id)) {
      return NextResponse.json({ error: "Invalid ID format" }, { status: 400 });
    }

    await Testimonial.findByIdAndDelete(_id);
    return NextResponse.json({ message: "Testimonial deleted" }, { status: 200 });
  } catch (error) {
    console.error("Error deleting testimonial:", error);
    return NextResponse.json({ error: "Error deleting testimonial" }, { status: 400 });
  }
}
