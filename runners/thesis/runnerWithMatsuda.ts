import { readFileSync, writeFileSync } from 'fs';
import json2csv, { Parser, transforms } from 'json2csv';

async function main() {
  const datasets = readJson<ProposalResult[]>(
    readFileSync('./datasets/proposal_result.json', 'utf-8')
  );
  const thesisResult = readJson<ThesisResult>(
    readFileSync('./outputs/thesis_result.json', 'utf-8')
  );

  const thesisResltWithMatsuda: ThesisResultWithMatsuda[] = [];

  for (let i = 0; i < datasets.length; i++) {
    const dataset = datasets[i];

    for (let j = 0; j < thesisResult.result.length; j++) {
      const result = thesisResult.result[j];

      if (dataset.prev.hash === result.srcHash && dataset.updated.hash === result.dstHash) {
        thesisResltWithMatsuda.push({
          ...dataset,
          error: result.error,
          isBreaking: result.isBreaking,
          matsudaPrediction: result.matsudaPrediction,
          maekawa: result.stats,
        });
      }
    }
  }

  writeFileSync(
    './outputs/thesis_result_with_matsuda.json',
    JSON.stringify(thesisResltWithMatsuda)
  );
  writeFileSync(
    './outputs/thesis_result_with_matsuda.csv',
    convertJsonToCSV(thesisResltWithMatsuda)
  );
}

main().catch((e) => {
  console.error(e);
});

function readJson<T>(str: string): T {
  const json = JSON.parse(str);
  return json;
}

function convertJsonToCSV(json: any, options: json2csv.Options<unknown> = {}) {
  const parser = new Parser({
    quote: '',
    transforms: [transforms.flatten({ separator: '_' })],
    ...options,
  });
  return parser.parse(json);
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
  isAssertionInserted: boolean;
  hasPotentialBreaking: boolean;
};

type Revision = {
  version: string;
  hash: string;
  coverage: {
    lines: {
      total: number;
      covered: number;
      skipped: number;
      pct: number;
    };
    statement: {
      total: number;
      covered: number;
      skipped: number;
      pct: number;
    };
  };
  test: number;
};

type ProposalResult = {
  nameWithOwner: string;
  state: 'failure' | 'success';
  npm_pkg: string;
  updated: Revision;
  prev: Revision;
  isBreaking: boolean;
};

type ThesisResultWithMatsuda = ProposalResult & {
  error: null | 'no-repo' | 'unexpected-error';
  maekawa: EscompifyType | null;
  matsudaPrediction: boolean;
  isBreaking: boolean;
};
