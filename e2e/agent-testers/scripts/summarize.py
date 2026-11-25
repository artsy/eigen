"""Merges every results/<persona>/findings.json of a collected run into one
Markdown summary, most severe first, with how many personas hit each issue.

Reports that describe the same bug in other words, or in another language, are
grouped by Claude when the `claude` CLI is installed (your own login, like the
testers). Only the report titles, screens and severities are sent. Without the
CLI, or with SUMMARY_GROUPING=0, only identical titles are merged.
A reproduction run (bug_report input, briefs/reproduce.md) starts with a table:
which devices reproduced the reported bug, which did not, and the evidence.
An improvement run (briefs/improve.md) adds a walkthrough table (goal reached,
actions and score of each persona) and the improvements by area and impact.
Usage: python3 scripts/summarize.py <collected_run_dir>"""
import json, os, re, shutil, subprocess, sys
from collections import defaultdict
from pathlib import Path
from statistics import median

ORDER = {"blocker": 0, "major": 1, "minor": 2, "cosmetic": 3}
RESULTS = ("yes", "unclear", "no")   # answers of briefs/reproduce.md, in table order
GOALS = ("yes", "partly", "no")      # goal_reached of briefs/improve.md
IMPACTS = ("high", "medium", "low")
AREAS = ("onboarding", "navigation", "copy", "layout", "feedback", "trust", "performance",
         "feature", "accessibility", "translation")
CLASSES = ["layout and text size", "feedback and errors", "accessibility", "translation",
           "right to left", "tablet", "system bars", "copy", "visual polish", "crash",
           "likely test artefact"]
PROMPT = """Below are bug reports from AI testers. Each tester used the same app on a
different phone, often in a different language. Group the reports that describe
the same underlying bug: same screen or element and same cause, even when the
wording or the language differs. Different elements, strings or screens are
different bugs, even when they look alike (two mistranslated labels are two bugs).
For each group, write a short English title and pick one class from this list:
{classes}.
Answer with JSON only, in this shape:
{{"groups": [{{"title": "...", "class": "...", "ids": [1, 4]}}]}}
Every report id must be in exactly one group.

Reports (id. [persona, severity, screen] title):
{reports}
"""


def per_persona(run_dir):
    """(persona, content of its findings.json) for each persona of a collected run."""
    for f in sorted(Path(run_dir).glob("*/results/*/findings.json")):
        try:
            data = json.loads(f.read_text(encoding="utf-8"))
        except (OSError, ValueError):
            continue
        if isinstance(data, dict):
            yield f.parent.name, data


def number(x):
    return x if isinstance(x, (int, float)) and not isinstance(x, bool) else None


def load(run_dir):
    findings, scores = [], []
    for persona, data in per_persona(run_dir):
        if number(data.get("score")) is not None:
            scores.append(data["score"])
        for i in data.get("issues") or []:
            if not isinstance(i, dict):
                continue
            findings.append({"id": len(findings) + 1, "persona": persona,
                             "severity": i.get("severity") or "?",
                             "title": (i.get("title") or "?").strip(),
                             "screen": (i.get("screen") or "").strip()})
    return findings, scores


def load_reproduction(run_dir):
    """One row per persona that answered `reproduced`, and the title of the bug report."""
    rows, title = [], ""
    for persona, data in per_persona(run_dir):
        answer = str(data.get("reproduced") or "").strip().lower()
        if answer:
            evidence = data.get("evidence") if isinstance(data.get("evidence"), list) else []
            rows.append({"persona": persona, "result": answer if answer in RESULTS else "unclear",
                         "evidence": [str(e) for e in evidence], "note": str(data.get("note") or "").strip()})
    for b in sorted(Path(run_dir).glob("*/results/bug_report.md")):
        lines = b.read_text(encoding="utf-8", errors="replace").strip().splitlines()
        title = lines[0].lstrip("#").strip() if lines else ""
        break
    return rows, title


def load_walkthrough(run_dir):
    """Goal reached, actions, score and improvements of each persona that followed briefs/improve.md."""
    rows = []
    for persona, data in per_persona(run_dir):
        goal = str(data.get("goal_reached") or "").strip().lower()
        ideas = []
        for i in data.get("improvements") or []:
            if not isinstance(i, dict) or not str(i.get("title") or "").strip():
                continue
            area, impact = (str(i.get(k) or "").strip().lower() for k in ("area", "impact"))
            screens = i.get("screens") if isinstance(i.get("screens"), list) else []
            ideas.append({"title": str(i["title"]).strip(), "area": area if area in AREAS else "other",
                          "impact": impact if impact in IMPACTS else "?", "why": str(i.get("why") or "").strip(),
                          "screen": str(i.get("screen") or "").strip(), "screens": [str(x) for x in screens]})
        if goal or ideas:
            rows.append({"persona": persona, "goal": goal if goal in GOALS else ("?" if goal else ""),
                         "actions": number(data.get("actions")), "score": number(data.get("score")),
                         "ideas": ideas})
    return rows


def personas_by_id():
    try:
        data = json.loads((Path(__file__).resolve().parent.parent / "personas.json").read_text(encoding="utf-8"))
        return {p["id"]: p for p in data}
    except (OSError, ValueError, KeyError, TypeError):
        return {}


def phone(persona):
    """Device, language and text size of a persona, as shown in the reproduction table."""
    d = (persona or {}).get("device") or {}
    name = d.get("name") or (f'{d["simulator"]}, iOS {d.get("ios", "?")}' if "simulator" in d else "")
    size = f'x{d["font_scale"]}' if "font_scale" in d else d.get("text_size", "")
    return name, (persona or {}).get("locale", ""), str(size)


def render_reproduction(rows, title):
    personas, n = personas_by_id(), {r: sum(x["result"] == r for x in rows) for r in RESULTS}
    lines = ["## Reproduction", ""]
    if title:
        lines.append(f"Bug: {cell(title)}")
    lines.append(f"Reproduced on {n['yes']} of {len(rows)} devices, not reproduced on {n['no']}, "
                 f"unclear on {n['unclear']}. Open the evidence screenshots before you trust a row.")
    lines += ["", "| Reproduced | Persona | Device | Language | Text size | Evidence | Note |",
              "|---|---|---|---|---|---|---|"]
    for r in sorted(rows, key=lambda x: (RESULTS.index(x["result"]), x["persona"])):
        device, locale, size = phone(personas.get(r["persona"]))
        lines.append(f"| {r['result']} | {r['persona']} | {cell(device)} | {locale} | {size} "
                     f"| {cell(', '.join(r['evidence']))} | {cell(r['note'])} |")
    return lines + [""]


def num(x):
    return "" if x is None else f"{x:g}"


def render_walkthrough(rows):
    personas, n = personas_by_id(), {g: sum(r["goal"] == g for r in rows) for g in GOALS}
    head, actions = [], [r["actions"] for r in rows if r["actions"] is not None]
    if any(r["goal"] for r in rows):
        head.append(f"Goal reached: yes for {n['yes']}, partly for {n['partly']}, no for {n['no']} "
                    f"of {len(rows)} personas.")
    if actions:
        head.append(f"Median: {median(actions):g} actions.")
    lines = ["## Walkthrough", "", " ".join(head), "",
             "| Persona | Device | Language | Text size | Goal reached | Actions | Score |",
             "|---|---|---|---|---|---|---|"]
    for r in sorted(rows, key=lambda x: (GOALS.index(x["goal"]) if x["goal"] in GOALS else 3, x["persona"])):
        device, locale, size = phone(personas.get(r["persona"]))
        lines.append(f"| {r['persona']} | {cell(device)} | {locale} | {size} | {r['goal'] or '?'} "
                     f"| {num(r['actions'])} | {num(r['score'])} |")
    ideas = [dict(i, persona=r["persona"]) for r in rows for i in r["ideas"]]
    if not ideas:
        return lines + [""]
    areas = defaultdict(lambda: [0, set()])
    for i in ideas:
        areas[i["area"]][0] += 1
        areas[i["area"]][1].add(i["persona"])
    ranked = sorted(areas, key=lambda a: (-len(areas[a][1]), -areas[a][0], a))
    lines += ["", "## Improvements", "",
              f"{len(ideas)} suggestions from {len({i['persona'] for i in ideas})} personas. The same idea often "
              "comes back in other words: read each area together, and open the screenshots.", "",
              "| Area | Suggestions | Personas |", "|---|---|---|"]
    lines += [f"| {a} | {areas[a][0]} | {len(areas[a][1])} ({', '.join(sorted(areas[a][1]))}) |" for a in ranked]
    lines += ["", "| Impact | Area | Improvement | Persona | Screen | Why |", "|---|---|---|---|---|---|"]
    for i in sorted(ideas, key=lambda i: (IMPACTS.index(i["impact"]) if i["impact"] in IMPACTS else 3,
                                          ranked.index(i["area"]), i["persona"])):
        where = i["screen"] + (f" ({', '.join(i['screens'])})" if i["screens"] else "")
        lines.append(f"| {i['impact']} | {i['area']} | {cell(i['title'])} | {i['persona']} | {cell(where.strip())} "
                     f"| {cell(i['why'])} |")
    return lines + [""]


def group_by_title(findings):
    groups = {}
    for f in findings:
        g = groups.setdefault(f["title"].lower(), {"title": f["title"], "class": "", "ids": []})
        g["ids"].append(f["id"])
    return list(groups.values())


def as_id(x):
    try:
        return int(x)
    except (TypeError, ValueError):
        return None


def group_with_claude(findings):
    """Groups the reports with `claude -p`. None when the CLI is missing or its answer is unusable."""
    exe = shutil.which("claude")
    if not exe or os.environ.get("SUMMARY_GROUPING", "1") == "0" or len(findings) < 2:
        return None
    reports = "\n".join(f'{f["id"]}. [{f["persona"]}, {f["severity"]}, {f["screen"]}] {f["title"]}'
                        for f in findings)
    print(f"Grouping {len(findings)} reports with Claude...", file=sys.stderr)
    try:
        out = subprocess.run([exe, "-p", "--output-format", "json",
                              "--model", os.environ.get("SUMMARY_MODEL", "sonnet")],
                             input=PROMPT.format(classes=", ".join(CLASSES), reports=reports),
                             capture_output=True, text=True, timeout=600)
        text = json.loads(out.stdout).get("result", "")
        groups = json.loads(re.search(r"\{.*\}", text, re.S).group(0))["groups"]
    except Exception as e:  # no login, usage limit, timeout, not JSON...
        print(f"Claude grouping skipped ({type(e).__name__}): identical titles only", file=sys.stderr)
        return None
    valid, seen, result = {f["id"] for f in findings}, set(), []
    for g in groups if isinstance(groups, list) else []:
        if not isinstance(g, dict):
            continue
        ids = [i for i in map(as_id, g.get("ids") or []) if i in valid and i not in seen]
        if ids:
            seen.update(ids)
            result.append({"title": str(g.get("title") or "").strip(),
                           "class": g.get("class") if g.get("class") in CLASSES else "", "ids": ids})
    if not result:
        return None
    by_id = {f["id"]: f for f in findings}
    return result + [{"title": by_id[i]["title"], "class": "", "ids": [i]} for i in sorted(valid - seen)]


def cell(s):
    return str(s).replace("|", "\\|").replace("\n", " ")


def render(findings, scores, groups, by_claude, repro=None, walk=None):
    by_id = {f["id"]: f for f in findings}
    rows = []
    for g in groups:
        fs = [by_id[i] for i in g["ids"]]
        rows.append({"title": g["title"] or fs[0]["title"], "class": g["class"] or "other", "reports": fs,
                     "personas": sorted({f["persona"] for f in fs}),
                     "sev": min((f["severity"] for f in fs), key=lambda s: ORDER.get(s, 9)),
                     "screens": sorted({f["screen"] for f in fs if f["screen"]})})
    rows.sort(key=lambda r: (ORDER.get(r["sev"], 9), -len(r["personas"]), r["title"].lower()))
    personas = sorted({f["persona"] for f in findings})
    lines, reproduced = ["# Agent test summary", ""], bool(repro and repro[0])
    if reproduced:
        lines += render_reproduction(*repro)
    if walk:
        lines += render_walkthrough(walk)
    if reproduced or walk:
        lines += ["## Everything else the agents reported" if reproduced else "## Issues", ""]
        if not findings:
            return "\n".join(lines + ["Nothing else." if reproduced else "No issues reported."]) + "\n"
    head = f"{len(findings)} reports from {len(personas)} personas"
    if scores:
        head += f", average score {sum(scores) / len(scores):.1f}/10"
    lines.append(head + ".")
    if by_claude:
        alone = sum(len(r["personas"]) == 1 for r in rows)
        lines.append(f"Claude grouped them into {len(rows)} distinct issues: {alone} found by one persona "
                     f"only, {len(rows) - alone} by several. Open the screenshots before you trust a group.")
    elif findings:
        lines.append("Only identical titles are merged: install the claude CLI to group the reports "
                     "that describe the same bug.")
    extra = (" Class |", "---|") if by_claude else ("", "")
    lines += ["", "| Severity | Issue | Personas | Screen |" + extra[0], "|---|---|---|---|" + extra[1]]
    for r in rows:
        lines.append(f"| {r['sev']} | {cell(r['title'])} | {len(r['personas'])} ({', '.join(r['personas'])}) "
                     f"| {cell(', '.join(r['screens']))} |" + (f" {r['class']} |" if by_claude else ""))
    if by_claude:
        classes = defaultdict(lambda: [0, set()])
        for r in rows:
            classes[r["class"]][0] += 1
            classes[r["class"]][1].update(r["personas"])
        lines += ["", "## Which personas found each class of issue", "",
                  "| Class | Issues | Personas |", "|---|---|---|"]
        for name, (n, ps) in sorted(classes.items(), key=lambda kv: (-len(kv[1][1]), kv[0])):
            lines.append(f"| {name} | {n} | {len(ps)} ({', '.join(sorted(ps))}) |")
        merged = [r for r in rows if len(r["reports"]) > 1]
        if merged:
            lines += ["", "## Reports behind each grouped issue", ""]
            for r in merged:
                lines.append(f"- **{cell(r['title'])}**")
                lines += [f"  - {f['persona']} ({f['severity']}): {f['title']}" for f in r["reports"]]
    return "\n".join(lines) + "\n"


def main():
    if len(sys.argv) != 2:
        sys.exit(__doc__)
    findings, scores = load(sys.argv[1])
    groups = group_with_claude(findings)
    print(render(findings, scores, groups or group_by_title(findings), groups is not None,
                 load_reproduction(sys.argv[1]), load_walkthrough(sys.argv[1])), end="")


if __name__ == "__main__":
    main()
