import { mount } from "enzyme"
import OpaqueImageView from "lib/Components/OpaqueImageView/OpaqueImageView"
import React from "react"
import * as renderer from "react-test-renderer"
import { CollectionFixture } from "../__fixtures__/index"
import { CollectionHeader } from "../CollectionHeader"

describe("CollectionHeader", () => {
  it("Renders collection header correctly", () => {
    const component = renderer.create(<CollectionHeader {...CollectionFixture} />)
    expect(component).toMatchSnapshot()
  })

  it("passes an image url to collection header", () => {
    const wrapper = mount(<CollectionHeader {...CollectionFixture} />)
    expect(wrapper.find(OpaqueImageView).html()).toContain("https://someimage.cloudfront.net/square.jpg")
  })
})
