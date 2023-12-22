import { MyArgs } from '@/cli';
import simpleGit from 'simple-git';
import { parseFilesIfExists, getChangedTestFilePaths } from '@/utils/files';
import { generateActions } from './gumtree';
import {
  findActualAndExpects,
  findTestCodeRange,
  isExpectedChanged,
  isTestCodeDeleted,
  isTestInsertedWithinTest
} from '@/patterns';

export async function handler(argv: MyArgs) {
  const { path, srcHash, dstHash } = argv;

  const data = await getGumTreeData(path, srcHash, dstHash);

  const result = {
    path: data.path,
    srcHash: data.srcHash,
    dstHash: data.dstHash,
    isDeleted: false,
    isInserted: false,
    isExpectChanged: false
  };

  for (const action of data.actions) {
    if (isTestCodeDeleted(action)) {
      result.isDeleted = true;
    }
  }

  const testCodeRanges = findTestCodeRange(data.dstAst);
  if (isTestInsertedWithinTest(data.actions, testCodeRanges)) {
    result.isInserted = true;
  }

  const actualAndExpected = findActualAndExpects(data.srcAst, data.srcCode);
  if (isExpectedChanged(data.actions, actualAndExpected)) {
    result.isExpectChanged = true;
  }

  return result;
}

async function getGumTreeData(path: string, srcHash: string, dstHash: string) {
  const { srcCode, dstCode, srcAst, dstAst } = await createSrcAndDstCode(
    path,
    srcHash,
    dstHash
  );

  const actions = await generateActions(srcAst, dstAst);

  const gumTreeData = {
    path,
    srcCode,
    dstCode,
    srcHash,
    dstHash,
    actions: actions ?? [],
    srcAst,
    dstAst
  };

  return gumTreeData;
}

async function createSrcAndDstCode(
  path: string,
  srcHash: string,
  dstHash: string
) {
  const git = simpleGit(path);
  const currentBranchName = (await git.branch(['--contains'])).current;

  try {
    await git.checkout(currentBranchName);

    const changedTestFilePaths = await getChangedTestFilePaths(
      path,
      srcHash,
      dstHash
    );

    await git.checkout(dstHash);
    const { ast: dstAst, code: dstCode } =
      parseFilesIfExists(changedTestFilePaths);

    await git.checkout(srcHash);
    const { ast: srcAst, code: srcCode } =
      parseFilesIfExists(changedTestFilePaths);

    // clean up
    await git.checkout(currentBranchName);

    return { srcCode, dstCode, srcAst, dstAst };
  } finally {
    await git.checkout(currentBranchName);
  }
}
