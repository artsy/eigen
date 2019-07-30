import { mount } from "enzyme"
import OpaqueImageView from "lib/Components/OpaqueImageView/OpaqueImageView"
import React from "react"
import { ImageCarouselContext, useNewImageCarouselContext } from "../ImageCarouselContext"
import { ImageCarouselEmbedded } from "../ImageCarouselEmbedded"

describe("ImageCarouselEmbedded", () => {
  function Mock() {
    const value = useNewImageCarouselContext({
      images: [{ height: 5, width: 5, url: "a" }, { height: 5, width: 5, url: "b" }],
    })
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
})
