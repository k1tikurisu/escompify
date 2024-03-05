import { ActionType } from '@/gumtree';
import { isTestCode } from '@/patterns';

export function isTestCodeDeleted(action: ActionType) {
  let foundTestCode = false;

  if (action.type === 'delete-tree' && !!action.src.path) {
    action.src.path.traverse({
      CallExpression(path) {
        if (isTestCode(path)) {
          foundTestCode = true;
          path.stop();
        }
      },
    });
  }

  return foundTestCode;
}
