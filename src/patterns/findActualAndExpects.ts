import { extractActualAndExpected } from '@/patterns/assertPatterns/extractActualAndExpected';
import traverse, { Node } from '@babel/traverse';

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

export function findActualAndExpects(node: Node, code: string) {
  const actualAndExpects: ActualAndExpectsType[] = [];

  traverse(node, {
    ExpressionStatement(path) {
      const { expression } = path.node;

      const { actual, expected } = extractActualAndExpected(path, expression);
      if (actual && expected && actual.start && actual.end && expected.start && expected.end) {
        actualAndExpects.push({
          actual: {
            code: code.slice(actual.start, actual.end),
            start: actual.start,
            end: actual.end,
          },
          expected: {
            code: code.slice(expected.start, expected.end),
            start: expected.start,
            end: expected.end,
          },
        });
      }
    },
  });

  return actualAndExpects;
}
