import { fireEvent, screen } from "@testing-library/react-native"
import { CollectionsChipsTestQuery } from "__generated__/CollectionsChipsTestQuery.graphql"
import { CollectionsChips } from "app/Scenes/CollectionsByCategory/CollectionsChips"
import { navigate } from "app/system/navigation/navigate"
import { setupTestWrapper } from "app/utils/tests/setupTestWrapper"
import { graphql } from "react-relay"
import { useTracking } from "react-tracking"

describe("CollectionsChips", () => {
  const trackEvent = useTracking().trackEvent

  const { renderWithRelay } = setupTestWrapper<CollectionsChipsTestQuery>({
    Component: CollectionsChips,
    query: graphql`
      query CollectionsChipsTestQuery {
        marketingCollections(category: "test", size: 10) @required(action: NONE) {
          ...CollectionsChips_marketingCollections
        }
      }
    `,
  })

  it("renders", () => {
    renderWithRelay()

    expect(screen.getByText(/mock-value-for-field-"title"/)).toBeOnTheScreen()
  })

  it("when tapping on a chip", () => {
    renderWithRelay()

    fireEvent.press(screen.getByText(/mock-value-for-field-"title"/))

    expect(navigate).toHaveBeenCalledWith('/collection/<mock-value-for-field-"slug">')
    expect(trackEvent).toHaveBeenCalledWith({
      action: "tappedCollectionGroup",
      context_module: "collectionRail",
      context_screen_owner_type: "collectionsCategory",
      destination_screen_owner_slug: '<mock-value-for-field-"slug">',
      destination_screen_owner_type: "collection",
      horizontal_slide_position: 0,
      type: "thumbnail",
    })
  })
})
