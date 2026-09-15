export const MAX_HISTORY_MESSAGES = 40
export const MAX_HISTORY_BYTES = 100_000

export type ArtAssistantHistoryEntry = {
  role: "USER" | "ASSISTANT"
  content: string
  artworkIDs?: string[]
}

/** Keeps the newest complete history entries within Metaphysics' server-side limits. */
export const trimArtAssistantHistory = (
  history: ArtAssistantHistoryEntry[],
  message: string
): ArtAssistantHistoryEntry[] => {
  let trimmed = history.slice(-MAX_HISTORY_MESSAGES)

  while (historyByteLength(trimmed, message) > MAX_HISTORY_BYTES && trimmed.length > 0) {
    const dropCount = trimmed[0]?.role === "USER" && trimmed[1]?.role === "ASSISTANT" ? 2 : 1
    trimmed = trimmed.slice(dropCount)
  }

  // A truncated history should never begin with an orphaned assistant response.
  if (trimmed[0]?.role === "ASSISTANT") {
    trimmed = trimmed.slice(1)
  }

  return trimmed
}

const historyByteLength = (history: ArtAssistantHistoryEntry[], message: string) => {
  return [
    message,
    ...history.flatMap((entry) => [entry.content, ...(entry.artworkIDs ?? [])]),
  ].reduce((total, value) => total + utf8ByteLength(value), 0)
}

const utf8ByteLength = (value: string) => {
  let length = 0

  for (const character of value) {
    const codePoint = character.codePointAt(0) ?? 0
    length += codePoint <= 0x7f ? 1 : codePoint <= 0x7ff ? 2 : codePoint <= 0xffff ? 3 : 4
  }

  return length
}
