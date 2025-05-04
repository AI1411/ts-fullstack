import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { teamSchema } from './schemas';
import { createTeam, deleteTeam, getTeamById, getTeams, updateTeam } from './controllers';

const teamRoutes = new Hono();

// チーム作成
teamRoutes.post('/teams', zValidator('json', teamSchema, (result, c) => {
  if (!result.success) {
    return c.json({ error: result.error.issues[0].message }, 400);
  }
}), createTeam);

// チーム一覧取得
teamRoutes.get('/teams', getTeams);

// チーム取得
teamRoutes.get('/teams/:id', getTeamById);

// チーム更新
teamRoutes.put('/teams/:id', zValidator('json', teamSchema, (result, c) => {
  if (!result.success) {
    return c.json({ error: result.error.issues[0].message }, 400);
  }
}), updateTeam);

// チーム削除
teamRoutes.delete('/teams/:id', deleteTeam);

export default teamRoutes;
