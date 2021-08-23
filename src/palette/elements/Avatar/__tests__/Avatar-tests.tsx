// @ts-expect-error
import { mount } from "enzyme"
import { Image } from "lib/Components/Bidding/Elements/Image"
import React from "react"
import { Avatar, InitialsHolder } from ".."

describe("Avatar", () => {
  it("renders initials if no image url and initials provided", () => {
    const wrapper = mount(<Avatar initials="AB" />)
    expect(wrapper.find(Image).length).toBe(0)

    const holderWrapper = wrapper.find(InitialsHolder)
    expect(holderWrapper.length).toBe(1)
    expect(holderWrapper.text()).toEqual("AB")
  })

  it("returns empty holder if no image url or initials", () => {
    const wrapper = mount(<Avatar />)

    const holderWrapper = wrapper.find(InitialsHolder)
    expect(holderWrapper.length).toBe(1)
  })

  it("returns different sizes", () => {
    const getWrapper = (size: any) => mount(<Avatar size={size} initials="AB" />)

    expect(getWrapper("xxs").html()).toContain("30")
    expect(getWrapper("xs").html()).toContain("45")
    expect(getWrapper("sm").html()).toContain("70")
    expect(getWrapper("md").html()).toContain("100")
  })
})
