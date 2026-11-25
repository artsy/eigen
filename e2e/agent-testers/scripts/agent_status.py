"""Says how an agent's `claude -p` run ended, without printing anything it wrote.

The workflow's logs are public, so this reads results/agent-output.json and
results/agent-errors.txt (both encrypted later with the rest of the results)
and only prints a status: finished, out of actions, usage limit, refused token
or key, no API credit, rate limit, overloaded API, or no output.

On GitHub Actions (GITHUB_ACTIONS=true) it adds an annotation for each problem,
shown on the run page, and one row to the job summary. Elsewhere, like in
scripts/collect.sh, it prints one plain line.
Usage: python3 scripts/agent_status.py <agent-output.json> <agent-errors.txt> <persona>"""
import json, os, re, sys

# (status, regex on the agent's final message and its stderr), first match wins
PATTERNS = [
    ("usage_limit", r"hit your (?:[\w-]+ )?limit|usage limit|limit reached|weekly limit"),
    ("auth", r"invalid api key|authentication_error|oauth token|please run /login|api error: 401|"
             r"invalid bearer token|not logged in"),
    ("credit", r"credit balance is too low|insufficient[_ ](?:credit|balance|quota)|billing"),
    ("rate_limit", r"rate_limit_error|api error: 429|too many requests"),
    ("overloaded", r"overloaded_error|api error: 529|overloaded"),
]
PROBLEMS = {
    "usage_limit": ("warning", "stopped on a Claude usage limit",
                    "Your plan's usage limit was reached. Wait for the reset, then run fewer personas at once "
                    "(android_personas, ios_personas)."),
    "auth": ("error", "could not sign in to the model API",
             "The token or key was refused. Set it again with: gh secret set {secret}"),
    "credit": ("error", "found no API credit",
               "The API account has no credit left. Add some, or use a Claude subscription token: "
               "gh secret set CLAUDE_CODE_OAUTH_TOKEN (token from claude setup-token)."),
    "rate_limit": ("warning", "hit the API rate limit",
                   "Requests were refused for too long (429). Run fewer personas at once."),
    "overloaded": ("warning", "stopped because the model API was overloaded",
                   "The API answered 529 for too long. Run it again later."),
    "no_output": ("error", "produced no output",
                  "Claude Code wrote no result: see results/agent-errors.txt in the decrypted results."),
    "error": ("warning", "stopped on an error",
              "See results/agent-output.json in the decrypted results."),
}


def read(path):
    try:
        with open(path, encoding="utf-8", errors="replace") as f:
            return f.read()
    except OSError:
        return ""


def classify(output_path, errors_path):
    """(status, details) where details has the number of turns and the cost when known."""
    raw, errors = read(output_path).strip(), read(errors_path)
    try:
        data = json.loads(raw) if raw else None
    except ValueError:
        data = None
    if isinstance(data, list):   # some versions print every message: the result comes last
        data = next((m for m in reversed(data) if isinstance(m, dict) and m.get("type") == "result"), None)
    details = {}
    if isinstance(data, dict):
        for key in ("num_turns", "total_cost_usd"):
            if isinstance(data.get(key), (int, float)) and not isinstance(data.get(key), bool):
                details[key] = data[key]
        if data.get("subtype") == "success" and not data.get("is_error"):
            return "finished", details
        if data.get("subtype") == "error_max_turns":
            return "max_turns", details
    text = ((data.get("result") or "") if isinstance(data, dict) else raw) + "\n" + errors
    for status, pattern in PATTERNS:
        if re.search(pattern, str(text), re.I):
            return status, details
    if not isinstance(data, dict):
        return "no_output", details
    return "error", details


def describe(status, details):
    parts = []
    if "num_turns" in details:
        parts.append(f"{details['num_turns']} turns")
    if "total_cost_usd" in details:
        parts.append(f"${details['total_cost_usd']:.2f}")
    label = {"finished": "finished", "max_turns": "used all its turns"}.get(status) or PROBLEMS[status][1]
    return label + (f" ({', '.join(parts)})" if parts else "")


def secret_name():
    if os.environ.get("LLM_BASE_URL"):
        return "LLM_API_KEY"
    if os.environ.get("ANTHROPIC_API_KEY"):
        return "ANTHROPIC_API_KEY"
    return "CLAUDE_CODE_OAUTH_TOKEN (token from claude setup-token)"


def main(argv):
    if len(argv) != 4:
        sys.exit(__doc__)
    persona = re.sub(r"[^\w.-]", "", argv[3]) or "agent"
    status, details = classify(argv[1], argv[2])
    line = f"{persona}: {describe(status, details)}"
    if os.environ.get("GITHUB_ACTIONS") != "true":
        print(("WARNING: " if status in PROBLEMS else "") + line)
        return status
    if status in PROBLEMS:
        level, title, hint = PROBLEMS[status]
        print(f"::{level} title={persona} {title}::{hint.format(secret=secret_name())}")
    else:
        print(line)
    summary = os.environ.get("GITHUB_STEP_SUMMARY")
    if summary:
        with open(summary, "a", encoding="utf-8") as f:
            f.write(f"Agent {line}\n")
    return status


if __name__ == "__main__":
    main(sys.argv)
