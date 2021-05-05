import OpaqueImageView from "lib/Components/OpaqueImageView/OpaqueImageView"
import { __deprecated_mountWithWrappers } from "lib/tests/renderWithWrappers"
import React from "react"
import { Platform } from "react-native"
import { ImageCarouselContext, useNewImageCarouselContext } from "../ImageCarouselContext"
import { ImageCarouselEmbedded } from "../ImageCarouselEmbedded"
import { ImageWithLoadingState } from "../ImageWithLoadingState"

const contextMock: Parameters<typeof useNewImageCarouselContext>[0] = {
  images: [
    {
      height: 5,
      width: 5,
      url: "a",
      deepZoom: { image: { url: "", format: "", tileSize: 300, size: { width: 302, height: 302 } } },
    },
    {
      height: 5,
      width: 5,
      url: "b",
      deepZoom: { image: { url: "", format: "", tileSize: 300, size: { width: 302, height: 302 } } },
    },
  ],
}

describe("ImageCarouselEmbedded", () => {
  let context: ImageCarouselContext
  function Mock({ contextInit = contextMock }: { contextInit?: typeof contextMock }) {
    const value = useNewImageCarouselContext(contextInit)
    context = value
    return (
      <ImageCarouselContext.Provider value={value}>
        <ImageCarouselEmbedded cardHeight={275} />
      </ImageCarouselContext.Provider>
    )
  }
  it("mounts", () => {
    const carousel = __deprecated_mountWithWrappers(<Mock />)
    expect(carousel.find(OpaqueImageView)).toHaveLength(2)
  })
  it("does something when you tap an image with deepZoom", () => {
    const carousel = __deprecated_mountWithWrappers(<Mock />)
    expect(context.fullScreenState.current).toBe("none")
    carousel.find(ImageWithLoadingState).at(0).props().onPress()
    expect(context.fullScreenState.current).not.toBe("none")
  })
  it("does nothing when you tap an image without deepZoom", () => {
    const carousel = __deprecated_mountWithWrappers(
      <Mock
        contextInit={{
          images: [
            {
              deepZoom: null,
              height: 302,
              url: "https://example.com/image.jpg",
              width: 40,
            },
          ],
        }}
      />
    )
    expect(context.fullScreenState.current).toBe("none")
    carousel.find(ImageWithLoadingState).at(0).props().onPress()
    expect(context.fullScreenState.current).toBe("none")
  })
  describe("deepZoom on Android", () => {
    beforeAll(() => {
      Platform.OS = "android"
    })
    afterAll(() => {
      Platform.OS = "ios"
    })

    it("suppresses fullScreen when you tap an image with deepZoom because it would fail", () => {
      const carousel = __deprecated_mountWithWrappers(<Mock />)
      expect(context.fullScreenState.current).toBe("none")
      carousel.find(ImageWithLoadingState).at(0).props().onPress()
      expect(context.fullScreenState.current).toBe("none")
    })
  })
})
