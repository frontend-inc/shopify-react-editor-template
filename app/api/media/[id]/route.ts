import { NextRequest } from "next/server";
import { CLOUD_BASE, FRONTEND_API_KEY } from "@/lib/cloud";

// DELETE /api/media/:id — remove a media asset.
export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const upstream = await fetch(
    `${CLOUD_BASE}/api/media/${encodeURIComponent(id)}`,
    {
      method: "DELETE",
      headers: { "x-api-key": FRONTEND_API_KEY },
    },
  );

  return new Response(upstream.body, {
    status: upstream.status,
    headers: {
      "content-type":
        upstream.headers.get("content-type") ?? "application/json",
    },
  });
}
