import simpleGit from 'simple-git';

export async function checkout(repoPath: string, hash: string) {
  const git = simpleGit(repoPath);
  await git.checkout(hash);
}
