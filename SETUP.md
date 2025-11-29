# Phase 1 Setup Guide

## Prerequisites

Before you begin, you need a PostgreSQL database. Choose one of these options:

### Option 1: Cloud Database (Recommended for Beginners)

**Using Neon (Free tier available)**
1. Go to [neon.tech](https://neon.tech)
2. Sign up for a free account
3. Create a new project
4. Copy the connection string (looks like: `postgresql://user:pass@host/db`)

**Using Supabase (Free tier available)**
1. Go to [supabase.com](https://supabase.com)
2. Create a new project
3. Go to Settings → Database
4. Copy the connection string under "Connection string"

### Option 2: Local PostgreSQL

**macOS (using Homebrew)**
```bash
brew install postgresql@15
brew services start postgresql@15
createdb n8n_clone
```

Your connection string will be:
```
postgresql://localhost:5432/n8n_clone
```

---

## Setup Steps

### 1. Install Dependencies

```bash
cd /Users/gurukantpatil/Desktop/n8n-clone
npm install
```

This installs:
- Next.js 15 and React 19
- Drizzle ORM and PostgreSQL client
- TypeScript and Tailwind CSS
- Development tools

### 2. Configure Environment Variables

Create a `.env.local` file:

```bash
cp .env.example .env.local
```

Edit `.env.local` and add your database URL:

```env
DATABASE_URL="postgresql://your-connection-string-here"
```

**Important**: Replace with your actual connection string from Neon, Supabase, or local PostgreSQL.

### 3. Generate and Push Database Schema

```bash
# Generate migration files from schema
npm run db:generate

# Push schema to database (creates tables)
npm run db:push
```

**What this does:**
- `db:generate`: Creates SQL migration files in `db/migrations/`
- `db:push`: Applies the schema to your database, creating all tables

### 4. Verify Database Setup (Optional)

Open Drizzle Studio to see your database visually:

```bash
npm run db:studio
```

This opens a web interface at `http://localhost:4983` where you can:
- See all 5 tables (users, workflows, nodes, connections, executions)
- View table structures
- Insert test data
- Verify relationships

### 5. Start Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

You should see:
- ✅ Database connection status
- ✅ Number of tables created
- ✅ Phase 1 completion message

---

## Troubleshooting

### "Cannot connect to database"

**Check:**
1. Is your `DATABASE_URL` correct in `.env.local`?
2. Is the database running? (for local PostgreSQL)
3. Can you access the database from your network?

**Test connection:**
```bash
# For Neon/Supabase, try pinging the host
# For local, try:
psql postgresql://localhost:5432/n8n_clone
```

### "Module not found" errors

```bash
# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### "Migration failed"

```bash
# Reset database (DEVELOPMENT ONLY!)
# This will delete all data
npm run db:push -- --force
```

### Port 3000 already in use

```bash
# Kill the process using port 3000
lsof -ti:3000 | xargs kill -9

# Or use a different port
npm run dev -- -p 3001
```

---

## Understanding the Database Schema

### Tables Created

1. **users** - User accounts
   - `id`, `email`, `name`, `passwordHash`, `createdAt`

2. **workflows** - Workflow definitions
   - `id`, `userId` (FK), `name`, `description`, `isActive`, `createdAt`, `updatedAt`

3. **nodes** - Individual workflow steps
   - `id`, `workflowId` (FK), `type`, `name`, `config` (JSONB), `position` (JSONB), `createdAt`

4. **connections** - Links between nodes
   - `id`, `workflowId` (FK), `sourceNodeId` (FK), `targetNodeId` (FK), `sourceHandle`, `targetHandle`

5. **executions** - Workflow run history
   - `id`, `workflowId` (FK), `status`, `startedAt`, `finishedAt`, `error`, `data` (JSONB)

### Relationships

```
User (1) ──── (Many) Workflows
Workflow (1) ──── (Many) Nodes
Workflow (1) ──── (Many) Connections
Workflow (1) ──── (Many) Executions
Node (1) ──── (Many) Connections (as source)
Node (1) ──── (Many) Connections (as target)
```

---

## Testing Your Setup

### Insert Test Data

Using Drizzle Studio (`npm run db:studio`):

1. **Create a user:**
   - Go to `users` table
   - Click "Add row"
   - Fill in: email, name, passwordHash (use "test123" for now)

2. **Create a workflow:**
   - Go to `workflows` table
   - Click "Add row"
   - Set `userId` to the user ID you created
   - Fill in: name, description
   - Set `isActive` to `true`

3. **Create nodes:**
   - Go to `nodes` table
   - Create 2-3 nodes with different types
   - Set `workflowId` to your workflow ID
   - Use config: `{"key": "value"}`
   - Use position: `{"x": 100, "y": 100}`

4. **Create a connection:**
   - Go to `connections` table
   - Link two nodes together
   - Set `sourceNodeId` and `targetNodeId`

### Verify Foreign Keys Work

Try to insert invalid data (should fail):
- Create a workflow with `userId: 9999` (user doesn't exist)
- Create a node with `workflowId: 9999` (workflow doesn't exist)

These should fail with foreign key constraint errors - that's good! It means your database is protecting data integrity.

---

## Next Steps

Once your setup is working:

1. ✅ Verify the home page shows "Connected ✅"
2. ✅ Check Drizzle Studio shows all 5 tables
3. ✅ Insert some test data
4. ✅ Read through the schema comments in `db/schema.ts`

**You're ready for Phase 2!** 🎉

Phase 2 will add:
- tRPC for type-safe API routes
- CRUD operations for workflows
- API endpoints to create/read/update/delete workflows

---

## Useful Commands

```bash
# Development
npm run dev              # Start dev server
npm run build           # Build for production
npm run start           # Start production server

# Database
npm run db:generate     # Generate migrations
npm run db:push         # Push schema to database
npm run db:studio       # Open Drizzle Studio

# Code Quality
npm run lint            # Run ESLint
```

---

## Learning Resources

- **Drizzle ORM Docs**: https://orm.drizzle.team
- **Next.js 15 Docs**: https://nextjs.org/docs
- **PostgreSQL Tutorial**: https://www.postgresqltutorial.com
- **Database Design**: https://www.youtube.com/watch?v=ztHopE5Wnpc

---

**Questions?** Review the comments in the code files - they explain the "why" behind each decision!
