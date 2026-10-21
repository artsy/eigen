---
name: screenshots
description: Take before/after screenshots of the UI surfaces affected by the current changes, on a connected Android emulator and/or booted iOS simulator, and produce side-by-side comparisons. Use when the user asks to "screenshot the surfaces I changed", "before and after screenshots", "record screenshots for the PR", or similar.
---

# Before/After Screenshots

Drive the running dev app with `.claude/skills/screenshots/scripts/sim.sh` (run it with no args for usage). Save images in the session scratchpad.

1. **Find the surfaces.** List changed files (`git diff --stat`, or `git diff main...HEAD --stat` if committed) and trace each component up to a screen. Route paths in `src/app/Navigation/routes.tsx` open as deep links (`sim.sh open android artist/kaws`).
2. **Pick platforms.** `sim.sh devices`; use what the user asked for, otherwise everything connected. If no device is booted for a requested platform, ask the user to boot one. Metro must be running; on Android also run `adb reverse tcp:8081 tcp:8081`.
3. **Capture AFTER.** Deep link, then take a screenshot, Read it, tap, and repeat. Note the steps so you can replay them.
4. **Capture BEFORE.** Save `git status --short` first. Remove the change: `git stash push -u -- <files>` if uncommitted (only the changed UI files, never `.claude/`), or `git checkout main -- <files>` if committed (delete files that don't exist on `main`). Then `sim.sh restart <platform>` and replay the steps.
5. **Restore.** `git stash pop` or `git checkout HEAD -- <files>`, confirm `git status --short` matches what you saved, and run `sim.sh restart`.
6. **Report.** Run `sim.sh compare before.png after.png out.png` for each pair, Read the results, and give the user absolute paths plus one line per surface on what changed.
7. **Hand off.** Ask how they want the photos:
   - **Open the folder** (default): `open <shots dir>` shows them in Finder, ready to drag into a PR.
   - **Add them to the PR description for them**: only if they choose this. GitHub has no image upload API, so use Claude in Chrome: open the description's edit box, upload the images with `file_upload`, and build a table from the returned `https://github.com/user-attachments/...` URLs (`| Surface | Before | After |`, each cell `<img src="..." width="300" />`). Save the description. Never post a comment.

## Gotchas

- With several Android devices connected (e.g. a phone plus the emulator), set `ANDROID_SERIAL=<serial>`.
- Android taps are in screenshot pixels; iOS (idb) taps are in points, which is pixels ÷ 3 on most simulators.
- Swipe slowly; fast swipes trigger the shake dev menu.
- Restart the app instead of relying on Fast Refresh after switching code.
- Skip surfaces where the change can't show on a platform (e.g. `Platform.OS === "android"` code) and say so.
- On delete/send/purchase flows, only open the confirmation, then Cancel.
- If a control can't be tapped (often the bug itself), use `sim.sh back android`.
