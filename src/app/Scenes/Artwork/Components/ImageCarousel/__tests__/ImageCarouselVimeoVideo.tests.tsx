import { extractVimeoVideoDataFromUrl } from "app/Scenes/Artwork/Components/ImageCarousel/ImageCarouselVimeoVideo"

describe("ImageCarouselVimeoVideo", () => {
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
  })
})
