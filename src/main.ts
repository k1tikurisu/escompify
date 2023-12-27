import { cli } from '@/cli';
import { handler } from '@/handler';

async function main() {
  const argv = cli(process.argv);

  const result = await handler(argv);

  const hasPotentialBreaking =
    result.isInserted ||
    result.isDeleted ||
    result.isExpectChanged ||
    result.isAssertionInserted;

  const output = {
    hasPotentialBreaking,
    isInserted: result.isInserted,
    isDeleted: result.isDeleted,
    isExpectChanged: result.isExpectChanged,
    isAssertionInserted: result.isAssertionInserted
  };

  console.log(JSON.stringify(output));
}

main().catch((e) => {
  console.error(e);
});
