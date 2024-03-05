import { ActionType } from '@/gumtree';
import { isIdentifier } from '@babel/types';

export function isAssertionInserted(action: ActionType) {
  let foundAssertion = false;

  if (action.type === 'insert-tree' && !!action.dst.path) {
    action.dst.path.traverse({
      CallExpression(path) {
        const callee = path.node.callee;

        if (isIdentifier(callee)) {
          const name = callee.name;

          if (name === 'expect' || name === 'assert' || name === 'test' || name === 't') {
            foundAssertion = true;
          }
        }
      },
    });
  }

  return foundAssertion;
}
