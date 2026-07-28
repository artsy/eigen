/**
 * Strips tags to measure the length of the text a user would actually see.
 */
export function visibleHtmlTextLength(html: string): number {
  return html.replace(/<[^>]*>/g, "").length
}

/**
 * Truncates an HTML string to at most `maxVisibleChars` of visible (non-tag) text,
 * without ever cutting in the middle of a tag or attribute.
 */
export function truncateHtml(html: string, maxVisibleChars: number): string {
  let result = ""
  let visibleCount = 0
  let inTag = false

  for (let i = 0; i < html.length; i++) {
    const char = html[i]

    if (char === "<") {
      inTag = true
      result += char
      continue
    }

    if (inTag) {
      result += char
      if (char === ">") {
        inTag = false
      }
      continue
    }

    if (visibleCount >= maxVisibleChars) {
      break
    }

    result += char
    visibleCount++
  }

  return result
}
