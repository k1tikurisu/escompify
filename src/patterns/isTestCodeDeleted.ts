import { ActionType } from '@/services/gumtree';
import { isTestCode } from '@/utils/patterns';
import { simple } from 'acorn-walk';
import { Node } from 'estree';
import acorn from 'acorn';

export function isTestCodeDeleted(action: ActionType) {
  try {
    if (action.action === 'delete-tree') {
      simple(action.src.node as acorn.Node, {
        CallExpression(node) {
          if (isTestCode(node as Node)) {
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
