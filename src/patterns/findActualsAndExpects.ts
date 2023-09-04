import traverse, { Node, NodePath } from '@babel/traverse';
import {
  ExpressionStatement,
  Expression,
  isCallExpression,
  isIdentifier,
  isMemberExpression
} from '@babel/types';

export type ActualAndExpectsType = {
  actual: {
    code: string;
    start: number;
    end: number;
  };
  expected: {
    code: string;
    start: number;
    end: number;
  };
};

type LocType = {
  start: number | null;
  end: number | null;
};

export function findActualsAndExpects(node: Node, code: string) {
  const actualsAndExpects: ActualAndExpectsType[] = [];

  traverse(node, {
    ExpressionStatement(path) {
      const { expression } = path.node;
      const { actual, expected } = extractActualAndExpected(path, expression);

      if (actual.start && actual.end && expected.start && expected.end) {
        actualsAndExpects.push({
          actual: {
            code: code.slice(actual.start, actual.end),
            start: actual.start,
            end: actual.end
          },
          expected: {
            code: code.slice(expected.start, expected.end),
            start: expected.start,
            end: expected.end
          }
        });
      }
    }
  });

  return actualsAndExpects;
}

function extractActualAndExpected(
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
    const { arguments: args, callee } = expression;

    if (isIdentifier(callee, { name: 'expect' }) && args.length >= 2) {
      actual.start = args[0]?.start ?? null;
      actual.end = args[0]?.end ?? null;
      expected.start = args[1]?.start ?? null;
      expected.end = args.at(-1)?.end ?? null;
    } else if (
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
    } else {
      path.scope.traverse(expression, {
        MemberExpression(path) {
          const memberObject = path.node.object;
          const memberProperty = path.node.property;

          if (
            isCallExpression(memberObject) &&
            isIdentifier(memberObject.callee, { name: 'expect' })
          ) {
            actual.start = memberObject.arguments[0]?.start ?? null;
            actual.end =
              memberObject.arguments[memberObject.arguments.length - 1]?.end ??
              null;
            expected.start = actual.end && actual.end + 1;
            const expectedEnd = args.at(-1)?.end;
            expected.end = expectedEnd ? expectedEnd + 1 : null;
          } else if (isIdentifier(memberProperty, { name: 'should' })) {
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
  }

  return { actual, expected };
}
