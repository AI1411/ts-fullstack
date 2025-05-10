# Backend API

This directory contains the backend API for the application.

## Cloudflare Workers Setup

```txt
npm install
npm run dev
```

```txt
npm run deploy
```

[For generating/synchronizing types based on your Worker configuration run](https://developers.cloudflare.com/workers/wrangler/commands/#types):

```txt
npm run cf-typegen
```

Pass the `CloudflareBindings` as generics when instantiation `Hono`:

```ts
// src/index.ts
const app = new Hono<{ Bindings: CloudflareBindings }>()
```

## Database Seeding

To populate the database with dummy data, follow these steps:

1. Make sure you have the required environment variables set up in `.dev.vars` file:
   ```
   DATABASE_URL=postgresql://username:password@localhost:5432/database_name
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the seed script:
   ```bash
   npm run seed
   ```

This will:
- Clear existing data from all tables (optional - you can comment out the delete operations in seed.ts if you want to keep existing data)
- Insert dummy data into all tables in the correct order to maintain referential integrity
- Generate realistic dummy data using Faker.js

The seed script will populate the following tables:
- teams
- users
- todos
- tasks
- notifications
- sub_tasks
- chats
- chat_messages
- products
- orders
- order_items

## Customizing Seed Data

You can customize the amount and type of seed data by modifying the `seed.ts` file:

- Adjust the number of records created for each table by changing the loop iteration counts
- Modify the data generation logic to fit your specific requirements
- Comment out sections for tables you don't want to seed

## Database Schema

The database schema is defined in `src/db/schema.ts` using Drizzle ORM.
