import { NodePath } from '@babel/traverse';
import {
  Node,
  isFunctionExpression,
  isArrowFunctionExpression,
  isIdentifier,
  isCallExpression
} from '@babel/types';

type OptionsType = {
  type: 'testCase';
};

export function isTestCode(path: NodePath<Node>, options?: OptionsType) {
  if (!isCallExpression(path.node)) return false;

  const {
    callee,
    arguments: [arg1, arg2]
  } = path.node;

  if (!isIdentifier(callee)) return false;

  const calleeName = callee.name;
  const testFunctionNames =
    options?.type === 'testCase' ? ['it', 'test'] : ['it', 'test', 'describe'];

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
