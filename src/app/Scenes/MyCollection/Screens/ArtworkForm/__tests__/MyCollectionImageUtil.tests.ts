import { Size } from "app/Scenes/Artwork/Components/ImageCarousel/geometry"
import { getBoundingBox } from "app/Scenes/MyCollection/Screens/ArtworkForm/MyCollectionImageUtil"
import { ScreenDimensionsWithSafeAreas } from "app/utils/hooks"

describe("MyCollectionImageUtil", () => {
  describe("image bounding box calculation", () => {
    it("constrains the bounding box to a max height and screen width", () => {
      const imageSize: Size = {
        width: 500,
        height: 500,
      }
      const screenDimensions: ScreenDimensionsWithSafeAreas = {
        width: 300,
        height: 300,
        orientation: "portrait",
        size: "standard",
        isSmallScreen: false,
        safeAreaInsets: {
          top: 10,
          bottom: 10,
          left: 10,
          right: 10,
        },
      }
      const maxImageHeight = 200
      const boundingBox = getBoundingBox(imageSize, maxImageHeight, screenDimensions)
      expect(boundingBox.height).toBe(200)
      expect(boundingBox.width).toBe(300)
    })

    it("returns the image height and screen width if below constraints", () => {
      const imageSize: Size = {
        width: 800,
        height: 500,
      }
      const screenDimensions: ScreenDimensionsWithSafeAreas = {
        width: 1000,
        height: 300,
        orientation: "portrait",
        size: "standard",
        isSmallScreen: false,
        safeAreaInsets: {
          top: 10,
          bottom: 10,
          left: 10,
          right: 10,
        },
      }
      const maxImageHeight = 750
      const boundingBox = getBoundingBox(imageSize, maxImageHeight, screenDimensions)
      expect(boundingBox.height).toBe(500)
      expect(boundingBox.width).toBe(1000)
    })
  })
})
