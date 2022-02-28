import { getShareMessage, getShareURL } from "./helpers"

describe("getShareURL", () => {
  it("should return correct share url", () => {
    expect(getShareURL("/some-link")).toBe("https://staging.artsy.net/some-link")
  })
})

describe("getShareMessage", () => {
  it("should return only artist names", () => {
    const artistNames = ["Artist One", "Artist Two"]
    expect(getShareMessage(artistNames)).toBe("Artist One, Artist Two on Artsy")
  })

  it("should return single artist name", () => {
    const artistNames = ["Artist One"]
    expect(getShareMessage(artistNames)).toBe("Artist One on Artsy")
  })

  it("should return artist names with title", () => {
    const artistNames = ["Artist One", "Artist Two"]
    expect(getShareMessage(artistNames, "Title")).toBe("Title by Artist One, Artist Two on Artsy")
  })

  it("should return single artist name with title", () => {
    const artistNames = ["Artist One"]
    expect(getShareMessage(artistNames, "Title")).toBe("Title by Artist One on Artsy")
  })
})
