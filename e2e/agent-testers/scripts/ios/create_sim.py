"""Creates the wanted simulator and prints UDID=... and DEVICE=... (for $GITHUB_ENV).
Usage: python3 scripts/ios/create_sim.py "<model>" <iOS major>
Falls back to the closest model of the same family / newest runtime, and says so."""
import json, subprocess, sys


def simctl(*a):
    return subprocess.run(["xcrun", "simctl", *a], capture_output=True, text=True, check=True).stdout


wanted, major = sys.argv[1], sys.argv[2]
d = json.loads(simctl("list", "-j", "devicetypes", "runtimes"))
rts = sorted((r for r in d["runtimes"] if r.get("isAvailable") and ".SimRuntime.iOS" in r["identifier"]),
             key=lambda r: [int(x) for x in r["version"].split(".")])
if not rts:
    sys.exit("No iOS runtime on this Mac")
rt = ([r for r in rts if r["version"].split(".")[0] == str(major)] or rts)[-1]
types = {t["name"]: t for t in rt.get("supportedDeviceTypes") or d["devicetypes"]}
model = wanted if wanted in types else [n for n in types if n.startswith("iPad" if wanted.startswith("iPad") else "iPhone")][-1]
if model != wanted:
    print(f"{wanted} not available for iOS {rt['version']}: using {model}", file=sys.stderr)
print("UDID=" + simctl("create", "Tester", types[model]["identifier"], rt["identifier"]).strip())
print(f"DEVICE={model}, iOS {rt['version']}")
