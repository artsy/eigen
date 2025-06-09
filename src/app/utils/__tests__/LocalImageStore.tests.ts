import { getLocalImage, LocalImage, storeLocalImage } from "app/utils/LocalImageStore"

describe("LocalImageStore", () => {
  const dateNow = Date.now
  // Thursday, May 10, 2018 8:22:32.000 PM UTC in milliseconds
  const mockNow = 1525983752000

  beforeEach(() => {
    jest.useFakeTimers({
      legacyFakeTimers: true,
    })
    Date.now = () => mockNow
  })

  afterEach(() => {
    Date.now = dateNow
  })

  it("stores a single image with a key", async () => {
    const imageKey = "some-key"
    const imagePath = "some-local-image"
    const image: LocalImage = {
      path: imagePath,
      width: 10,
      height: 11,
    }
    storeLocalImage(imageKey, image)
    const retrievedImage = await getLocalImage(imageKey)
    expect(retrievedImage).toEqual({
      aspectRatio: 0.9090909090909091,
      expires: expect.any(String),
      height: 11,
      path: "some-local-image",
      width: 10,
    })
  })
})
