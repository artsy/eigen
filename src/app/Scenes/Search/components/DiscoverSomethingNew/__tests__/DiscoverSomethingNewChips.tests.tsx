import { fireEvent, screen } from "@testing-library/react-native"
import { DiscoverSomethingNewChipsTestQuery } from "__generated__/DiscoverSomethingNewChipsTestQuery.graphql"
import { DiscoverSomethingNewChips } from "app/Scenes/Search/components/DiscoverSomethingNew/DiscoverSomethingNewChips"
import { navigate } from "app/system/navigation/navigate"
import { setupTestWrapper } from "app/utils/tests/setupTestWrapper"
import { graphql } from "react-relay"
import { useTracking } from "react-tracking"

jest.mock("app/system/navigation/navigate", () => ({
  navigate: jest.fn(),
}))

jest.mock("react-native-device-info", () => ({
  isTablet: jest.fn(() => false),
}))

describe("DiscoverSomethingNewChips", () => {
  const trackEvent = useTracking().trackEvent

  const { renderWithRelay } = setupTestWrapper<DiscoverSomethingNewChipsTestQuery>({
    Component: ({ collections }) => <DiscoverSomethingNewChips collections={collections} />,
    query: graphql`
      query DiscoverSomethingNewChipsTestQuery @relay_test_operation {
        collections: marketingCollections {
          ...DiscoverSomethingNewChips_collection
        }
      }
    `,
  })

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it("renders section title", () => {
    renderWithRelay({
      MarketingCollection: () => ({
        __typename: "MarketingCollection",
        internalID: "test-id",
        slug: "test-slug",
        title: "Test Collection",
        category: "Test Category",
        thumbnail: "https://example.com/test.jpg",
      }),
    })

    expect(screen.getByText("Discover Something New")).toBeOnTheScreen()
  })

  it("navigates to collection when chip is pressed", () => {
    renderWithRelay({
      MarketingCollection: () => ({
        __typename: "MarketingCollection",
        internalID: "test-id",
        slug: "test-collection",
        title: "Test Collection",
        category: "Test Category",
        thumbnail: "https://example.com/test.jpg",
      }),
    })

    fireEvent.press(screen.getByText("Test Collection"))
    expect(navigate).toHaveBeenCalledWith("/collection/test-collection")
  })

  it("tracks analytics when chip is pressed", () => {
    renderWithRelay({
      MarketingCollection: () => ({
        __typename: "MarketingCollection",
        internalID: "test-collection-id",
        slug: "test-collection",
        title: "Test Collection",
        category: "Test Category",
        thumbnail: "https://example.com/test.jpg",
      }),
    })

    fireEvent.press(screen.getByText("Test Collection"))

    expect(trackEvent).toHaveBeenCalledWith({
      action: "tappedCardGroup",
      context_module: "discoverSomethingNewRail",
      context_screen_owner_type: "search",
      destination_screen_owner_type: "marketingCollection",
      destination_path: "/collection/test-collection",
      destination_screen_owner_id: "test-collection-id",
      horizontal_slide_position: 0,
      type: "thumbnail",
    })
  })

  it("returns null when no collections", () => {
    renderWithRelay({
      Query: () => ({
        collections: [],
      }),
    })

    expect(screen.queryByText("Discover Something New")).not.toBeOnTheScreen()
  })
})
