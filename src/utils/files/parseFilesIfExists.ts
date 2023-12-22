import { existsSync, readFileSync } from 'fs';
import { parseWithOptions } from '@/utils/parseWithOptions';
import { Node, Statement } from '@babel/types';

export function parseFilesIfExists(filePaths: string[]) {
  let length = 0;
  const astBodies: Array<Statement> = [];
  let mergedCode = '';

  for (const filepath of filePaths) {
    if (!existsSync(filepath)) continue;

    // ファイル単位でASTに変換する際にposを合わせる
    const code = ' '.repeat(length) + readFileSync(filepath);
    length += code.length;
    mergedCode += code;

    const ast = parseWithOptions(code);
    astBodies.push(...ast.program.body);
  }

  const mergedAst = {
    type: 'Program',
    start: 0,
    end: length,
    sourceType: 'module',
    interpreter: null,
    body: astBodies
  } as unknown as Node;

  return { ast: mergedAst, code: mergedCode };
}
