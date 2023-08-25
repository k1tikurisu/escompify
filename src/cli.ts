import yargs, { Arguments } from 'yargs';
import { hideBin } from 'yargs/helpers';

export type MyArgs = {
  path: string;
  srcHash: string;
  dstHash: string;
} & Arguments;

export function cli(argv: string[]) {
  return yargs(hideBin(argv))
    .scriptName('escompify')
    .options({
      path: {
        describe: 'repo path',
        demandOption: true,
        type: 'string',
        normalize: true,
        alias: 'p'
      },
      srcHash: {
        describe: 'src hash',
        demandOption: true,
        type: 'string',
        alias: 's'
      },
      dstHash: {
        describe: 'dst hash',
        demandOption: true,
        type: 'string',
        alias: 'd'
      }
    })
    .usage('Usage: $0 -p [path] -s [hash] -d [hash]')
    .demandOption(['p', 's', 'd'])
    .version()
    .alias('v', 'version')
    .help()
    .alias('h', 'help')
    .parseSync();
}
