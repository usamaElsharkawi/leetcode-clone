# Architectural Critique: LeetCode Clone — Create Problem Flow

## Executive Summary

Solid foundation with clear separation of concerns. Three critical risk areas need addressing before this scales to production.

---

## 1. Judge0 Integration — Reliability & Cost Risks

### Current Architecture

```
create-problem POST
  → validate auth (admin)
  → validate body
  → FOR EACH reference solution:
      → FOR EACH test case:
          → submitBatch() → Judge0 RapidAPI
          → pollBatchResult() → poll 100×100ms = 10s max
          → if any fail → 400
  → prisma.problem.create()
```

### Risk 1: Synchronous Blocking in Request Handler

**Problem**: `create-problem` holds the HTTP connection for `O(languages × testCases × 10s)` worst-case.

- 3 languages × 10 test cases × 10s = **5 minutes max request duration**
- Vercel/Next.js default timeout: **60s** (Pro: 300s)
- User sees spinner for minutes; connection may drop

**Trade-off made**: Simplicity (sync validation) vs. Reliability (async job queue)
**When it flips**: At ~3 languages × 5 test cases you hit Vercel timeout

**Senior fix**: Async job queue (BullMQ/Redis, or Inngest, or Trigger.dev)

- POST returns `202 Accepted` + `jobId`
- Background worker runs validation
- Webhook/polling notifies admin when done
- DB row created with `status: PENDING_VALIDATION` → `VALIDATED` | `REJECTED`

---
