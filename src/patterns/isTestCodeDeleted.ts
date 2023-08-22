import { ActionType } from '@/services/gumtree';
import { isTestCode } from '@/utils/patterns';
import { simple } from 'acorn-walk';

export function isTestCodeDeleted(action: ActionType) {
  try {
    if (action.action === 'delete-tree') {
      simple(action.src.node, {
        CallExpression(node) {
          if (isTestCode(node)) {
            // stop the walk (https://github.com/acornjs/acorn/issues/625)
            throw true;
          }
        }
      });
    }
  } catch {
    return true;
  }

  return false;
}
