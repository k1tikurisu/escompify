import { existsSync, readFileSync } from 'fs';

export function mergeFileIfExists(filePaths: string[]): string {
  const fileContents = filePaths
    .filter((filePath) => existsSync(filePath))
    .map((filePath) => readFileSync(filePath, 'utf8'));

  const mergedContents = fileContents.join('\n');

  return mergedContents;
}
