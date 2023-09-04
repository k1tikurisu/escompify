import { ActionType } from '@/services/gumtree';
import { TestCodeRangeType, isTestCode } from '@/patterns/';
import traverse, { Node } from '@babel/traverse';

export function isTestInsertedWithinTest(
  actions: ActionType[],
  testCodeRanges: TestCodeRangeType[]
) {
  let foundTestCodeInserted = false;

  for (const action of actions) {
    if (
      action.action !== 'insert-tree' ||
      !action.dst.node.start ||
      !action.dst.node.end
    ) {
      continue;
    }

    const node = {
      type: 'Program',
      body: action.dst.node
    };
    traverse(node as Node, {
      CallExpression(path) {
        if (isTestCode(path)) {
          if (path.node.start && path.node.end) {
            for (const { start, end } of testCodeRanges) {
              if (start <= path.node.start && path.node.end <= end) {
                foundTestCodeInserted = true;
                path.stop();
              }
            }
          }
        }
      }
    });
  }

  return foundTestCodeInserted;
}
