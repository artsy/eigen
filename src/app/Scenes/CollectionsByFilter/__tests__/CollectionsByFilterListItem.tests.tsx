import { fireEvent, screen } from "@testing-library/react-native"
import { CollectionsByFilterListItemTestQuery } from "__generated__/CollectionsByFilterListItemTestQuery.graphql"
import { CollectionsByFilterListItem } from "app/Scenes/CollectionsByFilter/CollectionsByFilterListItem"
import { setupTestWrapper } from "app/utils/tests/setupTestWrapper"
import { graphql } from "react-relay"
import { useTracking } from "react-tracking"

describe("CollectionsByFilterListItem", () => {
  const trackEvent = useTracking().trackEvent

  const { renderWithRelay } = setupTestWrapper<CollectionsByFilterListItemTestQuery>({
    Component: ({ discoveryCategoryConnection }) => {
      const artworkFilter =
        discoveryCategoryConnection?.filtersForArtworksConnection?.edges?.[0]?.node
      return <CollectionsByFilterListItem artwork={artworkFilter as any} />
    },
    query: graphql`
      query CollectionsByFilterListItemTestQuery @relay_test_operation {
        discoveryCategoryConnection: discoveryCategoryConnection(slug: "test") {
          filtersForArtworksConnection(first: 1) {
            edges {
              node {
                ...CollectionsByFilterListItem_artworkFilter
              }
            }
          }
        }
      }
    `,
  })

  it("renders", () => {
    renderWithRelay()

    expect(screen.getByText(/mock-Value-for-Field-"Title"/)).toBeOnTheScreen()
  })

  it("when tapping on the title", () => {
    renderWithRelay()

    fireEvent.press(screen.getByText(/mock-Value-for-Field-"Title"/))

    expect(trackEvent).toHaveBeenCalledWith({
      action: "tappedArtworkGroup",
      context_module: "collectionRail",
      context_screen_owner_type: "collectionsCategory",
      destination_screen_owner_slug: '<mock-value-for-field-"title">',
      destination_screen_owner_type: "collection",
      type: "viewAll",
    })
  })
})
