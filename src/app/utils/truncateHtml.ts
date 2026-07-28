const ENTITY_PATTERN = "&(#\\d+|#x[0-9a-fA-F]+|[a-zA-Z][a-zA-Z0-9]*);"
const ENTITY_REGEX = new RegExp(`^${ENTITY_PATTERN}`)

export interface TruncatedHtml {
  text: string
  wasTruncated: boolean
}

/**
 * Truncates an HTML string to at most `maxVisibleChars` of visible (non-tag) text,
 * without ever cutting in the middle of a tag, an attribute, or an entity reference
 * (e.g. `&amp;`). Once the budget is spent, still emits any tags needed to close
 * elements that are already open, but stops before a new tag would open.
 *
 * `wasTruncated` and the returned `text` come from the same scan, so callers can't
 * see them disagree about whether truncation happened.
 */
export function truncateHtml(html: string, maxVisibleChars: number): TruncatedHtml {
  let result = ""
  let visibleCount = 0
  let inTag = false
  let wasTruncated = false

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
        wasTruncated = true
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
          wasTruncated = true
          break
        }
        result += entityMatch[0]
        visibleCount++
        i += entityMatch[0].length - 1
        continue
      }
    }

    if (visibleCount >= maxVisibleChars) {
      wasTruncated = true
      break
    }

    result += char
    visibleCount++
  }

  return { text: result, wasTruncated }
}
