import { Image } from "../../State/MyCollectionArtworkModel"
import { deletedPhotoIDs } from "../deletedPhotoIDs"

describe("deletedPhotoIDs", () => {
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

    const deletedIDs = deletedPhotoIDs(initialImages, submittedImages)
    expect(deletedIDs.length).toEqual(1)
    expect(deletedIDs[0]).toEqual("2")
  })

  it("returns multiple removed photo ids", () => {
    const initialImages: Image[] = [image("1"), image("2"), image("3"), image("4"), image("5")]
    const submittedImages: Image[] = [image("1"), image("3"), image("4")]

    const deletedIDs = deletedPhotoIDs(initialImages, submittedImages)
    expect(deletedIDs.length).toEqual(2)
    expect(deletedIDs[0]).toEqual("2")
    expect(deletedIDs[1]).toEqual("5")
  })

  it("ignores images without ids (not uploaded)", () => {
    const initialImages: Image[] = [image("1"), image("2"), noIdImage()]
    const submittedImages: Image[] = [image("1")]

    const deletedIDs = deletedPhotoIDs(initialImages, submittedImages)
    expect(deletedIDs.length).toEqual(1)
    expect(deletedIDs[0]).toEqual("2")
  })
})
