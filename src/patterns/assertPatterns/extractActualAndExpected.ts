import { NodePath } from '@babel/traverse';
import { Expression, ExpressionStatement } from '@babel/types';
import { extractExpectPattern } from './bdd/expect';
import { extractShouldPattern } from './bdd/should';
import { extractAssertPattern } from './tdd/assert';

type LocType = {
  start: number | null;
  end: number | null;
};

export function extractActualAndExpected(
  path: NodePath<ExpressionStatement>,
  expression: Expression
) {
  const expectPattern = extractExpectPattern(path, expression);
  if (isExtracted(expectPattern)) {
    return expectPattern;
  }

  const shouldPattern = extractShouldPattern(path, expression);
  if (isExtracted(shouldPattern)) {
    return shouldPattern;
  }

  const assertPattern = extractAssertPattern(expression);
  if (isExtracted(assertPattern)) {
    return assertPattern;
  }

  return { actual: null, expected: null };
}

function isExtracted({
  actual,
  expected,
}: {
  actual: LocType | null;
  expected: LocType | null;
}) {
  if (!actual || !expected) return false;
  return actual.start && actual.end && expected.start && expected.end;
}
