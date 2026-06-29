# LeetCode Clone — Learning Journal

> *A production-grade coding platform built from first principles.*
> *Focus: timeless software fundamentals, not framework-specific knowledge.*

---

## Learning Concepts

<details>
<summary><strong>1. What is an ORM?</strong></summary>

**Core Problem:** Applications speak in **objects** (TypeScript classes, interfaces). Databases speak in **tables and SQL**. These two worlds have fundamentally different languages and structures.

**Solution (ORM — Object Relational Mapping):** A translation layer that maps:
- Database tables → Application objects
- Database rows → Object instances
- Foreign key relationships → Nested object properties

**Analogy:** A diplomat translating between English and French at the UN.

**Trade-offs:**

| Pros | Cons |
|------|------|
| Developer productivity (less boilerplate) | Performance overhead vs raw SQL |
| Type safety | Black box (don't control generated SQL) |
| Database-agnostic (swap engines easily) | Complex queries may still need raw SQL |

</details>

---

<details>
<summary><strong>2. What is Prisma?</strong></summary>

**Definition:** Prisma is a **schema-first, type-safe database toolkit** — more than just an ORM.

**Core Innovation:** You declare your data model once in `schema.prisma`, and Prisma **generates** everything else:
- TypeScript types (compile-time safety)
- SQL migrations (schema evolution)
- A fully typed query client

**Traditional ORM flow:** Database exists → You define classes → Manual types → Runtime errors

**Prisma flow:** You write schema → Prisma generates types + client + migrations → Compile-time safety

**Key difference:** No magic lazy loading. You must **explicitly** include relations with `include` or `select`. This prevents N+1 query problems.

</details>

---

<details>
<summary><strong>3. What are Migrations?</strong></summary>

**Core Problem:** Database schemas evolve over time. Adding a column to a table with millions of rows is delicate. Managing changes across dev, staging, and production manually leads to drift and data loss.

**Solution:** Migrations are **version-controlled scripts** that evolve your database schema safely and reproducibly.

```sql
-- UP (apply changes)
ALTER TABLE users ADD COLUMN name VARCHAR(255);

-- DOWN (rollback changes)
ALTER TABLE users DROP COLUMN name;
```

**Prisma migrations are auto-generated:**
```bash
npx prisma migrate dev --name add_user_name
```

| Concept | Real-world analogy |
|---------|-------------------|
| Migration file | A git commit for your database |
| UP | Adding a room to your house |
| DOWN | Removing that room (restoring blueprint) |
| `_prisma_migrations` table | Git log — tracks which migrations applied |

</details>

---

<details>
<summary><strong>4. Dependencies vs DevDependencies</strong></summary>

**Core Principle: Build-time vs Runtime**

| Aspect | `dependencies` | `devDependencies` |
|--------|---------------|-------------------|
| When needed | When your app **runs** | When you're **building/testing** |
| Ships to production? | ✅ Yes | ❌ No |

**In our project:**

```json
{
  "dependencies": {
    "@prisma/client": "^7.8.0"
  },
  "devDependencies": {
    "prisma": "^7.8.0"
  }
}
```

**Why separate?** Smaller production bundles, smaller security surface, efficient Docker images.

</details>

---

<details>
<summary><strong>5. What is a Model?</strong></summary>

**General Definition:** A **model** is a structured representation of a real-world concept within your system.

**Three layers of "model" in software:**

| Layer | What it represents | Example |
|-------|-------------------|---------|
| **Domain Model** | Business concepts + behavior | `User.solve(problem)` |
| **Data Model** | Storage structure | `CREATE TABLE users (...)` |
| **Object Model** | In-memory representation | `interface User { id, email }` |

**Prisma's innovation:** Prisma models **collapse the Data Model + Object Model** into one declaration. The same `schema.prisma` generates both SQL DDL and TypeScript types.

```prisma
model User {
  id       Int    @id @default(autoincrement())
  email    String @unique
  username String @unique
  role     Role   @default(USER)
}
```

This generates: `CREATE TABLE "User"`, `interface User`, `prisma.user.findMany(...)`.

</details>

---

### 6. PrismaClient & The Adapter Pattern

<details>
<summary><strong>6. PrismaClient & The Adapter Pattern</strong></summary>

**PrismaClient:** The runtime object your application code uses to communicate with the database.

```typescript
const prisma = new PrismaClient();
await prisma.user.findMany({ where: { role: 'ADMIN' } });
```

**The Adapter Pattern (PrismaPg):** Prisma is generic — it needs a **driver** specific to your database engine.

```
PrismaClient → PrismaPg adapter → PostgreSQL
 (generic)      (PostgreSQL driver)   (database)
```

**Analogy:** PrismaClient is your phone (USB-C charger). PrismaPg is the country-specific plug adapter. PostgreSQL is the wall outlet.

</details>

---

<details>
<summary><strong>7. The Singleton Pattern & HMR Problem</strong></summary>

**The Problem:** In development, Next.js uses **Hot Module Replacement (HMR)**. When you save a file, the module reloads without a full page refresh. If your database connection file creates a **new PrismaClient** on each reload:

```
Save file → HMR → New PrismaClient → New connection to PostgreSQL
Save again → HMR → Another PrismaClient → Another connection
... (repeat many times)

PostgreSQL: "Too many connections!" ❌
```

**The Solution: Singleton on globalThis**

```typescript
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma = globalForPrisma.prisma ?? new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }),
})

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
```

**How it works:**

| Load Event | `globalThis.prisma` | Result |
|------------|--------------------|--------|
| First load | `undefined` | Creates new PrismaClient, stores on `globalThis` |
| HMR reload | Existing PrismaClient | Reuses existing — NO new connection |
| Production | N/A | Module loads once per process anyway |

**Why `globalThis`?** It survives HMR reloads. Your module's local variables reset, but `globalThis` persists for the life of the process.

</details>

---

<details>
<summary><strong>8. Type Assertions in TypeScript</strong></summary>

**Core Concept:** `as` is a **compile-time type assertion**, not a runtime transformation.

```typescript
const globalForPrisma = globalThis as unknown as { 
  prisma: PrismaClient | undefined 
}
```

**What it is:** A label telling TypeScript "trust me, this is safe". It does NOT create a new object or transform the existing one. **It disappears entirely during compilation.**

**Two-step cast explained:**
1. `globalThis as unknown` — TypeScript allows converting anything to `unknown`
2. `unknown as { prisma: ... }` — TypeScript allows converting `unknown` to anything

Without the double cast, TypeScript complains that `typeof globalThis` and `{ prisma: ... }` have zero overlap.

</details>

---

<details>
<summary><strong>9. Database Providers: Neon vs Docker Compose</strong></summary>

| Aspect | Neon (Cloud) | Docker Compose (Local) |
|--------|-------------|----------------------|
| Setup | 2 minutes (sign up, create project) | 5 minutes (install Docker, write compose) |
| Cost | Free tier available | Free (runs on your machine) |
| Internet | ✅ Required | ❌ Not required |
| Maintenance | Managed (backups, scaling) | You handle it |

**Prisma doesn't care which one.** It just needs a `DATABASE_URL` in `.env`.

</details>

---

*Documentation is a living artifact — updated as understanding deepens.*

---

### 10. What is Clerk?

<details>
<summary><strong>10. What is Clerk?</strong></summary>

**Definition:** Clerk is a **User Management & Authentication Platform as a Service**. It handles the complex security infrastructure of authentication so you don't have to build it yourself.

**The problem it solves:** Building authentication from scratch requires solving dozens of hard problems — password hashing, session management, JWT signing, OAuth flows, email verification, CSRF protection, rate limiting, MFA, and more. Getting any of these wrong compromises your users' security.

**What Clerk provides:**
- Pre-built sign-in/sign-up UI components (`<SignIn />`, `<SignUp />`)
- Session management (cookies, JWTs, token refresh)
- OAuth providers (Google, GitHub, 30+ more)
- User profile management (`<UserButton />`, `<UserProfile />`)
- Server helpers (`auth()`, `currentUser()`)
- Middleware for route protection (`clerkMiddleware()`)
- Admin dashboard for managing users

**Analogy:** Clerk is like a hotel's **front desk** — they handle check-in, keys, and identity verification. You handle what happens inside the room (your application logic).

**How it fits in our stack:**

```
proxy.ts (clerkMiddleware) → checks session → protects routes
    ↓
layout.tsx (ClerkProvider) → provides user context to components
    ↓
Your components (auth()) → reads user ID for database queries
```

</details>

---

### 11. What is `clerkMiddleware()`?

<details>
<summary><strong>11. What is `clerkMiddleware()`?</strong></summary>

**Definition:** A request interceptor that runs on every incoming HTTP request **before** it reaches your route handler.

**What it does:**
1. Reads the session cookie from the request
2. Verifies the JWT signature using your `CLERK_SECRET_KEY`
3. Checks if the session is expired
4. If invalid/expired → redirects to `/sign-in`
5. If valid → attaches user info to the request and passes through

**Analogy:** The **bouncer** at a club entrance — checks ID before letting anyone in.

**Our proxy.ts (middleware file):**

```typescript
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isPublicRoute = createRouteMatcher(["/sign-in(.*)", "/sign-up(.*)"]);

export default clerkMiddleware(async (auth, req) => {
  if (!isPublicRoute(req)) {
    await auth.protect();
  }
})

export const config = {
  matcher: [
    '/((?!_next|.*\\..*).*)',
    '/(api|trpc)(.*)',
    '/__clerk/(.*)',
  ],
}
```

**Key concepts:**
- `createRouteMatcher(["..."])` — Defines which routes are public (no auth required)
- `auth.protect()` — Blocks the request if no valid session exists
- `matcher` config — Tells Next.js which routes should trigger the middleware (avoids running on static files)

</details>

---

### 12. Route Groups `(auth)`

<details>
<summary><strong>12. Route Groups `(auth)`</strong></summary>

**Definition:** A folder wrapped in parentheses `()` is a **route group** — it's ignored in the URL path. Used purely for organizing related routes.

**The problem:** Without route groups, every folder in `app/` maps to a URL segment. To group auth pages, you'd get `/auth/sign-in` instead of `/sign-in`.

**Solution:**

```
app/
├── (auth)/                  ← Not a URL segment
│   ├── sign-in/
│   │   └── page.tsx         →  /sign-in
│   └── sign-up/
│       └── page.tsx         →  /sign-up
│
├── problems/
│   └── page.tsx             →  /problems
│
└── page.tsx                 →  /
```

**Benefits:**
- Organizes related pages without affecting URLs
- Can have its own `layout.tsx` that only applies to auth pages
- Root layout still wraps everything — route group layouts are **nested inside**, not replacing

**Layout hierarchy:**

```
<RootLayout>                    ← app/layout.tsx (html, body, ClerkProvider)
  <AuthLayout (optional)>       ← app/(auth)/layout.tsx (centered card)
    <SignInPage />
  </AuthLayout>
</RootLayout>
```

</details>

---

### 13. Optional Catch-All Routes `[[...param]]`

<details>
<summary><strong>13. Optional Catch-All Routes `[[...param]]`</strong></summary>

**Definition:** A route pattern that matches both the root path AND any sub-paths underneath it.

**The problem:** Clerk's `<SignIn />` handles multiple stages — `/sign-in`, `/sign-in/forgot-password`, `/sign-in/sso-callback`. You don't know all sub-paths Clerk might use.

**Solution:** `[[...sign-in]]` — the optional catch-all:

```
app/(auth)/sign-in/[[...sign-in]]/page.tsx

/sign-in              →  matches ✅ (slug = undefined)
/sign-in/forgot-password → matches ✅ (slug = ["forgot-password"])
/sign-in/sso/callback →  matches ✅ (slug = ["sso", "callback"])
```

**Syntax comparison:**

| Pattern | `/sign-in` | `/sign-in/forgot` |
|---------|-----------|------------------|
| `[slug]` | ❌ No match | ✅ `slug = "forgot"` |
| `[...slug]` | ❌ No match | ✅ `slug = ["forgot"]` |
| `[[...slug]]` | ✅ `slug = undefined` | ✅ `slug = ["forgot"]` |

**The double brackets `[[ ]]` make it optional** — without them, `/sign-in` would return 404.

</details>

---

### 14. Layout Nesting: Root vs Route Group Layouts

<details>
<summary><strong>14. Layout Nesting: Root vs Route Group Layouts</strong></summary>

**Core rule:** Layouts **nest**, they don't **replace**. A route group layout is always nested inside the root layout.

| Question | Answer |
|----------|--------|
| Does auth layout **replace** root layout? | ❌ No |
| Is auth layout **nested inside** root layout? | ✅ Yes |
| What if no auth layout exists? | Page goes directly inside root layout |

**Visual hierarchy:**

```
┌──────────────────────────────────────────────────────┐
│  Root Layout (app/layout.tsx)                        │
│  ┌─ <html> ──────────────────────────────────────┐  │
│  │  <body>                                       │  │
│  │  Navbar, Footer, ClerkProvider                │  │
│  │                                               │  │
│  │  ┌─ Auth Layout (app/(auth)/layout.tsx) ───┐ │  │
│  │  │  Centered card, no navbar               │ │  │
│  │  │  ┌─ <SignIn /> ──────────────────────┐  │ │  │
│  │  │  └───────────────────────────────────┘  │ │  │
│  │  └─────────────────────────────────────────┘ │  │
│  └───────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────┘
```

</details>

---

*Documentation is a living artifact — updated as understanding deepens.*

---

### 15. Null Safety in Auth Functions

<details>
<summary><strong>15. Null Safety in Auth Functions</strong></summary>

**Core Problem:** Clerk's auth() returns userId: string | null, but Prisma expects string | undefined.

```typescript
const { userId } = await auth()
await prisma.user.findUnique({ where: { clerkId: userId } })
// error: null not assignable to undefined
```

**Fix:** Early return pattern

```typescript
export async function getCurrentUserRole() {
  const { userId } = await auth()
  if (!userId) return null
  const user = await prisma.user.findUnique({
    where: { clerkId: userId },
    select: { role: true }
  })
  return user?.role
}
```

**Golden Rule:** Handle null explicitly before any Prisma query.

</details>

---

### 16. `id` vs `clerkId` — Two ID Spaces

<details>
<summary><strong>16. `id` vs `clerkId`</strong></summary>

**Core Problem:** Your app touches two systems with different ID schemes.

```
Clerk: "user_2qX8..."    You: "cly8h3j2..."
(clerkId)                (id)
```

**Rule of Thumb:**

> Use clerkId **once** to find the user. Then use your internal id forever.

```typescript
const { userId: clerkId } = await auth()
const user = await prisma.user.findUnique({ where: { clerkId } })
await prisma.submission.create({ data: { userId: user.id } })
```

| | `id` | `clerkId` |
|---|------|----------|
| Who assigns? | Your system | Clerk |
| Used in foreign keys? | All your tables | Never |
| Survives provider swap? | Yes | No |

</details>

---

### 17. upsert - Atomic Create-or-Update

<details>
<summary><strong>17. upsert</strong></summary>

One operation: create if missing, update if exists. No race conditions.

```typescript
const user = await prisma.user.upsert({
  where: { clerkId: "abc" },
  update: { lastActiveAt: new Date() },
  create: { clerkId: "abc", xp: 0 }
})
```

Best for: Lazy user creation on first visit.

</details>

---

### 18. Enums: Prisma vs TypeScript

<details>
<summary><strong>18. Enums: Prisma vs TypeScript</strong></summary>

Prisma enums generate BOTH a database ENUM type AND a TypeScript enum from one definition.

Generates:
- PostgreSQL: CREATE TYPE "Difficulty" AS ENUM (...)
- TypeScript: export enum Difficulty { EASY = 'EASY', ... }

| Layer | When enforced |
|-------|--------------|
| TypeScript | Compile time |
| PostgreSQL | Runtime |

Pure TS enum = compile-time only, no DB enforcement.

</details>

---

### 19. TypeScript = Compile-Time Safety Layer

<details>
<summary><strong>19. TypeScript = Compile-Time Safety Layer</strong></summary>

TypeScript is a compile-time safety layer over JavaScript. Types are erased at runtime; only pure JS ships.

```
.ts (typed) -> tsc -> .js (no types) -> runtime
```

What you get: Compile-time errors, autocomplete, self-documenting code.
What you DON'T get: Runtime type checking.

Analogy: TypeScript is makeup on JavaScript's face. Washed off at runtime.

</details>

---

### 20. createdAt and updatedAt

<details>
<summary><strong>20. createdAt and updatedAt</strong></summary>

Without timestamps, your database is a bag of unordered facts.

```prisma
createdAt DateTime @default(now())
updatedAt DateTime @updatedAt
```

| Use Case | Field |
|----------|-------|
| Newest first | createdAt |
| Recently active | updatedAt |
| Debugging | updatedAt |
| Retention analysis | createdAt |

Never omit them.

</details>

---

### 21. Server Actions vs Route Handlers vs Server Components

<details>
<summary><strong>21. SA vs RH vs RSC</strong></summary>

| Pattern | Purpose | When to Use |
|---------|---------|-------------|
| Server Component | Fetch data for render | 90% of pages |
| Route Handler | Shared API endpoint | Multiple consumers |
| Server Action | Form mutations | Forms, optimistic updates |

Server Actions are MUTATION-only. Using them for queries is an anti-pattern.

Rule: Fetching data -> RSC. Forms -> Server Action. Shared API -> Route Handler.

</details>
