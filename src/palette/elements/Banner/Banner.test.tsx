import { mount } from "enzyme"
import "jest-styled-components"
import React from "react"
import { Banner } from "../Banner"

describe("Button", () => {
  it("pass a custom color to Banner", () => {
    const message = "There was an error."
    const wrapper = mount(
      <Banner message={message} backgroundColor="purple100" />
    )
    expect(wrapper).toHaveStyleRule("background-color", "purple100")
  })

  it("has default red background to Banner", () => {
    const message = "There was an error."
    const wrapper = mount(<Banner message={message} />)
    expect(wrapper).toHaveStyleRule("background-color", "red100")
  })

  it("displays the message", () => {
    const message = "There was an error."
    const wrapper = mount(<Banner message={message} />)
    expect(wrapper.text()).toEqual(message)
    expect(wrapper.find("CloseButton")).toHaveLength(0)
  })

  it("is dismissable", () => {
    const message = "There was an error."
    const wrapper = mount(<Banner dismissable message={message} />)
    expect(wrapper.find("CloseButton")).toHaveLength(1)
  })

  it("disappears when dismissed", () => {
    const message = "There was an error."
    const wrapper = mount(<Banner dismissable message={message} />)
    expect(wrapper.find("CloseButton")).toHaveLength(1)
    wrapper.find("CloseButton").simulate("click")
    expect(wrapper.find("CloseButton")).toHaveLength(0)
  })
})
