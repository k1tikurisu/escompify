import { ActionType } from '@/services/gumtree';
import { findActualAndExpected, isTestCode } from '@/utils/patterns/';
import { traverse } from '@babel/core';

export function isTestCodeExtension(
  action: ActionType,
  importedModules: string[]
) {
  let foundTestCodeExtension = false;

  if (action.action === 'insert-tree') {
    traverse(action.src.node, {
      CallExpression(path) {
        if (!isTestCode(path)) {
          path.skip();
        }
        const { actualsAndExpects } = findActualAndExpected(path);

        if (
          actualsAndExpects.actuals.find((actual) =>
            importedModules.includes(actual)
          )
        ) {
          foundTestCodeExtension = true;
          path.stop();
        }
      }
    });
  }

  return foundTestCodeExtension;
}
