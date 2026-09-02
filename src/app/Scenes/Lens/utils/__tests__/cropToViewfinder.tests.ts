import { computeViewfinderCropRect } from "app/Scenes/Lens/utils/cropToViewfinder"
import { computePhotoCropRect } from "app/Scenes/Lens/utils/viewfinderGeometry"

describe("computeViewfinderCropRect", () => {
  it("matches the shared computePhotoCropRect geometry, rounded to whole pixels", () => {
    const imageWidth = 4032
    const imageHeight = 3024
    const containerWidth = 390
    const containerHeight = 844

    const rect = computeViewfinderCropRect(imageWidth, imageHeight, containerWidth, containerHeight)
    const expected = computePhotoCropRect(imageWidth, imageHeight, containerWidth, containerHeight)

    expect(rect.originX).toBe(Math.round(expected.originX))
    expect(rect.originY).toBe(Math.round(expected.originY))
    expect(rect.width).toBe(Math.round(expected.width))
    expect(rect.height).toBe(Math.round(expected.height))
  })

  it("stays within the source image bounds even when the container's aspect ratio differs sharply from the photo's", () => {
    // A near-square photo through a tall phone screen -- the case that was actually broken.
    const rect = computeViewfinderCropRect(3024, 4032, 390, 844)

    expect(rect.originX).toBeGreaterThanOrEqual(0)
    expect(rect.originY).toBeGreaterThanOrEqual(0)
    expect(rect.originX + rect.width).toBeLessThanOrEqual(3024)
    expect(rect.originY + rect.height).toBeLessThanOrEqual(4032)
  })

  it("returns whole-pixel integers", () => {
    const rect = computeViewfinderCropRect(4033, 3025, 391, 845)

    expect(Number.isInteger(rect.originX)).toBe(true)
    expect(Number.isInteger(rect.originY)).toBe(true)
    expect(Number.isInteger(rect.width)).toBe(true)
    expect(Number.isInteger(rect.height)).toBe(true)
  })
})
