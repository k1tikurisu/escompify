import { readFileSync } from 'fs';
import path from 'path';
import { Node } from '@babel/types';

export const loadAst = (filepath: string): Node => {
  const content = readFileSync(
    path.resolve(__dirname, `/works/tests/resources/${filepath}`),
    'utf-8'
  );
  return JSON.parse(content);
};
