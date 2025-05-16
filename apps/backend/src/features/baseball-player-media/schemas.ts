import { z } from '@hono/zod-openapi';

// Baseball player media schema for request validation
export const baseballPlayerMediaSchema = z.object({
  player_id: z.number().int().positive().openapi({
    description: '選手ID',
    example: 1
  }),
  media_type: z.string().min(1).openapi({
    description: 'メディアタイプ（IMAGE, VIDEO, DOCUMENT, INTERVIEW）',
    example: 'IMAGE'
  }),
  title: z.string().min(1).openapi({
    description: 'タイトル',
    example: '2023年開幕戦ホームラン'
  }),
  description: z.string().optional().openapi({
    description: '説明',
    example: '2023年シーズン開幕戦で放った第1号ホームラン'
  }),
  url: z.string().min(1).openapi({
    description: 'メディアURL',
    example: 'https://example.com/media/player1/homerun.jpg'
  }),
  thumbnail_url: z.string().optional().openapi({
    description: 'サムネイルURL',
    example: 'https://example.com/media/player1/homerun_thumb.jpg'
  }),
  publication_date: z.string().optional().openapi({
    description: '公開日',
    example: '2023-04-01'
  }),
  source: z.string().optional().openapi({
    description: '出典',
    example: '公式サイト'
  }),
  is_featured: z.boolean().optional().openapi({
    description: '注目コンテンツフラグ',
    example: true
  })
}).openapi('BaseballPlayerMedia');

// Response schema with ID and timestamps
export const baseballPlayerMediaResponseSchema = z.object({
  id: z.number().openapi({
    description: 'メディアID',
    example: 1
  }),
  player_id: z.number().openapi({
    description: '選手ID',
    example: 1
  }),
  media_type: z.string().openapi({
    description: 'メディアタイプ（IMAGE, VIDEO, DOCUMENT, INTERVIEW）',
    example: 'IMAGE'
  }),
  title: z.string().openapi({
    description: 'タイトル',
    example: '2023年開幕戦ホームラン'
  }),
  description: z.string().nullable().openapi({
    description: '説明',
    example: '2023年シーズン開幕戦で放った第1号ホームラン'
  }),
  url: z.string().openapi({
    description: 'メディアURL',
    example: 'https://example.com/media/player1/homerun.jpg'
  }),
  thumbnail_url: z.string().nullable().openapi({
    description: 'サムネイルURL',
    example: 'https://example.com/media/player1/homerun_thumb.jpg'
  }),
  publication_date: z.string().nullable().openapi({
    description: '公開日',
    example: '2023-04-01'
  }),
  source: z.string().nullable().openapi({
    description: '出典',
    example: '公式サイト'
  }),
  is_featured: z.boolean().openapi({
    description: '注目コンテンツフラグ',
    example: true
  }),
  created_at: z.string().openapi({
    description: '作成日時',
    example: '2023-04-01T10:30:00Z'
  }),
  updated_at: z.string().openapi({
    description: '更新日時',
    example: '2023-04-01T10:30:00Z'
  })
}).openapi('BaseballPlayerMediaResponse');

// Update schema (all fields optional)
export const baseballPlayerMediaUpdateSchema = z.object({
  player_id: z.number().int().positive().optional().openapi({
    description: '選手ID',
    example: 1
  }),
  media_type: z.string().min(1).optional().openapi({
    description: 'メディアタイプ（IMAGE, VIDEO, DOCUMENT, INTERVIEW）',
    example: 'IMAGE'
  }),
  title: z.string().min(1).optional().openapi({
    description: 'タイトル',
    example: '2023年開幕戦ホームラン'
  }),
  description: z.string().optional().openapi({
    description: '説明',
    example: '2023年シーズン開幕戦で放った第1号ホームラン'
  }),
  url: z.string().min(1).optional().openapi({
    description: 'メディアURL',
    example: 'https://example.com/media/player1/homerun.jpg'
  }),
  thumbnail_url: z.string().optional().openapi({
    description: 'サムネイルURL',
    example: 'https://example.com/media/player1/homerun_thumb.jpg'
  }),
  publication_date: z.string().optional().openapi({
    description: '公開日',
    example: '2023-04-01'
  }),
  source: z.string().optional().openapi({
    description: '出典',
    example: '公式サイト'
  }),
  is_featured: z.boolean().optional().openapi({
    description: '注目コンテンツフラグ',
    example: true
  })
}).openapi('BaseballPlayerMediaUpdate');

// Error response schema
export const errorResponseSchema = z.object({
  error: z.string().openapi({
    description: 'エラーメッセージ',
    example: '入力が無効です'
  })
}).openapi('ErrorResponse');