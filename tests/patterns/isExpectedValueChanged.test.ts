import { isExpectedValueChanged } from '../../src/patterns';
import { loadAction } from '../utils';

describe('isExpectedValueChanged', () => {
  it('should return true for a changed expected value', async () => {
    const actions = loadAction('expectedValueChanged');
    const isChanged = actions.some((action) => isExpectedValueChanged(action));

    expect(isChanged).toBe(true);
  });
  it('should return false when both the expected and input values are changed', async () => {
    const actions = loadAction('inputValueChanged');
    const isChanged = actions.some((action) => isExpectedValueChanged(action));

    expect(isChanged).toBe(false);
  });
});
