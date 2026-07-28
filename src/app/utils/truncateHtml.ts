const ENTITY_PATTERN = "&(#\\d+|#x[0-9a-fA-F]+|[a-zA-Z][a-zA-Z0-9]*);"
const ENTITY_REGEX = new RegExp(`^${ENTITY_PATTERN}`)
const ENTITY_REGEX_GLOBAL = new RegExp(ENTITY_PATTERN, "g")

/**
 * Strips tags to measure the length of the text a user would actually see.
 * Entity references (e.g. `&amp;`) count as a single character, matching how
 * they render.
 */
export function visibleHtmlTextLength(html: string): number {
  return html.replace(/<[^>]*>/g, "").replace(ENTITY_REGEX_GLOBAL, "&").length
}

/**
 * Truncates an HTML string to at most `maxVisibleChars` of visible (non-tag) text,
 * without ever cutting in the middle of a tag, an attribute, or an entity reference
 * (e.g. `&amp;`). Once the budget is spent, still emits any tags needed to close
 * elements that are already open, but stops before a new tag would open.
 */
export function truncateHtml(html: string, maxVisibleChars: number): string {
  let result = ""
  let visibleCount = 0
  let inTag = false

  for (let i = 0; i < html.length; i++) {
    const char = html[i]

    if (inTag) {
      result += char
      if (char === ">") {
        inTag = false
      }
      continue
    }

    if (char === "<") {
      const isClosingTag = html[i + 1] === "/"
      if (visibleCount >= maxVisibleChars && !isClosingTag) {
        break
      }
      inTag = true
      result += char
      continue
    }

    if (char === "&") {
      const entityMatch = ENTITY_REGEX.exec(html.slice(i))
      if (entityMatch) {
        if (visibleCount >= maxVisibleChars) {
          break
        }
        result += entityMatch[0]
        visibleCount++
        i += entityMatch[0].length - 1
        continue
      }
    }

    if (visibleCount >= maxVisibleChars) {
      break
    }

    result += char
    visibleCount++
  }

  return result
}
