import { CollectionHeaderTestsQuery } from "__generated__/CollectionHeaderTestsQuery.graphql"
import OpaqueImageView from "app/Components/OpaqueImageView/OpaqueImageView"
import { ReadMore } from "app/Components/ReadMore"
import { GlobalStoreProvider } from "app/store/GlobalStore"
import { renderRelayTree } from "app/tests/renderRelayTree"
// @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
import { mount } from "enzyme"
import { Sans, Theme } from "palette"
import React from "react"
import { graphql } from "react-relay"
import { CollectionFixture } from "../Components/__fixtures__/CollectionFixture"
import { CollectionHeader, CollectionHeaderContainer } from "./CollectionHeader"

jest.unmock("react-relay")

it("renders without throwing an error", async () => {
  await renderRelayTree({
    Component: (props: any) => (
      <GlobalStoreProvider>
        <Theme>
          <CollectionHeaderContainer collection={props.marketingCollection} {...props} />
        </Theme>
      </GlobalStoreProvider>
    ),
    query: graphql`
      query CollectionHeaderTestsQuery @raw_response_type {
        marketingCollection(slug: "street-art-now") {
          ...CollectionHeader_collection
        }
      }
    `,
    // @ts-ignore-error
    mockData: {
      marketingCollection: CollectionFixture,
    } as CollectionHeaderTestsQuery,
  })
})

describe("collection header", () => {
  let props: any
  beforeEach(() => {
    props = {
      collection: { ...CollectionFixture },
    }
  })

  it("passes the collection header image url to collection header", () => {
    const wrapper = mount(
      <GlobalStoreProvider>
        <Theme>
          <CollectionHeader {...props} />
        </Theme>
      </GlobalStoreProvider>
    )
    expect(wrapper.find(OpaqueImageView).html()).toContain(
      "http://imageuploadedbymarketingteam.jpg"
    )
  })

  it("passes the collection header title to collection header", () => {
    const wrapper = mount(
      <GlobalStoreProvider>
        <Theme>
          <CollectionHeader {...props} />
        </Theme>
      </GlobalStoreProvider>
    )

    expect(wrapper.find(Sans).at(0).html()).toContain("Street Art Now")
  })

  it("passes the url of the most marketable artwork in the collection to the collection header when there is no headerImage value present", () => {
    props.collection.headerImage = null
    const wrapper = mount(
      <GlobalStoreProvider>
        <Theme>
          <CollectionHeader {...props} />
        </Theme>
      </GlobalStoreProvider>
    )
    expect(wrapper.find(OpaqueImageView).html()).toContain(
      "https://defaultmostmarketableartworkincollectionimage.jpg"
    )
  })

  it("does not render the Read More component when there is no description", () => {
    props.collection.descriptionMarkdown = null
    const wrapper = mount(
      <GlobalStoreProvider>
        <Theme>
          <CollectionHeader {...props} />
        </Theme>
      </GlobalStoreProvider>
    )
    expect(wrapper.find(ReadMore).exists()).toBe(false)
  })

  it("passes the collection header description to collection header", () => {
    const wrapper = mount(
      <GlobalStoreProvider>
        <Theme>
          <CollectionHeader {...props} />
        </Theme>
      </GlobalStoreProvider>
    )

    expect(wrapper.find(ReadMore).exists()).toBe(true)
    expect(wrapper.find(ReadMore).find(Sans).text()).toContain(
      "A beach towel by Yayoi Kusama, a classic print by Alexander Calder, or a piggy bank by Yoshitomo Nara"
    )
  })
})
