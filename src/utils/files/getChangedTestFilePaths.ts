import simpleGit from 'simple-git';

export async function getChangedTestFilePaths(
  repoPath: string,
  srcHash: string,
  dstHash: string
) {
  const git = simpleGit(repoPath);
  const paths = (await git.diff(['--name-only', `${srcHash}...${dstHash}`]))
    .split('\n')
    .slice(0, -1)
    .filter((path) => {
      // https://github.com/Wakayama-SocSEL/Matsuda/blob/c5e848e83c3dd1bca0738f1d521793f3bad92821/runner-proposal/src/proposal.ts#L11C1-L18C2
      return (
        /(test|spec)/.test(path) &&
        /\.(ts|js)$/.test(path) &&
        !path.endsWith('.d.ts')
      );
    })
    .map((path) => `${repoPath}/${path}`);

  return paths;
}
