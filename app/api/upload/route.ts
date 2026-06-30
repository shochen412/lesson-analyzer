import { NextResponse } from "next/server";

export async function GET() {
  const key = process.env.ASSEMBLYAI_API_KEY;
  if (!key) {
    return NextResponse.json({ error: "Missing API key" }, { status: 500 });
  }
  return NextResponse.json({ key });
}
