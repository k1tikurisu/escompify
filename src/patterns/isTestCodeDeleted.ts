import { ActionType } from '@/services/gumtree';
import { isTestCode } from '@/utils/patterns';

export function isTestCodeDeleted(action: ActionType) {
  if (action.action === 'delete-tree') {
    return isTestCode(action.src.node);
  }

  return false;
}
