import { calculateSinglePhotoSize, isSizeLimitExceeded } from "./calculatePhotoSize"

describe("calculateSinglePhotoSize", () => {
  it("returns photo with size correctly calculated with units", () => {
    const photo = calculateSinglePhotoSize({
      size: 3425899,
      width: 40,
      height: 40,
      path: "/123",
    })
    expect(photo.sizeDisplayValue).toBe("3.3 MB")
  })
  it("sets correct error when size not found", () => {
    const photo = calculateSinglePhotoSize({
      width: 40,
      height: 40,
      path: "/123",
    })
    expect(photo.sizeDisplayValue).toBe("Size not found")
    expect(photo.error).toBeTrue()
  })
  it("sets correct text when photo was automatically added", () => {
    const photo = calculateSinglePhotoSize({
      automaticallyAdded: true,
      width: 40,
      height: 40,
      path: "/123",
    })
    expect(photo.sizeDisplayValue).toBe("Automatically added")
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
    width: 40,
    height: 40,
    path: "/123",
  },
  {
    size: 3425899,
    width: 40,
    height: 40,
    path: "/123",
  },
]

const mockPhotosWithSizeExcess = [
  {
    size: 93425899,
    width: 40,
    height: 40,
    path: "/123",
  },
  {
    size: 83425899,
    width: 40,
    height: 40,
    path: "/123",
  },
]
