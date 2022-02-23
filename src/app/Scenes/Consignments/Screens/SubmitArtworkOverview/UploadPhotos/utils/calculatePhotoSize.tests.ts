import { calculateSinglePhotoSize, isSizeLimitExceeded } from "./calculatePhotoSize"

describe("calculateSinglePhotoSize", () => {
  it("returns photo with size correctly calculated with units", () => {
    const photo = calculateSinglePhotoSize({
      size: 3425899,
    })
    expect(photo.sizeDisplayValue).toBe("3.3 MB")
  })
  it("sets correct error when size not found", () => {
    const photo = calculateSinglePhotoSize({})
    expect(photo.sizeDisplayValue).toBe("Size not found")
    expect(photo.error).toBeTrue()
  })
})

describe("isSizeLimitExceeded", () => {
  it("calculates all photos size and returns false when limit not exceeded", () => {
    const isExceeded = isSizeLimitExceeded(mockPhotos)
    expect(isExceeded).toBe(false)
  })
  it("calculates all photos size and returns true when limit exceeded", () => {
    const isExceeded = isSizeLimitExceeded(mockPhotosWithSizeExcess)
    expect(isExceeded).toBe(true)
  })
})

const mockPhotos = [
  {
    size: 3425899,
  },
  {
    size: 3425899,
  },
]

const mockPhotosWithSizeExcess = [
  {
    size: 93425899,
  },
  {
    size: 83425899,
  },
]
