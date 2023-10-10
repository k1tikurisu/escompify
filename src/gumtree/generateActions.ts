import { runGumTree, getTree } from '@/gumtree';
import { parseWithOptions } from '@/utils';
import { NodePath } from '@babel/traverse';
import { ParseResult } from '@babel/parser';
import { File } from '@babel/types';

export type ActionType = {
  type:
    | 'match'
    | `insert-${'node' | 'tree'}`
    | `move-${'node' | 'tree'}`
    | `update-${'node' | 'tree'}`
    | `delete-${'node' | 'tree'}`;
  src: ActionDetailsType;
  dst: ActionDetailsType;
};

type ActionDetailsType = {
  path: NodePath | null | undefined;
  ast: ParseResult<File>;
};

export async function generateActions(srcCode: string, dstCode: string) {
  try {
    const output = await runGumTree(srcCode, dstCode);
    if (!output) throw Error('Error at runGumTree');

    const srcAst = parseWithOptions(srcCode);
    const dstAst = parseWithOptions(dstCode);

    if (output.actions.length === 0) return [];

    const actions: ActionType[] = [];
    for (const action of output.actions) {
      const loc = action.tree.match(/\[(\d+),(\d+)\]/);

      if (!loc || !loc[1] || !loc[2]) {
        throw Error('Error at generateActions: loc is undefined');
      }

      const [start, end] = [parseInt(loc[1]), parseInt(loc[2])];

      const actionWithAst: ActionType = {
        type: action.action,
        src: {
          ast: srcAst,
          path: action.action.startsWith('insert')
            ? null
            : getTree(srcAst, start, end)
        },
        dst: {
          ast: dstAst,
          path: action.action.startsWith('insert')
            ? getTree(dstAst, start, end)
            : null
        }
      };

      actions.push(actionWithAst);
    }
    return actions;
  } catch (error) {
    console.error(`Error at generateActions: ${error}`);
  }
}
