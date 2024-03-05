import { Expression, isCallExpression, isIdentifier, isMemberExpression } from '@babel/types';

type LocType = {
  start: number | null;
  end: number | null;
};

/**
 * 下記のパターンの入力値と期待値を抽出する
 * assert.equal(foo, 'bar'); // assertオブジェクトを使用
 * it('label', function (t) {  // コールバック引数にアサーションAPIをはやしてるパターン
 *   t.is(foo, 'bar');
 *   t.true(foo);
 * })
 */
export function extractAssertPattern(expression: Expression) {
  const actual: LocType = {
    start: null,
    end: null,
  };
  const expected: LocType = {
    start: null,
    end: null,
  };

  if (isCallExpression(expression)) {
    const { arguments: args, callee } = expression;

    if (
      isMemberExpression(callee) &&
      isIdentifier(callee.object) &&
      (callee.object.name === 'assert' || callee.object.name === 't')
    ) {
      if (args.length === 1) {
        actual.start = args[0]?.start ?? null;
        actual.end = args[0]?.end ?? null;
        expected.start = callee.property.start ?? null;
        expected.end = callee.property.end ?? null;
      } else if (args.length === 2) {
        actual.start = args[0]?.start ?? null;
        actual.end = args[0]?.end ?? null;
        expected.start = args[1]?.start ?? null;
        expected.end = args[1]?.end ?? null;
      }
    }
  }

  return { actual, expected };
}
