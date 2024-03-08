# 研究用リポジトリ

## 作成者

前川

## 作成期間

2022 年 7 月 ～ 2024 年 3 月

## ディレクトリ構成

```sh
├── outputs # 各分析結果
├── runners # 分析を実行するプログラム
├── scripts # 分析の準備と集計に必要なプログラム
└── src # 後方互換性を予測するプログラム
```

## outputs 以下のファイル

- thesis_result ... 提案手法の適用結果を集計した最終的なデータ
- thesis_result_with_mejor ... メジャーバージョンによる提案手法の精度の推移
- thesis_result_with_coverage ... テストカバレッジによる提案手法の精度の推移

## 再現手順

研究結果は`outputs`配下に出力されています。再現手順を示しますが、ライブラリが非公開や削除されることによってデータセットが変わると出力結果が変わる場合があります。その場合は、サーバー上にあるライブラリを使用することで同じ結果を得ることが可能です。

### 環境構築

DockerとNode.jsが必要です。提案手法のプログラムの実行にNode.js、GumTreeの実行にDockerを使用します。

```sh
$ docker -v
Docker version 25.0.3, build 4debf41
$ node -v
v20.11.1

# 依存ライブラリをインストール
$ corepack enable && yarn install

# GumTreeをビルド
$ docker build -t k1tikurisu/gumtree --progress=plain ./gumtree
# GumTreeコマンドが利用できることを確認
$ docker run --rm -it k1tikurisu/gumtree gumtree --help
Available Options:
..

# データセットを配置（datasets配下に松田研究の結果が配置されます）
$ ./scripts/clone_datasets.sh

# 分析対象ライブラリをクローン（repos配下にクローンされます）
$ ./scripts/clone_repos.sh
# クローンされたリポジトリを参照できることを確認
$ ls -l repos
..
```

### 研究結果の出力

以下のコマンドで各研究結果をJSON形式で出力します。

```sh
# outputs/thesis_result.jsonを生成する
$ ./runners/thesis/run.sh
# outputs/thesis_result_with_mejorを生成する
$ ./runners/thesis/mejor.sh
# outputs/thesis_result_with_coverageを生成する
$ ./runners/thesis/coverage.json
```
