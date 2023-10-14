import { ActionType } from '@/gumtree';
import { TestCodeRangeType, isTestCode } from '@/patterns/';

export function isTestInsertedWithinTest(
  actions: ActionType[],
  testCodeRanges: TestCodeRangeType[]
) {
  let foundTestCodeInserted = false;

  for (const action of actions) {
    if (action.type !== 'insert-tree' || !action.dst.path) {
      continue;
    }

    action.dst.path.traverse({
      CallExpression(path) {
        if (isTestCode(path)) {
          if (path.node.start && path.node.end) {
            for (const { start, end } of testCodeRanges) {
              if (start < path.node.start && path.node.end < end) {
                foundTestCodeInserted = true;
                path.stop();
              }
            }
          }
          // テストスイートごと追加された場合、中のテストケースは探索しない
          path.stop();
        }
      }
    });
  }

  return foundTestCodeInserted;
}
