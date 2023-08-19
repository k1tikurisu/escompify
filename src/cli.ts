import yargs, { Arguments } from 'yargs';
import { hideBin } from 'yargs/helpers';

export type YargsArgs = {
  s: string;
  d: string;
} & Arguments;

export function cli(argv: string[]) {
  return yargs(hideBin(argv))
    .scriptName('escompify')
    .options({
      s: {
        describe: 'Source file path',
        demandOption: true,
        type: 'string',
        alias: 'src',
        normalize: true
      },
      d: {
        describe: 'Destination file path',
        demandOption: true,
        type: 'string',
        alias: 'dst',
        normalize: true
      }
    })
    .usage('Usage: $0 -s [path] -d [path]')
    .demandOption(['s', 'd'])
    .version()
    .alias('v', 'version')
    .help()
    .alias('h', 'help')
    .parseSync();
}
