import { MyArgs } from '@/cli';
import globby from 'globby';
import { getAction, postDiff } from '@/services/gumtree/';
import { readFileSync } from 'fs';
import { checkout } from '@/utils/git';
import { isTestCodeDeleted } from '@/patterns';

export async function handler(argv: MyArgs) {
  const { path, srcHash, dstHash } = argv;

  // TODO: use cache
  await checkout(path, srcHash);
  const srcCode = concatenateFileSync(await getTestFiles(path));

  await checkout(path, dstHash);
  const dstCode = concatenateFileSync(await getTestFiles(path));

  const res = await postDiff({
    body: { src_code: srcCode, dst_code: dstCode }
  });
  const id = res?.data.diff_id;

  let isBreaking = false;
  if (id) {
    const actions = await getAction(id);

    isBreaking = !!actions?.data.some((action) => isTestCodeDeleted(action));
  }

  return isBreaking;
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
    throw error;
  }
}
