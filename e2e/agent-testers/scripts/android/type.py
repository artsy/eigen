"""Replaces the focused field's content. adb cannot type accents: they are
stripped. Usage: python3 scripts/android/type.py "text" """
import re, subprocess, sys, unicodedata

t = unicodedata.normalize("NFKD", sys.argv[1]).encode("ascii", "ignore").decode()
subprocess.run(["adb", "shell", "input", "keyevent", "KEYCODE_MOVE_END"])
subprocess.run(["adb", "shell", "input", "keyevent", *(["67"] * 40)])  # 40 backspaces
t = re.sub(r"([\\'\"`$&|;<>()*~#])", r"\\\1", t).replace(" ", "%s")
subprocess.run(["adb", "shell", "input", "text", t])
print("typed: check it on the next screenshot")
