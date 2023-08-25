import { cli } from '@/cli';
import { handler } from '@/handler';

async function main() {
  const argv = cli(process.argv);

  const isBreaking = await handler(argv);

  console.log('isBreaking: ' + isBreaking);
}

main().catch((e) => {
  console.error(e);
});
