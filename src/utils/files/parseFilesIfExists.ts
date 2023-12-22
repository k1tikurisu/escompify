import { existsSync, readFileSync } from 'fs';
import { parseWithOptions } from '@/utils/parseWithOptions';
import { Node, Statement } from '@babel/types';

export function parseFilesIfExists(filePaths: string[]) {
  let length = 0;
  const astBodies: Array<Statement> = [];
  let mergedCode = '';

  for (const filepath of filePaths) {
    if (!existsSync(filepath)) continue;

    const code = readFileSync(filepath).toString();

    // length分空白を追加してASTのstartとendの位置をずらす
    const ast = parseWithOptions(' '.repeat(length) + code);

    length += code.length;
    mergedCode += code;

    astBodies.push(...ast.program.body);
  }

  const mergedAst = {
    type: 'File',
    start: 0,
    end: length,
    program: {
      type: 'Program',
      start: 0,
      end: length,
      sourceType: 'module',
      interpreter: null,
      body: astBodies
    }
  } as unknown as Node;

  return { ast: mergedAst, code: mergedCode };
}
