import { NodePath, type types as t } from '@babel/core';

export function isTestCaseCallExpression(path: NodePath<t.CallExpression>) {
  if (path.node.callee.type === 'Identifier') {
    const [arg1, arg2] = path.node.arguments;
    const calleeName = path.node.callee.name;

    const isTestCase =
      (calleeName === 'it' || calleeName === 'test') &&
      !!arg1 &&
      !!arg2 &&
      arg1.type === 'StringLiteral' &&
      (arg2.type === 'FunctionExpression' ||
        arg2.type === 'ArrowFunctionExpression');

    return isTestCase;
  }

  return false;
}
