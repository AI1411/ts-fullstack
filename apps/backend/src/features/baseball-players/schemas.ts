import { z } from '@hono/zod-openapi';

// Baseball player schema for request validation
export const baseballPlayerSchema = z.object({
  name: z.string().min(1).openapi({
    description: '選手名',
    example: '山田太郎'
  }),
  team: z.string().optional().openapi({
    description: 'チーム名',
    example: '東京ヤクルトスワローズ'
  }),
  position: z.string().optional().openapi({
    description: 'ポジション',
    example: '内野手'
  }),
  batting_average: z.number().min(0).max(1).optional().openapi({
    description: '打率',
    example: 0.309
  }),
  home_runs: z.number().min(0).optional().openapi({
    description: 'ホームラン数',
    example: 38
  }),
  runs_batted_in: z.number().min(0).optional().openapi({
    description: '打点',
    example: 94
  }),
  stolen_bases: z.number().min(0).optional().openapi({
    description: '盗塁数',
    example: 21
  }),
  era: z.number().min(0).optional().openapi({
    description: '防御率',
    example: 2.45
  }),
  wins: z.number().min(0).optional().openapi({
    description: '勝利数',
    example: 15
  }),
  losses: z.number().min(0).optional().openapi({
    description: '敗戦数',
    example: 5
  }),
  saves: z.number().min(0).optional().openapi({
    description: 'セーブ数',
    example: 0
  })
}).openapi('BaseballPlayer');

// Response schema with ID and timestamps
export const baseballPlayerResponseSchema = z.object({
  id: z.number().openapi({
    description: '選手ID',
    example: 1
  }),
  name: z.string().openapi({
    description: '選手名',
    example: '山田太郎'
  }),
  team: z.string().nullable().openapi({
    description: 'チーム名',
    example: '東京ヤクルトスワローズ'
  }),
  position: z.string().nullable().openapi({
    description: 'ポジション',
    example: '内野手'
  }),
  batting_average: z.number().nullable().openapi({
    description: '打率',
    example: 0.309
  }),
  home_runs: z.number().nullable().openapi({
    description: 'ホームラン数',
    example: 38
  }),
  runs_batted_in: z.number().nullable().openapi({
    description: '打点',
    example: 94
  }),
  stolen_bases: z.number().nullable().openapi({
    description: '盗塁数',
    example: 21
  }),
  era: z.number().nullable().openapi({
    description: '防御率',
    example: 2.45
  }),
  wins: z.number().nullable().openapi({
    description: '勝利数',
    example: 15
  }),
  losses: z.number().nullable().openapi({
    description: '敗戦数',
    example: 5
  }),
  saves: z.number().nullable().openapi({
    description: 'セーブ数',
    example: 0
  }),
  created_at: z.string().openapi({
    description: '作成日時',
    example: '2023-01-01T00:00:00Z'
  }),
  updated_at: z.string().openapi({
    description: '更新日時',
    example: '2023-01-01T00:00:00Z'
  })
}).openapi('BaseballPlayerResponse');

// Update schema (all fields optional)
export const baseballPlayerUpdateSchema = z.object({
  name: z.string().min(1).optional().openapi({
    description: '選手名',
    example: '山田太郎'
  }),
  team: z.string().optional().openapi({
    description: 'チーム名',
    example: '東京ヤクルトスワローズ'
  }),
  position: z.string().optional().openapi({
    description: 'ポジション',
    example: '内野手'
  }),
  batting_average: z.number().min(0).max(1).optional().openapi({
    description: '打率',
    example: 0.309
  }),
  home_runs: z.number().min(0).optional().openapi({
    description: 'ホームラン数',
    example: 38
  }),
  runs_batted_in: z.number().min(0).optional().openapi({
    description: '打点',
    example: 94
  }),
  stolen_bases: z.number().min(0).optional().openapi({
    description: '盗塁数',
    example: 21
  }),
  era: z.number().min(0).optional().openapi({
    description: '防御率',
    example: 2.45
  }),
  wins: z.number().min(0).optional().openapi({
    description: '勝利数',
    example: 15
  }),
  losses: z.number().min(0).optional().openapi({
    description: '敗戦数',
    example: 5
  }),
  saves: z.number().min(0).optional().openapi({
    description: 'セーブ数',
    example: 0
  })
}).openapi('BaseballPlayerUpdate');

// Error response schema
export const errorResponseSchema = z.object({
  error: z.string().openapi({
    description: 'エラーメッセージ',
    example: '入力が無効です'
  })
}).openapi('ErrorResponse');