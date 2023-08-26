import { NodePath, types as t } from '@babel/core';

export function isTestCode(path: NodePath<t.CallExpression>) {
  const {
    callee,
    arguments: [arg1, arg2]
  } = path.node;

  if (!t.isIdentifier(callee)) return false;

  const calleeName = callee.name;
  const testFunctionNames = ['it', 'test', 'describe'];

  return (
    testFunctionNames.includes(calleeName) &&
    t.isStringLiteral(arg1) &&
    (t.isFunctionExpression(arg2) || t.isArrowFunctionExpression(arg2))
  );
}
