import {
  extractVimeoVideoDataFromUrl,
  extractYouTubeId,
  isValidVideoUrl,
  isVimeo,
  isYouTube,
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
})
