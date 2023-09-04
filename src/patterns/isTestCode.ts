import { NodePath } from '@babel/traverse';
import {
  Node,
  isFunctionExpression,
  isArrowFunctionExpression,
  isIdentifier,
  isCallExpression
} from '@babel/types';

export function isTestCode(path: NodePath<Node>) {
  if (!isCallExpression(path.node)) return false;

  const {
    callee,
    arguments: [arg1, arg2]
  } = path.node;

  if (!isIdentifier(callee)) return false;

  const calleeName = callee.name;
  const testFunctionNames = ['it', 'test', 'describe'];

  return (
    testFunctionNames.includes(calleeName) &&
    isLiteral(arg1) &&
    (isFunctionExpression(arg2) || isArrowFunctionExpression(arg2))
  );
}

// estree対応
function isLiteral(node: Node | undefined) {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  if (node?.type === 'Literal') {
    return true;
  }
  return false;
}
