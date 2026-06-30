import { NextRequest } from "next/server";

export const runtime = "edge";

export async function POST(request: NextRequest) {
  const key = process.env.ASSEMBLYAI_API_KEY;
  if (!key) {
    return Response.json({ error: "Missing API key" }, { status: 500 });
  }

  const response = await fetch("https://api.assemblyai.com/v2/upload", {
    method: "POST",
    headers: {
      authorization: key,
      "content-type": "application/octet-stream",
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ...(({ body: request.body, duplex: "half" }) as any),
  });

  if (!response.ok) {
    return Response.json({ error: "Upload failed" }, { status: response.status });
  }

  return Response.json(await response.json());
}
