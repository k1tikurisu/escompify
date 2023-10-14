import { generateActions } from '@/gumtree';
import {
  findTestCodeRange,
  isTestInsertedWithinTest
} from '../../src/patterns';
import { parseWithOptions } from '@/utils';

describe('isTestCodeInserted', () => {
  it('should return true when inserting test code into test code', async () => {
    const srcCode = `
    describe('sum', function () {
      it('adds 1 + 2 to equal 3', function () {
        expect(sum(1, 2)).toBe(3);
      });
    });
    `;
    const dstCode = `
    describe('sum', function () {
      it('adds 1 + 2 to equal 3', function () {
        expect(sum(1, 2)).toBe(3);
      });
      it('adds 2 - 1 to equal 1', function () {
        expect(sum(2, -1)).toBe(1);
      });
    });
    `;

    const actions = await generateActions(srcCode, dstCode);
    const ast = parseWithOptions(dstCode);
    const testCodeRanges = findTestCodeRange(ast);

    expect(isTestInsertedWithinTest(actions ?? [], testCodeRanges)).toBe(true);
  });

  it('should return false for a test code inserted', async () => {
    const srcCode = ``;
    const dstCode = `
    describe('sum', function () {
      it('adds 1 + 2 to equal 3', function () {
        expect(sum(1, 2)).toBe(3);
      });
    });
    `;

    const actions = await generateActions(srcCode, dstCode);
    const ast = parseWithOptions(dstCode);
    const testCodeRanges = findTestCodeRange(ast);

    expect(isTestInsertedWithinTest(actions ?? [], testCodeRanges)).toBe(false);
  });
});
