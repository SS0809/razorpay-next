import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import Plan from "@/models/Plan";
import { ObjectId } from "mongodb";

export async function GET(req: NextRequest) {
  await connectToDatabase();
  try {
    const plans = await Plan.find({});
    return NextResponse.json(plans, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch plans" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  await connectToDatabase();
  try {
    const body = await req.json();
    const { title, price, duration, discountrate, description, features, unavailableFeatures, actionLabel } = body;

    const newPlan = new Plan({
      title,
      price,
      duration,
      discountrate,
      description,
      features,
      unavailableFeatures,
      actionLabel
    });

    await newPlan.save();
    return NextResponse.json(newPlan, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Error saving plan" }, { status: 400 });
  }
}

export async function PUT(req: NextRequest) {
  await connectToDatabase();

  try {
    const body = await req.json();
    const { _id, title, price, duration, discountrate, description, features, unavailableFeatures, actionLabel } = body;

    if (!_id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }

    if (!ObjectId.isValid(_id)) {
      return NextResponse.json({ error: "Invalid ID format" }, { status: 400 });
    }

    const updatedPlan = await Plan.findByIdAndUpdate(
      _id,
      { title, price, duration, discountrate, description, features, unavailableFeatures, actionLabel },
      { new: true }
    );

    if (!updatedPlan) {
      return NextResponse.json({ error: "Plan not found" }, { status: 404 });
    }

    return NextResponse.json(updatedPlan, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Error updating plan" }, { status: 400 });
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

    const deletedPlan = await Plan.findByIdAndDelete(_id);

    if (!deletedPlan) {
      return NextResponse.json({ error: "Plan not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Plan deleted" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Error deleting plan" }, { status: 400 });
  }
}
