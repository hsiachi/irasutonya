import { Conversation } from "@/types/conversation";
import { NextRequest, NextResponse } from "next/server";
import { getBotReply } from "@/libs/openai";

export async function POST(req: NextRequest) {
  const params = await req.json();
  const conv = params.conversation as Conversation;
  const images = params.images as { name: string; url: string }[];
  console.log(conv, images);
  try {
    const fetched = await getBotReply(conv, images);
    console.log(fetched);
    return NextResponse.json({ reply: fetched });
  } catch (e) {
    console.log(e);
    return NextResponse.json(
      { msg: "Failed to fetch from OpenAI" },
      { status: 500 }
    );
  }
}
