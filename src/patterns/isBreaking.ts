import {
  findImportedModules,
  isExpectedValueChanged,
  isTestCodeDeleted,
  isTestCodeExtension
} from '@/patterns/';
import { GumTree } from '@/__generated__/client';

export function isBreaking(data: GumTree) {
  const srcAst = JSON.parse(data.srcAst);
  const actions = JSON.parse(data.actions);
  const importedModules = findImportedModules(srcAst);

  for (const action of actions) {
    if (isTestCodeDeleted(action)) return true;
    if (isTestCodeExtension(action, importedModules)) return true;
    if (isExpectedValueChanged(action, srcAst)) return true;
  }

  return false;
}
