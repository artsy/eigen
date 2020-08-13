import { mount } from "enzyme"
import React from "react"
import { Toggle } from "../Toggle"

describe("Toggle", () => {
  it("hides content when not expanded", () => {
    const wrapper = mount(<Toggle>hidden content</Toggle>)
    expect(wrapper.html()).not.toContain("hidden content")
  })

  it("shows content when expanded", () => {
    const wrapper = mount(<Toggle expanded>visible content</Toggle>)
    expect(wrapper.html()).toContain("visible content")
  })

  it("toggles content when clicked", () => {
    const wrapper = mount(<Toggle>tab content</Toggle>)
    expect(wrapper.html()).not.toContain("tab content")
    wrapper.find("Header").simulate("click")
    expect(wrapper.html()).toContain("tab content")
    wrapper.find("Header").simulate("click")
    expect(wrapper.html()).not.toContain("tab content")
  })

  it("disables toggle", () => {
    const wrapper = mount(
      <Toggle disabled expanded>
        tab content
      </Toggle>
    )
    const header = wrapper.find("Header")
    expect(wrapper.html()).toContain("tab content")
    header.simulate("click")
    expect(wrapper.html()).toContain("tab content")
    header.simulate("click")
    expect(wrapper.html()).toContain("tab content")
  })
})
