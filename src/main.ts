import { cli } from '@/cli';
import { handler } from '@/handler';

async function main() {
  const argv = cli(process.argv);

  const result = await handler(argv);

  const isBreaking =
    result.isInserted || result.isDeleted || result.isExpectChanged;

  console.log(
    `
      isBeraking: ${isBreaking}
      isInserted: ${result.isInserted}
      isDeleted: ${result.isDeleted}
      isExpectChanged: ${result.isExpectChanged}
    `
  );
}

main().catch((e) => {
  console.error(e);
});
