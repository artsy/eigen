import {
  MAX_PROMPT_LENGTH,
  sanitizePrompt,
} from "app/Scenes/ArtAssistant/utils/sanitizePrompt"

describe("sanitizePrompt", () => {
  it("leaves an ordinary prompt untouched", () => {
    expect(sanitizePrompt("Large blue abstract painting, under $10k")).toBe(
      "Large blue abstract painting, under $10k"
    )
  })

  it("trims surrounding whitespace", () => {
    expect(sanitizePrompt("  something like Ruth Asawa  ")).toBe("something like Ruth Asawa")
  })

  it("redacts email addresses", () => {
    expect(sanitizePrompt("email me at collector@example.com please")).toBe(
      "email me at <EMAIL> please"
    )
  })

  it("redacts phone numbers", () => {
    expect(sanitizePrompt("call me on +1 212 555 0198")).toBe("call me on <PHONE>")
  })

  it("redacts card numbers", () => {
    expect(sanitizePrompt("my card is 4111 1111 1111 1111")).toBe("my card is <CARD>")
  })

  it("redacts several kinds of PII in one prompt", () => {
    const result = sanitizePrompt("reach me at a@b.co or 212-555-0198")

    expect(result).toContain("<EMAIL>")
    expect(result).toContain("<PHONE>")
    expect(result).not.toContain("a@b.co")
  })

  // These are the prompts a naive phone regex eats. Over-redaction silently
  // corrupts the dataset, so they are worth pinning.
  it.each([
    "abstract paintings from 1960 - 1970",
    "works made between 1998 and 2005 in oil",
    "I want a 48 x 60 inch canvas, budget 12000",
    "prints under 2500 from the 1970s",
    "something between 5,000 and 10,000 dollars",
    "Large blue abstract painting for a living room, under $10k",
  ])("leaves number ranges and budgets alone: %s", (prompt) => {
    expect(sanitizePrompt(prompt)).toBe(prompt)
  })

  it("redacts a parenthesised area code", () => {
    expect(sanitizePrompt("my number is (212) 555 0198")).toBe("my number is <PHONE>")
  })

  it("truncates to the maximum length", () => {
    const result = sanitizePrompt("a".repeat(MAX_PROMPT_LENGTH + 250))

    expect(result).toHaveLength(MAX_PROMPT_LENGTH)
  })

  it("handles an empty prompt", () => {
    expect(sanitizePrompt("   ")).toBe("")
  })
})
