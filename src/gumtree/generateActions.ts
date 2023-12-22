import { runGumTree, getTree } from '@/gumtree';
import { NodePath } from '@babel/traverse';
import { Node } from '@babel/types';

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
  ast: Node;
};

export async function generateActions(srcAst: Node, dstAst: Node) {
  try {
    const output = await runGumTree(
      JSON.stringify(srcAst),
      JSON.stringify(dstAst)
    );
    if (!output) throw Error('Error at runGumTree');

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
