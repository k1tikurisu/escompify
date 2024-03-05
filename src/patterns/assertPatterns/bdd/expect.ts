import { NodePath } from '@babel/traverse';
import { Expression, ExpressionStatement, isCallExpression, isIdentifier } from '@babel/types';

type LocType = {
  start: number | null;
  end: number | null;
};

/**
 * 下記の２種類の入力値と期待値を抽出する
 * expect(sum(1, 2)).to.be.a('number').equal(3); // expect関数にメソッドチェーンで振る舞いを記述する
 * expect(sum(1, 2), 'to be', 3);  // expectの引数に振る舞いを記述する
 */
export function extractExpectPattern(path: NodePath<ExpressionStatement>, expression: Expression) {
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

    // expect(sum(1, 2), 'to be', 3);のパターン
    if (isIdentifier(callee, { name: 'expect' }) && args.length >= 2) {
      actual.start = args[0]?.start ?? null;
      actual.end = args[0]?.end ?? null;
      expected.start = args[1]?.start ?? null;
      expected.end = args.at(-1)?.end ?? null;
    } else {
      // expect(sum(1, 2)).to.be.a('number').equal(3);のパターン
      path.scope.traverse(expression, {
        MemberExpression(path) {
          const memberObject = path.node.object;

          if (
            !isCallExpression(memberObject) ||
            !isIdentifier(memberObject.callee, { name: 'expect' })
          )
            return;

          actual.start = memberObject.arguments[0]?.start ?? null;
          actual.end = memberObject.arguments[memberObject.arguments.length - 1]?.end ?? null;
          expected.start = actual.end && actual.end + 1;
          const expectedEnd = args.at(-1)?.end;
          expected.end = expectedEnd ? expectedEnd + 1 : null;
        },
      });
    }
  }

  return { actual, expected };
}
