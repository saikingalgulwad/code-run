import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const feedbacks = await prisma.feedback.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(feedbacks, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to fetch feedbacks" }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    if (!body.text) {
      return NextResponse.json({ error: "Feedback text required" }, { status: 400 });
    }

    const newFeedback = await prisma.feedback.create({
      data: { text: body.text },
    });

    return NextResponse.json(newFeedback, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to create feedback" }, { status: 500 });
  }
}
