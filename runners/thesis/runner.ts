import { existsSync, readFileSync, writeFileSync } from 'fs';
import { run } from '../../src/utils/run';

async function main() {
  const datasets = readJson<ProposalResult[]>(
    readFileSync('/works/datasets/proposal_result.json', 'utf-8')
  );

  const result: ThesisResult = {
    matrix: {
      thesis: {
        tp: 0,
        tn: 0,
        fp: 0,
        fn: 0
      },
      matsuda: {
        tp: 0,
        tn: 0,
        fp: 0,
        fn: 0
      }
    },
    errors: 0,
    result: []
  };

  for (let i = 0; i < datasets.length; i++) {
    const dataset = datasets[i];

    result.result[i] = {
      ...result.result[i],
      path: `/works/repos/${dataset.nameWithOwner}`,
      srcHash: dataset.prev.hash,
      dstHash: dataset.updated.hash,
      isBreaking: dataset.state === 'failure',
      matsudaPrediction: dataset.isBreaking
    };

    console.log(
      `Start ${i + 1}/${datasets.length} : -p ${result.result[i].path} -s ${
        result.result[i].srcHash
      } -d ${result.result[i].dstHash}`
    );

    try {
      if (!existsSync(result.result[i].path)) {
        result.result[i] = {
          ...result.result[i],
          stats: null,
          error: 'no-repo'
        };
        continue;
      }

      const output = readJson<EscompifyType>(
        await run(
          `escompify -p /works/repos/${dataset.nameWithOwner} -s ${dataset.prev.hash} -d ${dataset.updated.hash}`
        )
      );

      result.result[i] = {
        ...result.result[i],
        stats: output,
        error: null
      };
    } catch (e) {
      result.errors++;
      result.result[i] = {
        ...result.result[i],
        stats: null,
        error: 'unexpected-error'
      };
      console.error(e);
    } finally {
      console.log(
        `Done: -p ${result.result[i].path} -s ${result.result[i].srcHash} -d ${result.result[i].dstHash}`
      );
    }
  }

  result.matrix = confusionMatrix(result);

  writeFileSync('/works/outputs/thesis_result.json', JSON.stringify(result));
}

main().catch((e) => {
  console.error(e);
});

function readJson<T>(str: string): T {
  const json = JSON.parse(str);
  return json;
}

function confusionMatrix({ result }: ThesisResult) {
  const thesis = {
    tp: 0,
    fp: 0,
    tn: 0,
    fn: 0
  };
  const matsuda = {
    tp: 0,
    fp: 0,
    tn: 0,
    fn: 0
  };

  for (const { matsudaPrediction, isBreaking, stats } of result) {
    if (!stats) continue;

    // for thesis
    if (isBreaking && stats.hasPotentialBreaking) {
      // tp: 破壊的変更あり，かつパターン検出
      thesis.tp++;
    } else if (!isBreaking && stats.hasPotentialBreaking) {
      // fp: 破壊的変更なし，かつパターン検出
      thesis.fp++;
    } else if (!isBreaking && !stats.hasPotentialBreaking) {
      // tn: 破壊的変更なし，かつパターン未検出
      thesis.tn++;
    } else if (isBreaking && !stats.hasPotentialBreaking) {
      // fn: 破壊的変更あり，パターン未検出
      thesis.fn++;
    }

    // for matsuda
    if (isBreaking && matsudaPrediction) {
      // tp: 破壊的変更あり，かつテスト変更あり
      matsuda.tp++;
    } else if (!isBreaking && matsudaPrediction) {
      // fp: 破壊的変更なし，かつテスト変更あり
      matsuda.fp++;
    } else if (!isBreaking && !matsudaPrediction) {
      // tn: 破壊的変更なし，かつテスト変更なし
      matsuda.tn++;
    } else if (isBreaking && !matsudaPrediction) {
      // fn: 破壊的変更あり，かつテスト変更なし
      matsuda.fn++;
    }
  }

  return {
    thesis,
    matsuda
  };
}

type ThesisResult = {
  matrix: {
    thesis: {
      tp: number;
      tn: number;
      fp: number;
      fn: number;
    };
    matsuda: {
      tp: number;
      tn: number;
      fp: number;
      fn: number;
    };
  };
  errors: number;
  result: Array<{
    path: string;
    srcHash: string;
    dstHash: string;
    matsudaPrediction: boolean;
    isBreaking: boolean;
    error: null | 'no-repo' | 'unexpected-error';
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
