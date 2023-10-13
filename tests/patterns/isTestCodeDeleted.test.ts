import { generateActions } from '@/gumtree';
import { isTestCodeDeleted } from '../../src/patterns';

describe('isTestCodeDeleted', () => {
  it('should return true for a deleted test suite', async () => {
    const srcCode = `
    describe('sum', function () {
      it('adds 1 + 2 to equal 3', function () {
        expect(sum(1, 2)).toBe(3);
      });
    });
    `;
    const dstCode = ``;

    const actions = await generateActions(srcCode, dstCode);
    const isTestDeleted = (actions ?? []).some((action) =>
      isTestCodeDeleted(action)
    );

    expect(isTestDeleted).toBe(true);
  });

  it('should return true for a deleted test case', async () => {
    const srcCode = `
    describe('sum', function () {
      it('adds 1 + 2 to equal 3', function () {
        expect(sum(1, 2)).toBe(3);
      });
      it('adds 2 - 1 to equal 1', function () {
        expect(sum(2, -1)).toBe(1);
      });
    });
    `;
    const dstCode = `
    describe('sum', function () {
      it('adds 1 + 2 to equal 3', function () {
        expect(sum(1, 2)).toBe(3);
      });
    });
    `;

    const actions = await generateActions(srcCode, dstCode);
    const isTestDeleted = (actions ?? []).some((action) =>
      isTestCodeDeleted(action)
    );

    expect(isTestDeleted).toBe(true);
  });

  it('should return false for a changed test code', async () => {
    const srcCode = `
    describe('sum', function () {
      it('adds 1 + 2 to equal 3', function () {
        expect(sum(1, 2)).toBe(3);
      });
    });
    `;
    const dstCode = `
    describe('sum', () => {
      it('adds 2 + 3 to equal 3', () => {
        expect(sum(2, 3)).toBe(5);
      });
    });
    `;

    const actions = await generateActions(srcCode, dstCode);
    const isTestDeleted = (actions ?? []).some((action) =>
      isTestCodeDeleted(action)
    );

    expect(isTestDeleted).toBe(false);
  });
});
