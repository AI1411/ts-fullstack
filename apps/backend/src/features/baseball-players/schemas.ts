import { z } from '@hono/zod-openapi';

// Baseball player schema for request validation
export const baseballPlayerSchema = z
  .object({
    // 基本情報
    name: z.string().min(1).openapi({
      description: '選手名',
      example: '山田太郎',
    }),
    team: z.string().optional().openapi({
      description: 'チーム名',
      example: '東京ヤクルトスワローズ',
    }),
    position: z.string().optional().openapi({
      description: 'ポジション',
      example: '内野手',
    }),

    // 基本プロフィール情報
    birth_date: z.string().optional().openapi({
      description: '生年月日',
      example: '1992-07-16',
    }),
    height: z.number().min(0).optional().openapi({
      description: '身長（cm）',
      example: 180,
    }),
    weight: z.number().min(0).optional().openapi({
      description: '体重（kg）',
      example: 75,
    }),
    throwing_hand: z.string().optional().openapi({
      description: '投げる手（右投げ/左投げ）',
      example: '右投げ',
    }),
    batting_hand: z.string().optional().openapi({
      description: '打つ手（右打ち/左打ち/両打ち）',
      example: '左打ち',
    }),
    uniform_number: z.number().min(0).optional().openapi({
      description: '背番号',
      example: 1,
    }),
    nationality: z.string().optional().openapi({
      description: '国籍',
      example: '日本',
    }),
    profile_image_url: z.string().optional().openapi({
      description: 'プロフィール画像URL',
      example: 'https://example.com/images/yamada.jpg',
    }),

    // 打撃成績
    batting_average: z.number().min(0).max(1).optional().openapi({
      description: '打率',
      example: 0.309,
    }),
    games_played: z.number().min(0).optional().openapi({
      description: '出場試合数',
      example: 143,
    }),
    at_bats: z.number().min(0).optional().openapi({
      description: '打数',
      example: 546,
    }),
    hits: z.number().min(0).optional().openapi({
      description: '安打数',
      example: 169,
    }),
    doubles: z.number().min(0).optional().openapi({
      description: '二塁打数',
      example: 25,
    }),
    triples: z.number().min(0).optional().openapi({
      description: '三塁打数',
      example: 3,
    }),
    home_runs: z.number().min(0).optional().openapi({
      description: 'ホームラン数',
      example: 38,
    }),
    runs_batted_in: z.number().min(0).optional().openapi({
      description: '打点',
      example: 94,
    }),
    runs_scored: z.number().min(0).optional().openapi({
      description: '得点',
      example: 112,
    }),
    stolen_bases: z.number().min(0).optional().openapi({
      description: '盗塁数',
      example: 21,
    }),
    walks: z.number().min(0).optional().openapi({
      description: '四球数',
      example: 80,
    }),
    strikeouts: z.number().min(0).optional().openapi({
      description: '三振数',
      example: 110,
    }),
    on_base_percentage: z.number().min(0).max(1).optional().openapi({
      description: '出塁率',
      example: 0.427,
    }),
    slugging_percentage: z.number().min(0).optional().openapi({
      description: '長打率',
      example: 0.611,
    }),
    ops: z.number().min(0).optional().openapi({
      description: 'OPS（出塁率＋長打率）',
      example: 1.038,
    }),

    // 投手成績
    era: z.number().min(0).optional().openapi({
      description: '防御率',
      example: 2.45,
    }),
    wins: z.number().min(0).optional().openapi({
      description: '勝利数',
      example: 15,
    }),
    losses: z.number().min(0).optional().openapi({
      description: '敗戦数',
      example: 5,
    }),
    saves: z.number().min(0).optional().openapi({
      description: 'セーブ数',
      example: 0,
    }),
    games_pitched: z.number().min(0).optional().openapi({
      description: '登板試合数',
      example: 25,
    }),
    games_started: z.number().min(0).optional().openapi({
      description: '先発登板数',
      example: 24,
    }),
    complete_games: z.number().min(0).optional().openapi({
      description: '完投数',
      example: 3,
    }),
    shutouts: z.number().min(0).optional().openapi({
      description: '完封数',
      example: 1,
    }),
    innings_pitched: z.number().min(0).optional().openapi({
      description: '投球回数',
      example: 180.2,
    }),
    hits_allowed: z.number().min(0).optional().openapi({
      description: '被安打数',
      example: 150,
    }),
    runs_allowed: z.number().min(0).optional().openapi({
      description: '失点',
      example: 55,
    }),
    earned_runs: z.number().min(0).optional().openapi({
      description: '自責点',
      example: 49,
    }),
    walks_allowed: z.number().min(0).optional().openapi({
      description: '与四球数',
      example: 45,
    }),
    strikeouts_pitched: z.number().min(0).optional().openapi({
      description: '奪三振数',
      example: 200,
    }),
    whip: z.number().min(0).optional().openapi({
      description: 'WHIP（与四死球＋被安打）÷投球回数',
      example: 1.08,
    }),

    // 契約情報
    contract_status: z.string().optional().openapi({
      description: '契約状況',
      example: '在籍中',
    }),
    salary: z.number().min(0).optional().openapi({
      description: '年俸（円）',
      example: 100000000,
    }),
    contract_start_date: z.string().optional().openapi({
      description: '契約開始日',
      example: '2023-01-01',
    }),
    contract_end_date: z.string().optional().openapi({
      description: '契約終了日',
      example: '2025-12-31',
    }),
  })
  .openapi('BaseballPlayer');

// Response schema with ID and timestamps
export const baseballPlayerResponseSchema = z
  .object({
    id: z.number().openapi({
      description: '選手ID',
      example: 1,
    }),
    // 基本情報
    name: z.string().openapi({
      description: '選手名',
      example: '山田太郎',
    }),
    team: z.string().nullable().openapi({
      description: 'チーム名',
      example: '東京ヤクルトスワローズ',
    }),
    position: z.string().nullable().openapi({
      description: 'ポジション',
      example: '内野手',
    }),

    // 基本プロフィール情報
    birth_date: z.string().nullable().openapi({
      description: '生年月日',
      example: '1992-07-16',
    }),
    height: z.number().nullable().openapi({
      description: '身長（cm）',
      example: 180,
    }),
    weight: z.number().nullable().openapi({
      description: '体重（kg）',
      example: 75,
    }),
    throwing_hand: z.string().nullable().openapi({
      description: '投げる手（右投げ/左投げ）',
      example: '右投げ',
    }),
    batting_hand: z.string().nullable().openapi({
      description: '打つ手（右打ち/左打ち/両打ち）',
      example: '左打ち',
    }),
    uniform_number: z.number().nullable().openapi({
      description: '背番号',
      example: 1,
    }),
    nationality: z.string().nullable().openapi({
      description: '国籍',
      example: '日本',
    }),
    profile_image_url: z.string().nullable().openapi({
      description: 'プロフィール画像URL',
      example: 'https://example.com/images/yamada.jpg',
    }),

    // 打撃成績
    batting_average: z.number().nullable().openapi({
      description: '打率',
      example: 0.309,
    }),
    games_played: z.number().nullable().openapi({
      description: '出場試合数',
      example: 143,
    }),
    at_bats: z.number().nullable().openapi({
      description: '打数',
      example: 546,
    }),
    hits: z.number().nullable().openapi({
      description: '安打数',
      example: 169,
    }),
    doubles: z.number().nullable().openapi({
      description: '二塁打数',
      example: 25,
    }),
    triples: z.number().nullable().openapi({
      description: '三塁打数',
      example: 3,
    }),
    home_runs: z.number().nullable().openapi({
      description: 'ホームラン数',
      example: 38,
    }),
    runs_batted_in: z.number().nullable().openapi({
      description: '打点',
      example: 94,
    }),
    runs_scored: z.number().nullable().openapi({
      description: '得点',
      example: 112,
    }),
    stolen_bases: z.number().nullable().openapi({
      description: '盗塁数',
      example: 21,
    }),
    walks: z.number().nullable().openapi({
      description: '四球数',
      example: 80,
    }),
    strikeouts: z.number().nullable().openapi({
      description: '三振数',
      example: 110,
    }),
    on_base_percentage: z.number().nullable().openapi({
      description: '出塁率',
      example: 0.427,
    }),
    slugging_percentage: z.number().nullable().openapi({
      description: '長打率',
      example: 0.611,
    }),
    ops: z.number().nullable().openapi({
      description: 'OPS（出塁率＋長打率）',
      example: 1.038,
    }),

    // 投手成績
    era: z.number().nullable().openapi({
      description: '防御率',
      example: 2.45,
    }),
    wins: z.number().nullable().openapi({
      description: '勝利数',
      example: 15,
    }),
    losses: z.number().nullable().openapi({
      description: '敗戦数',
      example: 5,
    }),
    saves: z.number().nullable().openapi({
      description: 'セーブ数',
      example: 0,
    }),
    games_pitched: z.number().nullable().openapi({
      description: '登板試合数',
      example: 25,
    }),
    games_started: z.number().nullable().openapi({
      description: '先発登板数',
      example: 24,
    }),
    complete_games: z.number().nullable().openapi({
      description: '完投数',
      example: 3,
    }),
    shutouts: z.number().nullable().openapi({
      description: '完封数',
      example: 1,
    }),
    innings_pitched: z.number().nullable().openapi({
      description: '投球回数',
      example: 180.2,
    }),
    hits_allowed: z.number().nullable().openapi({
      description: '被安打数',
      example: 150,
    }),
    runs_allowed: z.number().nullable().openapi({
      description: '失点',
      example: 55,
    }),
    earned_runs: z.number().nullable().openapi({
      description: '自責点',
      example: 49,
    }),
    walks_allowed: z.number().nullable().openapi({
      description: '与四球数',
      example: 45,
    }),
    strikeouts_pitched: z.number().nullable().openapi({
      description: '奪三振数',
      example: 200,
    }),
    whip: z.number().nullable().openapi({
      description: 'WHIP（与四死球＋被安打）÷投球回数',
      example: 1.08,
    }),

    // 契約情報
    contract_status: z.string().nullable().openapi({
      description: '契約状況',
      example: '在籍中',
    }),
    salary: z.number().nullable().openapi({
      description: '年俸（円）',
      example: 100000000,
    }),
    contract_start_date: z.string().nullable().openapi({
      description: '契約開始日',
      example: '2023-01-01',
    }),
    contract_end_date: z.string().nullable().openapi({
      description: '契約終了日',
      example: '2025-12-31',
    }),

    // システム情報
    created_at: z.string().openapi({
      description: '作成日時',
      example: '2023-01-01T00:00:00Z',
    }),
    updated_at: z.string().openapi({
      description: '更新日時',
      example: '2023-01-01T00:00:00Z',
    }),
  })
  .openapi('BaseballPlayerResponse');

// Update schema (all fields optional)
export const baseballPlayerUpdateSchema = z
  .object({
    // 基本情報
    name: z.string().min(1).optional().openapi({
      description: '選手名',
      example: '山田太郎',
    }),
    team: z.string().optional().openapi({
      description: 'チーム名',
      example: '東京ヤクルトスワローズ',
    }),
    position: z.string().optional().openapi({
      description: 'ポジション',
      example: '内野手',
    }),

    // 基本プロフィール情報
    birth_date: z.string().optional().openapi({
      description: '生年月日',
      example: '1992-07-16',
    }),
    height: z.number().min(0).optional().openapi({
      description: '身長（cm）',
      example: 180,
    }),
    weight: z.number().min(0).optional().openapi({
      description: '体重（kg）',
      example: 75,
    }),
    throwing_hand: z.string().optional().openapi({
      description: '投げる手（右投げ/左投げ）',
      example: '右投げ',
    }),
    batting_hand: z.string().optional().openapi({
      description: '打つ手（右打ち/左打ち/両打ち）',
      example: '左打ち',
    }),
    uniform_number: z.number().min(0).optional().openapi({
      description: '背番号',
      example: 1,
    }),
    nationality: z.string().optional().openapi({
      description: '国籍',
      example: '日本',
    }),
    profile_image_url: z.string().optional().openapi({
      description: 'プロフィール画像URL',
      example: 'https://example.com/images/yamada.jpg',
    }),

    // 打撃成績
    batting_average: z.number().min(0).max(1).optional().openapi({
      description: '打率',
      example: 0.309,
    }),
    games_played: z.number().min(0).optional().openapi({
      description: '出場試合数',
      example: 143,
    }),
    at_bats: z.number().min(0).optional().openapi({
      description: '打数',
      example: 546,
    }),
    hits: z.number().min(0).optional().openapi({
      description: '安打数',
      example: 169,
    }),
    doubles: z.number().min(0).optional().openapi({
      description: '二塁打数',
      example: 25,
    }),
    triples: z.number().min(0).optional().openapi({
      description: '三塁打数',
      example: 3,
    }),
    home_runs: z.number().min(0).optional().openapi({
      description: 'ホームラン数',
      example: 38,
    }),
    runs_batted_in: z.number().min(0).optional().openapi({
      description: '打点',
      example: 94,
    }),
    runs_scored: z.number().min(0).optional().openapi({
      description: '得点',
      example: 112,
    }),
    stolen_bases: z.number().min(0).optional().openapi({
      description: '盗塁数',
      example: 21,
    }),
    walks: z.number().min(0).optional().openapi({
      description: '四球数',
      example: 80,
    }),
    strikeouts: z.number().min(0).optional().openapi({
      description: '三振数',
      example: 110,
    }),
    on_base_percentage: z.number().min(0).max(1).optional().openapi({
      description: '出塁率',
      example: 0.427,
    }),
    slugging_percentage: z.number().min(0).optional().openapi({
      description: '長打率',
      example: 0.611,
    }),
    ops: z.number().min(0).optional().openapi({
      description: 'OPS（出塁率＋長打率）',
      example: 1.038,
    }),

    // 投手成績
    era: z.number().min(0).optional().openapi({
      description: '防御率',
      example: 2.45,
    }),
    wins: z.number().min(0).optional().openapi({
      description: '勝利数',
      example: 15,
    }),
    losses: z.number().min(0).optional().openapi({
      description: '敗戦数',
      example: 5,
    }),
    saves: z.number().min(0).optional().openapi({
      description: 'セーブ数',
      example: 0,
    }),
    games_pitched: z.number().min(0).optional().openapi({
      description: '登板試合数',
      example: 25,
    }),
    games_started: z.number().min(0).optional().openapi({
      description: '先発登板数',
      example: 24,
    }),
    complete_games: z.number().min(0).optional().openapi({
      description: '完投数',
      example: 3,
    }),
    shutouts: z.number().min(0).optional().openapi({
      description: '完封数',
      example: 1,
    }),
    innings_pitched: z.number().min(0).optional().openapi({
      description: '投球回数',
      example: 180.2,
    }),
    hits_allowed: z.number().min(0).optional().openapi({
      description: '被安打数',
      example: 150,
    }),
    runs_allowed: z.number().min(0).optional().openapi({
      description: '失点',
      example: 55,
    }),
    earned_runs: z.number().min(0).optional().openapi({
      description: '自責点',
      example: 49,
    }),
    walks_allowed: z.number().min(0).optional().openapi({
      description: '与四球数',
      example: 45,
    }),
    strikeouts_pitched: z.number().min(0).optional().openapi({
      description: '奪三振数',
      example: 200,
    }),
    whip: z.number().min(0).optional().openapi({
      description: 'WHIP（与四死球＋被安打）÷投球回数',
      example: 1.08,
    }),

    // 契約情報
    contract_status: z.string().optional().openapi({
      description: '契約状況',
      example: '在籍中',
    }),
    salary: z.number().min(0).optional().openapi({
      description: '年俸（円）',
      example: 100000000,
    }),
    contract_start_date: z.string().optional().openapi({
      description: '契約開始日',
      example: '2023-01-01',
    }),
    contract_end_date: z.string().optional().openapi({
      description: '契約終了日',
      example: '2025-12-31',
    }),
  })
  .openapi('BaseballPlayerUpdate');

// Error response schema
export const errorResponseSchema = z
  .object({
    error: z.string().openapi({
      description: 'エラーメッセージ',
      example: '入力が無効です',
    }),
  })
  .openapi('ErrorResponse');
