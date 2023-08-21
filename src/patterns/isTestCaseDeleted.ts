import { ActionType } from '@/services/gumtree';
import { isTestCase } from '@/utils/patterns';

export function isTestCaseDeleted(action: ActionType) {
  if (action.action === 'delete-tree') {
    return isTestCase(action.src.node);
  }

  return false;
}
