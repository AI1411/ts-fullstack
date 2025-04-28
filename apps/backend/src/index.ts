import {Hono} from 'hono'
import {cors} from 'hono/cors'
import {zValidator} from '@hono/zod-validator'
import {z} from 'zod'
import {todosTable, usersTable} from './db/schema'
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

// すべてのルートを結合
const route = app
  .route('/', baseRoutes)
  .route('/', userRoutes)
  .route('/', todoRoutes)

export type AppType = typeof route

export default app