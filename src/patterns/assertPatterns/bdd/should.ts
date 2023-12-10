import { NodePath } from '@babel/traverse';
import {
  Expression,
  ExpressionStatement,
  isCallExpression,
  isIdentifier,
  isMemberExpression
} from '@babel/types';

type LocType = {
  start: number | null;
  end: number | null;
};

/**
 * 下記のパターンの入力値と期待値を抽出する
 * sum(1,2).should.be.a('number').equal(3); // 入力にshouldプロパティを生やして，メソッドチェーンで振る舞いを記述する
 */
export function extractShouldPattern(
  path: NodePath<ExpressionStatement>,
  expression: Expression
) {
  const actual: LocType = {
    start: null,
    end: null
  };
  const expected: LocType = {
    start: null,
    end: null
  };

  if (isCallExpression(expression)) {
    const { arguments: args } = expression;

    path.scope.traverse(expression, {
      MemberExpression(path) {
        const memberObject = path.node.object;
        const memberProperty = path.node.property;

        if (isIdentifier(memberProperty, { name: 'should' })) {
          actual.start = memberObject.start ?? null;
          actual.end = memberObject.end ?? null;

          if (isMemberExpression(path.parent)) {
            expected.start = path.parent.property.start ?? null;
            const expectedEnd = args.at(-1)?.end;
            expected.end = expectedEnd ? expectedEnd + 1 : null;
          }
        }
      }
    });
  }

  return { actual, expected };
}
