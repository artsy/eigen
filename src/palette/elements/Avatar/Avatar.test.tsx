import { mount } from "enzyme"
import React from "react"
import { act } from "react-test-renderer"
import { Avatar } from "../Avatar"

describe("Avatar", () => {
  describe("on web", () => {
    it("renders an LazyImage if image url provided", () => {
      const wrapper = mount(<Avatar src="some/path.img" />)
      expect(wrapper.find("LazyImage").length).toBe(1)
      expect(wrapper.find("InitialsHolder").length).toBe(0)
    })

    it("renders an InnerLazyImage if image url provided and lazy loaded", () => {
      const wrapper = mount(<Avatar lazyLoad src="some/path.img" />)
      expect(wrapper.find("InnerLazyImage").length).toBe(1)
    })
  })

  it("renders initials if no image url and initials provided", () => {
    const wrapper = mount(<Avatar initials="AB" />)
    expect(wrapper.find("AvatarImage").length).toBe(0)
    const holderWrapper = wrapper.find("InitialsHolder")
    expect(holderWrapper.length).toBe(1)
    expect(holderWrapper.text()).toEqual("AB")
  })

  it("returns null if no image url or initials", () => {
    const wrapper = mount(<Avatar />)
    expect(wrapper.instance()).toBe(null)
  })

  it("returns different sizes", () => {
    const getWrapper = size => mount(<Avatar size={size} initials="AB" />)
    expect(getWrapper("xs").html()).toContain("45px")
    expect(getWrapper("sm").html()).toContain("70px")
    expect(getWrapper("md").html()).toContain("100px")
  })

  it("renders a fallback if the image fails to load", () => {
    const Fallback = () => <div id="fallback" />
    const err = jest.fn()
    const wrapper = mount(
      <Avatar
        src="https://www.artsy.net/does-not-exist"
        size="md"
        onError={err}
        renderFallback={() => <Fallback />}
      />
    )
    act(() => {
      wrapper.find("img").simulate("error")
    })
    act(() => {
      wrapper.render()
    })
    expect(err).toBeCalled()
    expect(wrapper.find(Fallback).length).toBe(1)
  })
})
