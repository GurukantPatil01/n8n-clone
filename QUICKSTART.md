# Quick Start Guide

## 🚀 Get Started in 3 Steps

### Step 1: Get a Database

Choose one option:

**Option A: Neon (Recommended - Free)**
1. Go to [neon.tech](https://neon.tech)
2. Sign up and create a project
3. Copy the connection string

**Option B: Supabase (Free)**
1. Go to [supabase.com](https://supabase.com)
2. Create a project
3. Settings → Database → Copy connection string

**Option C: Local PostgreSQL**
```bash
brew install postgresql@15
brew services start postgresql@15
createdb n8n_clone
# Connection string: postgresql://localhost:5432/n8n_clone
```

---

### Step 2: Configure & Setup

```bash
# 1. Copy environment template
cp .env.example .env.local

# 2. Edit .env.local and add your DATABASE_URL
# DATABASE_URL="postgresql://your-connection-string-here"

# 3. Install dependencies
npm install

# 4. Create database tables
npm run db:push
```

---

### Step 3: Run the App

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

You should see:
- ✅ Database Connected
- ✅ 5 tables created
- ✅ Phase 1 Complete message

---

## 📚 Learning Path

1. **Read**: [README.md](./README.md) - Understand what we're building
2. **Setup**: [SETUP.md](./SETUP.md) - Detailed setup instructions
3. **Learn**: [LEARNING.md](./LEARNING.md) - Deep dive into concepts
4. **Explore**: Open `db/schema.ts` and read the comments

---

## 🛠️ Useful Commands

```bash
npm run dev          # Start development server
npm run db:push      # Update database schema
npm run db:studio    # Open visual database editor
```

---

## ❓ Troubleshooting

**Can't connect to database?**
- Check your `DATABASE_URL` in `.env.local`
- Make sure the database is running

**Port 3000 in use?**
```bash
npm run dev -- -p 3001
```

**Need to reset database?**
```bash
npm run db:push -- --force
```

---

## 🎯 What's Next?

After Phase 1, you'll learn:
- **Phase 2**: tRPC for type-safe APIs
- **Phase 3**: User authentication
- **Phase 4**: Beautiful UI with dark mode
- **Phase 5**: Drag-and-drop workflow canvas
- **Phase 6**: Execute workflows

---

**Questions?** Check [SETUP.md](./SETUP.md) for detailed troubleshooting!
