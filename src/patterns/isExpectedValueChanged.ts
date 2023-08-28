import { ActionType } from '@/services/gumtree';
import { Node, traverse } from '@babel/core';

export function isExpectedValueChanged(action: ActionType, srcNode: Node) {
  let foundExpectedValueChanged = false;

  if (action.action === 'update-node') {
    traverse(srcNode, {
      enter(path) {
        if (path) {
          foundExpectedValueChanged = true;
          path.stop();
        }
      }
    });
  }

  return foundExpectedValueChanged;
}
