import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  // query params
  const convId = req.nextUrl.searchParams.get("conversation_id");
  const query = req.nextUrl.searchParams.get("query");

  // TODO: implement search
  return NextResponse.json({
    data: ["full/9d83195aa19dd4127dd74e12debecd7efedb264e.jpg"],
  });
}
