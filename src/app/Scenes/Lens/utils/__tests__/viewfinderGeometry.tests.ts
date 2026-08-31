import { LENS_VIEWFINDER_ASPECT_RATIO, LENS_VIEWFINDER_FRACTION } from "app/Scenes/Lens/constants"
import {
  computePhotoCropRect,
  computeViewfinderRect,
} from "app/Scenes/Lens/utils/viewfinderGeometry"

describe("computeViewfinderRect", () => {
  it("is height-constrained when the container is proportionally wider than the target ratio", () => {
    // e.g. a typical phone screen (~9:19.5, much narrower/taller than 5:6) -- width is the
    // constraint, height is derived. Also covers the analyzing screen's square-ish preview card.
    const rect = computeViewfinderRect(390, 844)

    const expectedContainWidth = 390
    const expectedContainHeight = 390 / LENS_VIEWFINDER_ASPECT_RATIO
    expect(rect.width).toBeCloseTo(expectedContainWidth * LENS_VIEWFINDER_FRACTION)
    expect(rect.height).toBeCloseTo(expectedContainHeight * LENS_VIEWFINDER_FRACTION)
  })

  it("is width-constrained when the container is proportionally narrower than the target ratio", () => {
    // A container wider than it is tall relative to 5:6 -- height is the constraint here.
    const rect = computeViewfinderRect(800, 400)

    const expectedContainHeight = 400
    const expectedContainWidth = 400 * LENS_VIEWFINDER_ASPECT_RATIO
    expect(rect.height).toBeCloseTo(expectedContainHeight * LENS_VIEWFINDER_FRACTION)
    expect(rect.width).toBeCloseTo(expectedContainWidth * LENS_VIEWFINDER_FRACTION)
  })

  it("produces a rect matching LENS_VIEWFINDER_ASPECT_RATIO regardless of the container's own ratio", () => {
    const rect = computeViewfinderRect(390, 844)

    expect(rect.width / rect.height).toBeCloseTo(LENS_VIEWFINDER_ASPECT_RATIO)
  })

  it("centers the rect within the container", () => {
    const containerWidth = 390
    const containerHeight = 844
    const rect = computeViewfinderRect(containerWidth, containerHeight)

    expect(rect.originX).toBeCloseTo((containerWidth - rect.width) / 2)
    expect(rect.originY).toBeCloseTo((containerHeight - rect.height) / 2)
  })

  it("stays within the container bounds", () => {
    const containerWidth = 390
    const containerHeight = 844
    const rect = computeViewfinderRect(containerWidth, containerHeight)

    expect(rect.originX).toBeGreaterThanOrEqual(0)
    expect(rect.originY).toBeGreaterThanOrEqual(0)
    expect(rect.originX + rect.width).toBeLessThanOrEqual(containerWidth)
    expect(rect.originY + rect.height).toBeLessThanOrEqual(containerHeight)
  })
})

describe("computePhotoCropRect", () => {
  it("reduces to computeViewfinderRect applied directly to the photo when the container's aspect ratio already equals the target", () => {
    // The analyzing screen's preview card is built to exactly LENS_VIEWFINDER_ASPECT_RATIO -- in
    // that case, inverting the cover mapping should agree with the simpler "fit the target ratio
    // within the photo's own canvas" formula, since there's no ratio mismatch to correct for.
    const photoWidth = 3000
    const photoHeight = 4000
    const containerWidth = 500
    const containerHeight = containerWidth / LENS_VIEWFINDER_ASPECT_RATIO

    const rect = computePhotoCropRect(photoWidth, photoHeight, containerWidth, containerHeight)
    const direct = computeViewfinderRect(photoWidth, photoHeight)

    expect(rect.originX).toBeCloseTo(direct.originX, 0)
    expect(rect.originY).toBeCloseTo(direct.originY, 0)
    expect(rect.width).toBeCloseTo(direct.width, 0)
    expect(rect.height).toBeCloseTo(direct.height, 0)
  })

  it("differs from the naive direct formula when the container's ratio doesn't match the target -- the live capture screen case", () => {
    // This is the bug this function exists to fix: a typical phone screen (~9:19.5) is a very
    // different shape than a 0.75-aspect photo, so what's visible within the brackets on a
    // full-screen live preview is NOT the same region as "fit 5:6 within the photo's own canvas."
    const photoWidth = 3000
    const photoHeight = 4000
    const screenWidth = 390
    const screenHeight = 844

    const rect = computePhotoCropRect(photoWidth, photoHeight, screenWidth, screenHeight)
    const naiveDirect = computeViewfinderRect(photoWidth, photoHeight)

    expect(rect.width).not.toBeCloseTo(naiveDirect.width, 0)
  })

  it("stays within the photo's bounds regardless of how different the container's ratio is", () => {
    const rect = computePhotoCropRect(3000, 4000, 390, 844)

    expect(rect.originX).toBeGreaterThanOrEqual(0)
    expect(rect.originY).toBeGreaterThanOrEqual(0)
    expect(rect.originX + rect.width).toBeLessThanOrEqual(3000)
    expect(rect.originY + rect.height).toBeLessThanOrEqual(4000)
  })

  it("produces a rect matching LENS_VIEWFINDER_ASPECT_RATIO", () => {
    const rect = computePhotoCropRect(3000, 4000, 390, 844)

    expect(rect.width / rect.height).toBeCloseTo(LENS_VIEWFINDER_ASPECT_RATIO)
  })

  describe("rotated presentation -- phone held sideways against an orientation-locked UI", () => {
    const CONTAINER_WIDTH = 428
    const CONTAINER_HEIGHT = 926

    it("leaves a portrait capture untouched, because nothing is rotated", () => {
      // Held upright: display space 3024x4032 -- portrait, matching the portrait container, so
      // the rotation-aware mapping must agree with the plain one.
      const asIs = computePhotoCropRect(3024, 4032, CONTAINER_WIDTH, CONTAINER_HEIGHT, "cover")
      const rotationAware = computePhotoCropRect(
        3024,
        4032,
        CONTAINER_WIDTH,
        CONTAINER_HEIGHT,
        "coverRotatedToContainer"
      )

      expect(Math.round(rotationAware.width)).toBe(1454)
      expect(Math.round(rotationAware.height)).toBe(1744)
      expect(Math.round(rotationAware.originX)).toBe(785)
      expect(Math.round(rotationAware.originY)).toBe(1144)
      expect(rotationAware).toEqual(asIs)
    })

    it("transposes a landscape capture back into the region the brackets actually marked", () => {
      // Held sideways: display space 4032x3024 -- landscape, while the container stays portrait.
      // The uncorrected mapping returns 1090x1308 @ (1471, 858): the wrong shape, and only about
      // half the framed area.
      const rect = computePhotoCropRect(
        4032,
        3024,
        CONTAINER_WIDTH,
        CONTAINER_HEIGHT,
        "coverRotatedToContainer"
      )

      expect(Math.round(rect.width)).toBe(1744)
      expect(Math.round(rect.height)).toBe(1454)
      expect(Math.round(rect.originX)).toBe(1144)
      expect(Math.round(rect.originY)).toBe(785)
    })

    it("produces the transposed viewfinder ratio for a rotated capture", () => {
      // 6:5 in the photo's space, because the 5:6 bracket was drawn in a space rotated 90 degrees
      // away from it. A rect that still reads 5:6 here is the signature of the original bug.
      const rect = computePhotoCropRect(
        4032,
        3024,
        CONTAINER_WIDTH,
        CONTAINER_HEIGHT,
        "coverRotatedToContainer"
      )

      expect(rect.width / rect.height).toBeCloseTo(1 / LENS_VIEWFINDER_ASPECT_RATIO)
    })

    it("keeps the rotated rect within the photo's bounds", () => {
      const rect = computePhotoCropRect(
        4032,
        3024,
        CONTAINER_WIDTH,
        CONTAINER_HEIGHT,
        "coverRotatedToContainer"
      )

      expect(rect.originX).toBeGreaterThanOrEqual(0)
      expect(rect.originY).toBeGreaterThanOrEqual(0)
      expect(rect.originX + rect.width).toBeLessThanOrEqual(4032)
      expect(rect.originY + rect.height).toBeLessThanOrEqual(3024)
    })

    it("covers a strictly larger area than the uncorrected mapping did", () => {
      const corrected = computePhotoCropRect(
        4032,
        3024,
        CONTAINER_WIDTH,
        CONTAINER_HEIGHT,
        "coverRotatedToContainer"
      )
      const uncorrected = computePhotoCropRect(
        4032,
        3024,
        CONTAINER_WIDTH,
        CONTAINER_HEIGHT,
        "cover"
      )

      expect(corrected.width * corrected.height).toBeGreaterThan(
        uncorrected.width * uncorrected.height
      )
    })

    it("defaults to the unrotated mapping, so a library pick is never transposed", () => {
      // `<Image resizeMode="cover">` does not rotate, so a landscape photo shown in the portrait
      // preview card must keep the plain mapping even though the orientations disagree.
      const explicit = computePhotoCropRect(4032, 3024, 500, 600, "cover")
      const defaulted = computePhotoCropRect(4032, 3024, 500, 600)

      expect(defaulted).toEqual(explicit)
    })
  })
})
