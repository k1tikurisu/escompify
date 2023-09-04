import { loadAction, loadAst } from '../utils';
import {
  findTestCodeRange,
  isTestInsertedWithinTest
} from '../../src/patterns';

describe('isTestCodeInserted', () => {
  it('should return true when inserting test code into test code', async () => {
    const actions = loadAction('nestedTestCodeInserted');
    const ast = loadAst('nestedTestCodeInserted/dst.json');
    const testCodeRanges = findTestCodeRange(ast);

    expect(isTestInsertedWithinTest(actions, testCodeRanges)).toBe(true);
  });

  it('should return false for a test code inserted', async () => {
    const actions = loadAction('testCodeInserted');
    const ast = loadAst('testCodeInserted/dst.json');
    const testCodeRanges = findTestCodeRange(ast);

    expect(isTestInsertedWithinTest(actions, testCodeRanges)).toBe(false);
  });
});
