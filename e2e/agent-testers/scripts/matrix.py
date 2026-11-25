"""Builds the job matrix: one row per requested persona, with its device.
Env: PERSONAS (comma-separated ids, "all" for every persona of the platform, "none" or empty to skip it), PLATFORM (android | ios).
Prints <platform>=<json> for $GITHUB_OUTPUT."""
import json, os

platform = os.environ.get("PLATFORM", "android")
wanted = [p.strip() for p in os.environ.get("PERSONAS", "").split(",") if p.strip()]
personas = {p["id"]: p for p in json.load(open("personas.json", encoding="utf-8"))}
if wanted == ["none"]:
    wanted = []
elif wanted == ["all"]:
    wanted = [pid for pid, p in personas.items() if p.get("platform") == platform]
missing = [p for p in wanted if p not in personas]
if missing:
    raise SystemExit(f"Unknown personas: {missing}")
other = [p for p in wanted if personas[p].get("platform", platform) != platform]
if other:  # its device settings would be silently replaced by defaults
    raise SystemExit(f"Not {platform} personas: {other}. Put them in the other platform's list.")
rows = []
for pid in wanted:
    p = personas[pid]
    d = p.get("device", {})
    geo = p.get("geo") or [48.8566, 2.3522]
    row = {"persona": pid, "theme": d.get("theme", "light"), "locale": p.get("locale", "en-US"),
           "geo": f"{geo[0]},{geo[1]}",
           # Eigen: sign in with the e2e account through launch arguments, and turn on feature flags
           "logged_in": "true" if p.get("logged_in", True) else "false",
           "feature_flags": ",".join(p.get("feature_flags", []))}
    if platform == "ios":
        row.update({"simulator": d.get("simulator", "iPhone 16"), "ios": str(d.get("ios", "26")),
                    "text_size": d.get("text_size", "large")})
    else:
        row.update({"profile": d.get("profile", "pixel_6"), "api": d.get("android_api", 34),
                    "font_scale": str(d.get("font_scale", 1.0)), "device": d.get("name", "Pixel 6, Android 14"),
                    # Eigen: emulator network presets (-netspeed / -netdelay), e.g. "umts" for a slow 3G line
                    "netspeed": d.get("netspeed", "full"), "netdelay": d.get("netdelay", "none")})
    rows.append(row)
print(f"{platform}=" + json.dumps(rows, ensure_ascii=False))
