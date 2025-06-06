import { getShareMessage, getShareURL, shareContent } from "app/Components/ShareSheet/helpers"
import { ShareSheetItem } from "app/Components/ShareSheet/types"

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

describe("shareContent should return correct content for", () => {
  it("when artists array is empty", () => {
    const artwork = {
      title: "Mona Lisa",
      href: "/artwork/mona-lisa",
      artists: [],
    } as unknown as ShareSheetItem
    const expectedOutput = {
      title: "Mona Lisa on Artsy",
      message: "Mona Lisa on Artsy",
      url: "https://staging.artsy.net/artwork/mona-lisa?utm_content=artwork-share",
    }

    expect(shareContent(artwork)).toEqual(expectedOutput)
  })

  it("when artists are less than three", () => {
    const artwork = {
      title: "The Starry Night",
      href: "/artwork/the-starry-night",
      artists: [{ name: "Vincent van Gogh" }, { name: "Paul Gauguin" }],
    } as unknown as ShareSheetItem
    const expectedOutput = {
      title: "The Starry Night by Vincent van Gogh, Paul Gauguin on Artsy",
      message: "The Starry Night by Vincent van Gogh, Paul Gauguin on Artsy",
      url: "https://staging.artsy.net/artwork/the-starry-night?utm_content=artwork-share",
    }

    expect(shareContent(artwork)).toEqual(expectedOutput)
  })

  it("when artists are more than three", () => {
    const artwork = {
      title: "The Persistence of Memory",
      href: "/artwork/the-persistence-of-memory",
      artists: [
        { name: "Salvador Dali" },
        { name: "John Doe" },
        { name: "Jane Smith" },
        { name: "Bob Johnson" },
      ],
    } as unknown as ShareSheetItem
    const expectedOutput = {
      title: "The Persistence of Memory by Salvador Dali, John Doe, Jane Smith on Artsy",
      message: "The Persistence of Memory by Salvador Dali, John Doe, Jane Smith on Artsy",
      url: "https://staging.artsy.net/artwork/the-persistence-of-memory?utm_content=artwork-share",
    }

    expect(shareContent(artwork)).toEqual(expectedOutput)
  })
})
