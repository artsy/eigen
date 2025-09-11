import { TouchableWithScale } from "@artsy/palette-mobile"
import { screen, fireEvent } from "@testing-library/react-native"
import { FairCollectionsTestsQuery } from "__generated__/FairCollectionsTestsQuery.graphql"
import { FairCollectionsFragmentContainer } from "app/Scenes/Fair/Components/FairCollections"
import { mockTrackEvent } from "app/utils/tests/globallyMockedStuff"
import { setupTestWrapper } from "app/utils/tests/setupTestWrapper"
import { graphql } from "react-relay"

describe("FairCollections", () => {
  const { renderWithRelay } = setupTestWrapper<FairCollectionsTestsQuery>({
    Component: ({ fair }) => <FairCollectionsFragmentContainer fair={fair!} />,
    query: graphql`
      query FairCollectionsTestsQuery($fairID: String!) @relay_test_operation {
        fair(id: $fairID) {
          ...FairCollections_fair
        }
      }
    `,
  })

  it("renders the 2 collections", () => {
    renderWithRelay({
      Fair: () => ({
        marketingCollections: [
          {
            title: "Big Artists, Small Sculptures",
            category: "Collectible Sculptures",
          },
          {
            title: "Example Collection 2",
            category: "Subtitle 2",
          },
        ],
      }),
    })

    expect(screen.getByText("Big Artists, Small Sculptures")).toBeOnTheScreen()
    expect(screen.getByText("Collectible Sculptures")).toBeOnTheScreen()
    expect(screen.getByText("Example Collection 2")).toBeOnTheScreen()
    expect(screen.getByText("Subtitle 2")).toBeOnTheScreen()
  })

  it("tracks taps on collections", () => {
    renderWithRelay({
      Fair: () => ({
        internalID: "abc123",
        slug: "art-basel-hong-kong-2020",
        marketingCollections: [
          {
            slug: "collectible-sculptures",
          },
        ],
      }),
    })

    const collection = screen.UNSAFE_getAllByType(TouchableWithScale)[0]
    fireEvent.press(collection)

    expect(mockTrackEvent).toHaveBeenCalledWith({
      action: "tappedCollectionGroup",
      context_module: "curatedHighlightsRail",
      context_screen_owner_type: "fair",
      context_screen_owner_id: "abc123",
      context_screen_owner_slug: "art-basel-hong-kong-2020",
      destination_screen_owner_type: "collection",
      destination_screen_owner_id: "collectible-sculptures",
      destination_screen_owner_slug: "collectible-sculptures",
      type: "thumbnail",
    })
  })

  it("renders null if there are no collections", () => {
    renderWithRelay({
      Fair: () => ({
        marketingCollections: [],
      }),
    })

    expect(screen.toJSON()).toBeNull()
  })
})
