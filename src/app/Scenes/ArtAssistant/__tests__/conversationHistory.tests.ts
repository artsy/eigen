import {
  MAX_HISTORY_BYTES,
  MAX_HISTORY_MESSAGES,
  trimArtAssistantHistory,
} from "app/Scenes/ArtAssistant/utils/conversationHistory"

describe("trimArtAssistantHistory", () => {
  it("keeps the newest messages within the count limit", () => {
    const history = Array.from({ length: MAX_HISTORY_MESSAGES + 4 }, (_, index) => ({
      role: index % 2 === 0 ? ("USER" as const) : ("ASSISTANT" as const),
      content: `message-${index}`,
    }))

    const result = trimArtAssistantHistory(history, "new message")

    expect(result).toHaveLength(MAX_HISTORY_MESSAGES)
    expect(result[0].content).toBe("message-4")
  })

  it("drops old turns as pairs to fit the byte limit", () => {
    const large = "a".repeat(MAX_HISTORY_BYTES / 2)
    const history = [
      { role: "USER" as const, content: large },
      { role: "ASSISTANT" as const, content: large },
      { role: "USER" as const, content: "latest question" },
      { role: "ASSISTANT" as const, content: "latest answer", artworkIDs: ["artwork-id"] },
    ]

    expect(trimArtAssistantHistory(history, "follow up")).toEqual(history.slice(2))
  })
})
