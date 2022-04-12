import { Photo } from "app/Scenes/SubmitArtwork/UploadPhotos/utils"
import { renderWithWrappers } from "app/tests/renderWithWrappers"
import React from "react"
import { Image } from "react-native"
import { AddEditPhotos } from "./AddEditPhotos"

jest.mock("app/utils/requestPhotos", () => ({
  showPhotoActionSheet: jest.fn(),
}))
import { showPhotoActionSheet } from "app/utils/requestPhotos"
const showPhotoActionSheetMock = showPhotoActionSheet as jest.Mock<any>

describe("AddEditPhotos", () => {
  let fakeNavigator: any

  beforeEach(() => {
    fakeNavigator = {
      pop: () => null,
    } as any
  })

  const fakePhoto = (path: string): Photo => {
    return {
      image: {
        path,
        size: 10,
        width: 10,
        height: 10,
        mime: "mime",
      },
      uploaded: false,
      uploading: false,
    }
  }

  it("displays photos", () => {
    const photos = [fakePhoto("path1"), fakePhoto("path2"), fakePhoto("path3")]
    const tree = renderWithWrappers(
      <AddEditPhotos initialPhotos={photos} photosUpdated={jest.fn()} navigator={fakeNavigator} />
    )
    expect(tree.root.findAllByType(Image).length).toEqual(3)
  })

  it("deletes photos", () => {
    const photos = [fakePhoto("path1"), fakePhoto("path2"), fakePhoto("path3")]
    const tree = renderWithWrappers(
      <AddEditPhotos initialPhotos={photos} photosUpdated={jest.fn()} navigator={fakeNavigator} />
    )

    const images = tree.root.findAllByType(Image)

    const path2Images = images.filter((image) => {
      return image.props.source.uri === "path2"
    })
    expect(path2Images).toHaveLength(1)
    expect(images.length).toEqual(3)

    const deleteButton = tree.root.findByProps({ testID: "delete-photo-button-path2" })
    deleteButton.props.onPress()

    const afterDeleteImages = tree.root.findAllByType(Image)
    expect(afterDeleteImages.length).toEqual(2)
    const path2ImagesAfterDelete = afterDeleteImages.filter((image) => {
      return image.props.source.uri === "path2"
    })
    expect(path2ImagesAfterDelete).toHaveLength(0)
  })

  it("adds photos", async () => {
    const initialPhotos = [fakePhoto("path1"), fakePhoto("path2"), fakePhoto("path3")]

    const tree = renderWithWrappers(
      <AddEditPhotos
        initialPhotos={initialPhotos}
        photosUpdated={jest.fn()}
        navigator={fakeNavigator}
      />
    )
    const images = tree.root.findAllByType(Image)
    expect(images.length).toEqual(3)

    const photosPromise = Promise.resolve([fakePhoto("path4").image, fakePhoto("path5").image])

    showPhotoActionSheetMock.mockReturnValueOnce(photosPromise)

    const addButton = tree.root.findByProps({ testID: "add-photos-button" })
    addButton.props.onPress()

    await photosPromise

    expect(showPhotoActionSheetMock).toHaveBeenCalled()

    const updatedImages = tree.root.findAllByType(Image)
    expect(updatedImages.length).toEqual(5)
  })
})
