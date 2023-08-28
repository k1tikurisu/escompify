import { NodePath, types as t } from '@babel/core';

export type ActualAndExpectedType = {
  actuals: string[];
  expects: string[][];
};

export function findActualAndExpected(_path: NodePath<t.Node>) {
  const actualsAndExpects: ActualAndExpectedType = { actuals: [], expects: [] };

  // TODO: 入力値と期待値を見つけるコード

  return { actualsAndExpects };
}
