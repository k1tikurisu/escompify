import { cli } from '@/cli';
import { handler } from '@/handler';

async function main() {
  const argv = cli(process.argv);

  const result = await handler(argv);

  const isBreaking =
    result.isInserted || result.isDeleted || result.isExpectChanged;

  console.log(
    `isBeraking: ${isBreaking}\nisInserted: ${result.isInserted}\nisDeleted: ${result.isDeleted}\nisExpectChanged: ${result.isExpectChanged}`
  );
}

main().catch((e) => {
  console.error(e);
});
