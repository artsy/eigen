import { Image } from "app/Scenes/MyCollection/State/MyCollectionArtworkModel"
import { deletedPhotos } from "app/Scenes/MyCollection/utils/deletedPhotos"

describe("deletedPhotos", () => {
  const image = (id: string): Image => {
    return {
      internalID: id,
      isDefault: false,
      height: 10,
      width: 10,
      imageVersions: ["normalized"],
    }
  }

  const noIdImage = (): Image => {
    return {
      isDefault: false,
      height: 10,
      width: 10,
      imageVersions: ["normalized"],
    }
  }

  it("returns removed photo ids", () => {
    const initialImages: Image[] = [image("1"), image("2"), image("3")]
    const submittedImages: Image[] = [image("1"), image("3")]

    const photos = deletedPhotos(initialImages, submittedImages)
    expect(photos.length).toEqual(1)
    expect(photos[0].id).toEqual("2")
  })

  it("returns multiple removed photo ids", () => {
    const initialImages: Image[] = [image("1"), image("2"), image("3"), image("4"), image("5")]
    const submittedImages: Image[] = [image("1"), image("3"), image("4")]

    const photos = deletedPhotos(initialImages, submittedImages)
    expect(photos.length).toEqual(2)
    expect(photos[0].id).toEqual("2")
    expect(photos[1].id).toEqual("5")
  })

  it("ignores images without ids (not uploaded)", () => {
    const initialImages: Image[] = [image("1"), image("2"), noIdImage()]
    const submittedImages: Image[] = [image("1")]

    const photos = deletedPhotos(initialImages, submittedImages)
    expect(photos.length).toEqual(1)
    expect(photos[0].id).toEqual("2")
  })
})
