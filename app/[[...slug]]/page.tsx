"use client";

import { useParams } from "next/navigation";
import { Render } from "@reacteditor/core";
import { appConfig } from "@/editor.config";
import resolveRoute from "@/lib/resolve-route";
import schema from "@/app.schema.json";
import globals from "@/app.globals.json";

export default function Page() {
  const params = useParams();
  const segments = Array.isArray(params?.slug) ? (params.slug as string[]) : [];
  const { key } = resolveRoute(segments);
  const { root, content } = (schema as any)[key] ?? {};
  const data = { root, content, globals };
  return <Render config={appConfig as any} data={data} />;
}
