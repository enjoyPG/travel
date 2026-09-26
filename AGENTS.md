<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## Deployment workflow

This repository is connected to the existing Vercel project `travel-film-archive`.
For completed website changes intended for production, commit the finished work and push
`main` to `origin` (`https://github.com/enjoyPG/travel.git`). Vercel deploys pushes to
the production branch automatically. Do not push incomplete work or force-push.
Keep `.env.local`, `.vercel`, and other credentials out of Git.
