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
