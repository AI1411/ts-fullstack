'use client';

import Link from 'next/link';
import type React from 'react';
import {
  RiFacebookCircleFill,
  RiInstagramFill,
  RiMailLine,
  RiMapPin2Line,
  RiPhoneLine,
  RiTwitterFill,
} from 'react-icons/ri';

const UserFooter: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-gray-300">
      {/* メインフッターコンテンツ */}
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          {/* 会社情報 */}
          <div>
            <h3 className="text-lg font-semibold text-white">ECサイト</h3>
            <p className="mt-4 text-sm">
              高品質な商品を取り揃えたオンラインストアです。お客様に最高のショッピング体験をお届けします。
            </p>
            <div className="mt-6 flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white">
                <RiFacebookCircleFill className="h-6 w-6" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <RiTwitterFill className="h-6 w-6" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <RiInstagramFill className="h-6 w-6" />
              </a>
            </div>
          </div>

          {/* クイックリンク */}
          <div>
            <h3 className="text-lg font-semibold text-white">クイックリンク</h3>
            <ul className="mt-4 space-y-2">
              <li>
                <Link href="/" className="text-sm hover:text-white">
                  ホーム
                </Link>
              </li>
              <li>
                <Link href="/products" className="text-sm hover:text-white">
                  商品一覧
                </Link>
              </li>
              <li>
                <Link href="/categories" className="text-sm hover:text-white">
                  カテゴリー
                </Link>
              </li>
              <li>
                <Link href="/sale" className="text-sm hover:text-white">
                  セール
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-sm hover:text-white">
                  会社概要
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-sm hover:text-white">
                  お問い合わせ
                </Link>
              </li>
            </ul>
          </div>

          {/* カスタマーサービス */}
          <div>
            <h3 className="text-lg font-semibold text-white">
              カスタマーサービス
            </h3>
            <ul className="mt-4 space-y-2">
              <li>
                <Link href="/account" className="text-sm hover:text-white">
                  アカウント
                </Link>
              </li>
              <li>
                <Link href="/orders" className="text-sm hover:text-white">
                  注文履歴
                </Link>
              </li>
              <li>
                <Link href="/shipping" className="text-sm hover:text-white">
                  配送情報
                </Link>
              </li>
              <li>
                <Link href="/returns" className="text-sm hover:text-white">
                  返品ポリシー
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-sm hover:text-white">
                  よくある質問
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-sm hover:text-white">
                  利用規約
                </Link>
              </li>
            </ul>
          </div>

          {/* お問い合わせ */}
          <div>
            <h3 className="text-lg font-semibold text-white">お問い合わせ</h3>
            <ul className="mt-4 space-y-2">
              <li className="flex items-start">
                <RiMapPin2Line className="mr-2 h-5 w-5 text-gray-400" />
                <span className="text-sm">〒100-0001 東京都千代田区1-1-1</span>
              </li>
              <li className="flex items-center">
                <RiPhoneLine className="mr-2 h-5 w-5 text-gray-400" />
                <span className="text-sm">03-1234-5678</span>
              </li>
              <li className="flex items-center">
                <RiMailLine className="mr-2 h-5 w-5 text-gray-400" />
                <span className="text-sm">info@example.com</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* コピーライト */}
      <div className="border-t border-gray-800 bg-gray-950 py-6">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="md:flex md:items-center md:justify-between">
            <div className="text-center text-sm md:text-left">
              &copy; {new Date().getFullYear()} ECサイト. All rights reserved.
            </div>
            <div className="mt-4 flex justify-center space-x-6 md:mt-0">
              <Link
                href="/privacy"
                className="text-xs text-gray-400 hover:text-white"
              >
                プライバシーポリシー
              </Link>
              <Link
                href="/terms"
                className="text-xs text-gray-400 hover:text-white"
              >
                利用規約
              </Link>
              <Link
                href="/sitemap"
                className="text-xs text-gray-400 hover:text-white"
              >
                サイトマップ
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default UserFooter;
