import { ActionType } from '@/services/gumtree';
import { isTestCode } from '@/patterns';
import traverse from '@babel/traverse';
import { Node } from '@babel/types';

export function isTestCodeDeleted(action: ActionType) {
  let foundTestCode = false;

  // babelはtopレベルじゃないとtraverseを開始できないのでwrapする
  const node = {
    type: 'Program',
    body: action.src.node
  };

  if (action.action === 'delete-tree') {
    traverse(node as Node, {
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
