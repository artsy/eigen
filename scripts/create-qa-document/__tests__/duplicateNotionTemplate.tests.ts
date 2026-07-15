import { splitForRichText } from "../duplicateNotionTemplate"

describe("splitForRichText", () => {
  it("returns a single chunk when the text is within the limit", () => {
    expect(splitForRichText("short")).toEqual(["short"])
    expect(splitForRichText("a".repeat(2000))).toHaveLength(1)
  })

  it("splits text over the limit into multiple chunks, each within the limit", () => {
    const line = "x".repeat(500)
    const text = Array.from({ length: 20 }, () => line).join("\n") // ~10k chars
    const chunks = splitForRichText(text)

    expect(chunks.length).toBeGreaterThan(1)
    chunks.forEach((c) => expect(c.length).toBeLessThanOrEqual(2000))
  })

  it("reassembles to the original text byte-for-byte", () => {
    const text = Array.from(
      { length: 500 },
      (_, i) => `- change number ${i} — someone (#${i})`
    ).join("\n")
    expect(splitForRichText(text).join("")).toEqual(text)
  })

  it("hard-splits a single line longer than the limit", () => {
    const text = "y".repeat(5000) // one line, no newlines
    const chunks = splitForRichText(text)

    expect(chunks.length).toBe(3) // 2000 + 2000 + 1000
    chunks.forEach((c) => expect(c.length).toBeLessThanOrEqual(2000))
    expect(chunks.join("")).toEqual(text)
  })

  it("prefers to cut on a newline boundary", () => {
    const first = "a".repeat(1990)
    const second = "b".repeat(1990)
    const [head] = splitForRichText(`${first}\n${second}`)

    // Cut at the newline rather than mid-line, so the first chunk is the whole
    // first line plus its trailing newline.
    expect(head).toEqual(`${first}\n`)
  })
})
