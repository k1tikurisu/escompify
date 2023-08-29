import { MyArgs } from '@/cli';
import globby from 'globby';
import { getAction, getAst, postDiff } from '@/services/gumtree/';
import { readFileSync } from 'fs';
import { checkout } from '@/utils/git';
import db from '@/libs/prisma';
import { isBreaking } from '@/patterns';

export async function handler(argv: MyArgs) {
  const { path, srcHash, dstHash } = argv;

  const data = await getGumTreeData(path, srcHash, dstHash);
  if (!data) return null;

  return isBreaking(data);
}

async function getGumTreeData(path: string, srcHash: string, dstHash: string) {
  try {
    const data = await db.gumTree.findUnique({
      where: { key: `${path}:${srcHash}:${dstHash}` }
    });

    if (data) {
      return data;
    }

    const gumTreeData = await processGumTreeData(path, srcHash, dstHash);

    return gumTreeData;
  } catch {
    return null;
  }
}

async function checkoutAndConcatenate(
  path: string,
  srcHash: string,
  dstHash: string
) {
  await checkout(path, srcHash);
  const srcCode = concatenateFileSync(await getTestFiles(path));

  await checkout(path, dstHash);
  const dstCode = concatenateFileSync(await getTestFiles(path));

  return { srcCode, dstCode };
}

async function processGumTreeData(
  path: string,
  srcHash: string,
  dstHash: string
) {
  const { srcCode, dstCode } = await checkoutAndConcatenate(
    path,
    srcHash,
    dstHash
  );

  if (!srcCode || !dstCode) {
    return null;
  }

  const res = await postDiff({
    body: { src_code: srcCode, dst_code: dstCode }
  });

  const id = res?.data.diff_id;

  if (!id) {
    return null;
  }

  const [actions, srcAst, dstAst] = await Promise.all([
    getAction(id),
    getAst({ id, type: 'src' }),
    getAst({ id, type: 'dst' })
  ]);

  if (!actions || !srcAst || !dstAst) {
    return null;
  }

  const gumTreeData = {
    serverId: id,
    key: `${path}:${srcHash}:${dstHash}`,
    actions: JSON.stringify(actions),
    srcAst: JSON.stringify(srcAst),
    dstAst: JSON.stringify(dstAst)
  };

  await db.gumTree.create({
    data: gumTreeData
  });

  return gumTreeData;
}

async function getTestFiles(repoPath: string) {
  const filePaths = await globby([`${repoPath}/**/*.{js,ts}`, '!**/*.d.ts']);
  const testFilePaths = filePaths.filter((path) => /(test|spec)/.test(path));
  return testFilePaths;
}

function concatenateFileSync(filePaths: string[]) {
  try {
    const fileContents = filePaths.map((filePath) => {
      try {
        return readFileSync(filePath, 'utf8');
      } catch (err) {
        console.error(`Error reading file ${filePath}:`, err);
        return '';
      }
    });

    const concatenatedContents = fileContents.join('\n');

    return concatenatedContents;
  } catch (error) {
    console.error('Error reading files:', error);
  }
}
