import { ActionType } from '@/gumtree';
import { ActualAndExpectsType } from '@/patterns';

export function isExpectedChanged(
  actions: ActionType[],
  actualAndExpectedList: ActualAndExpectsType[]
) {
  const changeExpectedSet = new Set<string>();
  const changeActualSet = new Set<string>();

  for (const action of actions) {
    if (action.type !== 'update-node' || !action.src.path) {
      continue;
    }

    const { start, end } = action.src.path.node;

    if (!start || !end) {
      continue;
    }

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
