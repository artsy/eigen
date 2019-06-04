import { mount } from "enzyme"
import React from "react"
import { Image } from "react-native"
import { ImageWithLoadingState } from "../ImageWithLoadingState"

const source = { uri: "https://image.com/image.jpg" }
const style = { width: 100, height: 300 }

describe(ImageWithLoadingState, () => {
  it("renders the image", () => {
    const wrapper = mount(<ImageWithLoadingState source={source} style={style} />)
    expect(wrapper.find(Image)).toHaveLength(1)
    expect(wrapper.find(Image).props().source).toBe(source)
  })
})
