import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { findPageRoute } from '@/lib/pages';

// Touches the filesystem, so it must never be statically optimised.
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

/**
 * Resolves a route key to its `page.json` on disk.
 *
 * The path is built from the registry in `lib/pages.ts`, never from the request
 * body, so an unknown or crafted route key is rejected outright rather than
 * escaping the `app/` directory. The realpath check is belt-and-braces for the
 * same thing.
 */
function resolvePageFile(routeKey: string): string | null {
  const route = findPageRoute(routeKey);
  if (!route) return null;

  const appDir = path.join(process.cwd(), 'app');
  const file = path.join(appDir, route.dir, 'page.json');

  return file.startsWith(appDir + path.sep) ? file : null;
}

// Props of blocks marked `global: true` (header, footer) live in one file that
// every page.json references, so editing them once updates every route.
const GLOBALS_FILE = path.join(process.cwd(), 'app.globals.json');

async function readJson(file: string): Promise<Record<string, any> | null> {
  try {
    return JSON.parse(await readFile(file, 'utf8'));
  } catch {
    return null;
  }
}

export async function GET(request: Request) {
  const routeKey = new URL(request.url).searchParams.get('route') ?? '/';
  const file = resolvePageFile(routeKey);

  if (!file) {
    return Response.json({ error: `Unknown route: ${routeKey}` }, { status: 404 });
  }

  const page = await readJson(file);
  // A route with no page.json yet is a new page, not an error.
  if (!page) return Response.json({ page: null });

  const globals = await readJson(GLOBALS_FILE);
  return Response.json({ page: { ...page, globals: globals ?? {} } });
}

export async function PUT(request: Request) {
  let body: { route?: string; page?: unknown };

  try {
    body = await request.json();
  } catch {
    return Response.json({ error: 'Expected a JSON body.' }, { status: 400 });
  }

  const routeKey = body.route ?? '';
  const file = resolvePageFile(routeKey);

  if (!file) {
    return Response.json({ error: `Unknown route: ${routeKey}` }, { status: 404 });
  }

  if (!body.page || typeof body.page !== 'object') {
    return Response.json({ error: 'Expected a page object.' }, { status: 400 });
  }

  // Globals belong to the whole site, not this route, so they go to their own
  // file and are stripped from the page before it is written.
  const { globals, ...page } = body.page as Record<string, unknown>;

  try {
    await writeFile(file, `${JSON.stringify(page, null, 2)}\n`, 'utf8');

    if (globals && typeof globals === 'object') {
      await writeFile(
        GLOBALS_FILE,
        `${JSON.stringify(globals, null, 2)}\n`,
        'utf8'
      );
    }

    return Response.json({ file: path.relative(process.cwd(), file) });
  } catch (err) {
    // Read-only filesystems (most serverless hosts) land here. Say so plainly
    // rather than reporting a save that did not happen.
    console.error(`Failed to write ${file}:`, err);
    return Response.json(
      {
        error:
          'Could not write page.json. The filesystem is read-only — run the editor locally to save.',
      },
      { status: 500 }
    );
  }
}
