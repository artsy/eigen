"""Screenshot of the iOS simulator + visible elements (AXe accessibility tree).
Usage: python3 scripts/ios/screen.py <dir> <NN>
The PNG is resized to the screen size in POINTS, so a position read on the
image goes straight to `bash scripts/ios/gesture.sh tap X Y`. Also warns
when the app is no longer running or a crash report just appeared, and prints an
accessibility check (controls with no name, touch targets under 44 pt)."""
import json, os, subprocess, sys, time
from pathlib import Path
from PIL import Image

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))
import a11y  # noqa: E402

UDID, APP = os.environ["UDID"], os.environ.get("APP_ID", "")


def run(*a):
    return subprocess.run(list(a), capture_output=True, text=True, timeout=60).stdout


def walk(n, acc):
    if isinstance(n, list):
        for c in n:
            walk(c, acc)
        return
    if not isinstance(n, dict):
        return
    f, label = n.get("frame") or {}, (n.get("AXLabel") or n.get("title") or "").strip()
    value, kind = str(n.get("AXValue") or "").strip(), (n.get("type") or n.get("role_description") or "").strip()
    if f and (label or value or "Field" in kind or kind in ("Button", "TextArea")):
        acc.append((kind, label, value, f))
    walk(n.get("children") or [], acc)


out, nn = Path(sys.argv[1]), sys.argv[2]
out.mkdir(parents=True, exist_ok=True)
raw = out / f"{nn}-raw.png"
run("xcrun", "simctl", "io", UDID, "screenshot", "--type=png", str(raw))
try:
    tree = json.loads(run("axe", "describe-ui", "--udid", UDID))
except json.JSONDecodeError:
    tree = []
els = []
walk(tree, els)
img = Image.open(raw).convert("RGB")
memo = Path(os.environ.get("RUNNER_TEMP", "/tmp")) / "width_points"
root = tree[0] if isinstance(tree, list) and tree else tree
wpt = int((root.get("frame") or {}).get("width", 0)) if isinstance(root, dict) else 0
if wpt >= 300 and img.size[0] % wpt == 0:
    memo.write_text(str(wpt))           # app in front: trust its frame
elif memo.exists():
    wpt = int(memo.read_text())         # system alert / home screen: reuse
else:
    wpt = img.size[0] // 3
scale = img.size[0] / wpt
hpt = img.size[1] / scale
img.resize((round(img.size[0] / scale), round(hpt))).save(out / f"{nn}.png")
raw.unlink()
print(f"screenshot: {out}/{nn}.png ({wpt}x{round(hpt)} points; positions on the image = positions to tap)")
seen = set()
for kind, label, value, f in els:
    if kind in ("Application", "Window", "ScrollBar") or f.get("width", 0) <= 0:
        continue
    cx, cy = round(f["x"] + f["width"] / 2), round(f["y"] + f["height"] / 2)
    if not (0 <= cx <= wpt and 0 <= cy <= hpt) or (label, value, cx, cy) in seen:
        continue
    seen.add((label, value, cx, cy))
    name = "field" if "Field" in kind or kind == "TextArea" else ("button" if kind in ("Button", "Link", "Switch", "Cell", "Tab") else "text")
    extra = f" value \"{value[:40]}\"" if value and value != label else ""
    print(f"- {name} \"{(label or value)[:70]}\"{extra} centre=({cx},{cy})")
try:
    check = a11y.ios(tree, wpt, hpt)
    if check:
        print(check)
except Exception:  # the check must never break seeing the screen
    pass
if APP and APP not in run("xcrun", "simctl", "spawn", UDID, "launchctl", "list"):
    print("WARNING: the app is no longer running (crash or closed).")
reports = Path.home() / "Library/Logs/DiagnosticReports"
for p in (reports.glob("*.ips") if reports.exists() else []):
    if time.time() - p.stat().st_mtime < 120:
        print(f"CRASH REPORT: {p.name} (less than 2 min ago)")
