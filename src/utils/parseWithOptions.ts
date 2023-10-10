import { ParseResult, parse } from '@babel/parser';
import { File } from '@babel/types';

// jsparserにschemaを合わせる
export function parseWithOptions(code: string): ParseResult<File> {
  try {
    return parse(code, {
      sourceType: 'module',
      plugins: ['estree']
    });
  } catch {
    return parse(code, {
      sourceType: 'module',
      plugins: ['estree', 'typescript']
    });
  }
}
