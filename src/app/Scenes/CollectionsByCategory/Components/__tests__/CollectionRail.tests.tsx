import { fireEvent, screen } from "@testing-library/react-native"
import { CollectionRailHomeViewSectionCardsTestQuery } from "__generated__/CollectionRailHomeViewSectionCardsTestQuery.graphql"
import { CollectionRail } from "app/Scenes/CollectionsByCategory/Components/CollectionRail"
import { navigate } from "app/system/navigation/navigate"
import { setupTestWrapper } from "app/utils/tests/setupTestWrapper"
import { graphql } from "react-relay"
import { useTracking } from "react-tracking"

describe("CollectionRail", () => {
  const trackEvent = useTracking().trackEvent

  const { renderWithRelay } = setupTestWrapper<CollectionRailHomeViewSectionCardsTestQuery>({
    Component: ({ marketingCollection }) => <CollectionRail collection={marketingCollection} />,
    query: graphql`
      query CollectionRailHomeViewSectionCardsTestQuery {
        marketingCollection(slug: "marketing-slug") @required(action: NONE) {
          ...CollectionRail_marketingCollection
        }
      }
    `,
  })

  it("renders", () => {
    renderWithRelay()

    expect(screen.getByText(/mock-Value-for-Field-"Title"/)).toBeOnTheScreen()
  })

  it("when tapping on an artwork", () => {
    renderWithRelay({
      FilterArtworksConnection: () => ({ edges, counts: { total: 2 } }),
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
    })

    fireEvent.press(screen.getByText(/mock-Value-for-Field-"Title"/))

    expect(navigate).toHaveBeenCalledWith('/collection/<mock-value-for-field-"slug">')
    expect(trackEvent).toHaveBeenLastCalledWith({
      action: "tappedArtworkGroup",
      context_module: "collectionRail",
      context_screen_owner_type: "collectionsCategory",
      destination_screen_owner_slug: '<mock-value-for-field-"slug">',
      destination_screen_owner_type: "collection",
      type: "viewAll",
    })
  })
})

const edges = [{ node: { internalID: "1", href: "/artwork/1", slug: "1-slug" } }]
