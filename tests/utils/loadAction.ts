import { readFileSync } from 'fs';
import path from 'path';
import { ActionType } from '../../src/services/gumtree';

export const loadAction = (filepath: string): ActionType[] => {
  const content = readFileSync(
    path.resolve(__dirname, `/works/tests/resources/${filepath}/action.json`),
    'utf-8'
  );
  return JSON.parse(content);
};
