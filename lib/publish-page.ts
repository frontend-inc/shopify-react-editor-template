'use server';

import { writeFile } from 'node:fs/promises';
import path from 'node:path';

const GLOBALS_FILE = path.join(process.cwd(), 'app.globals.json');

export interface PublishResult {
  file?: string;
  error?: string;
}

export async function publishPage(
  pagePath: string,
  page: unknown
): Promise<PublishResult> {
  if (!page || typeof page !== 'object') {
    return { error: 'Expected a page object.' };
  }

  const appDir = path.join(process.cwd(), 'app');
  const file = path.resolve(process.cwd(), pagePath);
  const relativeToApp = path.relative(appDir, file);

  if (
    !relativeToApp ||
    relativeToApp.startsWith(`..${path.sep}`) ||
    path.isAbsolute(relativeToApp) ||
    path.basename(file) !== 'page.json'
  ) {
    return { error: 'Invalid page file.' };
  }

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
    console.error(`Failed to write ${file}:`, err);
    return {
      error:
        'Could not write page.json. The filesystem is read-only — run the editor locally to save.',
    };
  }
}
