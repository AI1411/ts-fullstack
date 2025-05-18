import { z } from '@hono/zod-openapi';

// Baseball game stats schema for request validation
export const baseballGameStatSchema = z.object({
  player_id: z.number().int().positive().openapi({
    description: '選手ID',
    example: 1
  }),
  game_date: z.string().openapi({
    description: '試合日',
    example: '2023-07-15T18:00:00Z'
  }),
  opponent: z.string().optional().openapi({
    description: '対戦相手',
    example: '読売ジャイアンツ'
  }),
  at_bats: z.number().int().min(0).optional().openapi({
    description: '打数',
    example: 4
  }),
  hits: z.number().int().min(0).optional().openapi({
    description: 'ヒット数',
    example: 2
  }),
  runs: z.number().int().min(0).optional().openapi({
    description: '得点',
    example: 1
  }),
  home_runs: z.number().int().min(0).optional().openapi({
    description: 'ホームラン数',
    example: 1
  }),
  runs_batted_in: z.number().int().min(0).optional().openapi({
    description: '打点',
    example: 3
  }),
  stolen_bases: z.number().int().min(0).optional().openapi({
    description: '盗塁数',
    example: 1
  }),
  innings_pitched: z.number().min(0).optional().openapi({
    description: '投球イニング',
    example: 7.0
  }),
  hits_allowed: z.number().int().min(0).optional().openapi({
    description: '被安打数',
    example: 5
  }),
  earned_runs: z.number().int().min(0).optional().openapi({
    description: '自責点',
    example: 2
  }),
  strikeouts: z.number().int().min(0).optional().openapi({
    description: '奪三振数',
    example: 8
  }),
  walks: z.number().int().min(0).optional().openapi({
    description: '与四球数',
    example: 2
  })
}).openapi('BaseballGameStat');

// Response schema with ID and timestamps
export const baseballGameStatResponseSchema = z.object({
  id: z.number().openapi({
    description: '統計ID',
    example: 1
  }),
  player_id: z.number().openapi({
    description: '選手ID',
    example: 1
  }),
  game_date: z.string().openapi({
    description: '試合日',
    example: '2023-07-15T18:00:00Z'
  }),
  opponent: z.string().nullable().openapi({
    description: '対戦相手',
    example: '読売ジャイアンツ'
  }),
  at_bats: z.number().nullable().openapi({
    description: '打数',
    example: 4
  }),
  hits: z.number().nullable().openapi({
    description: 'ヒット数',
    example: 2
  }),
  runs: z.number().nullable().openapi({
    description: '得点',
    example: 1
  }),
  home_runs: z.number().nullable().openapi({
    description: 'ホームラン数',
    example: 1
  }),
  runs_batted_in: z.number().nullable().openapi({
    description: '打点',
    example: 3
  }),
  stolen_bases: z.number().nullable().openapi({
    description: '盗塁数',
    example: 1
  }),
  innings_pitched: z.number().nullable().openapi({
    description: '投球イニング',
    example: 7.0
  }),
  hits_allowed: z.number().nullable().openapi({
    description: '被安打数',
    example: 5
  }),
  earned_runs: z.number().nullable().openapi({
    description: '自責点',
    example: 2
  }),
  strikeouts: z.number().nullable().openapi({
    description: '奪三振数',
    example: 8
  }),
  walks: z.number().nullable().openapi({
    description: '与四球数',
    example: 2
  }),
  created_at: z.string().openapi({
    description: '作成日時',
    example: '2023-01-01T00:00:00Z'
  }),
  updated_at: z.string().openapi({
    description: '更新日時',
    example: '2023-01-01T00:00:00Z'
  })
}).openapi('BaseballGameStatResponse');

// Update schema (all fields optional)
export const baseballGameStatUpdateSchema = z.object({
  player_id: z.number().int().positive().optional().openapi({
    description: '選手ID',
    example: 1
  }),
  game_date: z.string().optional().openapi({
    description: '試合日',
    example: '2023-07-15T18:00:00Z'
  }),
  opponent: z.string().optional().openapi({
    description: '対戦相手',
    example: '読売ジャイアンツ'
  }),
  at_bats: z.number().int().min(0).optional().openapi({
    description: '打数',
    example: 4
  }),
  hits: z.number().int().min(0).optional().openapi({
    description: 'ヒット数',
    example: 2
  }),
  runs: z.number().int().min(0).optional().openapi({
    description: '得点',
    example: 1
  }),
  home_runs: z.number().int().min(0).optional().openapi({
    description: 'ホームラン数',
    example: 1
  }),
  runs_batted_in: z.number().int().min(0).optional().openapi({
    description: '打点',
    example: 3
  }),
  stolen_bases: z.number().int().min(0).optional().openapi({
    description: '盗塁数',
    example: 1
  }),
  innings_pitched: z.number().min(0).optional().openapi({
    description: '投球イニング',
    example: 7.0
  }),
  hits_allowed: z.number().int().min(0).optional().openapi({
    description: '被安打数',
    example: 5
  }),
  earned_runs: z.number().int().min(0).optional().openapi({
    description: '自責点',
    example: 2
  }),
  strikeouts: z.number().int().min(0).optional().openapi({
    description: '奪三振数',
    example: 8
  }),
  walks: z.number().int().min(0).optional().openapi({
    description: '与四球数',
    example: 2
  })
}).openapi('BaseballGameStatUpdate');

// Error response schema
export const errorResponseSchema = z.object({
  error: z.string().openapi({
    description: 'エラーメッセージ',
    example: '入力が無効です'
  })
}).openapi('ErrorResponse');