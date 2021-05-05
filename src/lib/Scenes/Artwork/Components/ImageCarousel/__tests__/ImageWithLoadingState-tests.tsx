import OpaqueImageView from "lib/Components/OpaqueImageView/OpaqueImageView"
import { __deprecated_mountWithWrappers } from "lib/tests/renderWithWrappers"
import React from "react"
import { ImageWithLoadingState } from "../ImageWithLoadingState"

const imageURL = "https://image.com/image.jpg"
const style = { width: 100, height: 300 }

describe("ImageWithLoadingState", () => {
  it("renders the image", () => {
    const wrapper = __deprecated_mountWithWrappers(<ImageWithLoadingState imageURL={imageURL} {...style} />)
    expect(wrapper.find(OpaqueImageView)).toHaveLength(1)
    expect(wrapper.find(OpaqueImageView).props().imageURL).toBe(imageURL)
  })
})
