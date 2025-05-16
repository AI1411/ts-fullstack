import { z } from '@hono/zod-openapi';

// Baseball injury schema for request validation
export const baseballInjurySchema = z.object({
  player_id: z.number().int().positive().openapi({
    description: '選手ID',
    example: 1
  }),
  injury_type: z.string().min(1).openapi({
    description: '怪我の種類',
    example: '肉離れ'
  }),
  body_part: z.string().optional().openapi({
    description: '怪我の部位',
    example: '右ハムストリング'
  }),
  start_date: z.string().openapi({
    description: '怪我の発生日',
    example: '2023-06-15'
  }),
  end_date: z.string().optional().openapi({
    description: '復帰予定日',
    example: '2023-07-15'
  }),
  status: z.string().optional().openapi({
    description: '状態（ACTIVE: 療養中, RECOVERED: 回復, SEASON_ENDING: シーズン終了）',
    example: 'ACTIVE'
  }),
  severity: z.string().optional().openapi({
    description: '重症度（MINOR: 軽度, MODERATE: 中度, SEVERE: 重度）',
    example: 'MODERATE'
  }),
  treatment: z.string().optional().openapi({
    description: '治療内容',
    example: 'リハビリテーション中'
  }),
  notes: z.string().optional().openapi({
    description: '備考',
    example: '2週間の安静後、段階的にリハビリを開始予定'
  })
}).openapi('BaseballInjury');

// Response schema with ID and timestamps
export const baseballInjuryResponseSchema = z.object({
  id: z.number().openapi({
    description: '怪我記録ID',
    example: 1
  }),
  player_id: z.number().openapi({
    description: '選手ID',
    example: 1
  }),
  injury_type: z.string().openapi({
    description: '怪我の種類',
    example: '肉離れ'
  }),
  body_part: z.string().nullable().openapi({
    description: '怪我の部位',
    example: '右ハムストリング'
  }),
  start_date: z.string().openapi({
    description: '怪我の発生日',
    example: '2023-06-15'
  }),
  end_date: z.string().nullable().openapi({
    description: '復帰予定日',
    example: '2023-07-15'
  }),
  status: z.string().openapi({
    description: '状態（ACTIVE: 療養中, RECOVERED: 回復, SEASON_ENDING: シーズン終了）',
    example: 'ACTIVE'
  }),
  severity: z.string().nullable().openapi({
    description: '重症度（MINOR: 軽度, MODERATE: 中度, SEVERE: 重度）',
    example: 'MODERATE'
  }),
  treatment: z.string().nullable().openapi({
    description: '治療内容',
    example: 'リハビリテーション中'
  }),
  notes: z.string().nullable().openapi({
    description: '備考',
    example: '2週間の安静後、段階的にリハビリを開始予定'
  }),
  created_at: z.string().openapi({
    description: '作成日時',
    example: '2023-06-15T10:30:00Z'
  }),
  updated_at: z.string().openapi({
    description: '更新日時',
    example: '2023-06-15T10:30:00Z'
  })
}).openapi('BaseballInjuryResponse');

// Update schema (all fields optional)
export const baseballInjuryUpdateSchema = z.object({
  player_id: z.number().int().positive().optional().openapi({
    description: '選手ID',
    example: 1
  }),
  injury_type: z.string().min(1).optional().openapi({
    description: '怪我の種類',
    example: '肉離れ'
  }),
  body_part: z.string().optional().openapi({
    description: '怪我の部位',
    example: '右ハムストリング'
  }),
  start_date: z.string().optional().openapi({
    description: '怪我の発生日',
    example: '2023-06-15'
  }),
  end_date: z.string().optional().openapi({
    description: '復帰予定日',
    example: '2023-07-15'
  }),
  status: z.string().optional().openapi({
    description: '状態（ACTIVE: 療養中, RECOVERED: 回復, SEASON_ENDING: シーズン終了）',
    example: 'RECOVERED'
  }),
  severity: z.string().optional().openapi({
    description: '重症度（MINOR: 軽度, MODERATE: 中度, SEVERE: 重度）',
    example: 'MODERATE'
  }),
  treatment: z.string().optional().openapi({
    description: '治療内容',
    example: 'リハビリテーション完了'
  }),
  notes: z.string().optional().openapi({
    description: '備考',
    example: '予定通り回復し、チーム練習に合流'
  })
}).openapi('BaseballInjuryUpdate');

// Error response schema
export const errorResponseSchema = z.object({
  error: z.string().openapi({
    description: 'エラーメッセージ',
    example: '入力が無効です'
  })
}).openapi('ErrorResponse');