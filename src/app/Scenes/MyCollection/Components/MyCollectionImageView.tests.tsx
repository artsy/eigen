import * as LocalImageStore from "app/utils/LocalImageStore"
import { LocalImage } from "app/utils/LocalImageStore"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"
import { act } from "react-test-renderer"
import { MyCollectionImageView, MyCollectionImageViewProps } from "./MyCollectionImageView"

describe("MyCollectionImageView", () => {
  it("shows a remote image if imageURL is present", () => {
    const props: MyCollectionImageViewProps = {
      imageWidth: 100,
      imageHeight: 100,
      aspectRatio: 1,
      imageURL: "https://some-url/:version.jpg",
      artworkSlug: "some-slug",
    }
    const { getAllByTestId } = renderWithWrappers(<MyCollectionImageView {...props} />)
    expect(getAllByTestId("Image-Remote")).toBeDefined()
  })

  it("shows a local image if a local image is present and imageURL is not defined", () => {
    const props: MyCollectionImageViewProps = {
      imageWidth: 100,
      imageHeight: 100,
      aspectRatio: 1,
      artworkSlug: "some-slug",
    }
    const localImageStoreMock = jest.spyOn(LocalImageStore, "getLocalImage")
    const localImage: LocalImage = {
      path: "some-local-path",
      width: 10,
      height: 10,
    }

    localImageStoreMock.mockImplementation(async () => localImage)

    act(async () => {
      const { getByTestId } = renderWithWrappers(<MyCollectionImageView {...props} />)
      const image = getByTestId("Image-Local")
      expect(image).toBeDefined()
      expect(image.props.source).toEqual({ uri: "some-local-path" })
    })
  })

  it("shows a fallback state if neither are present", () => {
    const props: MyCollectionImageViewProps = {
      imageWidth: 100,
      imageHeight: 100,
      aspectRatio: 1,
      artworkSlug: "some-slug",
    }
    const localImageStoreMock = jest.spyOn(LocalImageStore, "getLocalImage")
    localImageStoreMock.mockImplementation(async () => null)

    act(async () => {
      const { getByTestId } = renderWithWrappers(<MyCollectionImageView {...props} />)
      const fallback = getByTestId("Fallback")
      expect(fallback).toBeDefined()
    })
  })
})
