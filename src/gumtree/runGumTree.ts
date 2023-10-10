import path from 'path';
import os from 'os';
import fs from 'fs';
import { randomUUID } from 'crypto';
import { run } from '@/utils';

export type GumTreeResponseType = {
  matches: {
    src: string;
    dest: string;
  }[];
  actions: {
    action: ActionType;
    tree: string;
    parent?: string;
    at?: number;
    label?: string;
  }[];
};

type ActionType =
  | 'match'
  | `insert-${'node' | 'tree'}`
  | `move-${'node' | 'tree'}`
  | `update-${'node' | 'tree'}`
  | `delete-${'node' | 'tree'}`;

export async function runGumTree(
  srcCode: string,
  dstCode: string
): Promise<GumTreeResponseType | undefined> {
  const id = randomUUID();
  const tempDir = path.join(os.tmpdir(), id);

  try {
    fs.mkdirSync(tempDir);

    const srcPath = path.join(tempDir, `src.js`);
    const dstPath = path.join(tempDir, `dst.js`);
    fs.writeFileSync(srcPath, srcCode, 'utf-8');
    fs.writeFileSync(dstPath, dstCode, 'utf-8');

    const output = await run(`gumtree textdiff -f JSON ${srcPath} ${dstPath}`);

    return JSON.parse(output);
  } catch (error) {
    console.error('Error at runGumTree: ', error);
  } finally {
    if (fs.existsSync(tempDir)) {
      fs.rmSync(tempDir, { recursive: true, force: true });
    }
  }
}
