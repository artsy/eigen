import { calculateSinglePhotoSize } from "./calculatePhotoSize"

describe("calculatePhotoSize", () => {
  it("returns photo with size correctly calculated with units", () => {
    const photo = calculateSinglePhotoSize({
      size: 1000000,
    })
    expect(photo.sizeDisplayValue).toBe("1.0 MB")
  })
  it("sets correct error when size not found", () => {
    const photo = calculateSinglePhotoSize({})
    expect(photo.sizeDisplayValue).toBe("Size not found")
    expect(photo.error).toBeTrue()
  })
})
