import { ActionType } from '@/services/gumtree';
import { isTestCode } from '@/patterns/';
import { traverse } from '@babel/core';

export function isTestCodeExtension(action: ActionType) {
  let foundTestCode = false;

  if (action.action === 'insert-tree') {
    traverse(action.src.node, {
      CallExpression(path) {
        if (isTestCode(path, { type: 'testCase' })) {
          foundTestCode = true;
          path.stop();
        }
      }
    });
  }

  return foundTestCode;
}
