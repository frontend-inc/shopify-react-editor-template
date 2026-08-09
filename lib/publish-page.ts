'use server';

import { writeFile } from 'node:fs/promises';
import path from 'node:path';
import { findPageRoute } from '@/lib/pages';

/**
 * Writes a published page straight to its `page.json` on disk.
 *
 * A server action rather than a route handler: the editor calls it like a
 * function, and there is no HTTP endpoint sitting in front of the filesystem.
 *
 * The path is built from the registry in `lib/pages.ts`, never from the caller,
 * so an unknown or crafted route key is rejected outright rather than escaping
 * the `app/` directory.
 */

// Props of blocks marked `global: true` (header, footer) live in one file that
// every page.json references, so editing them once updates every route.
const GLOBALS_FILE = path.join(process.cwd(), 'app.globals.json');

export interface PublishResult {
  /** Path of the written file, relative to the project root. */
  file?: string;
  error?: string;
}

export async function publishPage(
  routeKey: string,
  page: unknown
): Promise<PublishResult> {
  const route = findPageRoute(routeKey);
  if (!route) return { error: `Unknown route: ${routeKey}` };

  if (!page || typeof page !== 'object') {
    return { error: 'Expected a page object.' };
  }

  const appDir = path.join(process.cwd(), 'app');
  const file = path.join(appDir, route.dir, 'page.json');

  // Belt-and-braces against a registry entry with a traversing `dir`.
  if (file !== path.join(appDir, 'page.json') && !file.startsWith(appDir + path.sep)) {
    return { error: `Unknown route: ${routeKey}` };
  }

  // Globals belong to the whole site, not this route, so they go to their own
  // file and are stripped from the page before it is written.
  const { globals, ...pageData } = page as Record<string, unknown>;

  try {
    await writeFile(file, `${JSON.stringify(pageData, null, 2)}\n`, 'utf8');

    if (globals && typeof globals === 'object') {
      await writeFile(
        GLOBALS_FILE,
        `${JSON.stringify(globals, null, 2)}\n`,
        'utf8'
      );
    }

    return { file: path.relative(process.cwd(), file) };
  } catch (err) {
    // Read-only filesystems (most serverless hosts) land here. Say so plainly
    // rather than reporting a save that did not happen.
    console.error(`Failed to write ${file}:`, err);
    return {
      error:
        'Could not write page.json. The filesystem is read-only — run the editor locally to save.',
    };
  }
}
