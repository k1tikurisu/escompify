import { generateActions } from '../../src/gumtree';

export async function loadAction(srcCode: string, dstCode: string) {
  const output = await generateActions(srcCode, dstCode);
  console.log(output);

  return output ?? [];
}
