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
- thesis_result_with_matsuda ... 提案手法と松田手法の結果を合わせたデータ

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

以下のコマンドで各研究結果をJSON/CSV形式で出力します。

```sh
# outputs/thesis_result.jsonを生成する
$ ./runners/thesis/run.sh
# outputs/thesis_result_with_matsudaを生成する
$ ./runners/thesis/run_with_matsuda.sh
```

#### `thesis_result_with_matsuda.csv`の各見出し

- isBreaking: 実際の後方互換性有無
- matsudaPrediction: 松田研究での判定結果
- maekawa_hasPotentialBreaking: 前川研究での判定結果
- maekawa_isInserted": テスト追加有無（それぞれ、定義は論文参照）
- maekawa_isDeleted": テスト削除有無
- maekawa_isExpectChanged": 期待値の変更有無
- maekawa_isAssertionInserted": アサーション追加有無
