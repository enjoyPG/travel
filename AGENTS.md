<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## Vercel deployment workflow

- This directory tracks `origin/main` at `https://github.com/enjoyPG/travel.git`.
  The existing Vercel project `travel-film-archive` tracks `main` as its production branch.
- Git auto deployment is the normal path for this project: a successful push to `origin/main`
  starts a Vercel Production deployment. Saving files or committing locally does not.
  Git is not a Vercel requirement in general; this project's automatic deployment uses
  the GitHub integration. Do not require Vercel CLI access before using this path.
- For completed website changes intended for production, review `git status` and the diff,
  stage only the intended files, commit, then `git push origin main`. A local save or commit
  alone does not deploy. Do not push unfinished work or force-push. Honor a user's request
  to keep a change local or in a draft branch.
- Keep `.env.local`, `.vercel`, credentials, and generated build files out of Git. Check the
  staged file list before pushing.
- In this Codex workspace, writes to `.git` may fail with `index.lock: Permission denied`.
  Retry only the needed Git write command with `exec_command`'s `require_escalated` setting.
  If elevated Git reports `dubious ownership`, use the one-command option
  `git -c safe.directory='C:/Users/lasth/OneDrive/바탕 화면/coding/20260924_tripJapan' ...`.
  Do not change the global Git trust list or retry a rejected escalation through another path.
- After pushing, verify that the Vercel Production deployment for the pushed commit is
  `Ready` and assigned to the production domains. If a build fails, inspect its logs and
  fix the cause before reporting completion. A Vercel connector `403` does not prove the
  Git deployment failed; inspect the project dashboard when that connector is unavailable.

### When direct Vercel access fails

- Vercel CLI, the Codex Vercel connector, the Vercel dashboard browser session, and the
  project's GitHub integration have separate access paths. A successful browser login or
  GitHub push does not authenticate the CLI or connector. Conversely, a CLI or connector
  authorization failure does not stop an already connected Git push from deploying.
- Before attempting a CLI deployment, check whether `vercel` is installed (`Get-Command
  vercel`). A missing command is an installation/PATH issue, not an authorization failure.
  The CLI is optional for this project's normal deployment workflow; do not install it
  solely to work around a working Git integration.
- For a CLI `Not authorized` error, check the CLI login and selected Vercel team/project
  scope (`vercel whoami`, `vercel switch`, and the local project link). Do not assume the
  reason is a revoked account: an expired login, wrong account, wrong team, or missing
  project permission can produce similar errors. Never paste or commit tokens. For a
  connector `403`, identify it as a connector scope failure and do not mislabel it as a
  GitHub or Vercel deployment failure.
- If direct access is blocked, finish an authorized release through `git push origin main`
  and verify the matching commit in the Vercel project dashboard. Do not claim success
  from a successful push alone. If Git push, build, or verification fails, report the
  exact failed step and error; do not repeatedly retry rejected permission escalations.
