import { fireEvent, screen } from "@testing-library/react-native"
import { DiscoverSomethingNewChipsTestsQuery } from "__generated__/DiscoverSomethingNewChipsTestsQuery.graphql"
import { DiscoverSomethingNewChips } from "app/Scenes/Search/components/DiscoverSomethingNew/DiscoverSomethingNewChips"
import { DiscoverSomethingNewChipsPlaceholder } from "app/Scenes/Search/components/DiscoverSomethingNew/DiscoverSomethingNewChipsPlaceholder"
import { navigate } from "app/system/navigation/navigate"
import { mockTrackEvent } from "app/utils/tests/globallyMockedStuff"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"
import { setupTestWrapper } from "app/utils/tests/setupTestWrapper"
import { graphql } from "react-relay"

describe("DiscoverSomethingNewChips", () => {
  const { renderWithRelay } = setupTestWrapper<DiscoverSomethingNewChipsTestsQuery>({
    Component: (props) => <DiscoverSomethingNewChips collections={props.collections as any} />,
    query: graphql`
      query DiscoverSomethingNewChipsTestsQuery @relay_test_operation {
        collections: discoveryMarketingCollections {
          ...DiscoverSomethingNewChips_collection
        }
      }
    `,
  })

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it("renders the section title and collection chips", () => {
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

    // Verify chips are rendered as interactive buttons
    const chips = screen.getAllByRole("button")
    expect(chips.length).toBeGreaterThan(0)
  })

  it("handles chip interactions", () => {
    renderWithRelay({
      MarketingCollection: () => ({
        internalID: "test-collection",
        slug: "test-collection",
        title: "Test Collection",
        category: "Test Category",
        thumbnail: "https://example.com/image.jpg",
      }),
    })

    const chips = screen.getAllByRole("button")
    expect(chips.length).toBeGreaterThan(0)

    // Test chip press functionality
    fireEvent.press(chips[0])

    expect(navigate).toHaveBeenCalled()
    expect(mockTrackEvent).toHaveBeenCalledWith(
      expect.objectContaining({
        action: "tappedCardGroup",
        context_module: "discoverSomethingNewRail",
        context_screen_owner_type: "search",
        destination_screen_owner_type: "marketingCollection",
      })
    )
  })

  it("returns null when no collections are provided", () => {
    renderWithRelay({
      Query: () => ({
        collections: null,
      }),
    })

    expect(screen.queryByText("Discover Something New")).not.toBeOnTheScreen()
  })

  it("returns null when collections array is empty", () => {
    renderWithRelay({
      Query: () => ({
        collections: [],
      }),
    })

    expect(screen.queryByText("Discover Something New")).not.toBeOnTheScreen()
  })

  describe("DiscoverSomethingNewChipsPlaceholder", () => {
    it("renders the placeholder component with skeleton elements", () => {
      renderWithWrappers(<DiscoverSomethingNewChipsPlaceholder />)

      expect(screen.getByText("Discover Something New")).toBeOnTheScreen()
      expect(screen.getByTestId("DiscoverSomethingNewChipsPlaceholder")).toBeOnTheScreen()
    })
  })
})
