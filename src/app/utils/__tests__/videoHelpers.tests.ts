import { act, renderHook, waitFor } from "@testing-library/react-native"
import {
  extractVimeoVideoDataFromUrl,
  extractYouTubeId,
  getYouTubeThumbnailUrl,
  isValidVideoUrl,
  isVimeo,
  isYouTube,
  useVimeoVideoMetadata,
} from "app/utils/videoHelpers"

describe("videoUtils.ts", () => {
  describe("extractVimeoVideoDataFromUrl", () => {
    it("extracts the video props from vimeo url", () => {
      const url = "https://player.vimeo.com/video/123456789?h=123456789&width=640&height=360"
      const result = extractVimeoVideoDataFromUrl(url)

      expect(result).toEqual({
        videoId: "123456789",
        token: "123456789",
        width: "640",
        height: "360",
      })
    })

    it("extracts video id when there are no query params", () => {
      const url = "https://player.vimeo.com/video/987654321"
      const result = extractVimeoVideoDataFromUrl(url)

      expect(result).toEqual({
        videoId: "987654321",
        token: undefined,
        width: undefined,
        height: undefined,
      })
    })

    it("extracts video data with partial query params", () => {
      const url = "https://player.vimeo.com/video/111222333?h=abcdef&width=1920"
      const result = extractVimeoVideoDataFromUrl(url)

      expect(result).toEqual({
        videoId: "111222333",
        token: "abcdef",
        width: "1920",
        height: undefined,
      })
    })
  })

  describe("isValidVideoUrl", () => {
    it("returns true for valid vimeo player url", () => {
      expect(isValidVideoUrl("https://player.vimeo.com/video/123456789")).toBe(true)
    })

    it("returns true for valid youtube urls", () => {
      expect(isValidVideoUrl("https://www.youtube.com/watch?v=dQw4w9WgXcQ")).toBe(true)
      expect(isValidVideoUrl("https://youtube.com/watch?v=dQw4w9WgXcQ")).toBe(true)
      expect(isValidVideoUrl("https://youtu.be/dQw4w9WgXcQ")).toBe(true)
    })

    it("returns false for invalid domains", () => {
      expect(isValidVideoUrl("https://example.com/video")).toBe(false)
      expect(isValidVideoUrl("https://dailymotion.com/video/123")).toBe(false)
    })
  })

  describe("isYouTube", () => {
    it("returns true for youtube.com urls", () => {
      expect(isYouTube("https://www.youtube.com/watch?v=123")).toBe(true)
      expect(isYouTube("https://youtube.com/embed/123")).toBe(true)
    })

    it("returns true for youtu.be urls", () => {
      expect(isYouTube("https://youtu.be/123456")).toBe(true)
    })

    it("returns false for non-youtube urls", () => {
      expect(isYouTube("https://vimeo.com/123")).toBe(false)
      expect(isYouTube("https://example.com")).toBe(false)
      expect(isYouTube("")).toBe(false)
    })
  })

  describe("isVimeo", () => {
    it("returns true for vimeo.com urls", () => {
      expect(isVimeo("https://player.vimeo.com/video/123456")).toBe(true)
      expect(isVimeo("https://vimeo.com/123456")).toBe(true)
    })

    it("returns false for non-vimeo urls", () => {
      expect(isVimeo("https://youtube.com/watch?v=123")).toBe(false)
      expect(isVimeo("https://example.com")).toBe(false)
      expect(isVimeo("")).toBe(false)
    })
  })

  describe("extractYouTubeId", () => {
    it("extracts video id from youtu.be short links", () => {
      expect(extractYouTubeId("https://youtu.be/dQw4w9WgXcQ")).toBe("dQw4w9WgXcQ")
      expect(extractYouTubeId("https://youtu.be/abc123XYZ")).toBe("abc123XYZ")
    })

    it("extracts video id from youtube.com watch urls", () => {
      expect(extractYouTubeId("https://www.youtube.com/watch?v=dQw4w9WgXcQ")).toBe("dQw4w9WgXcQ")
      expect(extractYouTubeId("https://youtube.com/watch?v=abc123&t=10s")).toBe("abc123")
    })

    it("extracts video id from youtube embed urls", () => {
      expect(extractYouTubeId("https://www.youtube.com/embed/dQw4w9WgXcQ")).toBe("dQw4w9WgXcQ")
      expect(extractYouTubeId("https://youtube.com/embed/abc123?autoplay=1")).toBe("abc123")
    })

    it("returns null for invalid youtube urls", () => {
      expect(extractYouTubeId("https://www.youtube.com/channel/UCxxxxxxx")).toBe(null)
      expect(extractYouTubeId("https://www.youtube.com/")).toBe(null)
    })

    it("returns null for non-youtube urls", () => {
      expect(extractYouTubeId("https://vimeo.com/123456")).toBe(null)
      expect(extractYouTubeId("not a url")).toBe(null)
      expect(extractYouTubeId("")).toBe(null)
    })
  })

  describe("getYouTubeThumbnailUrl", () => {
    it("builds the hqdefault thumbnail url from a youtube.com watch url", () => {
      expect(getYouTubeThumbnailUrl("https://www.youtube.com/watch?v=dQw4w9WgXcQ")).toBe(
        "https://img.youtube.com/vi/dQw4w9WgXcQ/hqdefault.jpg"
      )
    })

    it("builds the thumbnail url from a youtu.be short link", () => {
      expect(getYouTubeThumbnailUrl("https://youtu.be/abc123XYZ")).toBe(
        "https://img.youtube.com/vi/abc123XYZ/hqdefault.jpg"
      )
    })

    it("builds the thumbnail url from a youtube embed link", () => {
      expect(getYouTubeThumbnailUrl("https://youtube.com/embed/abc123?autoplay=1")).toBe(
        "https://img.youtube.com/vi/abc123/hqdefault.jpg"
      )
    })

    it("returns null for a vimeo url", () => {
      expect(getYouTubeThumbnailUrl("https://player.vimeo.com/video/76979871")).toBe(null)
    })

    it("returns null for a youtube url with no video id", () => {
      expect(getYouTubeThumbnailUrl("https://www.youtube.com/channel/UCxxxxxxx")).toBe(null)
    })
  })
})

describe("useVimeoVideoMetadata", () => {
  const sizes = [0, 1, 2, 3, 4].map((size) => ({
    link_with_play_button: `https://i.vimeocdn.com/${size}.jpg`,
  }))

  const vimeoResponse = (status: number) => ({
    ok: status >= 200 && status < 300,
    status,
    json: () => Promise.resolve({ pictures: { sizes } }),
  })

  afterEach(() => {
    jest.restoreAllMocks()
    jest.useRealTimers()
  })

  it("requests only the cover field and returns the cover", async () => {
    const fetchMock = jest.spyOn(global, "fetch").mockResolvedValue(vimeoResponse(200) as any)

    const { result } = renderHook(() => useVimeoVideoMetadata("123"))

    await waitFor(() => expect(result.current.coverImage).toEqual("https://i.vimeocdn.com/4.jpg"))
    expect(fetchMock.mock.calls[0][0]).toEqual(
      "https://api.vimeo.com/videos/123?fields=pictures.sizes.link_with_play_button"
    )
    expect(result.current.isCoverUnavailable).toBe(false)
  })

  it("returns no cover for a response that isn't OK", async () => {
    jest.spyOn(global, "fetch").mockResolvedValue(vimeoResponse(429) as any)

    const { result } = renderHook(() => useVimeoVideoMetadata("123"))

    await waitFor(() => expect(result.current.isCoverUnavailable).toBe(true))
    expect(result.current.coverImage).toBeUndefined()
  })

  it("gives up on a request that takes longer than 5 seconds", async () => {
    jest.useFakeTimers()
    jest.spyOn(global, "fetch").mockImplementation(
      (_url, init) =>
        new Promise((_resolve, reject) => {
          init?.signal?.addEventListener("abort", () => reject(new Error("Aborted")))
        })
    )

    const { result } = renderHook(() => useVimeoVideoMetadata("123"))

    await act(async () => {
      jest.advanceTimersByTime(5000)
    })

    expect(result.current.isCoverUnavailable).toBe(true)
  })
})
