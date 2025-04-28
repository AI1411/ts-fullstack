import {Hono} from 'hono'
import {cors} from 'hono/cors'
import {zValidator} from '@hono/zod-validator'
import {z} from 'zod'
import {notificationsTable, tasksTable, teamsTable, todosTable, usersTable} from './db/schema'
import {drizzle} from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import {eq} from 'drizzle-orm'

export type Env = {
  DATABASE_URL: string;
};

const app = new Hono<{ Bindings: Env }>();

app.use('*', cors({
  origin: '*'
}))

// データベース接続関数
const getDB = (c: any) => {
  const client = postgres(c.env.DATABASE_URL, {prepare: false})
  return drizzle({client})
}

const userSchema = z.object({
  id: z.number().optional(),
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
})

const todoSchema = z.object({
  id: z.number().optional(),
  user_id: z.number(),
  title: z.string().min(2),
  description: z.string().nullable().optional(),
  status: z.string().optional().default('PENDING'),
})

const teamSchema = z.object({
  id: z.number().optional(),
  name: z.string().min(2),
  description: z.string().nullable().optional(),
})

const taskSchema = z.object({
  id: z.number().optional(),
  user_id: z.number(),
  team_id: z.number(),
  title: z.string().min(2),
  description: z.string().nullable().optional(),
  status: z.string().optional().default('PENDING'),
  due_date: z.string().nullable().optional(),
})

const notificationSchema = z.object({
  id: z.number().optional(),
  user_id: z.number(),
  title: z.string().min(2),
  message: z.string().min(2),
  is_read: z.boolean().optional().default(false),
})

// ユーザーCRUD
const userRoutes = app
  // ユーザー作成
  .post('/users', zValidator('json', userSchema, (result, c) => {
    if (!result.success) {
      return c.json({error: result.error.issues[0].message}, 400)
    }
  }), async (c) => {
    const {name, email, password} = c.req.valid('json')
    const db = getDB(c)
    try {
      const user = await db.insert(usersTable).values({
        name,
        email,
        password, // 本番環境ではパスワードのハッシュ化が必要
      }).returning()
      return c.json({user: user[0]})
    } catch (error: any) {
      return c.json({error: error.message}, 500)
    }
  })
  // ユーザー一覧取得
  .get('/users', async (c) => {
    const db = getDB(c)
    try {
      const users = await db.select().from(usersTable)
      return c.json({users})
    } catch (error: any) {
      return c.json({error: error.message}, 500)
    }
  })
  // ユーザー詳細取得
  .get('/users/:id', async (c) => {
    const id = parseInt(c.req.param('id'))
    const db = getDB(c)
    try {
      const user = await db.select().from(usersTable).where(eq(usersTable.id, id))
      if (!user.length) {
        return c.json({error: 'User not found'}, 404)
      }
      return c.json({user: user[0]})
    } catch (error: any) {
      return c.json({error: error.message}, 500)
    }
  })
  // ユーザー更新
  .put('/users/:id', zValidator('json', userSchema.partial(), (result, c) => {
    if (!result.success) {
      return c.json({error: result.error.issues[0].message}, 400)
    }
  }), async (c) => {
    const id = parseInt(c.req.param('id'))
    const data = c.req.valid('json')
    const db = getDB(c)
    try {
      const updatedUser = await db.update(usersTable)
        .set({...data, updated_at: new Date()})
        .where(eq(usersTable.id, id))
        .returning()
      if (!updatedUser.length) {
        return c.json({error: 'User not found'}, 404)
      }
      return c.json({user: updatedUser[0]})
    } catch (error: any) {
      return c.json({error: error.message}, 500)
    }
  })
  // ユーザー削除
  .delete('/users/:id', async (c) => {
    const id = parseInt(c.req.param('id'))
    const db = getDB(c)
    try {
      const deletedUser = await db.delete(usersTable)
        .where(eq(usersTable.id, id))
        .returning()
      if (!deletedUser.length) {
        return c.json({error: 'User not found'}, 404)
      }
      return c.json({message: 'User deleted successfully'})
    } catch (error: any) {
      return c.json({error: error.message}, 500)
    }
  })

const todoRoutes = app
  .post('/todos', zValidator('json', todoSchema, (result, c) => {
    if (!result.success) {
      return c.json({error: result.error.issues[0].message}, 400)
    }
  }), async (c) => {
    const {title, description, user_id, status} = c.req.valid('json')
    const db = getDB(c)
    try {
      const todo = await db.insert(todosTable).values({
        title,
        description,
        user_id,
        status: status || 'PENDING',
      }).returning()
      return c.json({todo: todo[0]})
    } catch (error: any) {
      return c.json({error: error.message}, 500)
    }
  })
  .get('/todos', async (c) => {
    const db = getDB(c)
    try {
      const todos = await db.select().from(todosTable)
      return c.json({todos})
    } catch (error: any) {
      return c.json({error: error.message}, 500)
    }
  })
  .get('/users/:userId/todos', async (c) => {
    const userId = parseInt(c.req.param('userId'))
    const db = getDB(c)
    try {
      const todos = await db.select().from(todosTable).where(eq(todosTable.user_id, userId))
      return c.json({todos})
    } catch (error: any) {
      return c.json({error: error.message}, 500)
    }
  })
  .get('/todos/:id', async (c) => {
    const id = parseInt(c.req.param('id'))
    const db = getDB(c)
    try {
      const todo = await db.select().from(todosTable).where(eq(todosTable.id, id))
      if (!todo.length) {
        return c.json({error: 'Todo not found'}, 404)
      }
      return c.json({todo: todo[0]})
    } catch (error: any) {
      return c.json({error: error.message}, 500)
    }
  })
  .put('/todos/:id', zValidator('json', todoSchema.partial(), (result, c) => {
    if (!result.success) {
      return c.json({error: result.error.issues[0].message}, 400)
    }
  }), async (c) => {
    const id = parseInt(c.req.param('id'))
    const data = c.req.valid('json')
    const db = getDB(c)
    try {
      const updatedTodo = await db.update(todosTable)
        .set({...data, updated_at: new Date()})
        .where(eq(todosTable.id, id))
        .returning()
      if (!updatedTodo.length) {
        return c.json({error: 'Todo not found'}, 404)
      }
      return c.json({todo: updatedTodo[0]})
    } catch (error: any) {
      return c.json({error: error.message}, 500)
    }
  })
  .delete('/todos/:id', async (c) => {
    const id = parseInt(c.req.param('id'))
    const db = getDB(c)
    try {
      const deletedTodo = await db.delete(todosTable)
        .where(eq(todosTable.id, id))
        .returning()
      if (!deletedTodo.length) {
        return c.json({error: 'Todo not found'}, 404)
      }
      return c.json({message: 'Todo deleted successfully'})
    } catch (error: any) {
      return c.json({error: error.message}, 500)
    }
  })

// ヘルスチェック
const baseRoutes = app
  .get('/', (c) => {
    return c.json({message: 'API is running'})
  })
  .get('/hello', (c) => {
    return c.json({message: 'Hello Hono!'})
  })

// Teams CRUD
const teamRoutes = app
  // Create team
  .post('/teams', zValidator('json', teamSchema, (result, c) => {
    if (!result.success) {
      return c.json({error: result.error.issues[0].message}, 400)
    }
  }), async (c) => {
    const {name, description} = c.req.valid('json')
    const db = getDB(c)
    try {
      const team = await db.insert(teamsTable).values({
        name,
        description,
      }).returning()
      return c.json({team: team[0]})
    } catch (error: any) {
      return c.json({error: error.message}, 500)
    }
  })
  // Get all teams
  .get('/teams', async (c) => {
    const db = getDB(c)
    try {
      const teams = await db.select().from(teamsTable)
      return c.json({teams})
    } catch (error: any) {
      return c.json({error: error.message}, 500)
    }
  })
  // Get team by id
  .get('/teams/:id', async (c) => {
    const id = parseInt(c.req.param('id'))
    const db = getDB(c)
    try {
      const team = await db.select().from(teamsTable).where(eq(teamsTable.id, id))
      if (!team.length) {
        return c.json({error: 'Team not found'}, 404)
      }
      return c.json({team: team[0]})
    } catch (error: any) {
      return c.json({error: error.message}, 500)
    }
  })
  // Update team
  .put('/teams/:id', zValidator('json', teamSchema.partial(), (result, c) => {
    if (!result.success) {
      return c.json({error: result.error.issues[0].message}, 400)
    }
  }), async (c) => {
    const id = parseInt(c.req.param('id'))
    const data = c.req.valid('json')
    const db = getDB(c)
    try {
      const updatedTeam = await db.update(teamsTable)
        .set({...data, updated_at: new Date()})
        .where(eq(teamsTable.id, id))
        .returning()
      if (!updatedTeam.length) {
        return c.json({error: 'Team not found'}, 404)
      }
      return c.json({team: updatedTeam[0]})
    } catch (error: any) {
      return c.json({error: error.message}, 500)
    }
  })
  // Delete team
  .delete('/teams/:id', async (c) => {
    const id = parseInt(c.req.param('id'))
    const db = getDB(c)
    try {
      const deletedTeam = await db.delete(teamsTable)
        .where(eq(teamsTable.id, id))
        .returning()
      if (!deletedTeam.length) {
        return c.json({error: 'Team not found'}, 404)
      }
      return c.json({message: 'Team deleted successfully'})
    } catch (error: any) {
      return c.json({error: error.message}, 500)
    }
  })

// Tasks CRUD
const taskRoutes = app
  // Create task
  .post('/tasks', zValidator('json', taskSchema, (result, c) => {
    if (!result.success) {
      return c.json({error: result.error.issues[0].message}, 400)
    }
  }), async (c) => {
    const {user_id, team_id, title, description, status, due_date} = c.req.valid('json')
    const db = getDB(c)
    try {
      const task = await db.insert(tasksTable).values({
        user_id,
        team_id,
        title,
        description,
        status: status || 'PENDING',
        due_date: due_date ? new Date(due_date) : null,
      }).returning()
      return c.json({task: task[0]})
    } catch (error: any) {
      return c.json({error: error.message}, 500)
    }
  })
  // Get all tasks
  .get('/tasks', async (c) => {
    const db = getDB(c)
    try {
      const tasks = await db.select().from(tasksTable)
      return c.json({tasks})
    } catch (error: any) {
      return c.json({error: error.message}, 500)
    }
  })
  // Get tasks by user id
  .get('/users/:userId/tasks', async (c) => {
    const userId = parseInt(c.req.param('userId'))
    const db = getDB(c)
    try {
      const tasks = await db.select().from(tasksTable).where(eq(tasksTable.user_id, userId))
      return c.json({tasks})
    } catch (error: any) {
      return c.json({error: error.message}, 500)
    }
  })
  // Get tasks by team id
  .get('/teams/:teamId/tasks', async (c) => {
    const teamId = parseInt(c.req.param('teamId'))
    const db = getDB(c)
    try {
      const tasks = await db.select().from(tasksTable).where(eq(tasksTable.team_id, teamId))
      return c.json({tasks})
    } catch (error: any) {
      return c.json({error: error.message}, 500)
    }
  })
  // Get task by id
  .get('/tasks/:id', async (c) => {
    const id = parseInt(c.req.param('id'))
    const db = getDB(c)
    try {
      const task = await db.select().from(tasksTable).where(eq(tasksTable.id, id))
      if (!task.length) {
        return c.json({error: 'Task not found'}, 404)
      }
      return c.json({task: task[0]})
    } catch (error: any) {
      return c.json({error: error.message}, 500)
    }
  })
  // Update task
  .put('/tasks/:id', zValidator('json', taskSchema.partial(), (result, c) => {
    if (!result.success) {
      return c.json({error: result.error.issues[0].message}, 400)
    }
  }), async (c) => {
    const id = parseInt(c.req.param('id'))
    const data = c.req.valid('json')
    const db = getDB(c)

    // Handle due_date conversion if it exists
    const updateData = {...data};
    if (data.due_date) {
      updateData.due_date = new Date(data.due_date);
    }

    try {
      const updatedTask = await db.update(tasksTable)
        .set({...updateData, updated_at: new Date()})
        .where(eq(tasksTable.id, id))
        .returning()
      if (!updatedTask.length) {
        return c.json({error: 'Task not found'}, 404)
      }
      return c.json({task: updatedTask[0]})
    } catch (error: any) {
      return c.json({error: error.message}, 500)
    }
  })
  // Delete task
  .delete('/tasks/:id', async (c) => {
    const id = parseInt(c.req.param('id'))
    const db = getDB(c)
    try {
      const deletedTask = await db.delete(tasksTable)
        .where(eq(tasksTable.id, id))
        .returning()
      if (!deletedTask.length) {
        return c.json({error: 'Task not found'}, 404)
      }
      return c.json({message: 'Task deleted successfully'})
    } catch (error: any) {
      return c.json({error: error.message}, 500)
    }
  })

// Notifications CRUD
const notificationRoutes = app
  // Create notification
  .post('/notifications', zValidator('json', notificationSchema, (result, c) => {
    if (!result.success) {
      return c.json({error: result.error.issues[0].message}, 400)
    }
  }), async (c) => {
    const {user_id, title, message, is_read} = c.req.valid('json')
    const db = getDB(c)
    try {
      const notification = await db.insert(notificationsTable).values({
        user_id,
        title,
        message,
        is_read: is_read || false,
      }).returning()
      return c.json({notification: notification[0]})
    } catch (error: any) {
      return c.json({error: error.message}, 500)
    }
  })
  // Get all notifications
  .get('/notifications', async (c) => {
    const db = getDB(c)
    try {
      const notifications = await db.select().from(notificationsTable)
      return c.json({notifications})
    } catch (error: any) {
      return c.json({error: error.message}, 500)
    }
  })
  // Get notifications by user id
  .get('/users/:userId/notifications', async (c) => {
    const userId = parseInt(c.req.param('userId'))
    const db = getDB(c)
    try {
      const notifications = await db.select().from(notificationsTable).where(eq(notificationsTable.user_id, userId))
      return c.json({notifications})
    } catch (error: any) {
      return c.json({error: error.message}, 500)
    }
  })
  // Get notification by id
  .get('/notifications/:id', async (c) => {
    const id = parseInt(c.req.param('id'))
    const db = getDB(c)
    try {
      const notification = await db.select().from(notificationsTable).where(eq(notificationsTable.id, id))
      if (!notification.length) {
        return c.json({error: 'Notification not found'}, 404)
      }
      return c.json({notification: notification[0]})
    } catch (error: any) {
      return c.json({error: error.message}, 500)
    }
  })
  // Update notification
  .put('/notifications/:id', zValidator('json', notificationSchema.partial(), (result, c) => {
    if (!result.success) {
      return c.json({error: result.error.issues[0].message}, 400)
    }
  }), async (c) => {
    const id = parseInt(c.req.param('id'))
    const data = c.req.valid('json')
    const db = getDB(c)
    try {
      const updatedNotification = await db.update(notificationsTable)
        .set({...data, updated_at: new Date()})
        .where(eq(notificationsTable.id, id))
        .returning()
      if (!updatedNotification.length) {
        return c.json({error: 'Notification not found'}, 404)
      }
      return c.json({notification: updatedNotification[0]})
    } catch (error: any) {
      return c.json({error: error.message}, 500)
    }
  })
  // Mark notification as read
  .put('/notifications/:id/read', async (c) => {
    const id = parseInt(c.req.param('id'))
    const db = getDB(c)
    try {
      const updatedNotification = await db.update(notificationsTable)
        .set({is_read: true, updated_at: new Date()})
        .where(eq(notificationsTable.id, id))
        .returning()
      if (!updatedNotification.length) {
        return c.json({error: 'Notification not found'}, 404)
      }
      return c.json({notification: updatedNotification[0]})
    } catch (error: any) {
      return c.json({error: error.message}, 500)
    }
  })
  // Delete notification
  .delete('/notifications/:id', async (c) => {
    const id = parseInt(c.req.param('id'))
    const db = getDB(c)
    try {
      const deletedNotification = await db.delete(notificationsTable)
        .where(eq(notificationsTable.id, id))
        .returning()
      if (!deletedNotification.length) {
        return c.json({error: 'Notification not found'}, 404)
      }
      return c.json({message: 'Notification deleted successfully'})
    } catch (error: any) {
      return c.json({error: error.message}, 500)
    }
  })

// すべてのルートを結合
const route = app
  .route('/', baseRoutes)
  .route('/', userRoutes)
  .route('/', todoRoutes)
  .route('/', teamRoutes)
  .route('/', taskRoutes)
  .route('/', notificationRoutes)

export type AppType = typeof route

export default app
