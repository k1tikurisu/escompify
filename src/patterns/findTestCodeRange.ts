import { Node } from '@babel/types';
import traverse from '@babel/traverse';
import { isTestCode } from '@/patterns';

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
    }
  });

  return testCodeRanges;
}
