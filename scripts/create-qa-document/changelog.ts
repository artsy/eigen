// Extract the changelog region from the release-candidate PR body.
//
// The RC PR (opened by the `artsyit` bot) writes the changelog under a
// "## Changelog" heading — a set of "### <section>" blocks with bullets — and
// terminates the body with a "#nochangelog" marker. We take everything between
// the heading and that marker so it can be dropped into the Notion code block.
//
// Returns null when the body has no changelog section (best-effort: a missing
// changelog must never block QA document creation).
export const extractChangelogFromPrBody = (body: string): string | null => {
  const heading = "## Changelog"
  const start = body.indexOf(heading)
  if (start === -1) return null

  const section = body
    .slice(start + heading.length)
    .replace(/#nochangelog\s*$/i, "") // drop the trailing marker
    .trim()

  return section || null
}

// Pull the GitHub handles out of a changelog section, so the release captain can
// see at a glance who to involve in Recent Changes QA without reading every line.
//
// Entries are written by the release bot as:
//   - <description> — <handle> (#<pr number>)
// so we anchor on the trailing "(#123)" and take the handle before it. Anchoring
// on the end of the line keeps em dashes inside a description from being
// mistaken for the separator. Lines that don't match that shape (section
// headings, blank lines, hand-edited entries) are skipped rather than guessed at.
//
// Returns handles in first-appearance order, de-duplicated.
export const extractContributorsFromChangelog = (changelog: string): string[] => {
  const contributors = new Set<string>()

  for (const line of changelog.split("\n")) {
    const match = line.match(/—\s*([^—(]+?)\s*\(#\d+\)\s*$/)
    if (match) contributors.add(match[1])
  }

  return [...contributors]
}
