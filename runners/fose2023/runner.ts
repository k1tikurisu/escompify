import { readFileSync, writeFileSync } from 'fs';
import { run } from '../../src/utils/run';

async function main() {
  const datasets = readJson<ProposalResult[]>(
    readFileSync('/works/datasets/proposal_result.json', 'utf-8')
  );

  const result: FoseResult = {
    tp: 0,
    tn: 0,
    fp: 0,
    fn: 0,
    errors: 0,
    result: [],
  };

  for (let i = 0; i < datasets.length; i++) {
    const dataset = datasets[i];

    result.result[i] = {
      ...result.result[i],
      path: `/works/repos/${dataset.nameWithOwner}`,
      srcHash: dataset.prev.hash,
      dstHash: dataset.updated.hash,
      isBreaking: dataset.state === 'failure',
      matsudaPrediction: dataset.isBreaking,
    };

    try {
      const output = readJson<EscompifyType>(
        await run(
          `escompify -p /works/repos/${dataset.nameWithOwner} -s ${dataset.prev.hash} -d ${dataset.updated.hash}`
        )
      );

      result.result[i] = {
        ...result.result[i],
        stats: output,
        error: false,
      };
    } catch (e) {
      result.errors++;
      result.result[i] = {
        ...result.result[i],
        stats: null,
        error: true,
      };
      console.error(e);
    }
  }

  writeFileSync('/works/outputs/fose2023.json', JSON.stringify(result));
}

main().catch((e) => {
  console.error(e);
});

function readJson<T>(str: string): T {
  const json = JSON.parse(str);
  return json;
}

type FoseResult = {
  tp: number;
  tn: number;
  fp: number;
  fn: number;
  errors: number;
  result: Array<{
    path: string;
    srcHash: string;
    dstHash: string;
    matsudaPrediction: boolean;
    isBreaking: boolean;
    error: boolean;
    stats: EscompifyType | null;
  }>;
};

type EscompifyType = {
  isInserted: boolean;
  isDeleted: boolean;
  isExpectChanged: boolean;
  hasPotentialBreaking: boolean;
};

type Revision = {
  version: string;
  hash: string;
};

type ProposalResult = {
  nameWithOwner: string;
  state: 'failure' | 'success';
  updated: Revision;
  prev: Revision;
  isBreaking: boolean;
};
