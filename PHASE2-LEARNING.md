# Phase 2: tRPC Learning Guide

## What is tRPC?

**tRPC** stands for "TypeScript Remote Procedure Call". It's a library that lets you build type-safe APIs without writing any API documentation or manual type definitions.

### The Problem tRPC Solves

**Traditional REST API**:
```typescript
// Backend (server/api/workflows.ts)
export async function GET() {
  const workflows = await db.query.workflows.findMany();
  return Response.json(workflows);
}

// Frontend (app/workflows/page.tsx)
// ❌ No type safety! You have to manually define types
interface Workflow {
  id: number;
  name: string;
  // ... hope this matches the backend!
}

const response = await fetch('/api/workflows');
const workflows: Workflow[] = await response.json();
```

**With tRPC**:
```typescript
// Backend (server/routers/workflow.ts)
export const workflowRouter = router({
  list: publicProcedure.query(async ({ ctx }) => {
    return await ctx.db.query.workflows.findMany();
  }),
});

// Frontend (app/workflows/page.tsx)
// ✅ Full type safety! TypeScript knows the exact type
const { data: workflows } = trpc.workflows.list.useQuery();
// workflows is typed automatically!
```

---

## Key Concepts

### 1. Context

**What**: Data available to all API procedures (like database, user session)

**Where**: `server/trpc.ts`

```typescript
export const createTRPCContext = async (opts: { headers: Headers }) => {
  return {
    db,           // Database instance
    headers: opts.headers,
    // user: await getUser(), // Will add in Phase 3
  };
};
```

**Why**: Instead of importing `db` in every router, it's available via `ctx.db`

---

### 2. Procedures

**What**: API endpoints (like REST routes)

**Types**:
- **Query**: Read data (no side effects) - like GET
- **Mutation**: Write data (has side effects) - like POST/PUT/DELETE

```typescript
// Query - fetches data
list: publicProcedure.query(async ({ ctx }) => {
  return await ctx.db.query.workflows.findMany();
});

// Mutation - modifies data
create: publicProcedure
  .input(z.object({ name: z.string() }))
  .mutation(async ({ ctx, input }) => {
    return await ctx.db.insert(workflows).values(input);
  });
```

---

### 3. Input Validation with Zod

**What**: Schema validation library that ensures inputs are correct

**Example**:
```typescript
.input(
  z.object({
    name: z.string().min(1).max(100),  // Required, 1-100 chars
    description: z.string().optional(), // Optional
    userId: z.number().int().positive() // Must be positive integer
  })
)
```

**Benefits**:
- ✅ Automatic validation before your code runs
- ✅ TypeScript knows the exact input type
- ✅ Clear error messages if validation fails

---

### 4. Type Inference

**The Magic**: TypeScript automatically knows all types!

```typescript
// Server defines the return type
list: publicProcedure.query(async ({ ctx }) => {
  return await ctx.db.query.workflows.findMany();
  // Returns: Workflow[]
});

// Client automatically knows the type!
const { data } = trpc.workflows.list.useQuery();
// data is typed as: Workflow[] | undefined
```

**No manual typing needed!** 🎉

---

### 5. React Query Integration

**What**: tRPC uses React Query for data fetching

**Benefits**:
- Automatic caching
- Automatic refetching
- Loading and error states
- Optimistic updates

**Example**:
```typescript
// Fetch data
const { data, isLoading, error } = trpc.workflows.list.useQuery();

// Mutate data
const createMutation = trpc.workflows.create.useMutation({
  onSuccess: () => {
    // Refetch the list after creating
    utils.workflows.list.invalidate();
  }
});

await createMutation.mutateAsync({ name: "New Workflow", userId: 1 });
```

---

## How Data Flows

### Query Flow (Reading Data)

```
1. Frontend calls:
   trpc.workflows.list.useQuery()
   
2. tRPC client sends request:
   POST /api/trpc/workflows.list
   
3. Next.js API route receives request:
   app/api/trpc/[trpc]/route.ts
   
4. tRPC router finds procedure:
   server/routers/_app.ts → workflows → list
   
5. Procedure executes:
   server/routers/workflow.ts → list.query()
   
6. Database query runs:
   ctx.db.query.workflows.findMany()
   
7. Response sent back:
   Workflows[] → SuperJSON serialization → Client
   
8. React Query caches result:
   Future calls use cache (no network request!)
```

### Mutation Flow (Writing Data)

```
1. Frontend calls:
   createMutation.mutate({ name: "Test", userId: 1 })
   
2. Input validation:
   Zod checks if input matches schema
   
3. If valid, request sent:
   POST /api/trpc/workflows.create
   
4. Procedure executes:
   server/routers/workflow.ts → create.mutation()
   
5. Database insert:
   ctx.db.insert(workflows).values(input)
   
6. Response sent back:
   Created workflow → Client
   
7. onSuccess callback:
   utils.workflows.list.invalidate() → Refetch list
```

---

## Comparing tRPC vs REST

| Feature | REST API | tRPC |
|---------|----------|------|
| **Type Safety** | Manual type definitions | Automatic type inference |
| **Validation** | Manual validation code | Zod schemas |
| **API Docs** | Swagger/OpenAPI needed | Types are the docs |
| **Client Code** | `fetch()` with manual types | Type-safe hooks |
| **Refactoring** | Find/replace strings, hope nothing breaks | TypeScript errors guide you |
| **Endpoints** | Multiple routes (`/api/workflows`, `/api/workflows/:id`) | Single route (`/api/trpc`) |
| **Learning Curve** | Lower (familiar HTTP) | Higher (new concepts) |
| **Best For** | Public APIs, mobile apps | Full-stack TypeScript apps |

---

## What We Built in Phase 2

### Server Side

1. **`server/trpc.ts`** - Core tRPC setup
   - Context creation (database access)
   - SuperJSON transformer (handles Dates, etc.)
   - Procedure helpers (publicProcedure)

2. **`server/routers/workflow.ts`** - Workflow CRUD
   - `list` - Get all workflows
   - `getById` - Get single workflow
   - `create` - Create workflow
   - `update` - Update workflow
   - `delete` - Delete workflow
   - `toggleActive` - Enable/disable workflow

3. **`server/routers/_app.ts`** - Root router
   - Combines all feature routers
   - Exports AppRouter type for client

4. **`app/api/trpc/[trpc]/route.ts`** - Next.js API handler
   - Handles all tRPC requests
   - Routes to correct procedure

### Client Side

1. **`lib/trpc/client.ts`** - tRPC React client
   - Creates typed hooks
   - Imports AppRouter type

2. **`lib/trpc/Provider.tsx`** - React Query provider
   - Configures caching
   - Enables tRPC hooks
   - Sets up batching

3. **`app/layout.tsx`** - App wrapper
   - Wraps app with TRPCProvider

4. **`app/workflows/page.tsx`** - Workflow management UI
   - List workflows
   - Create workflow form
   - Edit/delete actions
   - Real-time updates

---

## Testing Your Understanding

### Question 1: Query vs Mutation

**When should you use `.query()` vs `.mutation()`?**

<details>
<summary>Answer</summary>

- **`.query()`**: For reading data (no side effects)
  - Example: Get list of workflows, get user profile
  - Like HTTP GET

- **`.mutation()`**: For writing data (has side effects)
  - Example: Create workflow, update user, delete item
  - Like HTTP POST/PUT/DELETE

**Rule of thumb**: If it changes data in the database, use mutation. Otherwise, use query.
</details>

---

### Question 2: Input Validation

**What happens if you call a procedure with invalid input?**

```typescript
trpc.workflows.create.mutate({
  name: "", // Empty string (min is 1)
  userId: -5 // Negative number (must be positive)
});
```

<details>
<summary>Answer</summary>

**tRPC will throw a validation error** before your code even runs!

The Zod schema catches this:
```typescript
.input(
  z.object({
    name: z.string().min(1),  // ❌ Empty string fails
    userId: z.number().positive() // ❌ Negative fails
  })
)
```

The error is sent back to the client with details about what failed. Your mutation code never executes.
</details>

---

### Question 3: Type Safety

**How does the client know the return type of a procedure without manual type definitions?**

<details>
<summary>Answer</summary>

**Type inference through the AppRouter type!**

1. Server exports the router type:
```typescript
export type AppRouter = typeof appRouter;
```

2. Client imports it:
```typescript
export const trpc = createTRPCReact<AppRouter>();
```

3. TypeScript uses the type to infer everything:
```typescript
const { data } = trpc.workflows.list.useQuery();
// TypeScript knows: data is Workflow[] | undefined
```

This is the "magic" of tRPC - one type definition powers the entire stack!
</details>

---

## Common Patterns

### Pattern 1: Invalidate After Mutation

```typescript
const createMutation = trpc.workflows.create.useMutation({
  onSuccess: () => {
    // Refetch the list to show new workflow
    utils.workflows.list.invalidate();
  }
});
```

**Why**: After creating a workflow, the list is stale. Invalidating triggers a refetch.

---

### Pattern 2: Optimistic Updates

```typescript
const deleteMutation = trpc.workflows.delete.useMutation({
  onMutate: async (deletedId) => {
    // Cancel ongoing queries
    await utils.workflows.list.cancel();
    
    // Snapshot current data
    const previous = utils.workflows.list.getData();
    
    // Optimistically update UI
    utils.workflows.list.setData(undefined, (old) =>
      old?.filter(w => w.id !== deletedId.id)
    );
    
    return { previous };
  },
  onError: (err, deletedId, context) => {
    // Rollback on error
    utils.workflows.list.setData(undefined, context?.previous);
  }
});
```

**Why**: UI updates immediately (feels faster), rolls back if server fails.

---

### Pattern 3: Dependent Queries

```typescript
const { data: workflow } = trpc.workflows.getById.useQuery(
  { id: workflowId },
  { enabled: !!workflowId } // Only run if workflowId exists
);

const { data: nodes } = trpc.nodes.list.useQuery(
  { workflowId: workflow?.id! },
  { enabled: !!workflow } // Only run after workflow loads
);
```

**Why**: Prevent unnecessary queries and ensure data dependencies are met.

---

## Debugging Tips

### 1. Check Network Tab

Open DevTools → Network → Filter by "trpc"

You'll see requests like:
```
POST /api/trpc/workflows.list
POST /api/trpc/workflows.create
```

Click on them to see:
- Request payload (input)
- Response data (output)
- Any errors

---

### 2. React Query DevTools

Install React Query DevTools:
```bash
npm install @tanstack/react-query-devtools
```

Add to your app:
```typescript
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

<TRPCProvider>
  {children}
  <ReactQueryDevtools initialIsOpen={false} />
</TRPCProvider>
```

Shows:
- All queries and their status
- Cache contents
- Refetch triggers

---

### 3. TypeScript Errors

If you see type errors:
1. Check that AppRouter is exported correctly
2. Ensure client imports the right type
3. Restart TypeScript server in VSCode

---

## Next Steps

After Phase 2, you understand:
- ✅ Type-safe APIs with tRPC
- ✅ Input validation with Zod
- ✅ React Query for data fetching
- ✅ CRUD operations

**Phase 3 Preview: Authentication**
- Add user login/registration
- Protect API routes (only authenticated users)
- Associate workflows with logged-in user
- Session management

---

## Resources

- **tRPC Docs**: https://trpc.io/docs
- **Zod Docs**: https://zod.dev
- **React Query Docs**: https://tanstack.com/query/latest
- **SuperJSON**: https://github.com/blitz-js/superjson

---

**Congratulations on completing Phase 2!** 🎉

You now have a fully type-safe API layer. Try creating workflows, editing them, and deleting them. Notice how TypeScript catches errors and provides autocomplete throughout!
