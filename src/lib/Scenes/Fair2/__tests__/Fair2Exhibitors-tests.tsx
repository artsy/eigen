import {
  Fair2ExhibitorsTestsQuery,
  Fair2ExhibitorsTestsQueryRawResponse,
} from "__generated__/Fair2ExhibitorsTestsQuery.graphql"
import { extractText } from "lib/tests/extractText"
import { renderWithWrappers } from "lib/tests/renderWithWrappers"
import { Button } from "palette"
import React from "react"
import { graphql, QueryRenderer } from "react-relay"
import { act } from "react-test-renderer"
import { useTracking } from "react-tracking"
import { createMockEnvironment } from "relay-test-utils"
import { Fair2ExhibitorRailFragmentContainer } from "../Components/Fair2ExhibitorRail"
import { Fair2ExhibitorsFragmentContainer } from "../Components/Fair2Exhibitors"

jest.unmock("react-relay")

describe("FairExhibitors", () => {
  const trackEvent = useTracking().trackEvent
  const getWrapper = (fixture = FAIR_2_EXHIBITORS_FIXTURE) => {
    const env = createMockEnvironment()

    const tree = renderWithWrappers(
      <QueryRenderer<Fair2ExhibitorsTestsQuery>
        environment={env}
        query={graphql`
          query Fair2ExhibitorsTestsQuery($fairID: String!) @raw_response_type {
            fair(id: $fairID) {
              ...Fair2Exhibitors_fair
            }
          }
        `}
        variables={{ fairID: "art-basel-hong-kong-2020" }}
        render={({ props, error }) => {
          if (error) {
            console.log(error)
            return null
          }

          if (!props || !props.fair) {
            return null
          }

          return <Fair2ExhibitorsFragmentContainer fair={props.fair} />
        }}
      />
    )

    env.mock.resolveMostRecentOperation({ errors: [], data: fixture })

    return tree
  }

  it("renders the rails from exhibitors that have artworks", () => {
    const wrapper = getWrapper()
    expect(wrapper.root.findAllByType(Fair2ExhibitorRailFragmentContainer)).toHaveLength(2)
  })

  it("skips over any partners with no artworks", () => {
    const wrapper = getWrapper()
    expect(extractText(wrapper.root)).not.toContain("Partner Without Artworks")
  })

  it("renders the show more button", () => {
    const wrapper = getWrapper()
    expect(extractText(wrapper.root)).toContain("Show more")
  })

  it("tracks taps on the show more button", () => {
    const wrapper = getWrapper()
    const button = wrapper.root.findAllByType(Button)[0]
    act(() => button.props.onPress())
    expect(trackEvent).toHaveBeenCalledWith({
      action: "tappedShowMore",
      context_module: "exhibitorsTab",
      context_screen_owner_type: "fair",
      context_screen_owner_id: "xyz123",
      context_screen_owner_slug: "xxx",
      subject: "showMore",
    })
  })
})

const FAIR_2_EXHIBITORS_FIXTURE: Fair2ExhibitorsTestsQueryRawResponse = {
  fair: {
    id: "xxx",
    internalID: "xyz123",
    slug: "xxx",
    exhibitors: {
      pageInfo: {
        endCursor: "xxx",
        hasNextPage: false,
      },
      edges: [
        {
          cursor: "xxx",
          node: {
            __typename: "Show",
            id: "xxx-1",
            fair: {
              id: "xxyyzz-123",
              internalID: "aabbcc-123",
              slug: "art-basel-hong-kong-2019",
            },
            slug: "example-1",
            internalID: "xxx-1",
            counts: { artworks: 0 },
            href: "/show/example-1",
            partner: {
              __typename: "ExternalPartner" as "ExternalPartner",
              __isNode: "ExternalPartner",
              id: "example-1",
              name: "Partner Without Artworks",
            },
            artworks: null,
          },
        },
        {
          cursor: "xxx",
          node: {
            __typename: "Show",
            id: "xxx-2",
            fair: {
              id: "xxyyzz-123",
              internalID: "aabbcc-123",
              slug: "art-basel-hong-kong-2019",
            },
            slug: "example-2",
            internalID: "xxx-2",
            counts: { artworks: 10 },
            href: "/show/example-2",
            partner: {
              __typename: "ExternalPartner" as "ExternalPartner",
              __isNode: "ExternalPartner",
              id: "example-2",
              name: "First Partner Has Artworks",
            },
            artworks: {
              edges: [
                {
                  node: {
                    href: "/artwork/cool-artwork-1",
                    artistNames: "Andy Warhol",
                    id: "abc124",
                    saleMessage: "For Sale",
                    image: {
                      aspectRatio: 1.2,
                      imageURL: "image.jpg",
                    },
                    saleArtwork: null,
                    sale: null,
                    title: "Best Artwork Ever",
                    internalID: "artwork1234",
                    slug: "cool-artwork-1",
                  },
                },
                {
                  node: {
                    href: "/artwork/cool-artwork-1",
                    artistNames: "Andy Warhol",
                    id: "abc125",
                    saleMessage: "For Sale",
                    image: {
                      aspectRatio: 1.2,
                      imageURL: "image.jpg",
                    },
                    saleArtwork: null,
                    sale: null,
                    title: "Best Artwork Ever",
                    internalID: "artwork1234",
                    slug: "cool-artwork-1",
                  },
                },
                {
                  node: {
                    href: "/artwork/cool-artwork-1",
                    artistNames: "Andy Warhol",
                    id: "abc126",
                    saleMessage: "For Sale",
                    image: {
                      aspectRatio: 1.2,
                      imageURL: "image.jpg",
                    },
                    saleArtwork: null,
                    sale: null,
                    title: "Best Artwork Ever",
                    internalID: "artwork1234",
                    slug: "cool-artwork-1",
                  },
                },
              ],
            },
          },
        },
        {
          cursor: "xxx",
          node: {
            __typename: "Show",
            id: "xxx-3",
            internalID: "xxx-3",
            counts: { artworks: 10 },
            fair: {
              id: "xxyyzz-123",
              internalID: "aabbcc-123",
              slug: "art-basel-hong-kong-2019",
            },
            slug: "example-3",
            href: "/show/example-3",
            partner: {
              __typename: "ExternalPartner" as "ExternalPartner",
              __isNode: "ExternalPartner",
              id: "example-3",
              name: "Second Partner Has Artworks",
            },
            artworks: {
              edges: [
                {
                  node: {
                    href: "/artwork/cool-artwork-1",
                    artistNames: "Andy Warhol",
                    id: "abc124",
                    saleMessage: "For Sale",
                    image: {
                      aspectRatio: 1.2,
                      imageURL: "image.jpg",
                    },
                    saleArtwork: null,
                    sale: null,
                    title: "Best Artwork Ever",
                    internalID: "artwork1234",
                    slug: "cool-artwork-1",
                  },
                },
                {
                  node: {
                    href: "/artwork/cool-artwork-1",
                    artistNames: "Andy Warhol",
                    id: "abc125",
                    saleMessage: "For Sale",
                    image: {
                      aspectRatio: 1.2,
                      imageURL: "image.jpg",
                    },
                    saleArtwork: null,
                    sale: null,
                    title: "Best Artwork Ever",
                    internalID: "artwork1234",
                    slug: "cool-artwork-1",
                  },
                },
                {
                  node: {
                    href: "/artwork/cool-artwork-1",
                    artistNames: "Andy Warhol",
                    id: "abc126",
                    saleMessage: "For Sale",
                    image: {
                      aspectRatio: 1.2,
                      imageURL: "image.jpg",
                    },
                    saleArtwork: null,
                    sale: null,
                    title: "Best Artwork Ever",
                    internalID: "artwork1234",
                    slug: "cool-artwork-1",
                  },
                },
              ],
            },
          },
        },
      ],
    },
  },
}
