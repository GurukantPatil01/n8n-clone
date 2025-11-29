# Phase 3 Learning Guide: Authentication & Security

## Table of Contents
1. [Password Hashing](#password-hashing)
2. [Session Management](#session-management)
3. [Middleware Pattern](#middleware-pattern)
4. [Protected Routes](#protected-routes)
5. [CSRF Protection](#csrf-protection)
6. [Self-Test Questions](#self-test-questions)

---

## Password Hashing

### Why Hash Passwords?

**Never store passwords in plain text!** If your database is compromised, attackers would have everyone's passwords.

### How Bcrypt Works

```typescript
import bcrypt from 'bcryptjs';

// Registration
const plainPassword = "password123";
const hashedPassword = await bcrypt.hash(plainPassword, 10);
// Result: "$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy"

// Login
const isValid = await bcrypt.compare(plainPassword, hashedPassword);
// Result: true
```

**Key Concepts:**

1. **One-Way Function**: You cannot reverse a hash to get the original password
2. **Salt**: Random data added to each password before hashing
   - Prevents rainbow table attacks
   - Makes identical passwords have different hashes
3. **Cost Factor** (10 in our case): How many rounds of hashing
   - Higher = slower = more secure
   - Intentionally slow to prevent brute force

---

## Session Management

### How Sessions Work

```
1. User logs in with email/password
   ↓
2. Server verifies credentials
   ↓
3. Server creates session in database
   ↓
4. Server sets cookie with session ID
   ↓
5. Browser sends cookie with every request
   ↓
6. Server looks up session to identify user
```

### Session vs JWT

| Feature | Sessions (our choice) | JWT |
|---------|----------------------|-----|
| Storage | Server-side (database) | Client-side (cookie/localStorage) |
| Revocation | Immediate (delete from DB) | Difficult (must wait for expiry) |
| Best For | Web applications | APIs, microservices |

---

## Middleware Pattern

### What is Middleware?

Middleware is code that runs **before** your main logic.

### Our Protected Procedure

```typescript
export const protectedProcedure = t.procedure.use(async (opts) => {
  if (!opts.ctx.user) {
    throw new TRPCError({ code: 'UNAUTHORIZED' });
  }
  return opts.next({ ctx: { ...opts.ctx, user: opts.ctx.user } });
});
```

---

## Protected Routes

### Authorization Flow

```
Client Request → Context Creation → Middleware Check → Procedure Code
```

### Ownership Verification

```typescript
// Always verify the user owns the resource
if (workflow.userId !== ctx.user.id) {
  throw new Error('Unauthorized');
}
```

---

## CSRF Protection

**Cross-Site Request Forgery**: Attack where malicious sites trick your browser.

Better Auth protects us with:
- SameSite cookies
- CSRF tokens
- HTTP-only cookies

---

## Self-Test Questions

**Q1:** Why hash passwords instead of encrypting them?
**A:** Hashing is one-way (cannot be reversed). More secure if database is compromised.

**Q2:** What's the difference between authentication and authorization?
**A:** Authentication = Who are you? Authorization = What can you do?

**Q3:** Why use HTTP-only cookies?
**A:** JavaScript cannot access them, protecting against XSS attacks.

---

## Key Takeaways

1. Never store plain text passwords
2. Sessions are stored server-side
3. Middleware enables reusable logic
4. Always verify ownership
5. HTTP-only cookies are secure

**Phase 3 Complete!** 🎉
