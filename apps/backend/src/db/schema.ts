import {
  boolean,
  index,
  integer,
  numeric,
  pgTable,
  serial,
  text,
  timestamp,
  uniqueIndex,
  varchar,
} from 'drizzle-orm/pg-core';

export const baseballPlayersTable = pgTable(
  'baseball_players',
  {
    id: serial('id').primaryKey(),
    name: varchar('name', { length: 100 }).notNull(),
    team: varchar('team', { length: 100 }),
    position: varchar('position', { length: 50 }),
    // 基本プロフィール情報
    birth_date: timestamp('birth_date'),
    height: integer('height'), // cm単位
    weight: integer('weight'), // kg単位
    throwing_hand: varchar('throwing_hand', { length: 20 }), // 右投げ/左投げ
    batting_hand: varchar('batting_hand', { length: 20 }), // 右打ち/左打ち/両打ち
    uniform_number: integer('uniform_number'),
    nationality: varchar('nationality', { length: 50 }),
    profile_image_url: varchar('profile_image_url', { length: 255 }),
    // 打撃成績
    batting_average: numeric('batting_average', { precision: 4, scale: 3 }),
    games_played: integer('games_played'),
    at_bats: integer('at_bats'),
    hits: integer('hits'),
    doubles: integer('doubles'),
    triples: integer('triples'),
    home_runs: integer('home_runs'),
    runs_batted_in: integer('runs_batted_in'),
    runs_scored: integer('runs_scored'),
    stolen_bases: integer('stolen_bases'),
    walks: integer('walks'),
    strikeouts: integer('strikeouts'),
    on_base_percentage: numeric('on_base_percentage', {
      precision: 4,
      scale: 3,
    }),
    slugging_percentage: numeric('slugging_percentage', {
      precision: 4,
      scale: 3,
    }),
    ops: numeric('ops', { precision: 4, scale: 3 }),
    // 投手成績
    era: numeric('era', { precision: 5, scale: 2 }),
    wins: integer('wins'),
    losses: integer('losses'),
    saves: integer('saves'),
    games_pitched: integer('games_pitched'),
    games_started: integer('games_started'),
    complete_games: integer('complete_games'),
    shutouts: integer('shutouts'),
    innings_pitched: numeric('innings_pitched', { precision: 6, scale: 1 }),
    hits_allowed: integer('hits_allowed'),
    runs_allowed: integer('runs_allowed'),
    earned_runs: integer('earned_runs'),
    walks_allowed: integer('walks_allowed'),
    strikeouts_pitched: integer('strikeouts_pitched'),
    whip: numeric('whip', { precision: 4, scale: 3 }),
    // 契約情報
    contract_status: varchar('contract_status', { length: 50 }),
    salary: integer('salary'),
    contract_start_date: timestamp('contract_start_date'),
    contract_end_date: timestamp('contract_end_date'),
    // システム情報
    created_at: timestamp('created_at').defaultNow().notNull(),
    updated_at: timestamp('updated_at').defaultNow().notNull(),
  },
  (table) => {
    return {
      nameIdx: index('idx_baseball_players_name').on(table.name),
      teamIdx: index('idx_baseball_players_team').on(table.team),
      positionIdx: index('idx_baseball_players_position').on(table.position),
      birthDateIdx: index('idx_baseball_players_birth_date').on(
        table.birth_date
      ),
      throwingHandIdx: index('idx_baseball_players_throwing_hand').on(
        table.throwing_hand
      ),
      battingHandIdx: index('idx_baseball_players_batting_hand').on(
        table.batting_hand
      ),
      createdAtIdx: index('idx_baseball_players_created_at').on(
        table.created_at
      ),
      updatedAtIdx: index('idx_baseball_players_updated_at').on(
        table.updated_at
      ),
    };
  }
);

// 野球チームテーブル
export const baseballTeamsTable = pgTable(
  'baseball_teams',
  {
    id: serial('id').primaryKey(),
    name: varchar('name', { length: 100 }).notNull(),
    abbreviation: varchar('abbreviation', { length: 10 }),
    league: varchar('league', { length: 50 }),
    division: varchar('division', { length: 50 }),
    home_stadium: varchar('home_stadium', { length: 100 }),
    city: varchar('city', { length: 100 }),
    founded_year: integer('founded_year'),
    team_color: varchar('team_color', { length: 20 }),
    logo_url: varchar('logo_url', { length: 255 }),
    website_url: varchar('website_url', { length: 255 }),
    description: text('description'),
    created_at: timestamp('created_at').defaultNow().notNull(),
    updated_at: timestamp('updated_at').defaultNow().notNull(),
  },
  (table) => {
    return {
      nameIdx: index('idx_baseball_teams_name').on(table.name),
      leagueIdx: index('idx_baseball_teams_league').on(table.league),
      divisionIdx: index('idx_baseball_teams_division').on(table.division),
      createdAtIdx: index('idx_baseball_teams_created_at').on(table.created_at),
      updatedAtIdx: index('idx_baseball_teams_updated_at').on(table.updated_at),
    };
  }
);

// 野球試合テーブル
export const baseballGamesTable = pgTable(
  'baseball_games',
  {
    id: serial('id').primaryKey(),
    date: timestamp('date').notNull(),
    home_team_id: integer('home_team_id')
      .references(() => baseballTeamsTable.id, { onDelete: 'cascade' })
      .notNull(),
    away_team_id: integer('away_team_id')
      .references(() => baseballTeamsTable.id, { onDelete: 'cascade' })
      .notNull(),
    stadium: varchar('stadium', { length: 100 }),
    home_score: integer('home_score'),
    away_score: integer('away_score'),
    status: varchar('status', { length: 20 }).default('SCHEDULED'), // SCHEDULED, IN_PROGRESS, COMPLETED, POSTPONED, CANCELLED
    start_time: timestamp('start_time'),
    end_time: timestamp('end_time'),
    attendance: integer('attendance'),
    weather: varchar('weather', { length: 50 }),
    notes: text('notes'),
    created_at: timestamp('created_at').defaultNow().notNull(),
    updated_at: timestamp('updated_at').defaultNow().notNull(),
  },
  (table) => {
    return {
      dateIdx: index('idx_baseball_games_date').on(table.date),
      homeTeamIdIdx: index('idx_baseball_games_home_team_id').on(
        table.home_team_id
      ),
      awayTeamIdIdx: index('idx_baseball_games_away_team_id').on(
        table.away_team_id
      ),
      statusIdx: index('idx_baseball_games_status').on(table.status),
      createdAtIdx: index('idx_baseball_games_created_at').on(table.created_at),
      updatedAtIdx: index('idx_baseball_games_updated_at').on(table.updated_at),
    };
  }
);

// 野球選手の怪我・コンディション管理テーブル
export const baseballPlayerInjuriesTable = pgTable(
  'baseball_player_injuries',
  {
    id: serial('id').primaryKey(),
    player_id: integer('player_id')
      .references(() => baseballPlayersTable.id, { onDelete: 'cascade' })
      .notNull(),
    injury_type: varchar('injury_type', { length: 100 }).notNull(),
    body_part: varchar('body_part', { length: 50 }),
    start_date: timestamp('start_date').notNull(),
    end_date: timestamp('end_date'),
    status: varchar('status', { length: 30 }).default('ACTIVE'), // ACTIVE, RECOVERED, SEASON_ENDING
    severity: varchar('severity', { length: 30 }), // MINOR, MODERATE, SEVERE
    treatment: text('treatment'),
    notes: text('notes'),
    created_at: timestamp('created_at').defaultNow().notNull(),
    updated_at: timestamp('updated_at').defaultNow().notNull(),
  },
  (table) => {
    return {
      playerIdIdx: index('idx_baseball_player_injuries_player_id').on(
        table.player_id
      ),
      injuryTypeIdx: index('idx_baseball_player_injuries_injury_type').on(
        table.injury_type
      ),
      statusIdx: index('idx_baseball_player_injuries_status').on(table.status),
      startDateIdx: index('idx_baseball_player_injuries_start_date').on(
        table.start_date
      ),
      endDateIdx: index('idx_baseball_player_injuries_end_date').on(
        table.end_date
      ),
      createdAtIdx: index('idx_baseball_player_injuries_created_at').on(
        table.created_at
      ),
      updatedAtIdx: index('idx_baseball_player_injuries_updated_at').on(
        table.updated_at
      ),
    };
  }
);

// 野球選手のメディアコンテンツテーブル
export const baseballPlayerMediaTable = pgTable(
  'baseball_player_media',
  {
    id: serial('id').primaryKey(),
    player_id: integer('player_id')
      .references(() => baseballPlayersTable.id, { onDelete: 'cascade' })
      .notNull(),
    media_type: varchar('media_type', { length: 30 }).notNull(), // IMAGE, VIDEO, DOCUMENT, INTERVIEW
    title: varchar('title', { length: 255 }).notNull(),
    description: text('description'),
    url: varchar('url', { length: 255 }).notNull(),
    thumbnail_url: varchar('thumbnail_url', { length: 255 }),
    publication_date: timestamp('publication_date'),
    source: varchar('source', { length: 100 }),
    is_featured: boolean('is_featured').default(false),
    created_at: timestamp('created_at').defaultNow().notNull(),
    updated_at: timestamp('updated_at').defaultNow().notNull(),
  },
  (table) => {
    return {
      playerIdIdx: index('idx_baseball_player_media_player_id').on(
        table.player_id
      ),
      mediaTypeIdx: index('idx_baseball_player_media_media_type').on(
        table.media_type
      ),
      isFeaturedIdx: index('idx_baseball_player_media_is_featured').on(
        table.is_featured
      ),
      publicationDateIdx: index(
        'idx_baseball_player_media_publication_date'
      ).on(table.publication_date),
      createdAtIdx: index('idx_baseball_player_media_created_at').on(
        table.created_at
      ),
      updatedAtIdx: index('idx_baseball_player_media_updated_at').on(
        table.updated_at
      ),
    };
  }
);

// 野球選手の試合統計テーブル（拡張版）
export const baseballGameStatsTable = pgTable(
  'baseball_game_stats',
  {
    id: serial('id').primaryKey(),
    player_id: integer('player_id')
      .references(() => baseballPlayersTable.id, { onDelete: 'cascade' })
      .notNull(),
    game_id: integer('game_id')
      .references(() => baseballGamesTable.id, { onDelete: 'cascade' })
      .notNull(),
    team_id: integer('team_id')
      .references(() => baseballTeamsTable.id, { onDelete: 'cascade' })
      .notNull(),
    // 打撃成績
    at_bats: integer('at_bats'),
    plate_appearances: integer('plate_appearances'),
    hits: integer('hits'),
    doubles: integer('doubles'),
    triples: integer('triples'),
    home_runs: integer('home_runs'),
    runs: integer('runs'),
    runs_batted_in: integer('runs_batted_in'),
    stolen_bases: integer('stolen_bases'),
    caught_stealing: integer('caught_stealing'),
    walks: integer('walks'),
    strikeouts: integer('strikeouts'),
    hit_by_pitch: integer('hit_by_pitch'),
    sacrifice_hits: integer('sacrifice_hits'),
    sacrifice_flies: integer('sacrifice_flies'),
    ground_into_double_play: integer('ground_into_double_play'),
    // 投手成績
    innings_pitched: numeric('innings_pitched', { precision: 4, scale: 1 }),
    hits_allowed: integer('hits_allowed'),
    runs_allowed: integer('runs_allowed'),
    earned_runs: integer('earned_runs'),
    walks_allowed: integer('walks_allowed'),
    strikeouts_pitched: integer('strikeouts_pitched'),
    home_runs_allowed: integer('home_runs_allowed'),
    batters_faced: integer('batters_faced'),
    pitches_thrown: integer('pitches_thrown'),
    win: boolean('win').default(false),
    loss: boolean('loss').default(false),
    save: boolean('save').default(false),
    hold: boolean('hold').default(false),
    blown_save: boolean('blown_save').default(false),
    // 守備成績
    innings_fielded: numeric('innings_fielded', { precision: 4, scale: 1 }),
    putouts: integer('putouts'),
    assists: integer('assists'),
    errors: integer('errors'),
    double_plays: integer('double_plays'),
    passed_balls: integer('passed_balls'),
    // システム情報
    created_at: timestamp('created_at').defaultNow().notNull(),
    updated_at: timestamp('updated_at').defaultNow().notNull(),
  },
  (table) => {
    return {
      playerIdIdx: index('idx_baseball_game_stats_player_id').on(
        table.player_id
      ),
      gameIdIdx: index('idx_baseball_game_stats_game_id').on(table.game_id),
      teamIdIdx: index('idx_baseball_game_stats_team_id').on(table.team_id),
      createdAtIdx: index('idx_baseball_game_stats_created_at').on(
        table.created_at
      ),
      updatedAtIdx: index('idx_baseball_game_stats_updated_at').on(
        table.updated_at
      ),
    };
  }
);

// 野球選手の対戦相手別成績テーブル
export const baseballPlayerMatchupsTable = pgTable(
  'baseball_player_matchups',
  {
    id: serial('id').primaryKey(),
    player_id: integer('player_id')
      .references(() => baseballPlayersTable.id, { onDelete: 'cascade' })
      .notNull(),
    opponent_player_id: integer('opponent_player_id')
      .references(() => baseballPlayersTable.id, { onDelete: 'cascade' })
      .notNull(),
    opponent_team_id: integer('opponent_team_id')
      .references(() => baseballTeamsTable.id, { onDelete: 'cascade' })
      .notNull(),
    // 打者 vs 投手の成績
    at_bats: integer('at_bats'),
    hits: integer('hits'),
    doubles: integer('doubles'),
    triples: integer('triples'),
    home_runs: integer('home_runs'),
    runs_batted_in: integer('runs_batted_in'),
    walks: integer('walks'),
    strikeouts: integer('strikeouts'),
    hit_by_pitch: integer('hit_by_pitch'),
    batting_average: numeric('batting_average', { precision: 4, scale: 3 }),
    on_base_percentage: numeric('on_base_percentage', {
      precision: 4,
      scale: 3,
    }),
    slugging_percentage: numeric('slugging_percentage', {
      precision: 4,
      scale: 3,
    }),
    // 投手 vs 打者の成績
    innings_pitched: numeric('innings_pitched', { precision: 4, scale: 1 }),
    batters_faced: integer('batters_faced'),
    earned_runs: integer('earned_runs'),
    // 集計期間
    season_year: integer('season_year'),
    is_career: boolean('is_career').default(false),
    last_updated: timestamp('last_updated').defaultNow().notNull(),
    created_at: timestamp('created_at').defaultNow().notNull(),
    updated_at: timestamp('updated_at').defaultNow().notNull(),
  },
  (table) => {
    return {
      playerIdIdx: index('idx_baseball_player_matchups_player_id').on(
        table.player_id
      ),
      opponentPlayerIdIdx: index(
        'idx_baseball_player_matchups_opponent_player_id'
      ).on(table.opponent_player_id),
      opponentTeamIdIdx: index(
        'idx_baseball_player_matchups_opponent_team_id'
      ).on(table.opponent_team_id),
      seasonYearIdx: index('idx_baseball_player_matchups_season_year').on(
        table.season_year
      ),
      isCareerIdx: index('idx_baseball_player_matchups_is_career').on(
        table.is_career
      ),
      createdAtIdx: index('idx_baseball_player_matchups_created_at').on(
        table.created_at
      ),
      updatedAtIdx: index('idx_baseball_player_matchups_updated_at').on(
        table.updated_at
      ),
    };
  }
);

// 野球選手のシーズン成績テーブル
export const baseballPlayerSeasonsTable = pgTable(
  'baseball_player_seasons',
  {
    id: serial('id').primaryKey(),
    player_id: integer('player_id')
      .references(() => baseballPlayersTable.id, { onDelete: 'cascade' })
      .notNull(),
    team_id: integer('team_id')
      .references(() => baseballTeamsTable.id, { onDelete: 'cascade' })
      .notNull(),
    season_year: integer('season_year').notNull(),
    // 打撃成績
    games_played: integer('games_played'),
    at_bats: integer('at_bats'),
    plate_appearances: integer('plate_appearances'),
    hits: integer('hits'),
    doubles: integer('doubles'),
    triples: integer('triples'),
    home_runs: integer('home_runs'),
    runs_scored: integer('runs_scored'),
    runs_batted_in: integer('runs_batted_in'),
    stolen_bases: integer('stolen_bases'),
    caught_stealing: integer('caught_stealing'),
    walks: integer('walks'),
    strikeouts: integer('strikeouts'),
    hit_by_pitch: integer('hit_by_pitch'),
    sacrifice_hits: integer('sacrifice_hits'),
    sacrifice_flies: integer('sacrifice_flies'),
    batting_average: numeric('batting_average', { precision: 4, scale: 3 }),
    on_base_percentage: numeric('on_base_percentage', {
      precision: 4,
      scale: 3,
    }),
    slugging_percentage: numeric('slugging_percentage', {
      precision: 4,
      scale: 3,
    }),
    ops: numeric('ops', { precision: 4, scale: 3 }),
    war: numeric('war', { precision: 4, scale: 1 }),
    // 投手成績
    games_pitched: integer('games_pitched'),
    games_started: integer('games_started'),
    complete_games: integer('complete_games'),
    shutouts: integer('shutouts'),
    wins: integer('wins'),
    losses: integer('losses'),
    saves: integer('saves'),
    holds: integer('holds'),
    blown_saves: integer('blown_saves'),
    innings_pitched: numeric('innings_pitched', { precision: 6, scale: 1 }),
    hits_allowed: integer('hits_allowed'),
    runs_allowed: integer('runs_allowed'),
    earned_runs: integer('earned_runs'),
    home_runs_allowed: integer('home_runs_allowed'),
    walks_allowed: integer('walks_allowed'),
    strikeouts_pitched: integer('strikeouts_pitched'),
    era: numeric('era', { precision: 5, scale: 2 }),
    whip: numeric('whip', { precision: 4, scale: 3 }),
    fip: numeric('fip', { precision: 4, scale: 2 }),
    pitcher_war: numeric('pitcher_war', { precision: 4, scale: 1 }),
    // 守備成績
    games_fielded: integer('games_fielded'),
    innings_fielded: numeric('innings_fielded', { precision: 6, scale: 1 }),
    putouts: integer('putouts'),
    assists: integer('assists'),
    errors: integer('errors'),
    double_plays: integer('double_plays'),
    fielding_percentage: numeric('fielding_percentage', {
      precision: 4,
      scale: 3,
    }),
    range_factor: numeric('range_factor', { precision: 4, scale: 2 }),
    // システム情報
    created_at: timestamp('created_at').defaultNow().notNull(),
    updated_at: timestamp('updated_at').defaultNow().notNull(),
  },
  (table) => {
    return {
      playerIdIdx: index('idx_baseball_player_seasons_player_id').on(
        table.player_id
      ),
      teamIdIdx: index('idx_baseball_player_seasons_team_id').on(table.team_id),
      seasonYearIdx: index('idx_baseball_player_seasons_season_year').on(
        table.season_year
      ),
      createdAtIdx: index('idx_baseball_player_seasons_created_at').on(
        table.created_at
      ),
      updatedAtIdx: index('idx_baseball_player_seasons_updated_at').on(
        table.updated_at
      ),
    };
  }
);

// 野球選手のキャリア成績テーブル
export const baseballPlayerCareersTable = pgTable(
  'baseball_player_careers',
  {
    id: serial('id').primaryKey(),
    player_id: integer('player_id')
      .references(() => baseballPlayersTable.id, { onDelete: 'cascade' })
      .notNull(),
    // 打撃成績
    total_seasons: integer('total_seasons'),
    total_games_played: integer('total_games_played'),
    total_at_bats: integer('total_at_bats'),
    total_hits: integer('total_hits'),
    total_doubles: integer('total_doubles'),
    total_triples: integer('total_triples'),
    total_home_runs: integer('total_home_runs'),
    total_runs_scored: integer('total_runs_scored'),
    total_runs_batted_in: integer('total_runs_batted_in'),
    total_stolen_bases: integer('total_stolen_bases'),
    total_walks: integer('total_walks'),
    total_strikeouts: integer('total_strikeouts'),
    career_batting_average: numeric('career_batting_average', {
      precision: 4,
      scale: 3,
    }),
    career_on_base_percentage: numeric('career_on_base_percentage', {
      precision: 4,
      scale: 3,
    }),
    career_slugging_percentage: numeric('career_slugging_percentage', {
      precision: 4,
      scale: 3,
    }),
    career_ops: numeric('career_ops', { precision: 4, scale: 3 }),
    career_war: numeric('career_war', { precision: 5, scale: 1 }),
    // 投手成績
    total_games_pitched: integer('total_games_pitched'),
    total_games_started: integer('total_games_started'),
    total_complete_games: integer('total_complete_games'),
    total_shutouts: integer('total_shutouts'),
    total_wins: integer('total_wins'),
    total_losses: integer('total_losses'),
    total_saves: integer('total_saves'),
    total_innings_pitched: numeric('total_innings_pitched', {
      precision: 7,
      scale: 1,
    }),
    total_strikeouts_pitched: integer('total_strikeouts_pitched'),
    career_era: numeric('career_era', { precision: 5, scale: 2 }),
    career_whip: numeric('career_whip', { precision: 4, scale: 3 }),
    career_pitcher_war: numeric('career_pitcher_war', {
      precision: 5,
      scale: 1,
    }),
    // 守備成績
    total_putouts: integer('total_putouts'),
    total_assists: integer('total_assists'),
    total_errors: integer('total_errors'),
    career_fielding_percentage: numeric('career_fielding_percentage', {
      precision: 4,
      scale: 3,
    }),
    // 受賞歴・記録
    awards: text('awards'),
    records: text('records'),
    // システム情報
    last_updated: timestamp('last_updated').defaultNow().notNull(),
    created_at: timestamp('created_at').defaultNow().notNull(),
    updated_at: timestamp('updated_at').defaultNow().notNull(),
  },
  (table) => {
    return {
      playerIdIdx: index('idx_baseball_player_careers_player_id').on(
        table.player_id
      ),
      lastUpdatedIdx: index('idx_baseball_player_careers_last_updated').on(
        table.last_updated
      ),
      createdAtIdx: index('idx_baseball_player_careers_created_at').on(
        table.created_at
      ),
      updatedAtIdx: index('idx_baseball_player_careers_updated_at').on(
        table.updated_at
      ),
    };
  }
);

// 野球データのインポート/エクスポート履歴テーブル
export const baseballDataImportExportTable = pgTable(
  'baseball_data_import_export',
  {
    id: serial('id').primaryKey(),
    operation_type: varchar('operation_type', { length: 20 }).notNull(), // IMPORT, EXPORT
    file_name: varchar('file_name', { length: 255 }).notNull(),
    file_format: varchar('file_format', { length: 20 }).notNull(), // CSV, JSON, XML
    data_type: varchar('data_type', { length: 50 }).notNull(), // PLAYERS, TEAMS, GAMES, STATS
    record_count: integer('record_count'),
    status: varchar('status', { length: 20 }).default('PENDING').notNull(), // PENDING, COMPLETED, FAILED
    error_message: text('error_message'),
    executed_by: integer('executed_by').references(() => usersTable.id),
    executed_at: timestamp('executed_at').defaultNow().notNull(),
    created_at: timestamp('created_at').defaultNow().notNull(),
    updated_at: timestamp('updated_at').defaultNow().notNull(),
  },
  (table) => {
    return {
      operationTypeIdx: index(
        'idx_baseball_data_import_export_operation_type'
      ).on(table.operation_type),
      dataTypeIdx: index('idx_baseball_data_import_export_data_type').on(
        table.data_type
      ),
      statusIdx: index('idx_baseball_data_import_export_status').on(
        table.status
      ),
      executedAtIdx: index('idx_baseball_data_import_export_executed_at').on(
        table.executed_at
      ),
      createdAtIdx: index('idx_baseball_data_import_export_created_at').on(
        table.created_at
      ),
      updatedAtIdx: index('idx_baseball_data_import_export_updated_at').on(
        table.updated_at
      ),
    };
  }
);

export const contactsTable = pgTable(
  'contacts',
  {
    id: serial('id').primaryKey(),
    name: varchar('name', { length: 100 }).notNull(),
    email: varchar('email', { length: 255 }).notNull(),
    phone: varchar('phone', { length: 50 }),
    subject: varchar('subject', { length: 255 }).notNull(),
    message: text('message').notNull(),
    status: varchar('status', { length: 64 }).default('PENDING').notNull(),
    created_at: timestamp('created_at').defaultNow().notNull(),
    updated_at: timestamp('updated_at').defaultNow().notNull(),
  },
  (table) => {
    return {
      nameIdx: index('idx_contacts_name').on(table.name),
      emailIdx: index('idx_contacts_email').on(table.email),
      statusIdx: index('idx_contacts_status').on(table.status),
      createdAtIdx: index('idx_contacts_created_at').on(table.created_at),
      updatedAtIdx: index('idx_contacts_updated_at').on(table.updated_at),
    };
  }
);

export const countriesTable = pgTable(
  'countries',
  {
    id: serial('id').primaryKey(),
    name: varchar('name', { length: 255 }).notNull(),
    code: varchar('code', { length: 10 }),
    flag_url: varchar('flag_url', { length: 255 }),
    created_at: timestamp('created_at').defaultNow().notNull(),
    updated_at: timestamp('updated_at').defaultNow().notNull(),
  },
  (table) => {
    return {
      nameIdx: index('idx_countries_name').on(table.name),
      codeIdx: index('idx_countries_code').on(table.code),
      createdAtIdx: index('idx_countries_created_at').on(table.created_at),
      updatedAtIdx: index('idx_countries_updated_at').on(table.updated_at),
    };
  }
);

export const companiesTable = pgTable(
  'companies',
  {
    id: serial('id').primaryKey(),
    name: varchar('name', { length: 255 }).notNull(),
    description: text('description'),
    address: varchar('address', { length: 255 }),
    phone: varchar('phone', { length: 50 }),
    email: varchar('email', { length: 255 }),
    website: varchar('website', { length: 255 }),
    created_at: timestamp('created_at').defaultNow().notNull(),
    updated_at: timestamp('updated_at').defaultNow().notNull(),
  },
  (table) => {
    return {
      nameIdx: index('idx_companies_name').on(table.name),
      emailIdx: index('idx_companies_email').on(table.email),
      createdAtIdx: index('idx_companies_created_at').on(table.created_at),
      updatedAtIdx: index('idx_companies_updated_at').on(table.updated_at),
    };
  }
);

export const inquiriesTable = pgTable(
  'inquiries',
  {
    id: serial('id').primaryKey(),
    name: varchar('name', { length: 100 }).notNull(),
    email: varchar('email', { length: 255 }).notNull(),
    subject: varchar('subject', { length: 255 }).notNull(),
    message: text('message').notNull(),
    status: varchar('status', { length: 64 }).default('PENDING').notNull(),
    created_at: timestamp('created_at').defaultNow().notNull(),
    updated_at: timestamp('updated_at').defaultNow().notNull(),
  },
  (table) => {
    return {
      nameIdx: index('idx_inquiries_name').on(table.name),
      emailIdx: index('idx_inquiries_email').on(table.email),
      statusIdx: index('idx_inquiries_status').on(table.status),
      createdAtIdx: index('idx_inquiries_created_at').on(table.created_at),
      updatedAtIdx: index('idx_inquiries_updated_at').on(table.updated_at),
    };
  }
);

export const categoriesTable = pgTable(
  'categories',
  {
    id: serial('id').primaryKey(),
    name: varchar('name', { length: 64 }).notNull(),
    description: text('description'),
    created_at: timestamp('created_at').defaultNow().notNull(),
    updated_at: timestamp('updated_at').defaultNow().notNull(),
  },
  (table) => {
    return {
      nameIdx: index('idx_categories_name').on(table.name),
      createdAtIdx: index('idx_categories_created_at').on(table.created_at),
      updatedAtIdx: index('idx_categories_updated_at').on(table.updated_at),
    };
  }
);

export const teamsTable = pgTable(
  'teams',
  {
    id: serial('id').primaryKey(),
    name: varchar('name', { length: 64 }).notNull(),
    description: text('description'),
    created_at: timestamp('created_at').defaultNow().notNull(),
    updated_at: timestamp('updated_at').defaultNow().notNull(),
  },
  (table) => {
    return {
      nameIdx: index('idx_teams_name').on(table.name),
      createdAtIdx: index('idx_teams_created_at').on(table.created_at),
      updatedAtIdx: index('idx_teams_updated_at').on(table.updated_at),
    };
  }
);

export const usersTable = pgTable(
  'users',
  {
    id: serial('id').primaryKey(),
    name: varchar('name', { length: 64 }).notNull(),
    email: varchar('email', { length: 255 }).notNull().unique(),
    password: varchar('password', { length: 255 }).notNull(),
    created_at: timestamp('created_at').defaultNow().notNull(),
    updated_at: timestamp('updated_at').defaultNow().notNull(),
  },
  (table) => {
    return {
      nameIdx: index('idx_users_name').on(table.name),
      createdAtIdx: index('idx_users_created_at').on(table.created_at),
      updatedAtIdx: index('idx_users_updated_at').on(table.updated_at),
      emailUnique: uniqueIndex('email_unique').on(table.email),
    };
  }
);

export const todosTable = pgTable(
  'todos',
  {
    id: serial('id').primaryKey(),
    user_id: integer('user_id').references(() => usersTable.id, {
      onDelete: 'cascade',
    }),
    title: varchar('title', { length: 255 }).notNull(),
    description: text('description'),
    status: varchar('status', { length: 64 }).default('PENDING'),
    created_at: timestamp('created_at').defaultNow().notNull(),
    updated_at: timestamp('updated_at').defaultNow().notNull(),
  },
  (table) => {
    return {
      userIdIdx: index('idx_todos_user_id').on(table.user_id),
      titleIdx: index('idx_todos_title').on(table.title),
      statusIdx: index('idx_todos_status').on(table.status),
      createdAtIdx: index('idx_todos_created_at').on(table.created_at),
      updatedAtIdx: index('idx_todos_updated_at').on(table.updated_at),
    };
  }
);

export const tasksTable = pgTable(
  'tasks',
  {
    id: serial('id').primaryKey(),
    user_id: integer('user_id').references(() => usersTable.id, {
      onDelete: 'cascade',
    }),
    team_id: integer('team_id').references(() => teamsTable.id, {
      onDelete: 'cascade',
    }),
    title: varchar('title', { length: 255 }).notNull(),
    description: text('description'),
    status: varchar('status', { length: 64 }).default('PENDING'),
    due_date: timestamp('due_date'),
    created_at: timestamp('created_at').defaultNow().notNull(),
    updated_at: timestamp('updated_at').defaultNow().notNull(),
  },
  (table) => {
    return {
      userIdIdx: index('idx_tasks_user_id').on(table.user_id),
      teamIdIdx: index('idx_tasks_team_id').on(table.team_id),
      titleIdx: index('idx_tasks_title').on(table.title),
      statusIdx: index('idx_tasks_status').on(table.status),
      dueDateIdx: index('idx_tasks_due_date').on(table.due_date),
      createdAtIdx: index('idx_tasks_created_at').on(table.created_at),
      updatedAtIdx: index('idx_tasks_updated_at').on(table.updated_at),
    };
  }
);

export const notificationsTable = pgTable(
  'notifications',
  {
    id: serial('id').primaryKey(),
    user_id: integer('user_id').references(() => usersTable.id, {
      onDelete: 'cascade',
    }),
    title: varchar('title', { length: 255 }).notNull(),
    message: text('message').notNull(),
    is_read: boolean('is_read').default(false),
    created_at: timestamp('created_at').defaultNow().notNull(),
    updated_at: timestamp('updated_at').defaultNow().notNull(),
  },
  (table) => {
    return {
      userIdIdx: index('idx_notifications_user_id').on(table.user_id),
      isReadIdx: index('idx_notifications_is_read').on(table.is_read),
      createdAtIdx: index('idx_notifications_created_at').on(table.created_at),
      updatedAtIdx: index('idx_notifications_updated_at').on(table.updated_at),
    };
  }
);

export const subTasksTable = pgTable(
  'sub_tasks',
  {
    id: serial('id').primaryKey(),
    task_id: integer('task_id')
      .references(() => tasksTable.id, { onDelete: 'cascade' })
      .notNull(),
    title: varchar('title', { length: 255 }).notNull(),
    description: text('description'),
    status: varchar('status', { length: 64 }).default('PENDING'),
    due_date: timestamp('due_date'),
    created_at: timestamp('created_at').defaultNow().notNull(),
    updated_at: timestamp('updated_at').defaultNow().notNull(),
  },
  (table) => {
    return {
      taskIdIdx: index('idx_sub_tasks_task_id').on(table.task_id),
      titleIdx: index('idx_sub_tasks_title').on(table.title),
      statusIdx: index('idx_sub_tasks_status').on(table.status),
      dueDateIdx: index('idx_sub_tasks_due_date').on(table.due_date),
      createdAtIdx: index('idx_sub_tasks_created_at').on(table.created_at),
      updatedAtIdx: index('idx_sub_tasks_updated_at').on(table.updated_at),
    };
  }
);

export const chatsTable = pgTable(
  'chats',
  {
    id: serial('id').primaryKey(),
    creator_id: integer('creator_id')
      .references(() => usersTable.id, { onDelete: 'cascade' })
      .notNull(),
    recipient_id: integer('recipient_id')
      .references(() => usersTable.id, { onDelete: 'cascade' })
      .notNull(),
    created_at: timestamp('created_at').defaultNow().notNull(),
    updated_at: timestamp('updated_at').defaultNow().notNull(),
  },
  (table) => {
    return {
      creatorIdIdx: index('idx_chats_creator_id').on(table.creator_id),
      recipientIdIdx: index('idx_chats_recipient_id').on(table.recipient_id),
      createdAtIdx: index('idx_chats_created_at').on(table.created_at),
      updatedAtIdx: index('idx_chats_updated_at').on(table.updated_at),
    };
  }
);

export const chatMessagesTable = pgTable(
  'chat_messages',
  {
    id: serial('id').primaryKey(),
    chat_id: integer('chat_id')
      .references(() => chatsTable.id, { onDelete: 'cascade' })
      .notNull(),
    sender_id: integer('sender_id')
      .references(() => usersTable.id, { onDelete: 'cascade' })
      .notNull(),
    content: text('content').notNull(),
    is_read: boolean('is_read').default(false),
    created_at: timestamp('created_at').defaultNow().notNull(),
    updated_at: timestamp('updated_at').defaultNow().notNull(),
  },
  (table) => {
    return {
      chatIdIdx: index('idx_chat_messages_chat_id').on(table.chat_id),
      senderIdIdx: index('idx_chat_messages_sender_id').on(table.sender_id),
      isReadIdx: index('idx_chat_messages_is_read').on(table.is_read),
      createdAtIdx: index('idx_chat_messages_created_at').on(table.created_at),
      updatedAtIdx: index('idx_chat_messages_updated_at').on(table.updated_at),
    };
  }
);

export const productsTable = pgTable(
  'products',
  {
    id: serial('id').primaryKey(),
    category_id: integer('category_id').references(() => categoriesTable.id, {
      onDelete: 'set null',
    }),
    name: varchar('name', { length: 255 }).notNull(),
    description: text('description'),
    price: integer('price').notNull(),
    stock: integer('stock').default(0),
    image_url: varchar('image_url', { length: 255 }),
    created_at: timestamp('created_at').defaultNow().notNull(),
    updated_at: timestamp('updated_at').defaultNow().notNull(),
  },
  (table) => {
    return {
      nameIdx: index('idx_products_name').on(table.name),
      categoryIdIdx: index('idx_products_category_id').on(table.category_id),
      priceIdx: index('idx_products_price').on(table.price),
      stockIdx: index('idx_products_stock').on(table.stock),
      createdAtIdx: index('idx_products_created_at').on(table.created_at),
      updatedAtIdx: index('idx_products_updated_at').on(table.updated_at),
    };
  }
);

export const ordersTable = pgTable(
  'orders',
  {
    id: serial('id').primaryKey(),
    user_id: integer('user_id')
      .references(() => usersTable.id, { onDelete: 'cascade' })
      .notNull(),
    total_amount: integer('total_amount').notNull(),
    status: varchar('status', { length: 64 }).default('PENDING').notNull(),
    created_at: timestamp('created_at').defaultNow().notNull(),
    updated_at: timestamp('updated_at').defaultNow().notNull(),
  },
  (table) => {
    return {
      userIdIdx: index('idx_orders_user_id').on(table.user_id),
      statusIdx: index('idx_orders_status').on(table.status),
      createdAtIdx: index('idx_orders_created_at').on(table.created_at),
      updatedAtIdx: index('idx_orders_updated_at').on(table.updated_at),
    };
  }
);

export const orderItemsTable = pgTable(
  'order_items',
  {
    id: serial('id').primaryKey(),
    order_id: integer('order_id')
      .references(() => ordersTable.id, { onDelete: 'cascade' })
      .notNull(),
    product_id: integer('product_id')
      .references(() => productsTable.id, { onDelete: 'restrict' })
      .notNull(),
    quantity: integer('quantity').notNull(),
    price: integer('price').notNull(),
    created_at: timestamp('created_at').defaultNow().notNull(),
    updated_at: timestamp('updated_at').defaultNow().notNull(),
  },
  (table) => {
    return {
      orderIdIdx: index('idx_order_items_order_id').on(table.order_id),
      productIdIdx: index('idx_order_items_product_id').on(table.product_id),
      createdAtIdx: index('idx_order_items_created_at').on(table.created_at),
      updatedAtIdx: index('idx_order_items_updated_at').on(table.updated_at),
    };
  }
);

export const invoicesTable = pgTable(
  'invoices',
  {
    id: serial('id').primaryKey(),
    order_id: integer('order_id').references(() => ordersTable.id, {
      onDelete: 'set null',
    }),
    invoice_number: varchar('invoice_number', { length: 50 }).notNull(),
    issue_date: timestamp('issue_date').defaultNow().notNull(),
    due_date: timestamp('due_date'),
    total_amount: integer('total_amount').notNull(),
    status: varchar('status', { length: 50 }).default('PENDING').notNull(),
    payment_method: varchar('payment_method', { length: 50 }),
    notes: text('notes'),
    created_at: timestamp('created_at').defaultNow().notNull(),
    updated_at: timestamp('updated_at').defaultNow().notNull(),
  },
  (table) => {
    return {
      orderIdIdx: index('idx_invoices_order_id').on(table.order_id),
      invoiceNumberIdx: index('idx_invoices_invoice_number').on(
        table.invoice_number
      ),
      issueDateIdx: index('idx_invoices_issue_date').on(table.issue_date),
      dueDateIdx: index('idx_invoices_due_date').on(table.due_date),
      statusIdx: index('idx_invoices_status').on(table.status),
      createdAtIdx: index('idx_invoices_created_at').on(table.created_at),
      updatedAtIdx: index('idx_invoices_updated_at').on(table.updated_at),
    };
  }
);
