import OpaqueImageView from "app/Components/OpaqueImageView/OpaqueImageView"
// @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
import { mount } from "enzyme"
import React from "react"
import { ImageWithLoadingState } from "./ImageWithLoadingState"

const imageURL = "https://image.com/image.jpg"
const style = { width: 100, height: 300 }

describe("ImageWithLoadingState", () => {
  it("renders the image", () => {
    const wrapper = mount(<ImageWithLoadingState imageURL={imageURL} {...style} />)
    expect(wrapper.find(OpaqueImageView)).toHaveLength(1)
    expect(wrapper.find(OpaqueImageView).props().imageURL).toBe(imageURL)
  })
})
