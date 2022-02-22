import { renderWithWrappersTL } from "app/tests/renderWithWrappers"
import * as LocalImageStore from "app/utils/LocalImageStore"
import { LocalImage } from "app/utils/LocalImageStore"
import React from "react"
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
    const { getAllByTestId } = renderWithWrappersTL(<MyCollectionImageView {...props} />)
    expect(getAllByTestId("Image-Remote")).toBeDefined()
  })

  it("shows a local image if a local image is present and imageURL is not defined", () => {
    const props: MyCollectionImageViewProps = {
      imageWidth: 100,
      imageHeight: 100,
      aspectRatio: 1,
      artworkSlug: "some-slug",
    }
    const localImageStoreMock = jest.spyOn(LocalImageStore, "retrieveLocalImages")
    const localImage: LocalImage = {
      path: "some-local-path",
      width: 10,
      height: 10,
    }
    const retrievalPromise = new Promise<LocalImage[]>((resolve) => {
      resolve([localImage])
    })
    localImageStoreMock.mockImplementation(() => retrievalPromise)

    act(async () => {
      await retrievalPromise
      const { getByTestId } = renderWithWrappersTL(<MyCollectionImageView {...props} />)
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
    const localImageStoreMock = jest.spyOn(LocalImageStore, "retrieveLocalImages")
    const retrievalPromise = new Promise<LocalImage[] | null>((resolve) => {
      resolve(null)
    })
    localImageStoreMock.mockImplementation(() => retrievalPromise)

    act(async () => {
      await retrievalPromise
      const { getByTestId } = renderWithWrappersTL(<MyCollectionImageView {...props} />)
      const fallback = getByTestId("Fallback")
      expect(fallback).toBeDefined()
    })
  })
})
