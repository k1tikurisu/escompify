import { readFileSync } from 'fs';
import path from 'path';

export const loadCode = (filepath: string) => {
  const content = readFileSync(
    path.resolve(__dirname, `/works/tests/resources/${filepath}`),
    'utf-8'
  );
  return content;
};
