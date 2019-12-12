import { mount } from "enzyme"
import OpaqueImageView from "lib/Components/OpaqueImageView/OpaqueImageView"
import React from "react"
import * as renderer from "react-test-renderer"
import { CollectionFixture } from "../../Components/__fixtures__/index"
import { CollectionHeader } from "../CollectionHeader"

describe("CollectionHeader", () => {
  let props
  beforeEach(() => {
    props = {
      ...CollectionFixture,
    }
  })

  it("Renders collection header correctly", () => {
    const component = renderer.create(<CollectionHeader {...props} />)
    expect(component).toMatchSnapshot()
  })

  it("passes the collection header image url to collection header", () => {
    const wrapper = mount(<CollectionHeader {...props} />)
    expect(wrapper.find(OpaqueImageView).html()).toContain("http://imageuploadedbymarketingteam.jpg")
  })

  it("passes the url of the most marketable artwork in the collection to the collection header when there is no headerImage value present", () => {
    props.collection.headerImage = null
    const wrapper = mount(<CollectionHeader {...props} />)
    expect(wrapper.find(OpaqueImageView).html()).toContain("https://defaultmostmarketableartworkincollectionimage.jpg")
  })
})
