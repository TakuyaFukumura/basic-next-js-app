# 不要ファイル・不要記述 調査レポート

**作成日**: 2026年3月4日  
**対象リポジトリ**: basic-next-js-app  
**調査目的**: プロジェクト内の不要ファイルおよび不要コードの洗い出し

---

## 1. 不要ファイル一覧

### 1-1. `public/` ディレクトリ内の SVG ファイル（5件）

以下の SVG ファイルは Next.js のデフォルトテンプレートに含まれていたものですが、
現在のプロジェクトのどのソースファイルからも参照されていません。

| ファイルパス | 説明 | 参照状況 |
|---|---|---|
| `public/file.svg` | ファイルアイコン | 未参照 |
| `public/globe.svg` | 地球アイコン | 未参照 |
| `public/next.svg` | Next.js ロゴ | 未参照 |
| `public/vercel.svg` | Vercel ロゴ | 未参照 |
| `public/window.svg` | ウィンドウアイコン | 未参照 |

**確認方法**: プロジェクト全体を対象に `file.svg` `globe.svg` `next.svg` `vercel.svg` `window.svg` で検索したところ、いずれもヒットなし。

**削除可否**: ✅ 削除可能

---

### 1-2. `tailwind.config.ts`

**現状**:  
Tailwind CSS v4 では設定の記述方式が「CSS ファースト」に変更されました。
`globals.css` 内の `@theme` ブロックや `@custom-variant` などを使ってスタイルを定義するのが v4 の標準的な方法です。

v4 で `tailwind.config.ts/js` を参照するには、CSS ファイル内で以下のように明示的に `@config` ディレクティブを記述する必要があります。

```css
@config "../../tailwind.config.ts";
```

しかし現在の `src/app/globals.css` には `@config` の記述が存在しないため、
`tailwind.config.ts` はビルド時に読み込まれておらず、実質的に機能していない状態です。

**現在の `tailwind.config.ts` に記載されている設定**:

```ts
content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
],
darkMode: "class",
theme: { extend: {} },
plugins: [],
```

- `content` パス: v4 では自動検出されるため不要
- `darkMode: "class"`: `globals.css` 内の `@custom-variant dark (&:where(.dark, .dark *));` で代替済み
- `theme.extend` / `plugins`: 内容が空のため影響なし

**削除可否**: ✅ 削除可能

---

## 2. 不要記述一覧

### 2-1. `src/app/globals.css` の `@theme inline` ブロック内

**対象コード**:

```css
@theme inline {
    --color-background: var(--background);
    --color-foreground: var(--foreground);
    --font-sans: var(--font-geist-sans);
    --font-mono: var(--font-geist-mono);
}
```

各行の問題点を以下に示します。

#### `--color-background` / `--color-foreground`

これらは Tailwind の `bg-background` や `text-foreground` といったユーティリティクラスを使えるようにするための定義ですが、
プロジェクト内のどのコンポーネントでも `bg-background` や `text-foreground` は使用されていません。

| 定義 | 対応 Tailwind クラス | 使用箇所 |
|---|---|---|
| `--color-background` | `bg-background` / `text-background` | なし |
| `--color-foreground` | `text-foreground` / `bg-foreground` | なし |

**削除可否**: ✅ 削除可能

#### `--font-sans: var(--font-geist-sans)`

Geist フォントは `layout.tsx` で読み込まれていないため、`var(--font-geist-sans)` は未定義の変数です。
なお `font-sans` クラス自体は `page.tsx` で使用されていますが、
`body` に `font-family: Arial, Helvetica, sans-serif;` が直接指定されているため、
この `@theme` 定義がなくても表示に影響はありません。

**削除可否**: ✅ 削除可能

#### `--font-mono: var(--font-geist-mono)`

Geist フォントは読み込まれておらず、`var(--font-geist-mono)` も未定義です。
さらに `font-mono` クラスはプロジェクト内のどこにも使用されていません。

**削除可否**: ✅ 削除可能

---

### 2-2. `src/app/globals.css` の `:root` / `.dark` ブロック内の変数

**対象コード**:

```css
:root {
    --background: #ffffff;
    --foreground: #171717;
}

.dark {
    --background: #0a0a0a;
    --foreground: #ededed;
}
```

これらの変数は `body` スタイルで以下のように参照されています。

```css
body {
    background: var(--background);
    color: var(--foreground);
    font-family: Arial, Helvetica, sans-serif;
}
```

なお、`@theme inline` 側の `--color-background` / `--color-foreground` を削除しても、
上記の `:root` / `.dark` に定義した `--background` / `--foreground` 自体や、
`body` からの `var(--background)` / `var(--foreground)` の参照はそのまま残ります。

これらの変数定義（`:root` / `.dark` ブロック）を削除したい場合は、
`body` の `background` / `color` で `var(--background)` / `var(--foreground)` を使うのをやめ、
直接カラーコードを書くか、別の方法（例: Tailwind の色ユーティリティ）に置き換える必要があります。
ただし、ダークモード時の `body` 背景・文字色の切り替えも `:root` / `.dark` の変数に依存しているため、
削除する際は代替手段を合わせて検討してください。

**削除可否**: ⚠️ 削除可能だが、`body` スタイルの修正が必要

---

## 3. 調査結果サマリー

| 種別 | 対象 | 件数 | 削除可否 |
|---|---|---|---|
| ファイル | `public/*.svg`（5ファイル） | 5 | ✅ |
| ファイル | `tailwind.config.ts` | 1 | ✅ |
| コード | `globals.css` の `@theme inline` 全体 | 1ブロック | ✅ |
| コード | `globals.css` の `:root` / `.dark` ブロック | 2ブロック | ⚠️ 要修正 |

---

## 4. 備考

- 本レポートは調査・仕様検討のための資料です。実際の削除作業は別タスクで実施してください。
- `tailwind.config.ts` を削除する前に、Tailwind CSS v4 での動作確認（ビルド・スタイル適用）を行うことを推奨します。
- `globals.css` の変数削除は影響範囲が広いため、削除後にビルドとスタイルの目視確認を行うことを推奨します。
