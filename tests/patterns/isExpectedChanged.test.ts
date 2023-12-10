import { generateActions } from '@/gumtree';
import { findActualAndExpects, isExpectedChanged } from '../../src/patterns';
import { parseWithOptions } from '@/utils';

describe('isExpectedChanged', () => {
  it('should return true for a changed expected', async () => {
    const srcCode = `
      describe('sum', function () {
        it('adds 1 + 2 to equal 3', function () {
          expect(sum(1, 2)).toBe(3);
        });
      });
    `;
    const dstCode = `
    describe('sum', function () {
      it('adds 1 + 2 to equal 5', function () {
        expect(sum(1, 2)).toBe(5);
      });
    });
    `;

    const actions = await generateActions(srcCode, dstCode);
    const ast = parseWithOptions(srcCode);
    const actualAndExpects = findActualAndExpects(ast, srcCode);

    expect(isExpectedChanged(actions ?? [], actualAndExpects)).toBe(true);
  });

  it('should return false when both the expected and actual are changed', async () => {
    const srcCode = `
    describe('sum', function () {
      it('adds 1 + 2 to equal 3', function () {
        expect(3).toBe(3);
      });
    });
    `;
    const dstCode = `
    describe('sum', function () {
      it('adds 2 + 3 to equal 5', function () {
        expect(5).toBe(5);
      });
    });
    `;

    const actions = await generateActions(srcCode, dstCode);
    const ast = parseWithOptions(srcCode);
    const actualAndExpects = findActualAndExpects(ast, srcCode);

    expect(isExpectedChanged(actions ?? [], actualAndExpects)).toBe(false);
  });
});
