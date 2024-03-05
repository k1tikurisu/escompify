# 研究用リポジトリ

## 作成者

前川

## 作成期間

2022 年 7 月 ～ 2024 年 3 月

## ディレクトリ構成

```sh
├── dataset # Mujahidらのデータセットを置く
├── outputs # 各分析結果
├── runners # 分析を実行するプログラム
├── scripts # 分析の準備と集計に必要なプログラム
└── src # 後方互換性を予測するプログラム
```

## output 以下のファイル

- analysis_result ... 分析対象の 500 ライブラリのテスト結果
- repository_versions 　... 分析対象の 500 ライブラリの各バージョンとコミットハッシュ値
- test_result ... 500 ライブラリに対応するクライアントのテスト実行結果
- proposal_result ... 提案手法の適用結果とテスト結果を集計した最終的なデータ

<details>
<summary>データの再現手順</summary>

### Docker イメージ作成とデータセット配置

```console
$ git clone https://github.com/mzdkzk/survey.git
$ docker-compose build
$ mv path/to/dataset ./dataset
```

### 手順 1

```console
$ docker-compose run --rm main yarn docker:analysis --build-arg repos=リポジトリ数
$ docker-compose run --rm main yarn analysis -c 個数 -p コンテナ数
```

`output/repository_versions`、`output/analysis_result`が生成されます。

### 手順 2

```console
# 1. の結果から runner-experiment/input.json を生成
$ docker-compose run --rm main ./scripts/loadAnalysisResult.sh
$ docker-compose run --rm main ./scripts/inputExperiment.sh

# 実行
$ docker-compose run --rm main yarn docker:experiment --build-arg repos=リポジトリ数
$ docker-compose run --rm -e HOST_PWD=$PWD main yarn experiment -c 個数 -p コンテナ数
```

`output/test_result`が生成されます。

### 手順 3

```console
# 2. の結果から runner-proposal/input.json を生成
$ docker-compose run --rm main ./scripts/loadExperimentResult.sh
$ docker-compose run --rm main ./scripts/inputProposal.sh

# 実行
$ docker-compose run --rm main yarn docker:proposal --build-arg repos=リポジトリ数
$ docker-compose run --rm main yarn proposal -c 個数 -p コンテナ数
```

`output/proposal_result`が生成されます。

</details>

## データセット

Mujahid, Suhaib, Abdalkareem, Rabe, Shihab, Emad, & McIntosh, Shane. (2019). MSR - Using Others' Tests to Avoid Breaking Updates [Data set]. Zenodo. http://doi.org/10.5281/zenodo.2549129
