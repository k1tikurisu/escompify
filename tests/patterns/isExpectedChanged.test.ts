import { loadAction, loadAst, loadCode } from '../utils';
import { findActualsAndExpects, isExpectedChanged } from '../../src/patterns';

describe('isExpectedChanged', () => {
  it('should return true for a changed expected', async () => {
    const actions = loadAction('expectedChanged');
    const ast = loadAst('expectedChanged');
    const code = loadCode('expectedChanged/src.js');
    const actualsAndExpects = findActualsAndExpects(ast, code);

    expect(isExpectedChanged(actions, actualsAndExpects)).toBe(true);
  });

  it('should return false when both the expected and actual are changed', async () => {
    const actions = loadAction('actualChanged');
    const ast = loadAst('actualChanged');
    const code = loadCode('actualChanged/src.js');
    const actualsAndExpects = findActualsAndExpects(ast, code);

    expect(isExpectedChanged(actions, actualsAndExpects)).toBe(false);
  });
});
