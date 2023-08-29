import { MyArgs } from '@/cli';
import { getAction, getAst, postDiff } from '@/services/gumtree/';
import simpleGit from 'simple-git';
import db from '@/libs/prisma';
import { isBreaking } from '@/patterns';
import { getChangedTestFilePaths, mergeFileIfExists } from '@/utils/files';

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
