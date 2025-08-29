import { fireEvent, screen } from "@testing-library/react-native"
import { CollectionsByFilterChipsTestQuery } from "__generated__/CollectionsByFilterChipsTestQuery.graphql"
import { CollectionsByFilterChips } from "app/Scenes/CollectionsByFilter/CollectionsByFilterChips"
import { setupTestWrapper } from "app/utils/tests/setupTestWrapper"
import { graphql } from "react-relay"
import { useTracking } from "react-tracking"

describe("CollectionsByFilterChips", () => {
  const trackEvent = useTracking().trackEvent

  const { renderWithRelay } = setupTestWrapper<CollectionsByFilterChipsTestQuery>({
    Component: ({ discoveryCategoryConnection }) => (
      <CollectionsByFilterChips discoveryCategories={discoveryCategoryConnection as any} />
    ),
    query: graphql`
      query CollectionsByFilterChipsTestQuery @relay_test_operation {
        discoveryCategoryConnection: discoveryCategoryConnection(slug: "test") {
          ...CollectionsByFilterChips_discoveryCategories
        }
      }
    `,
  })

  it("renders", () => {
    renderWithRelay({
      DiscoveryCategory: () => ({
        chipsFilteredCollections: {
          edges: [
            {
              node: {
                href: '/collection/mock-value-for-field-"slug"',
                title: 'mock-value-for-field-"title"',
              },
            },
          ],
        },
      }),
    })

    expect(screen.getByText(/mock-value-for-field-"title"/)).toBeOnTheScreen()
  })

  it("when tapping on a chip", () => {
    renderWithRelay({
      DiscoveryCategory: () => ({
        chipsFilteredCollections: {
          edges: [
            {
              node: {
                href: '/collection/mock-value-for-field-"slug"',
                title: 'mock-value-for-field-"title"',
              },
            },
          ],
        },
      }),
    })

    fireEvent.press(screen.getByText(/mock-value-for-field-"title"/))

    expect(trackEvent).toHaveBeenCalledWith({
      action: "tappedCollectionGroup",
      context_module: "collectionRail",
      context_screen_owner_type: "collectionsCategory",
      destination_screen_owner_slug: 'mock-value-for-field-"title"',
      destination_screen_owner_type: "collection",
      horizontal_slide_position: 0,
      type: "thumbnail",
    })
  })
})
