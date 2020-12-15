import { Fair2TestsQuery } from "__generated__/Fair2TestsQuery.graphql"
import { extractText } from "lib/tests/extractText"
import { renderWithWrappers } from "lib/tests/renderWithWrappers"
import React from "react"
import { graphql, QueryRenderer } from "react-relay"
import { act } from "react-test-renderer"
import { useTracking } from "react-tracking"
import { createMockEnvironment, MockPayloadGenerator } from "relay-test-utils"
import { Fair2ArtworksFragmentContainer } from "../Components/Fair2Artworks"
import { Fair2CollectionsFragmentContainer } from "../Components/Fair2Collections"
import { Fair2EditorialFragmentContainer } from "../Components/Fair2Editorial"
import { Fair2ExhibitorsFragmentContainer } from "../Components/Fair2Exhibitors"
import { Fair2FollowedArtistsRailFragmentContainer } from "../Components/Fair2FollowedArtistsRail"
import { Fair2HeaderFragmentContainer } from "../Components/Fair2Header"
import { Tab, Tabs } from "../Components/SimpleTabs"
import { Fair2, Fair2FragmentContainer } from "../Fair2"

jest.unmock("react-relay")

describe("Fair2", () => {
  const trackEvent = useTracking().trackEvent
  let env: ReturnType<typeof createMockEnvironment>

  beforeEach(() => {
    env = createMockEnvironment()
  })

  const TestRenderer = () => (
    <QueryRenderer<Fair2TestsQuery>
      environment={env}
      query={graphql`
        query Fair2TestsQuery($fairID: String!) @relay_test_operation {
          fair(id: $fairID) {
            ...Fair2_fair
          }
        }
      `}
      variables={{ fairID: "art-basel-hong-kong-2020" }}
      render={({ props, error }) => {
        if (props?.fair) {
          return <Fair2FragmentContainer fair={props.fair} />
        } else if (error) {
          console.log(error)
        }
      }}
    />
  )

  const getWrapper = (mockResolvers = {}) => {
    const tree = renderWithWrappers(<TestRenderer />)
    act(() => {
      env.mock.resolveMostRecentOperation((operation) => MockPayloadGenerator.generate(operation, mockResolvers))
    })
    return tree
  }

  it("renders without throwing an error", () => {
    const wrapper = getWrapper()
    expect(wrapper.root.findAllByType(Fair2)).toHaveLength(1)
  })

  it("renders the necessary components when fair is active", () => {
    const wrapper = getWrapper({
      Fair: () => ({
        isActive: true,
        counts: {
          artworks: 42,
          partnerShows: 42,
        },
      }),
    })

    expect(wrapper.root.findAllByType(Fair2HeaderFragmentContainer)).toHaveLength(1)
    expect(wrapper.root.findAllByType(Fair2EditorialFragmentContainer)).toHaveLength(1)
    expect(wrapper.root.findAllByType(Fair2CollectionsFragmentContainer)).toHaveLength(1)
    expect(wrapper.root.findAllByType(Tabs)).toHaveLength(1)
    expect(wrapper.root.findAllByType(Fair2ExhibitorsFragmentContainer)).toHaveLength(1)
    expect(wrapper.root.findAllByType(Fair2FollowedArtistsRailFragmentContainer)).toHaveLength(1)
  })

  it("renders fewer components when fair is inactive", () => {
    const wrapper = getWrapper({
      Fair: () => ({
        isActive: false,
      }),
    })

    expect(wrapper.root.findAllByType(Fair2HeaderFragmentContainer)).toHaveLength(1)
    expect(wrapper.root.findAllByType(Fair2EditorialFragmentContainer)).toHaveLength(1)
    expect(extractText(wrapper.root)).toMatch("This fair is currently unavailable.")

    expect(wrapper.root.findAllByType(Fair2CollectionsFragmentContainer)).toHaveLength(0)
    expect(wrapper.root.findAllByType(Tabs)).toHaveLength(0)
    expect(wrapper.root.findAllByType(Fair2ExhibitorsFragmentContainer)).toHaveLength(0)
    expect(wrapper.root.findAllByType(Fair2FollowedArtistsRailFragmentContainer)).toHaveLength(0)
  })

  it("does not render components when there is no data for them", () => {
    const wrapper = getWrapper({
      Fair: () => ({
        articles: {
          edges: [],
        },
        marketingCollections: [],
        counts: {
          artworks: 0,
          partnerShows: 0,
        },
      }),
    })
    expect(wrapper.root.findAllByType(Fair2HeaderFragmentContainer)).toHaveLength(1)
    expect(wrapper.root.findAllByType(Fair2EditorialFragmentContainer)).toHaveLength(0)
    expect(wrapper.root.findAllByType(Fair2CollectionsFragmentContainer)).toHaveLength(0)
    expect(wrapper.root.findAllByType(Tabs)).toHaveLength(0)
    expect(wrapper.root.findAllByType(Fair2ExhibitorsFragmentContainer)).toHaveLength(0)
    expect(wrapper.root.findAllByType(Fair2ArtworksFragmentContainer)).toHaveLength(0)
  })

  it("renders the collections component if there are collections", () => {
    const wrapper = getWrapper({
      Fair: () => ({
        isActive: true,
        marketingCollections: [
          {
            slug: "great-collection",
          },
        ],
      }),
    })
    expect(wrapper.root.findAllByType(Fair2CollectionsFragmentContainer)).toHaveLength(1)
  })

  it("renders the editorial component if there are articles", () => {
    const wrapper = getWrapper({
      Fair: () => ({
        isActive: true,
        articles: {
          edges: [
            {
              __typename: "Article",
              node: {
                slug: "great-article",
              },
            },
          ],
        },
      }),
    })
    expect(wrapper.root.findAllByType(Fair2EditorialFragmentContainer)).toHaveLength(1)
  })

  it("renders the artists you follow rail if there are any artworks", () => {
    let wrapper = getWrapper({
      Fair: () => ({
        isActive: true,
        followedArtistArtworks: {
          edges: [],
        },
      }),
    })

    expect(wrapper.root.findAllByType(Fair2FollowedArtistsRailFragmentContainer)).toHaveLength(0)

    wrapper = getWrapper({
      Fair: () => ({
        isActive: true,
        followedArtistArtworks: {
          edges: [
            {
              __typename: "FilterArtworkEdge",
              artwork: {
                slug: "an-artwork",
              },
            },
          ],
        },
      }),
    })

    expect(wrapper.root.findAllByType(Fair2FollowedArtistsRailFragmentContainer)).toHaveLength(1)
  })

  it("renders the artworks/exhibitors component and tabs if there are artworks and exhibitors", () => {
    const wrapper = getWrapper({
      Fair: () => ({
        isActive: true,
        counts: {
          artworks: 100,
          partnerShows: 20,
        },
      }),
    })
    expect(wrapper.root.findAllByType(Tabs)).toHaveLength(1)
    expect(wrapper.root.findAllByType(Fair2ExhibitorsFragmentContainer)).toHaveLength(1)
    expect(wrapper.root.findAllByType(Fair2ArtworksFragmentContainer)).toHaveLength(0)
  })

  it("tracks taps navigating between the artworks tab and exhibitors tab", () => {
    const wrapper = getWrapper({
      Fair: () => ({
        isActive: true,
        slug: "art-basel-hong-kong-2020",
        internalID: "fair1244",
        counts: {
          artworks: 100,
          partnerShows: 20,
        },
      }),
    })
    const tabs = wrapper.root.findAllByType(Tab)
    const exhibitorsTab = tabs[0]
    const artworksTab = tabs[1]

    act(() => artworksTab.props.onPress())
    expect(trackEvent).toHaveBeenCalledWith({
      action: "tappedNavigationTab",
      context_module: "exhibitorsTab",
      context_screen_owner_type: "fair",
      context_screen_owner_slug: "art-basel-hong-kong-2020",
      context_screen_owner_id: "fair1244",
      subject: "Artworks",
    })

    act(() => exhibitorsTab.props.onPress())
    expect(trackEvent).toHaveBeenCalledWith({
      action: "tappedNavigationTab",
      context_module: "artworksTab",
      context_screen_owner_type: "fair",
      context_screen_owner_slug: "art-basel-hong-kong-2020",
      context_screen_owner_id: "fair1244",
      subject: "Exhibitors",
    })
  })
})
