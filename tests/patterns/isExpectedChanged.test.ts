import { generateActions } from '@/gumtree';
import { parseWithOptions } from '@/utils';
import { findActualAndExpects, isExpectedChanged } from '../../src/patterns';

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

    const srcAst = parseWithOptions(srcCode);
    const dstAst = parseWithOptions(dstCode);
    const actions = await generateActions(srcAst, dstAst);
    const actualAndExpects = findActualAndExpects(srcAst, srcCode);

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

    const srcAst = parseWithOptions(srcCode);
    const dstAst = parseWithOptions(dstCode);
    const actions = await generateActions(srcAst, dstAst);
    const actualAndExpects = findActualAndExpects(srcAst, srcCode);

    expect(isExpectedChanged(actions ?? [], actualAndExpects)).toBe(false);
  });
});
