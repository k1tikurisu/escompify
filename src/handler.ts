import { YargsArgs } from '@/cli';

export async function handler(argv: YargsArgs) {
  console.log(argv.s, argv.d);

  return {};
}
