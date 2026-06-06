// Server-only config for the Frontend Cloud proxy routes.
// The API key lives here (read from a non-public env var) so it is never
// shipped to the browser bundle.

export const CLOUD_BASE = "https://cloud.frontend.co";

export const FRONTEND_API_KEY = process.env.FRONTEND_API_KEY ?? "";
