import { rephrase } from "@/libs/openai";
import { Conversation } from "@/types/conversation";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const params = await req.json();
  const conv = params.conversation as Conversation;
  try {
    const fetched = await rephrase(conv);
    return NextResponse.json({ query: fetched });
  } catch (e) {
    console.log(e);
    return NextResponse.json(
      { msg: "Failed to fetch from OpenAI" },
      { status: 500 }
    );
  }
}
