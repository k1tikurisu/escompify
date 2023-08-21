import { Node } from 'estree';

export function isTestCode(node: Node) {
  if (node.type === 'ExpressionStatement') {
    const { expression } = node;

    if (
      expression.type === 'CallExpression' &&
      expression.callee.type === 'Identifier'
    ) {
      const [arg1, arg2] = expression.arguments;
      const calleeName = expression.callee.name;

      return (
        isTestFunctionName(calleeName) &&
        isLiteral(arg1) &&
        isFunctionExpression(arg2)
      );
    }
  }

  return false;
}

function isTestFunctionName(name: string) {
  const testFunctionName = ['it', 'test', 'describe'];

  return testFunctionName.includes(name);
}

function isLiteral(node: Node | undefined) {
  return !!node && node.type === 'Literal';
}

function isFunctionExpression(node: Node | undefined) {
  return (
    !!node &&
    (node.type === 'FunctionExpression' ||
      node.type === 'ArrowFunctionExpression')
  );
}
