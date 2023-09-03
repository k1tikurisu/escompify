import { ActionType } from '@/services/gumtree';
import { isTestCode } from '@/patterns';
import { traverse } from '@babel/core';

export function isTestCodeDeleted(action: ActionType) {
  let foundTestCode = false;

  if (action.action === 'delete-tree') {
    traverse(action.src.node, {
      CallExpression(path) {
        if (isTestCode(path)) {
          foundTestCode = true;
          path.stop();
        }
      }
    });
  }

  return foundTestCode;
}
