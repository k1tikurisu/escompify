import { cli } from '@/cli';
import { handler } from '@/handler';

async function main() {
  const argv = cli(process.argv);

  const result = await handler(argv);

  const hasPotentialBreaking =
    result.isInserted || result.isDeleted || result.isExpectChanged;

  const output = {
    hasPotentialBreaking,
    isInserted: result.isInserted,
    isDeleted: result.isDeleted,
    isExpectChanged: result.isExpectChanged
  };

  console.log(JSON.stringify(output));
}

main().catch((e) => {
  console.error(e);
});
