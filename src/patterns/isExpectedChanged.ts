import { ActionType } from '@/services/gumtree';
import { ActualAndExpectsType } from '@/patterns';

export function isExpectedChanged(
  actions: ActionType[],
  actualAndExpectedList: ActualAndExpectsType[]
) {
  const changeExpectedSet = new Set<string>();
  const changeActualSet = new Set<string>();

  for (const action of actions) {
    if (
      action.action !== 'update-node' ||
      !action.src.node.start ||
      !action.src.node.end
    ) {
      continue;
    }

    const start = action.src.node.start;
    const end = action.src.node.end;

    for (const { actual, expected } of actualAndExpectedList) {
      if (actual.start <= start && end <= actual.end) {
        if (!changeExpectedSet.delete(expected.code)) {
          changeActualSet.add(actual.code);
        }
        break;
      }

      if (expected.start <= start && end <= expected.end) {
        if (!changeActualSet.delete(actual.code)) {
          changeExpectedSet.add(expected.code);
        }
        break;
      }
    }
  }

  return changeExpectedSet.size > 0;
}
