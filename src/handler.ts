import { MyArgs } from '@/cli';
import { getAction, getAst, postDiff } from '@/services/gumtree/';
import simpleGit from 'simple-git';
import db from '@/libs/prisma';
import { getChangedTestFilePaths, mergeFileIfExists } from '@/utils/files';

export async function handler(argv: MyArgs) {
  const { path, srcHash, dstHash } = argv;

  const data = await getGumTreeData(path, srcHash, dstHash);
  if (!data) return null;

  return data;
}

async function getGumTreeData(path: string, srcHash: string, dstHash: string) {
  try {
    const data = await db.gumTree.findUnique({
      where: {
        key: `${path}:${srcHash}:${dstHash}`,
        status: {
          in: ['success', 'matched']
        }
      }
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

async function processGumTreeData(
  path: string,
  srcHash: string,
  dstHash: string
) {
  const { srcCode, dstCode } = await createSrcAndDstCode(
    path,
    srcHash,
    dstHash
  );

  // 外れ値を除外
  if (new Blob([srcCode, dstCode]).size >= 165956) {
    await db.gumTree.create({
      data: {
        key: `${path}:${srcHash}:${dstHash}`,
        serverId: null,
        status: 'exceeded',
        actions: JSON.stringify([]),
        srcAst: JSON.stringify({}),
        dstAst: JSON.stringify({})
      }
    });
    return null;
  }

  const isMatched = !srcCode && !dstCode;

  const res = await postDiff({
    body: { src_code: srcCode, dst_code: dstCode }
  });

  const id = res?.data.diff_id;

  if (!id) {
    await db.gumTree.create({
      data: {
        key: `${path}:${srcHash}:${dstHash}`,
        serverId: null,
        status: 'error',
        actions: JSON.stringify([]),
        srcAst: JSON.stringify({}),
        dstAst: JSON.stringify({})
      }
    });

    return null;
  }

  const [actions, srcAst, dstAst] = await Promise.all([
    getAction(id),
    getAst({ id, type: 'src' }),
    getAst({ id, type: 'dst' })
  ]);

  const gumTreeData = {
    serverId: id,
    key: `${path}:${srcHash}:${dstHash}`,
    actions: JSON.stringify(actions?.data ?? []),
    srcAst: JSON.stringify(srcAst?.data ?? {}),
    dstAst: JSON.stringify(dstAst?.data ?? {}),
    status: isMatched ? 'matched' : res.data.status
  };

  await db.gumTree.create({
    data: gumTreeData
  });

  return gumTreeData;
}

async function createSrcAndDstCode(
  path: string,
  srcHash: string,
  dstHash: string
) {
  const git = simpleGit(path);

  try {
    const currentBranchName = (await git.branch(['--contains'])).current;

    const changedTestFilePaths = await getChangedTestFilePaths(
      path,
      srcHash,
      dstHash
    );

    await git.checkout(dstHash);
    const dstCode = mergeFileIfExists(changedTestFilePaths);

    await git.checkout(srcHash);
    const srcCode = mergeFileIfExists(changedTestFilePaths);

    // clean up
    await git.checkout(currentBranchName);

    return { srcCode, dstCode };
  } catch {
    return { srcCode: '', dstCode: '' };
  }
}
