import { Theme } from "@artsy/palette"
// @ts-ignore STRICTNESS_MIGRATION
import { mount } from "enzyme"
import SwitchBoard from "lib/NativeModules/SwitchBoard"
import { CollectionHubRailsOtherCollectionsRailFixture } from "lib/Scenes/Collection/Components/__fixtures__/CollectionFixture"
import { renderRelayTree } from "lib/tests/renderRelayTree"
import React from "react"
import { graphql } from "react-relay"
import { CollectionGroupMemberPill, OtherCollectionsRail, OtherCollectionsRailContainer } from "../OtherCollectionsRail"

jest.unmock("react-relay")
jest.mock("lib/NativeModules/SwitchBoard", () => ({ presentNavigationViewController: jest.fn() }))

it("renders without throwing an error", async () => {
  await renderRelayTree({
    Component: (props: any) => (
      <Theme>
        <OtherCollectionsRailContainer collectionGroup={props.marketingCollection} {...props} />
      </Theme>
    ),
    query: graphql`
      query OtherCollectionsRailTestsQuery @raw_response_type {
        marketingCollection(slug: "post-war") {
          linkedCollections {
            groupType
            ...OtherCollectionsRail_collectionGroup
          }
        }
      }
    `,
    mockData: { marketingCollection: CollectionHubRailsOtherCollectionsRailFixture },
  })
})

describe("Other Collections Rail", () => {
  const render = () =>
    mount(
      <Theme>
        <OtherCollectionsRail {...({ collectionGroup: CollectionHubRailsOtherCollectionsRailFixture } as any)} />
      </Theme>
    )

  it("renders a title", () => {
    const wrapper = render()
    expect(wrapper.text()).toContain("Browse by Movement")
  })

  it("renders the other collection pills", () => {
    const wrapper = render()
    expect(wrapper.find(CollectionGroupMemberPill).map((el: any) => el.text())).toEqual([
      "Abstract Expressionist Art",
      "Arte Povera",
      "Black Arts Movement",
    ])
  })

  it("navigates to a new collection when a pill is tapped", () => {
    const wrapper = render()
    const pill = wrapper.find(CollectionGroupMemberPill).at(0)

    pill.props().onPress()

    expect(SwitchBoard.presentNavigationViewController).toHaveBeenCalledWith(
      expect.anything(),
      "/collection/abstract-expressionism"
    )
  })
})
