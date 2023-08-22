import { loadAction } from '../utils';
import { isTestCodeDeleted } from '../../src/patterns';

describe('isTestCodeDeleted', () => {
  it('should return true for a deleted test suite', async () => {
    const actions = loadAction('testSuiteDeleted');
    const isTestDeleted = actions.some((action) => isTestCodeDeleted(action));

    expect(isTestDeleted).toBe(true);
  });

  it('should return true for a deleted test case', async () => {
    const actions = loadAction('testCaseDeleted');
    const isTestDeleted = actions.some((action) => isTestCodeDeleted(action));

    expect(isTestDeleted).toBe(true);
  });

  it('should return false for a changed test code', async () => {
    const actions = loadAction('testCodeChanged');
    const isTestDeleted = actions.some((action) => isTestCodeDeleted(action));

    expect(isTestDeleted).toBe(false);
  });

  it('should return false for a moved test code', async () => {
    const actions = loadAction('testCodeMoved');
    const isTestDeleted = actions.some((action) => isTestCodeDeleted(action));

    expect(isTestDeleted).toBe(false);
  });
});
