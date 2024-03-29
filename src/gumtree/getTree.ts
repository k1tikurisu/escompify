import traverse, { NodePath } from '@babel/traverse';
import { Node } from '@babel/types';

export function getTree(ast: Node, start: number, end: number): NodePath | undefined {
  let tree: NodePath | undefined;

  traverse(ast, {
    enter(path) {
      const { node } = path;

      if (node.start === start && node.end === end) {
        tree = path;
        path.stop();
      }
    },
  });

  return tree;
}
