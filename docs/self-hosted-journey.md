# Open Brain — Self-Hosted Journey

**Our stack:** lempd (`192.168.4.103`) — Ubuntu 24.04, PostgreSQL 16, Docker
**Why self-hosted:** We already run Postgres on lempd for the music library project.
Zero SaaS dependency, zero monthly cost, data stays on our hardware.

**Authors:** Kai (CT114) + Red (Kai on Red-Dragon) + Keith Gendler

---

## Deviations from Upstream (NateBJones-Projects/OB1)

| Upstream | Ours |
|---|---|
| Supabase (managed Postgres + Edge Functions) | lempd Postgres 16 + FastAPI service |
| Supabase CLI for deployment | systemd service on lempd |
| Deno Edge Function (TypeScript) | Python FastAPI (same 4 MCP tools) |
| Supabase secrets for env vars | `.env` file on lempd, chmod 600 |
| `*.supabase.co` MCP URL | Tailscale Serve → `lempd.tail171d15.ts.net/brain` |

---

## Build Log

### 2026-04-02 — Prep
- Read and mined the full OB1 repo
- Forked as `RedondoK/open-brain`
- OpenRouter API key obtained
- Architecture decision: FastAPI on lempd, expose via Tailscale Serve
- Clients: Claude Desktop (RD), Claude app (Galaxy S26 Ultra), ChatGPT, OpenClaw (CT114)

### 2026-04-03 — Build Day (planned)
- [ ] Install pgvector on lempd Postgres
- [ ] Create `brain` DB + schema (thoughts table, match_thoughts, upsert_thought)
- [ ] Build FastAPI MCP server (port Nate's 4 tools from Deno/TypeScript → Python)
- [ ] Deploy as systemd service on lempd
- [ ] Expose via Tailscale Serve
- [ ] Connect OpenClaw CT114 + Claude Code CT101
- [ ] Run Memory Migration prompt

---

## Schema (identical to upstream)

```sql
-- Enable pgvector
CREATE EXTENSION IF NOT EXISTS vector;

-- Thoughts table
CREATE TABLE thoughts (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  content text NOT NULL,
  embedding vector(1536),
  metadata jsonb DEFAULT '{}'::jsonb,
  content_fingerprint text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Indexes
CREATE INDEX ON thoughts USING hnsw (embedding vector_cosine_ops);
CREATE INDEX ON thoughts USING gin (metadata);
CREATE INDEX ON thoughts (created_at DESC);
CREATE UNIQUE INDEX idx_thoughts_fingerprint
  ON thoughts (content_fingerprint)
  WHERE content_fingerprint IS NOT NULL;
```

---

## MCP Endpoint

```
https://lempd.tail171d15.ts.net/brain?key=YOUR_ACCESS_KEY
```

Accessible from any Tailscale device: RD, Galaxy S26 Ultra, CT114, CT101.
