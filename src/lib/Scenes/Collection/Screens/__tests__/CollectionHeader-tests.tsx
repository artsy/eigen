import { Serif } from "@artsy/palette"
import { CollectionHeaderTestsQueryRawResponse } from "__generated__/CollectionHeaderTestsQuery.graphql"
import { mount } from "enzyme"
import OpaqueImageView from "lib/Components/OpaqueImageView/OpaqueImageView"
import { renderRelayTree } from "lib/tests/renderRelayTree"
import React from "react"
import { graphql } from "react-relay"
import { CollectionFixture } from "../../Components/__fixtures__/CollectionFixture"
import { CollectionHeader, CollectionHeaderContainer } from "../CollectionHeader"

jest.unmock("react-relay")

it("renders properly", async () => {
  const tree = await renderRelayTree({
    Component: (props: any) => <CollectionHeaderContainer collection={props.marketingCollection} {...props} />,
    query: graphql`
      query CollectionHeaderTestsQuery @raw_response_type {
        marketingCollection(slug: "street-art-now") {
          ...CollectionHeader_collection
        }
      }
    `,
    mockData: { marketingCollection: CollectionFixture } as CollectionHeaderTestsQueryRawResponse,
  })

  expect(tree.html()).toMatchSnapshot()
})

describe("collection header", () => {
  let props
  beforeEach(() => {
    props = {
      collection: { ...CollectionFixture },
    }
  })

  it("passes the collection header image url to collection header", () => {
    const wrapper = mount(<CollectionHeader {...props} />)
    expect(wrapper.find(OpaqueImageView).html()).toContain("http://imageuploadedbymarketingteam.jpg")
  })

  it("passes the collection header title to collection header", () => {
    const wrapper = mount(<CollectionHeader {...props} />)
    expect(wrapper.find(Serif).html()).toContain("Street Art Now")
  })

  it("passes the url of the most marketable artwork in the collection to the collection header when there is no headerImage value present", () => {
    props.collection.headerImage = null
    const wrapper = mount(<CollectionHeader {...props} />)
    expect(wrapper.find(OpaqueImageView).html()).toContain("https://defaultmostmarketableartworkincollectionimage.jpg")
  })
})
