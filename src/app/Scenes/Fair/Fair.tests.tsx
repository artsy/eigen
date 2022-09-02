import { FairTestsQuery } from "__generated__/FairTestsQuery.graphql"
import { getRelayEnvironment } from "app/relay/defaultEnvironment"
import { __globalStoreTestUtils__ } from "app/store/GlobalStore"
import { mockTrackEvent } from "app/tests/globallyMockedStuff"
import { renderWithWrappers } from "app/tests/renderWithWrappers"
import { resolveMostRecentRelayOperation } from "app/tests/resolveMostRecentRelayOperation"
import { NavigationalTabs, Tab } from "palette/elements/Tabs"
import { graphql, QueryRenderer } from "react-relay"
import { act } from "react-test-renderer"
import { FairFragmentContainer } from "./Fair"

describe("Fair", () => {
  const TestRenderer = () => (
    <QueryRenderer<FairTestsQuery>
      environment={getRelayEnvironment()}
      query={graphql`
        query FairTestsQuery($fairID: String!) @relay_test_operation {
          fair(id: $fairID) {
            ...Fair_fair
          }
        }
      `}
      variables={{ fairID: "art-basel-hong-kong-2020" }}
      render={({ props, error }) => {
        if (props?.fair) {
          return <FairFragmentContainer fair={props.fair} />
        } else if (error) {
          console.log(error)
        }
      }}
    />
  )

  it("renders without throwing an error", () => {
    const { getByTestId } = renderWithWrappers(<TestRenderer />)

    resolveMostRecentRelayOperation({ Fair: () => ({ id: "fair1244" }) })

    expect(getByTestId("fairFlatList")).toBeTruthy()
  })

  it("renders the necessary components when fair is active", () => {
    const { getByTestId, UNSAFE_getByType } = renderWithWrappers(<TestRenderer />)

    resolveMostRecentRelayOperation({
      Fair: () => ({
        id: "fair1244",
        isActive: true,
        counts: {
          artworks: 42,
          partnerShows: 42,
        },
      }),
    })

    expect(getByTestId("fairHeaderBox")).toBeTruthy()
    expect(getByTestId("fairEditorialBox")).toBeTruthy()
    expect(getByTestId("fairCollectionsBox")).toBeTruthy()
    expect(getByTestId("fairExhibitorsFlatList")).toBeTruthy()
    expect(getByTestId("fairFollowedArtistsRailBox")).toBeTruthy()
    expect(UNSAFE_getByType(NavigationalTabs)).toBeTruthy()
  })

  it("renders fewer components when fair is inactive", () => {
    const { getByText, getByTestId, queryByTestId, UNSAFE_queryByType } = renderWithWrappers(
      <TestRenderer />
    )

    resolveMostRecentRelayOperation({ Fair: () => ({ id: "fair1244", isActive: false }) })

    expect(getByTestId("fairHeaderBox")).toBeTruthy()
    expect(getByTestId("fairEditorialBox")).toBeTruthy()
    expect(getByText("This fair is currently unavailable.")).toBeTruthy()

    expect(queryByTestId("fairCollectionsBox")).toBeNull()
    expect(queryByTestId("fairExhibitorsFlatList")).toBeNull()
    expect(queryByTestId("fairFollowedArtistsRailBox")).toBeNull()
    expect(UNSAFE_queryByType(NavigationalTabs)).toBeNull()
  })

  it("does not render components when there is no data for them", () => {
    const { getByTestId, queryByTestId, UNSAFE_queryByType } = renderWithWrappers(<TestRenderer />)

    resolveMostRecentRelayOperation({
      Fair: () => ({
        id: "fair1244",
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

    expect(getByTestId("fairHeaderBox")).toBeTruthy()

    expect(queryByTestId("fairArtworksBox")).toBeNull()
    expect(queryByTestId("fairEditorialBox")).toBeNull()
    expect(queryByTestId("fairCollectionsBox")).toBeNull()
    expect(queryByTestId("fairExhibitorsFlatList")).toBeNull()
    expect(queryByTestId("fairFollowedArtistsRailBox")).toBeNull()
    expect(UNSAFE_queryByType(NavigationalTabs)).toBeNull()
  })

  it("renders the collections component if there are collections", () => {
    const { getByTestId } = renderWithWrappers(<TestRenderer />)

    resolveMostRecentRelayOperation({
      Fair: () => ({
        id: "fair1244",
        isActive: true,
        marketingCollections: [{ slug: "great-collection" }],
      }),
    })

    expect(getByTestId("fairCollectionsBox")).toBeTruthy()
  })

  it("renders the editorial component if there are articles", () => {
    const { getByTestId } = renderWithWrappers(<TestRenderer />)

    resolveMostRecentRelayOperation({
      Fair: () => ({
        id: "fair1244",
        isActive: true,
        articles: { edges: [{ __typename: "Article", node: { slug: "great-article" } }] },
      }),
    })

    expect(getByTestId("fairEditorialBox")).toBeTruthy()
  })

  it("renders the artists you follow rail when there are no artworks", async () => {
    const { queryByTestId } = renderWithWrappers(<TestRenderer />)

    resolveMostRecentRelayOperation({
      Fair: () => ({
        id: "fair1244",
        isActive: true,
        filterArtworksConnection: {
          edges: [],
        },
      }),
    })

    expect(queryByTestId("fairFollowedArtistsRailBox")).toBeNull()
  })

  it("renders the artists you follow rail when there are artworks", async () => {
    const { getByTestId } = renderWithWrappers(<TestRenderer />)

    resolveMostRecentRelayOperation({
      Fair: () => ({
        id: "fair1244",
        isActive: true,
        filterArtworksConnection: {
          edges: [{ __typename: "FilterArtworksEdge", node: { id: "an-artwork" } }],
        },
      }),
    })

    expect(getByTestId("fairFollowedArtistsRailBox")).toBeTruthy()
  })

  it("renders the artworks/exhibitors component and tabs if there are artworks and exhibitors", () => {
    const { getByTestId, queryByTestId, UNSAFE_getAllByType } = renderWithWrappers(<TestRenderer />)

    resolveMostRecentRelayOperation({
      Fair: () => ({
        id: "fair1244",
        isActive: true,
        counts: {
          artworks: 100,
          partnerShows: 20,
        },
      }),
    })

    expect(getByTestId("fairExhibitorsFlatList")).toBeTruthy()
    expect(queryByTestId("fairArtworksBox")).toBeNull()
    expect(UNSAFE_getAllByType(Tab)).toHaveLength(2)
  })

  describe("tracks taps navigating between the artworks tab and exhibitors tab", () => {
    it("When Using Palette V3", () => {
      const { UNSAFE_getAllByType } = renderWithWrappers(<TestRenderer />)

      resolveMostRecentRelayOperation({
        Fair: () => ({
          id: "fair1244",
          isActive: true,
          slug: "art-basel-hong-kong-2020",
          internalID: "fair1244",
          counts: {
            artworks: 100,
            partnerShows: 20,
          },
        }),
      })

      const tabs = UNSAFE_getAllByType(Tab)
      const exhibitorsTab = tabs[0]
      const artworksTab = tabs[1]

      act(() => artworksTab.props.onPress())

      expect(mockTrackEvent).toHaveBeenCalledWith({
        action: "tappedNavigationTab",
        context_module: "exhibitorsTab",
        context_screen_owner_type: "fair",
        context_screen_owner_slug: "art-basel-hong-kong-2020",
        context_screen_owner_id: "fair1244",
        subject: "Artworks",
      })

      act(() => exhibitorsTab.props.onPress())
      expect(mockTrackEvent).toHaveBeenCalledWith({
        action: "tappedNavigationTab",
        context_module: "artworksTab",
        context_screen_owner_type: "fair",
        context_screen_owner_slug: "art-basel-hong-kong-2020",
        context_screen_owner_id: "fair1244",
        subject: "Exhibitors",
      })
    })
  })

  describe("search image button", () => {
    describe("with AREnableImageSearch feature flag disabled", () => {
      beforeEach(() => {
        __globalStoreTestUtils__?.injectFeatureFlags({ AREnableImageSearch: false })
      })

      it("should not be rendered", () => {
        const { queryByLabelText } = renderWithWrappers(<TestRenderer />)

        expect(queryByLabelText("Search images")).toBeNull()
      })
    })

    describe("with AREnableImageSearch feature flag enabled", () => {
      beforeEach(() => {
        __globalStoreTestUtils__?.injectFeatureFlags({ AREnableImageSearch: true })
      })

      it("should not be rendered when fair is not active", () => {
        const { queryByLabelText } = renderWithWrappers(<TestRenderer />)

        resolveMostRecentRelayOperation({
          Fair: () => ({
            id: "fair1244",
            isActive: false,
            slug: "a-non-active-fair",
            isReverseImageSearchEnabled: true,
          }),
        })

        expect(queryByLabelText("Search by image")).toBeNull()
      })

      it("should not be rendered when fair doesn't have any indexed artworks", () => {
        const { queryByLabelText } = renderWithWrappers(<TestRenderer />)

        resolveMostRecentRelayOperation({
          Fair: () => ({
            id: "fair1244",
            isActive: true,
            slug: "an-active-fair-without-indexed-artworks",
            isReverseImageSearchEnabled: false,
          }),
        })

        expect(queryByLabelText("Search by image")).toBeNull()
      })

      it("should be rendered when fair has indexed artworks, is active and feature flag is enabled", () => {
        const { queryByLabelText } = renderWithWrappers(<TestRenderer />)

        resolveMostRecentRelayOperation({
          Fair: () => ({
            id: "fair1244",
            isActive: true,
            slug: "an-active-fair-with-indexed-artworks",
            isReverseImageSearchEnabled: true,
          }),
        })

        expect(queryByLabelText("Search by image")).toBeTruthy()
      })
    })
  })
})
