import { readFileSync } from 'fs';
import path from 'path';
import { Node } from 'estree';

export const loadAst = (filepath: string): Node => {
  const content = readFileSync(
    path.resolve(__dirname, `/works/tests/resources/${filepath}/src.json`),
    'utf-8'
  );
  return JSON.parse(content);
};
