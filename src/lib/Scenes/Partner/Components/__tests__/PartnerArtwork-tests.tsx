import { Theme } from "@artsy/palette"
import { PartnerArtwork_partner } from "__generated__/PartnerArtwork_partner.graphql"
import GenericGrid from "lib/Components/ArtworkGrids/GenericGrid"
import { StickyTabScrollViewContext } from "lib/Components/StickyTabPage/StickyTabScrollView"
import { renderRelayTree } from "lib/tests/renderRelayTree"
import React from "react"
import Animated from "react-native-reanimated"
import { graphql, RelayPaginationProp } from "react-relay"
import { PartnerArtworkFixture } from "../__fixtures__/PartnerArtwork-fixture"
import { PartnerArtworkFragmentContainer as PartnerArtwork } from "../PartnerArtwork"

jest.unmock("react-relay")

describe("PartnerArtwork", () => {
  const getWrapper = async (partner: Omit<PartnerArtwork_partner, " $fragmentRefs">) =>
    await renderRelayTree({
      Component: (props: any) => {
        return (
          <Theme>
            <StickyTabScrollViewContext.Provider
              value={{
                contentHeight: new Animated.Value(0),
                layoutHeight: new Animated.Value(0),
                scrollOffsetY: new Animated.Value(0),
              }}
            >
              <PartnerArtwork partner={{ ...partner }} relay={{ environment: {} } as RelayPaginationProp} {...props} />
            </StickyTabScrollViewContext.Provider>
          </Theme>
        )
      },
      query: graphql`
        query PartnerArtworkTestsQuery @raw_response_type {
          partner(id: "anderson-fine-art-gallery-flickinger-collection") {
            id
            artworks: artworksConnection(first: 10) {
              edges {
                node {
                  ...GenericGrid_artworks
                }
              }
            }
          }
        }
      `,
      mockData: {
        partner,
      },
    })

  it("renders the artworks", async () => {
    const wrapper = await getWrapper(PartnerArtworkFixture as any)
    const grid = wrapper.find(GenericGrid)
    expect(grid.props().artworks.length).toBe(10)
    expect(grid.length).toBe(1)
    expect(wrapper.html()).toMatchSnapshot()
  })
})
