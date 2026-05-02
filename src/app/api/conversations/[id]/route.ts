import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";

export const runtime = "nodejs";

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
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

    const { id } = await params;
    const body = await req.json();
    const { title, messages, updatedAt } = body;

    // Verify ownership
    const existing = await prisma.conversation.findUnique({
      where: { id },
    });

    if (!existing || existing.userId !== user.id) {
      return NextResponse.json({ message: "Conversation not found or unauthorized" }, { status: 404 });
    }

    const conversation = await prisma.conversation.update({
      where: { id },
      data: {
        title: title !== undefined ? title : existing.title,
        messages: messages !== undefined ? JSON.stringify(messages) : existing.messages,
        updatedAt: updatedAt ? new Date(updatedAt) : new Date(),
      },
    });

    return NextResponse.json(conversation);
  } catch (error) {
    console.error("Update conversation error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
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

    const { id } = await params;

    // Verify ownership
    const existing = await prisma.conversation.findUnique({
      where: { id },
    });

    if (!existing || existing.userId !== user.id) {
      return NextResponse.json({ message: "Conversation not found or unauthorized" }, { status: 404 });
    }

    await prisma.conversation.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete conversation error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
