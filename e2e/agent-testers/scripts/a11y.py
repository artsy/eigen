"""Accessibility check of one screen, printed under the element list by screen.py.

Flags two things a screen reader user or a shaky thumb runs into:
- controls with no name (nothing for TalkBack or VoiceOver to read out),
- touch targets under the platform minimum: 48 dp on Android, 44 pt on iOS.
Elements cut by the edge of a scrolling list or of the screen are skipped,
and so are big containers, keyboards and system switches. Returns one line,
or None when the screen passes."""
import re

MAX_LISTED = 4


def _line(noname, small, unit, minimum):
    parts = []
    if noname:
        at = " ".join(f"({x},{y})" for x, y in noname[:MAX_LISTED])
        more = f" and {len(noname) - MAX_LISTED} more" if len(noname) > MAX_LISTED else ""
        parts.append(f"{len(noname)} control{'s' if len(noname) > 1 else ''} with no name at {at}{more}")
    if small:
        quoted = ['"%s" ' % n if n else "" for n, _, _, _, _ in small[:MAX_LISTED]]
        at = ", ".join(f"{q}{w}x{h} {unit} at ({x},{y})" for q, (_, w, h, x, y) in zip(quoted, small[:MAX_LISTED]))
        more = f" and {len(small) - MAX_LISTED} more" if len(small) > MAX_LISTED else ""
        parts.append(f"{len(small)} touch target{'s' if len(small) > 1 else ''} under {minimum} {unit}: {at}{more}")
    if not parts:
        return None
    return "accessibility check (confirm on the screenshot): " + "; ".join(parts)


def _cut(box, frames, small_is_height):
    """True if box touches or crosses the edge of one of frames (scroll areas, screen) along its small side."""
    x1, y1, x2, y2 = box
    for fx1, fy1, fx2, fy2 in frames:
        if small_is_height and (y1 <= fy1 or y2 >= fy2):
            return True
        if not small_is_height and (x1 <= fx1 or x2 >= fx2):
            return True
    return False


# ---------- Android: uiautomator dump ----------

def _bounds(n):
    b = re.findall(r"-?\d+", n.get("bounds", ""))
    return tuple(map(int, b)) if len(b) == 4 else None


def _name(n):
    for m in n.iter("node"):
        t = (m.get("text") or "").strip() or (m.get("content-desc") or "").strip()
        if t:
            return t
    return ""


def android(root, density, w, h):
    """root: <hierarchy> element of `uiautomator dump`; density: dpi from `wm density`; w, h: screen in pixels."""
    noname, small, seen = [], [], set()
    screen = (0, 0, w, h)

    def visit(n, scrolls):
        b = _bounds(n)
        if b and n.get("scrollable") == "true":
            scrolls = scrolls + [b]
        active = n.get("clickable") == "true" or n.get("long-clickable") == "true" or n.get("checkable") == "true"
        if b and active and n.get("enabled") != "false":
            x1, y1, x2, y2 = b
            if x2 > x1 and y2 > y1 and (b, "a") not in seen:
                seen.add((b, "a"))
                cx, cy = (x1 + x2) // 2, (y1 + y2) // 2
                name = _name(n)
                big = (x2 - x1) * (y2 - y1) > 0.4 * w * h
                if not name and not big:
                    noname.append((cx, cy))
                wdp, hdp = round((x2 - x1) * 160 / density), round((y2 - y1) * 160 / density)
                if min(wdp, hdp) < 48 and not _cut(b, scrolls + [screen], hdp <= wdp):
                    small.append((name[:30], wdp, hdp, cx, cy))
        for c in n:
            if c.tag == "node":
                visit(c, scrolls)

    for top in root:
        if top.tag == "node":
            visit(top, [])
    return _line(noname, small, "dp", 48)


# ---------- iOS: `axe describe-ui` ----------

ACTIVE = ("Button", "Link", "Tab", "Switch", "Slider", "Cell", "MenuItem", "Stepper", "SegmentedControl")
SCROLLING = ("ScrollView", "Table", "CollectionView", "List", "WebView")


def _ios_kind(n):
    return (n.get("type") or n.get("role_description") or "").strip()


def _ios_name(n):
    label = (n.get("AXLabel") or n.get("title") or "").strip()
    if label:
        return label
    for c in n.get("children") or []:
        if isinstance(c, dict):
            label = _ios_name(c)
            if label:
                return label
    return ""


def ios(tree, wpt, hpt):
    """tree: JSON of `axe describe-ui`; wpt, hpt: screen size in points."""
    noname, small, seen = [], [], set()
    screen = (0, 0, wpt, hpt)

    def visit(n, scrolls):
        if isinstance(n, list):
            for c in n:
                visit(c, scrolls)
            return
        if not isinstance(n, dict):
            return
        kind = _ios_kind(n)
        if "Keyboard" in kind or kind == "Key":
            return
        f = n.get("frame") or {}
        box = None
        if f.get("width", 0) > 0 and f.get("height", 0) > 0:
            box = (f["x"], f["y"], f["x"] + f["width"], f["y"] + f["height"])
        if box and kind in SCROLLING:
            scrolls = scrolls + [box]
        if box and kind in ACTIVE and n.get("enabled", True) is not False:
            x1, y1, x2, y2 = box
            cx, cy = round((x1 + x2) / 2), round((y1 + y2) / 2)
            on_screen = 0 <= cx <= wpt and 0 <= cy <= hpt
            if on_screen and (cx, cy, kind) not in seen:
                seen.add((cx, cy, kind))
                name = _ios_name(n)
                big = (x2 - x1) * (y2 - y1) > 0.4 * wpt * hpt
                if not name and not big:
                    noname.append((cx, cy))
                wd, hd = round(x2 - x1), round(y2 - y1)
                if kind not in ("Switch", "Cell", "Slider") and min(wd, hd) < 44 \
                        and not _cut(box, scrolls + [screen], hd <= wd):
                    small.append((name[:30], wd, hd, cx, cy))
        visit(n.get("children") or [], scrolls)

    visit(tree, [])
    return _line(noname, small, "pt", 44)
