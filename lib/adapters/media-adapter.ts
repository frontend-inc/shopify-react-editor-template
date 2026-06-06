import type {
  MediaAdapter,
  MediaItem,
  MediaPage,
} from "@reacteditor/plugin-media";

// Requests go to our own /api/media proxy routes, which inject the API key
// server-side. No credentials are sent from the client.
export const mediaAdapter: MediaAdapter = {
  fetchList: async ({ query, cursor, signal }) => {
    const url = new URL("/api/media", window.location.origin);
    if (query) url.searchParams.set("query", query);
    if (cursor) url.searchParams.set("cursor", cursor);

    const res = await fetch(url, { method: "GET", signal });
    if (!res.ok) throw new Error(`List failed: ${res.status}`);
    return (await res.json()) as MediaPage;
  },

  // XHR (not fetch) so we get real upload progress.
  upload: (file, opts) =>
    new Promise<MediaItem>((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open("POST", "/api/media");

      xhr.upload.onprogress = (e) => {
        if (e.lengthComputable) opts?.onProgress?.(e.loaded / e.total);
      };
      xhr.onload = () => {
        if (xhr.status >= 400) {
          reject(new Error(xhr.responseText || `Upload failed: ${xhr.status}`));
          return;
        }
        try {
          resolve(JSON.parse(xhr.responseText) as MediaItem);
        } catch (err) {
          reject(err instanceof Error ? err : new Error(String(err)));
        }
      };
      xhr.onerror = () => reject(new Error("Network error"));
      xhr.onabort = () => {
        const err = new Error("Aborted");
        err.name = "AbortError";
        reject(err);
      };
      opts?.signal?.addEventListener("abort", () => xhr.abort());

      const fd = new FormData();
      fd.append("file", file);
      xhr.send(fd);
    }),

  delete: async (id) => {
    const res = await fetch(`/api/media/${encodeURIComponent(id)}`, {
      method: "DELETE",
    });
    if (!res.ok) throw new Error(`Delete failed: ${res.status}`);
  },
};
