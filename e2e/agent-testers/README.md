# Agent testers (trial)

A trimmed copy of [mobile-agent-testers](https://github.com/pierridotite/mobile-agent-testers)
(MIT, see `LICENSE`, vendored at `d610b95`). Each persona in `personas.json` gets its own simulator
or emulator with the latest QA build installed, driven by a headless Claude Code agent that follows
`AGENT_BRIEF.md` and writes a report, `findings.json` and screenshots.

Workflow: `.github/workflows/agent-testers.yml`.

## What changed from upstream

- No build jobs: the QA build comes from S3 (`Artsy-<build_name>`), like the e2e suites.
- `scripts/{ios,android}/run_agent.sh` launch the app with the e2e launch arguments
  (`useE2EInit`, `email`/`password` or `shouldSignOut`, `enableFeatureFlags`). The test account is read by
  `scripts/e2e_credentials.sh` into unexported shell variables and its file is deleted before the
  agent starts, so the agent never sees it.
- Personas have `logged_in` and `feature_flags` fields.

## Reading the results

Results are encrypted with `results_public.pem`, because this repo's artifacts are public. With the
matching private key at `~/.mobile-agent-testers/artsy_eigen.pem`:

```sh
cd e2e/agent-testers
bash scripts/collect.sh <run id>   # → runs/<run id>/SUMMARY.md, plus each persona's report.md and screenshots
```

Never commit the private key.
