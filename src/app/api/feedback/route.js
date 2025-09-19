import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  const feedbacks = await prisma.feedback.findMany({
    orderBy: { createdAt: "desc" },
  });
  return new Response(JSON.stringify(feedbacks), { status: 200 });
}

export async function POST(request) {
  const body = await request.json();
  if (!body.text) {
    return new Response(JSON.stringify({ error: "Feedback text required" }), { status: 400 });
  }
  const newFeedback = await prisma.feedback.create({
    data: { text: body.text },
  });
  return new Response(JSON.stringify(newFeedback), { status: 201 });
}
