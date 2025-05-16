import { z } from '@hono/zod-openapi';

// Baseball team schema for request validation
export const baseballTeamSchema = z.object({
  name: z.string().min(1).openapi({
    description: 'チーム名',
    example: '東京ヤクルトスワローズ'
  }),
  abbreviation: z.string().optional().openapi({
    description: 'チーム略称',
    example: 'YS'
  }),
  league: z.string().optional().openapi({
    description: 'リーグ',
    example: 'セントラル・リーグ'
  }),
  division: z.string().optional().openapi({
    description: 'ディビジョン',
    example: 'イースタン'
  }),
  home_stadium: z.string().optional().openapi({
    description: 'ホームスタジアム',
    example: '明治神宮野球場'
  }),
  city: z.string().optional().openapi({
    description: '本拠地',
    example: '東京都'
  }),
  founded_year: z.number().min(1800).optional().openapi({
    description: '創設年',
    example: 1950
  }),
  team_color: z.string().optional().openapi({
    description: 'チームカラー',
    example: '#224499'
  }),
  logo_url: z.string().optional().openapi({
    description: 'ロゴURL',
    example: 'https://example.com/logos/swallows.png'
  }),
  website_url: z.string().optional().openapi({
    description: '公式ウェブサイトURL',
    example: 'https://www.yakult-swallows.co.jp'
  }),
  description: z.string().optional().openapi({
    description: 'チーム説明',
    example: '東京を本拠地とするプロ野球チーム'
  })
}).openapi('BaseballTeam');

// Response schema with ID and timestamps
export const baseballTeamResponseSchema = z.object({
  id: z.number().openapi({
    description: 'チームID',
    example: 1
  }),
  name: z.string().openapi({
    description: 'チーム名',
    example: '東京ヤクルトスワローズ'
  }),
  abbreviation: z.string().nullable().openapi({
    description: 'チーム略称',
    example: 'YS'
  }),
  league: z.string().nullable().openapi({
    description: 'リーグ',
    example: 'セントラル・リーグ'
  }),
  division: z.string().nullable().openapi({
    description: 'ディビジョン',
    example: 'イースタン'
  }),
  home_stadium: z.string().nullable().openapi({
    description: 'ホームスタジアム',
    example: '明治神宮野球場'
  }),
  city: z.string().nullable().openapi({
    description: '本拠地',
    example: '東京都'
  }),
  founded_year: z.number().nullable().openapi({
    description: '創設年',
    example: 1950
  }),
  team_color: z.string().nullable().openapi({
    description: 'チームカラー',
    example: '#224499'
  }),
  logo_url: z.string().nullable().openapi({
    description: 'ロゴURL',
    example: 'https://example.com/logos/swallows.png'
  }),
  website_url: z.string().nullable().openapi({
    description: '公式ウェブサイトURL',
    example: 'https://www.yakult-swallows.co.jp'
  }),
  description: z.string().nullable().openapi({
    description: 'チーム説明',
    example: '東京を本拠地とするプロ野球チーム'
  }),
  created_at: z.string().openapi({
    description: '作成日時',
    example: '2023-01-01T00:00:00Z'
  }),
  updated_at: z.string().openapi({
    description: '更新日時',
    example: '2023-01-01T00:00:00Z'
  })
}).openapi('BaseballTeamResponse');

// Update schema (all fields optional)
export const baseballTeamUpdateSchema = z.object({
  name: z.string().min(1).optional().openapi({
    description: 'チーム名',
    example: '東京ヤクルトスワローズ'
  }),
  abbreviation: z.string().optional().openapi({
    description: 'チーム略称',
    example: 'YS'
  }),
  league: z.string().optional().openapi({
    description: 'リーグ',
    example: 'セントラル・リーグ'
  }),
  division: z.string().optional().openapi({
    description: 'ディビジョン',
    example: 'イースタン'
  }),
  home_stadium: z.string().optional().openapi({
    description: 'ホームスタジアム',
    example: '明治神宮野球場'
  }),
  city: z.string().optional().openapi({
    description: '本拠地',
    example: '東京都'
  }),
  founded_year: z.number().min(1800).optional().openapi({
    description: '創設年',
    example: 1950
  }),
  team_color: z.string().optional().openapi({
    description: 'チームカラー',
    example: '#224499'
  }),
  logo_url: z.string().optional().openapi({
    description: 'ロゴURL',
    example: 'https://example.com/logos/swallows.png'
  }),
  website_url: z.string().optional().openapi({
    description: '公式ウェブサイトURL',
    example: 'https://www.yakult-swallows.co.jp'
  }),
  description: z.string().optional().openapi({
    description: 'チーム説明',
    example: '東京を本拠地とするプロ野球チーム'
  })
}).openapi('BaseballTeamUpdate');

// Error response schema
export const errorResponseSchema = z.object({
  error: z.string().openapi({
    description: 'エラーメッセージ',
    example: '入力が無効です'
  })
}).openapi('ErrorResponse');