import { ActionType } from '@/services/gumtree';
import { Node } from '@babel/core';
import {
  isExpectedValueChanged,
  isTestCodeDeleted,
  isTestCodeExtension
} from '@/patterns/';

export function isBreaking(
  actions: ActionType[],
  srcAst: Node,
  importedModules: string[]
) {
  for (const action of actions) {
    if (isTestCodeDeleted(action)) return true;
    if (isTestCodeExtension(action, importedModules)) return true;
    if (isExpectedValueChanged(action, srcAst)) return true;
  }

  return false;
}
