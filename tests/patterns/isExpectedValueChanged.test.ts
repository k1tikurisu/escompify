import { isExpectedValueChanged } from '../../src/patterns';
import { loadAction, loadAst } from '../utils';

describe('isExpectedValueChanged', () => {
  it('should return true for a changed expected value', async () => {
    const actions = loadAction('expectedValueChanged');
    const ast = loadAst('expectedValueChanged');
    const isChanged = actions.some((action) =>
      isExpectedValueChanged(ast, action)
    );

    expect(isChanged).toBe(true);
  });
  it('should return false when both the expected and input values are changed', async () => {
    const actions = loadAction('inputValueChanged');
    const ast = loadAst('inputValueChanged');
    const isChanged = actions.some((action) =>
      isExpectedValueChanged(ast, action)
    );

    expect(isChanged).toBe(false);
  });
});
