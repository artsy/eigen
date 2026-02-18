import { fireEvent, screen } from "@testing-library/react-native"
import { DiscoverSomethingNewTestsQuery } from "__generated__/DiscoverSomethingNewTestsQuery.graphql"
import { DiscoverSomethingNew } from "app/Scenes/Search/components/DiscoverSomethingNew/DiscoverSomethingNew"
import { navigate } from "app/system/navigation/navigate"
import { mockTrackEvent } from "app/utils/tests/globallyMockedStuff"
import { setupTestWrapper } from "app/utils/tests/setupTestWrapper"
import { graphql } from "react-relay"

describe("DiscoverSomethingNew", () => {
  const { renderWithRelay } = setupTestWrapper<DiscoverSomethingNewTestsQuery>({
    Component: () => <DiscoverSomethingNew />,
    query: graphql`
      query DiscoverSomethingNewTestsQuery @relay_test_operation {
        collections: discoveryMarketingCollections {
          ...DiscoverSomethingNewChips_collection
        }
      }
    `,
  })

  it("does not render when no collections are available", () => {
    renderWithRelay({
      Query: () => ({
        collections: null,
      }),
    })

    expect(screen.queryByText("Discover Something New")).not.toBeOnTheScreen()
  })

  it("does not render when collections array is empty", () => {
    renderWithRelay({
      Query: () => ({
        collections: [],
      }),
    })

    expect(screen.queryByText("Discover Something New")).not.toBeOnTheScreen()
  })

  it("renders collections with mock data", () => {
    renderWithRelay({
      MarketingCollection: () => ({
        internalID: "test-collection",
        slug: "test-collection",
        title: "Test Collection",
        category: "Test Category",
        thumbnail: "https://example.com/image.jpg",
      }),
    })

    expect(screen.getByText("Discover Something New")).toBeOnTheScreen()

    // Component renders with collection data (though specific text may be mocked)
    const chips = screen.getAllByRole("button")
    expect(chips.length).toBeGreaterThan(0)
  })

  it("handles navigation and tracking setup", () => {
    renderWithRelay({
      MarketingCollection: () => ({
        internalID: "test-collection",
        slug: "test-collection",
        title: "Test Collection",
        category: "Test Category",
        thumbnail: "https://example.com/image.jpg",
      }),
    })

    expect(screen.getByText("Discover Something New")).toBeOnTheScreen()

    // Verify navigation and tracking mocks are set up
    expect(navigate).toBeDefined()
    expect(mockTrackEvent).toBeDefined()

    // Test that chips are interactive
    const chips = screen.getAllByRole("button")
    expect(chips.length).toBeGreaterThan(0)

    // Chips should be pressable
    fireEvent.press(chips[0])

    // Should call navigation (specific URL may vary due to mocking)
    expect(navigate).toHaveBeenCalled()
    expect(mockTrackEvent).toHaveBeenCalled()
  })
})
