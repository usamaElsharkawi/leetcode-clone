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
