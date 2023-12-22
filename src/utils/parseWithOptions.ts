import { ParseResult, parse } from '@babel/parser';
import { File } from '@babel/types';

// jsparserにschemaを合わせる
export function parseWithOptions(code: string): ParseResult<File> {
  return parse(code, {
    sourceType: 'module',
    plugins: ['estree', 'typescript']
  });
}
