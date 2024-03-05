import { isTestCode } from '@/patterns';
import traverse from '@babel/traverse';
import { Node } from '@babel/types';

export type TestCodeRangeType = {
  start: number;
  end: number;
};

export function findTestCodeRange(node: Node) {
  const testCodeRanges: TestCodeRangeType[] = [];

  traverse(node, {
    CallExpression(path) {
      if (isTestCode(path) && path.node.start && path.node.end) {
        testCodeRanges.push({ start: path.node.start, end: path.node.end });
      }
    },
  });

  return testCodeRanges;
}
