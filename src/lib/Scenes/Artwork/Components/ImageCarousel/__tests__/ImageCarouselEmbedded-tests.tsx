import { mount } from "enzyme"
import OpaqueImageView from "lib/Components/OpaqueImageView/OpaqueImageView"
import React from "react"
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
        <ImageCarouselEmbedded />
      </ImageCarouselContext.Provider>
    )
  }
  it("mounts", () => {
    const carousel = mount(<Mock />)
    expect(carousel.find(OpaqueImageView)).toHaveLength(2)
  })
  it("does something when you tap an image with deepZoom", () => {
    const carousel = mount(<Mock />)
    expect(context.fullScreenState.current).toBe("none")
    carousel
      .find(ImageWithLoadingState)
      .at(0)
      .props()
      .onPress()
    expect(context.fullScreenState.current).not.toBe("none")
  })
  it("does nothing when you tap an image without deepZoom", () => {
    const carousel = mount(
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
    carousel
      .find(ImageWithLoadingState)
      .at(0)
      .props()
      .onPress()
    expect(context.fullScreenState.current).toBe("none")
  })
})
