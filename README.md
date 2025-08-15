# 基本Next.jsアプリ

Next.jsを使ったシンプルな「Hello, world.」アプリケーションです。このプロジェクトは、SQLiteデータベースからメッセージを取得して表示する基本的な機能を提供します。

## 技術スタック

- **Next.js 15.4.6** - React フレームワーク（App Routerを使用）
- **React 19** - ユーザーインターフェース構築
- **TypeScript** - 型安全性
- **Tailwind CSS 4** - スタイリング
- **SQLite** - データベース（better-sqlite3）
- **ESLint** - コード品質管理

## 機能

- SQLiteデータベースから「Hello, world.」メッセージを取得
- レスポンシブデザイン対応
- ダークモード対応
- TypeScriptによる型安全性
- モダンなUI/UXデザイン

## 始め方

### 前提条件

- Node.js 18.x以上
- npm、yarn、またはpnpm

### インストール

1. リポジトリをクローン：
```bash
git clone https://github.com/TakuyaFukumura/basic-next-js-app.git
cd basic-next-js-app
```

2. 依存関係をインストール：
```bash
npm install
# または
yarn install
# または
pnpm install
```

### 開発サーバーの起動

```bash
npm run dev
# または
yarn dev
# または
pnpm dev
```

ブラウザで [http://localhost:3000](http://localhost:3000) を開いてアプリケーションを確認してください。

### ビルドと本番デプロイ

本番用にアプリケーションをビルドする：

```bash
npm run build
npm start
# または
yarn build
yarn start
# または
pnpm build
pnpm start
```

## プロジェクト構造

```
├── lib/
│   └── database.ts          # SQLiteデータベース接続・操作
├── src/
│   └── app/
│       ├── api/
│       │   └── message/
│       │       └── route.ts # APIエンドポイント
│       ├── globals.css      # グローバルスタイル
│       ├── layout.tsx       # アプリケーションレイアウト
│       └── page.tsx         # メインページコンポーネント
├── data/                    # SQLiteデータベースファイル（自動生成）
├── package.json
├── next.config.ts
├── tailwind.config.js
└── tsconfig.json
```

## API エンドポイント

### GET /api/message

データベースから最新のメッセージを取得します。

**レスポンス:**
```json
{
  "message": "Hello, world."
}
```

## データベース

SQLiteデータベースは初回起動時に自動的に作成されます：

- データベースファイル: `data/app.db`
- テーブル: `messages`
  - `id`: 自動増分プライマリーキー
  - `content`: メッセージ内容
  - `created_at`: 作成日時

## カスタマイズ

### メッセージの変更

データベース内のメッセージを変更したい場合は、SQLiteクライアントを使用して `data/app.db` ファイル内の `messages` テーブルを編集してください。

### スタイルの変更

スタイルは Tailwind CSS を使用しています。`src/app/page.tsx` ファイル内のクラス名を変更することで、外観をカスタマイズできます。

## 開発

### リンティング

```bash
npm run lint
# または
yarn lint
# または
pnpm lint
```

### 型チェック

TypeScriptの型チェックは、ビルド時またはIDEで自動的に実行されます。

## トラブルシューティング

### データベース関連のエラー

- `data/` フォルダが存在しない場合、自動的に作成されます
- データベースファイルが破損した場合は、`data/app.db` を削除して再起動してください

### ポート競合

デフォルトのポート3000が使用中の場合：

```bash
npm run dev -- --port 3001
```

## ライセンス

このプロジェクトはMITライセンスの下で公開されています。

## 貢献

プルリクエストや課題の報告を歓迎します。コントリビューションガイドラインに従ってください。

## 作成者

[TakuyaFukumura](https://github.com/TakuyaFukumura)