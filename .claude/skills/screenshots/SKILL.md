---
name: screenshots
description: Take before/after screenshots of the UI surfaces affected by the current changes, on a connected Android emulator and/or booted iOS simulator, and produce side-by-side comparisons. Use when the user asks to "screenshot the surfaces I changed", "before and after screenshots", "record screenshots for the PR", or similar.
---

# Before/After Screenshots

Drive the running dev app with `.claude/skills/screenshots/scripts/sim.sh` (run it with no args for usage). Save images in the session scratchpad.

1. **Find the surfaces.** Run `git fetch origin main`, then list changed files (`git diff --stat`, or `git diff origin/main...HEAD --stat` if committed) and trace each component up to a screen. Route paths in `src/app/Navigation/routes.tsx` open as deep links (`sim.sh open android artist/kaws`).
2. **Pick platforms.** `sim.sh devices`; use what the user asked for, otherwise everything connected. If no device is booted for a requested platform, ask the user to boot one. On Android also run `adb reverse tcp:8081 tcp:8081`.
   Then run `sim.sh check <platform>` (no platform checks both). If it reports anything missing, stop and show the user the list with its install commands, and ask whether to install them. Never install anything without the user's explicit approval. Install only the items they approve, or let them install it themselves, then re-run `check`. Never start Metro yourself; ask the user to run `yarn start`.
3. **Capture AFTER.** Deep link, then take a screenshot, Read it, tap, and repeat. Note the steps so you can replay them.
4. **Capture BEFORE.** Save `git status --short` and the SHA from `git merge-base origin/main HEAD`; write the SHA itself into later commands as `<base>`, because shell variables don't persist between commands. Before reverting anything, print the step 5 restore commands for the user, so they can recover their work if the session dies. Remove every change under `src/`, not just the UI files, so the tree still bundles. Never touch `.claude/`. A branch can have both kinds of change, so do both steps in this order:

   - Uncommitted: `git stash push -u -m screenshots-skill -- src/`. Note whether it created a stash, because it prints "No local changes to save" when it doesn't.
   - Committed: `git restore --source=<base> --staged --worktree -- src/`. This also removes files the branch added and brings back ones it deleted or renamed.

   Then `sim.sh restart <platform>` and replay the steps.

5. **Restore** in reverse order: `git restore --source=HEAD --staged --worktree -- src/`, then, only if step 4 created a stash, pop it by name rather than `stash@{0}`: `git stash pop --index "$(git stash list | grep -m1 screenshots-skill | cut -d: -f1)"`. Confirm `git status --short` matches what you saved, and run `sim.sh restart`.
6. **Report.** Run `sim.sh compare before.png after.png out.png` for each pair, Read the results, and give the user absolute paths plus one line per surface on what changed.
7. **Hand off.** Ask how they want the photos:
   - **Open the folder** (default): `open <shots dir>` shows them in Finder, ready to drag into a PR.
   - **Add them to the PR description for them**: only if they choose this. eigen is public and anyone with the link can open an uploaded image, so first show the user the final images and have them confirm none show personal data (profile, orders, addresses, inquiries). GitHub has no image upload API, so use Claude in Chrome: open the description's edit box, upload the images with `file_upload`, and build a table from the returned `https://github.com/user-attachments/...` URLs (`| Surface | Before | After |`, each cell `<img src="..." width="300" />`). Save the description. Never post a comment.

## Gotchas

- With several Android devices connected (e.g. a phone plus the emulator), set `ANDROID_SERIAL=<serial>`.
- Android taps are in screenshot pixels; iOS (idb) taps are in points, which is pixels ÷ 3 on most simulators.
- Swipe slowly; fast swipes trigger the shake dev menu.
- Restart the app instead of relying on Fast Refresh after switching code.
- Skip surfaces where the change can't show on a platform (e.g. `Platform.OS === "android"` code) and say so.
- On delete/send/purchase flows, only open the confirmation, then Cancel.
- If a control can't be tapped (often the bug itself), use `sim.sh back android`.
