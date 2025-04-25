import type { Metadata } from 'next'
import './globals.css'


export const metadata: Metadata = {
  // サイトの基本的なタイトル
  title: "INDX Budget Planner - シンプル部門予算計画ツール",
  // サイトの簡単な説明 (検索結果やSNS共有時に表示されやすい)
  description: "シンプルなインターフェースで部門の月次予算計画を作成・管理できるSaaSツール。コストカテゴリ別の入力、自動集計、CSV出力機能を提供します。",
  // Open Graph Protocol (Facebook, LinkedInなどでの共有時の設定)
  openGraph: {
    title: "INDX Budget | シンプル部門予算計画ツール",
    description: "簡単な操作で部門予算を作成・管理。月別コスト入力、カテゴリ集計、CSV出力に対応。",
    // サイトの正式なURL
    url: "https://indx-budget.vercel.app/",
    // サイト名
    siteName: "INDX Budget",
    // 共有時に表示される画像 (適切な画像URLに差し替えてください)
    images: [
      {
        // 例: OGP画像のURL (サイトのトップページや特徴を表す画像)
        url: "https://indx-budget.vercel.app/ogp.png", // このURLは仮のものです
        width: 1200, // 推奨サイズ
        height: 630, // 推奨サイズ
        alt: "INDX Budget ツール画面のプレビュー",
      },
    ],
    // サイトの言語
    locale: "ja_JP",
    // サイトの種類 (Webサイト)
    type: "website",
  },
  // Twitter Card (Twitterでの共有時の設定)
  twitter: {
    // カードの種類 (大きな画像付きサマリー)
    card: "summary_large_image",
    title: "INDX Budget - シンプル部門予算計画ツール",
    description: "シンプルなインターフェースで部門の月次予算計画を作成・管理できるSaaSツール。",
    // 共有時に表示される画像 (Open Graphと同じか、専用のものを指定)
    images: ["https://indx-budget.vercel.app/ogp.png"], // このURLは仮のものです
    // サイト運営者のTwitterアカウント名 (任意)
    // creator: "@YourTwitterHandle", // 例: @INDX_corp など
  },
  // 検索エンジン向けの設定
  robots: {
    index: true, // 検索結果にインデックスさせる
    follow: true, // ページ内のリンクを辿ることを許可する
    nocache: false, // キャッシュを許可する (通常はfalse)
    googleBot: {
      index: true,
      follow: true,
    },
  },
  // 正規URLの指定 (URLの重複を避けるため)
  alternates: {
    canonical: "https://indx-budget.vercel.app/",
  },
  // その他のメタデータ (必要に応じて追加)
  // keywords: ["予算計画", "部門予算", "コスト管理", "経費管理", "SaaS", "ツール", "INDX"], // キーワード (現在はSEO効果が低いとされる)
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
