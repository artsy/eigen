import { GlobalStoreProvider } from "app/store/GlobalStore"
// @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
import { mount } from "enzyme"
import { Theme } from "palette"
import React from "react"
import { ImageCarouselContext, useNewImageCarouselContext } from "../ImageCarouselContext"
import { ImageCarouselFullScreen } from "./ImageCarouselFullScreen"
import { ImageZoomView } from "./ImageZoomView"

describe("ImageCarouselFullScreen", () => {
  const Mock = () => {
    const value = useNewImageCarouselContext({
      images: [
        {
          height: 5,
          width: 5,
          url: "a",
          deepZoom: { image: { size: { width: 5, height: 5 } } as any },
        },
        {
          height: 5,
          width: 5,
          url: "b",
          deepZoom: { image: { size: { width: 5, height: 5 } } as any },
        },
      ],
    })
    return (
      <GlobalStoreProvider>
        <Theme>
          <ImageCarouselContext.Provider value={value}>
            <ImageCarouselFullScreen />
          </ImageCarouselContext.Provider>
        </Theme>
      </GlobalStoreProvider>
    )
  }

  it("mounts", () => {
    const carousel = mount(<Mock />)
    expect(carousel.find(ImageZoomView)).toHaveLength(2)
  })
})
