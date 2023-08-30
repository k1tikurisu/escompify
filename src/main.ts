import { cli } from '@/cli';
import { handler } from '@/handler';

async function main() {
  const argv = cli(process.argv);

  await handler(argv);
}

main().catch((e) => {
  console.error(e);
});
