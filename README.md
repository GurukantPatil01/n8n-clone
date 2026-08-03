# N8N Clone - Learning Project 🚀

> **Learning Goal**: Understand how to build a workflow automation tool like n8n/Zapier from scratch

## 📚 What You'll Learn

This project teaches you how to build a **visual workflow automation tool** where users can:
- Create workflows by connecting nodes (like n8n/Zapier)
- Execute automated tasks based on triggers
- Transform data between different services
- Build complex automation logic visually

## 🎯 Project Overview

### What is n8n?
n8n is a workflow automation tool that allows users to connect different apps and services together. Think of it like:
- **Nodes**: Individual blocks that perform specific actions (e.g., "Send Email", "Get Data from API", "Transform Data")
- **Connections**: Lines that connect nodes and pass data between them
- **Workflows**: A complete automation made up of connected nodes
- **Triggers**: Events that start a workflow (e.g., "New email received", "Every hour")

### Core Concepts We'll Build

1. **Visual Canvas**: A drag-and-drop interface where users build workflows
2. **Node System**: Reusable components that perform specific tasks
3. **Data Flow**: How data moves from one node to another
4. **Execution Engine**: The system that runs workflows in the correct order
5. **Persistence**: Saving workflows and execution history to a database

---

## 🏗️ Tech Stack

We're using modern, production-ready technologies:

| Technology | Purpose | Why We Use It |
|------------|---------|---------------|
| **Next.js 15** | Full-stack React framework | Server-side rendering, API routes, file-based routing |
| **TypeScript** | Type-safe JavaScript | Catch errors early, better IDE support |
| **PostgreSQL** | Relational database | Store workflows, users, execution history |
| **Drizzle ORM** | Database toolkit | Type-safe database queries, migrations |
| **tRPC** | Type-safe API layer | End-to-end type safety between frontend/backend |
| **Better Auth** | Authentication | Secure user login/registration |
| **React Flow** | Visual workflow canvas | Pre-built node/edge rendering and interactions |
| **Tailwind CSS** | Styling framework | Rapid UI development |

---

## 📖 Phase 1: Database Setup (Current Phase)

### What We're Building
In this phase, we set up the foundation - the database that will store all our workflow data.

### Key Concepts

#### 1. **Database Schema Design**
We need to store:
- **Users**: Who owns which workflows
- **Workflows**: The automation blueprints users create
- **Nodes**: Individual steps in a workflow
- **Connections**: How nodes are linked together
- **Executions**: History of when workflows ran and their results

#### 2. **Drizzle ORM**
Instead of writing raw SQL, we use Drizzle ORM which:
- Provides type-safe database queries
- Handles migrations automatically
- Makes it easy to change the database schema
- Gives us autocomplete for database operations

#### 3. **Database Relationships**
Understanding how data connects:
```
User (1) ──── (Many) Workflows
Workflow (1) ──── (Many) Nodes
Workflow (1) ──── (Many) Connections
Workflow (1) ──── (Many) Executions
```

### What We'll Create

```
n8n-clone/
├── src/
│   ├── db/
│   │   ├── schema.ts          # Database table definitions
│   │   ├── index.ts           # Database connection
│   │   └── migrations/        # Database version control
│   └── ...
├── drizzle.config.ts          # Drizzle configuration
├── .env.local                 # Environment variables (DATABASE_URL)
└── package.json
```

### Step-by-Step Breakdown

#### Step 1: Initialize Next.js Project
```bash
npx create-next-app@latest n8n-clone
```
**What this does**: Creates a new Next.js 15 project with TypeScript, Tailwind CSS, and App Router

**Concepts**:
- **App Router**: Next.js's new routing system (uses `app/` directory)
- **Server Components**: React components that run on the server by default
- **File-based routing**: Each file in `app/` becomes a route

#### Step 2: Install Database Dependencies
```bash
npm install drizzle-orm postgres
npm install -D drizzle-kit
```
**What this does**:
- `drizzle-orm`: The ORM library for type-safe queries
- `postgres`: PostgreSQL client for Node.js
- `drizzle-kit`: CLI tool for migrations

#### Step 3: Set Up PostgreSQL Database
You need a PostgreSQL database. Options:
- **Local**: Install PostgreSQL on your machine
- **Cloud**: Use [Neon](https://neon.tech), [Supabase](https://supabase.com), or [Railway](https://railway.app)

**Connection String Format**:
```
postgresql://username:password@host:port/database
```

#### Step 4: Define Database Schema
Create `src/db/schema.ts` with tables for:
- `users`: User accounts
- `workflows`: Workflow definitions
- `nodes`: Individual workflow steps
- `connections`: Links between nodes
- `executions`: Workflow run history

**Key Drizzle Concepts**:
- `pgTable()`: Defines a table
- `serial()`, `text()`, `timestamp()`: Column types
- `references()`: Foreign key relationships
- `relations()`: Define how tables relate

#### Step 5: Create Database Connection
Create `src/db/index.ts` to:
- Connect to PostgreSQL
- Export the database instance
- Make it available throughout the app

#### Step 6: Generate and Run Migrations
```bash
npx drizzle-kit generate
npx drizzle-kit migrate
```
**What this does**:
- `generate`: Creates SQL migration files from your schema
- `migrate`: Applies migrations to your database

**Migrations**: Version control for your database schema. Each change creates a new migration file.

---

## 🎓 Learning Resources

### Understanding Workflow Automation
- **n8n Documentation**: https://docs.n8n.io/
- **Zapier How It Works**: https://zapier.com/how-it-works

### Technologies We're Using
- **Next.js 15**: https://nextjs.org/docs
- **Drizzle ORM**: https://orm.drizzle.team/docs/overview
- **React Flow**: https://reactflow.dev/
- **tRPC**: https://trpc.io/docs

### Database Design
- **Database Normalization**: Understanding how to structure data
- **Foreign Keys**: How tables reference each other
- **Indexes**: Making queries faster

---

## 🚀 Getting Started (Phase 1)

### Prerequisites
- Node.js 18+ installed
- Basic understanding of React and TypeScript
- PostgreSQL database (local or cloud)

### Setup Instructions

1. **Clone/Create the project**
   ```bash
   cd /Users/gurukantpatil/Desktop/n8n-clone
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create `.env.local`:
   ```env
   DATABASE_URL="postgresql://..."
   ```

4. **Run database migrations**
   ```bash
   npx drizzle-kit generate
   npx drizzle-kit migrate
   ```

5. **Start development server**
   ```bash
   npm run dev
   ```

---

## 📝 What's Next?

After completing Phase 1 (Database Setup), we'll move to:

### Phase 2: tRPC Layer
- Set up type-safe API routes
- Create CRUD operations for workflows
- Learn about RPC (Remote Procedure Call)

### Phase 3: Authentication
- Implement user registration/login
- Secure API routes
- Session management

### Phase 4: Theme & Styling
- Build a beautiful UI
- Implement dark mode
- Create reusable components

### Phase 5: Workflow Canvas
- Integrate React Flow
- Build drag-and-drop interface
- Create custom node components

### Phase 6: Execution Engine
- Run workflows
- Handle data transformation
- Implement error handling

---

## 🤔 Key Questions to Understand

As you build, ask yourself:

1. **Database**: Why do we need separate tables for nodes and connections?
2. **Type Safety**: How does TypeScript help us catch errors?
3. **ORM**: What advantages does Drizzle give us over raw SQL?
4. **Relationships**: How do we ensure data integrity with foreign keys?
5. **Migrations**: Why can't we just modify the database directly?

---

## 📂 Project Structure (After Phase 1)

```
n8n-clone/
├── src/
│   ├── app/                   # Next.js App Router pages
│   │   ├── page.tsx          # Home page
│   │   └── layout.tsx        # Root layout
│   ├── db/
│   │   ├── schema.ts         # Database schema definitions
│   │   ├── index.ts          # Database connection
│   │   └── migrations/       # SQL migration files
│   └── lib/                  # Utility functions
├── public/                    # Static assets
├── drizzle.config.ts         # Drizzle configuration
├── .env.local                # Environment variables
├── package.json
├── tsconfig.json             # TypeScript configuration
└── tailwind.config.ts        # Tailwind CSS configuration
```

---

## 💡 Tips for Learning

1. **Read the Code**: Don't just copy-paste. Understand each line.
2. **Experiment**: Try changing things and see what breaks.
3. **Use TypeScript**: Pay attention to type errors - they teach you a lot.
4. **Check the Database**: Use a tool like [Drizzle Studio](https://orm.drizzle.team/drizzle-studio/overview) to see your data.
5. **Ask Questions**: If something doesn't make sense, research it.

---

## 🐛 Common Issues & Solutions

### Issue: "Cannot connect to database"
- **Solution**: Check your `DATABASE_URL` in `.env.local`
- Ensure PostgreSQL is running
- Verify credentials are correct

### Issue: "Module not found"
- **Solution**: Run `npm install` to install dependencies
- Check import paths are correct

### Issue: "Migration failed"
- **Solution**: Check your schema for syntax errors
- Ensure database is accessible
- Try dropping tables and re-running migrations (in development only!)


