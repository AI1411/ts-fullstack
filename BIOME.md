# Biome セットアップ

このプロジェクトでは、リンティングとフォーマットに [Biome](https://biomejs.dev/) を使用しています。

## Biome とは？

Biome は JavaScript と TypeScript プロジェクト向けの高速でモダンなリンティングおよびフォーマットツールです。ESLint、Prettier などのツールの代替として設計されており、パフォーマンスと開発者体験に重点を置いています。

## 使用方法

Biome を使用するための npm スクリプトは以下の通りです：

- `npm run lint`: プロジェクト全体に対して Biome のリンターを実行
- `npm run lint:fix`: Biome のリンターを実行し、問題を自動修正
- `npm run format`: プロジェクト全体に対して Biome のフォーマッターを実行
- `npm run format:fix`: Biome のフォーマッターを実行し、フォーマットの問題を自動修正
- `npm run check`: リンターとフォーマッターの両方のチェックを実行
- `npm run check:fix`: リンターとフォーマッターの両方のチェックを実行し、問題を自動修正

## 設定

Biome はプロジェクトのルートにある `biome.json` ファイルで設定されています。現在の設定：

- 推奨されるリンティングルールを使用
- 一度に有効にすると混乱を招く可能性のあるルールを無効化
- スムーズな移行のために一部のルールを「エラー」ではなく「警告」に設定
- スペース、2スペースのインデント、シングルクォート、ES5 の末尾カンマを使用するようにフォーマットを設定
- `node_modules`、`dist`、`.next`、`build`、`coverage` ディレクトリを無視
- ファイルサイズの上限を 2MB (2097152 バイト) に設定

## 段階的な導入

Biome は既存のプロジェクトに導入されるため、初期段階ではより寛容に設定されています。コードベースが Biome のルールに従うように更新されるにつれて、設定をより厳格にすることができます。

## リソース

- [Biome ドキュメント](https://biomejs.dev/)
- [Biome 設定リファレンス](https://biomejs.dev/reference/configuration/)
- [Biome ルールリファレンス](https://biomejs.dev/linter/rules/)
