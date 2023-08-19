import { YargsArgs } from '@/cli';
import { getAction } from '@/services/gumtree/';

export async function handler(argv: YargsArgs) {
  console.log(argv.s, argv.d);

  const res = await getAction(4);
  console.log(res.data[0]?.type);

  return {};
}
