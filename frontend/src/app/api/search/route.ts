import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  // query params
  const convId = req.nextUrl.searchParams.get("conversation_id");
  const query = req.nextUrl.searchParams.get("q");
  const size = req.nextUrl.searchParams.get("size") ?? "5";

  if (!query) {
    return NextResponse.json({ data: "query is required" }, { status: 400 });
  }

  const fetched = await fetch(
    `${process.env.BACKEND_API_URL}/api/search?` +
      new URLSearchParams({ query: query, size: size })
  );
  if (!fetched.ok) {
    const text = await fetched.text();
    console.log("search error", fetched.status, text);
    return NextResponse.json(
      { data: "search error: " + text },
      { status: fetched.status }
    );
  }
  return NextResponse.json(await fetched.json());
}
