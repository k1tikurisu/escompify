import { ActionType } from '@/services/gumtree';
import { isTestCode } from '@/utils/patterns';

export function isTestCodeDeleted(action: ActionType) {
  if (action.action === 'delete-tree') {
    if (action.src.node.type === 'ExpressionStatement') {
      return isTestCode(action.src.node.expression);
    }
  }

  return false;
}
