import { mount } from "enzyme"
import React from "react"
import { ImageCarouselContext, useNewImageCarouselContext } from "../../ImageCarouselContext"
import { ImageCarouselFullScreen } from "../ImageCarouselFullScreen"
import { ImageZoomView } from "../ImageZoomView"

describe("ImageCarouselFullScreen", () => {
  function Mock() {
    const value = useNewImageCarouselContext({
      images: [
        { height: 5, width: 5, url: "a", deepZoom: { image: { size: { width: 5, height: 5 } } as any } },
        { height: 5, width: 5, url: "b", deepZoom: { image: { size: { width: 5, height: 5 } } as any } },
      ],
    })
    return (
      <ImageCarouselContext.Provider value={value}>
        <ImageCarouselFullScreen />
      </ImageCarouselContext.Provider>
    )
  }
  it("mounts", () => {
    const carousel = mount(<Mock />)
    expect(carousel.find(ImageZoomView)).toHaveLength(2)
  })
})
