import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";

export const runtime = "nodejs";

export async function GET(req: Request) {
  try {
    const session = await getServerSession();
    if (!session?.user?.email) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const conversations = await prisma.conversation.findMany({
      where: { userId: user.id },
      orderBy: { updatedAt: "desc" },
    });

    return NextResponse.json(conversations);
  } catch (error) {
    console.error("Fetch conversations error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession();
    if (!session?.user?.email) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const body = await req.json();
    const { id, title, messages, model, mode, createdAt, updatedAt } = body;

    const conversation = await prisma.conversation.create({
      data: {
        id,
        userId: user.id,
        title,
        messages: JSON.stringify(messages),
        model,
        mode,
        createdAt: new Date(createdAt),
        updatedAt: new Date(updatedAt),
      },
    });

    return NextResponse.json(conversation, { status: 201 });
  } catch (error) {
    console.error("Create conversation error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
