import { NextRequest } from "next/server";
import { CLOUD_BASE, FRONTEND_API_KEY } from "@/lib/cloud";

// GET /api/media — list/search media. Forwards query + cursor params.
export async function GET(req: NextRequest) {
  const incoming = new URL(req.url);
  const url = new URL("/api/media", CLOUD_BASE);
  const query = incoming.searchParams.get("query");
  const cursor = incoming.searchParams.get("cursor");
  if (query) url.searchParams.set("query", query);
  if (cursor) url.searchParams.set("cursor", cursor);

  const upstream = await fetch(url, {
    method: "GET",
    headers: { "x-api-key": FRONTEND_API_KEY },
  });

  return new Response(upstream.body, {
    status: upstream.status,
    headers: {
      "content-type":
        upstream.headers.get("content-type") ?? "application/json",
    },
  });
}

// POST /api/media — upload. Forwards the multipart body as-is.
export async function POST(req: NextRequest) {
  const upstream = await fetch(`${CLOUD_BASE}/api/media`, {
    method: "POST",
    headers: {
      "content-type": req.headers.get("content-type") ?? "",
      "x-api-key": FRONTEND_API_KEY,
    },
    body: req.body,
    // @ts-expect-error - duplex is valid but missing from the lib types.
    duplex: "half",
  });

  return new Response(upstream.body, {
    status: upstream.status,
    headers: {
      "content-type":
        upstream.headers.get("content-type") ?? "application/json",
    },
  });
}
