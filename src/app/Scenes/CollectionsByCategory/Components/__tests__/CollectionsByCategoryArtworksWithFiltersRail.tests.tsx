import { fireEvent, screen } from "@testing-library/react-native"
import { CollectionsByCategoryArtworksWithFiltersRailTestQuery } from "__generated__/CollectionsByCategoryArtworksWithFiltersRailTestQuery.graphql"
import { CollectionsByCategoryArtworksWithFiltersRail } from "app/Scenes/CollectionsByCategory/Components/CollectionsByCategoryArtworksWithFiltersRail"
import { navigate } from "app/system/navigation/navigate"
import { setupTestWrapper } from "app/utils/tests/setupTestWrapper"
import { graphql } from "react-relay"
import { useTracking } from "react-tracking"

describe("CollectionsByCategoryArtworksWithFiltersRail", () => {
  const trackEvent = useTracking().trackEvent

  const { renderWithRelay } =
    setupTestWrapper<CollectionsByCategoryArtworksWithFiltersRailTestQuery>({
      Component: ({ viewer }) => (
        <CollectionsByCategoryArtworksWithFiltersRail
          viewer={viewer}
          title="Test Category"
          href="/collect?category=test"
          lastElement={false}
        />
      ),
      query: graphql`
        query CollectionsByCategoryArtworksWithFiltersRailTestQuery {
          viewer @required(action: NONE) {
            ...CollectionsByCategoryArtworksWithFiltersRail_viewer
              @arguments(categorySlug: "test-category", filterSlug: "test-filter")
          }
        }
      `,
    })

  it("renders", () => {
    renderWithRelay({
      FilterArtworksConnection: () => ({ edges, counts: { total: 2 } }),
      DiscoveryArtworksWithFiltersCollection: () => ({
        title: "Test Category",
        href: "/collect?category=test",
      }),
    })

    expect(screen.getByText("Test Category")).toBeOnTheScreen()
  })

  it("when tapping on an artwork", () => {
    renderWithRelay({
      FilterArtworksConnection: () => ({ edges, counts: { total: 2 } }),
      DiscoveryArtworksWithFiltersCollection: () => ({
        title: "Test Category",
        href: "/collect?category=test",
      }),
    })

    fireEvent.press(screen.getByTestId(`artwork-${edges[0].node.slug}`))

    expect(navigate).toHaveBeenCalledWith(`/artwork/${edges[0].node.internalID}`)
    expect(trackEvent).toHaveBeenLastCalledWith({
      action: "tappedArtworkGroup",
      context_module: "collectionRail",
      context_screen_owner_type: "collectionsCategory",
      destination_screen_owner_slug: "1",
      destination_screen_owner_type: "artwork",
      horizontal_slide_position: 0,
      type: "thumbnail",
    })
  })

  it("when tapping on the title", () => {
    renderWithRelay({
      FilterArtworksConnection: () => ({ edges, counts: { total: 1 } }),
      DiscoveryArtworksWithFiltersCollection: () => ({
        title: "Test Category",
        href: "/collect?category=test",
      }),
    })

    fireEvent.press(screen.getByText("Test Category"))

    expect(navigate).toHaveBeenCalledWith(
      "/collect?category=test&title=Test%20Category&disableSubtitle=true"
    )
    expect(trackEvent).toHaveBeenLastCalledWith({
      action: "tappedArtworkGroup",
      context_module: "collectionRail",
      context_screen_owner_type: "collectionsCategory",
      destination_screen_owner_slug: "/collect?category=test",
      destination_screen_owner_type: "collection",
      type: "viewAll",
    })
  })
})

const edges = [{ node: { internalID: "1", href: "/artwork/1", slug: "1-slug" } }]
