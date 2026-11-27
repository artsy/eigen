"""Replaces the focused field's content on the iOS simulator. The text is
pasted (simulator pasteboard + Cmd+V), so accents and symbols survive and iOS
autocorrect cannot change it. Usage: python3 scripts/ios/type.py "text" """
import os, subprocess, sys, unicodedata

UDID, t = os.environ["UDID"], sys.argv[1]


def axe(*a):
    return subprocess.run(["axe", *a, "--udid", UDID], capture_output=True, text=True)


axe("key-combo", "--modifiers", "227", "--key", "4")   # Cmd+A
axe("key", "42")                                        # delete
axe("key-sequence", "--keycodes", ",".join(["42"] * 60), "--delay", "0.02")
paste = subprocess.run(["xcrun", "simctl", "pbcopy", UDID], input=t, text=True, capture_output=True)
r = axe("key-combo", "--modifiers", "227", "--key", "25") if paste.returncode == 0 else paste  # Cmd+V
if r.returncode:  # fallback: key by key, US layout, no accents
    r = axe("type", unicodedata.normalize("NFKD", t).encode("ascii", "ignore").decode())
print("failed: " + (r.stderr or r.stdout)[-300:] if r.returncode else "typed: check it on the next screenshot")
