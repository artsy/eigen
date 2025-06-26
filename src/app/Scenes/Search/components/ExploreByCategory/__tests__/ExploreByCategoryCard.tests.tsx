import { fireEvent, screen } from "@testing-library/react-native"
import { ExploreByCategoryCard } from "app/Scenes/Search/components/ExploreByCategory/ExploreByCategoryCard"
import { MarketingCollectionCategory } from "app/Scenes/Search/components/ExploreByCategory/constants"
import { mockTrackEvent } from "app/utils/tests/globallyMockedStuff"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"

const mockRouterLinkProps = { to: "", prefetchVariables: {} }

jest.mock("app/system/navigation/RouterLink", () => ({
  RouterLink: ({ children, to, onPress, prefetchVariables }: any) => {
    const { TouchableOpacity } = require("react-native")
    mockRouterLinkProps.to = to
    mockRouterLinkProps.prefetchVariables = prefetchVariables
    return (
      <TouchableOpacity
        accessibilityRole="button"
        testID="router-link"
        onPress={() => {
          onPress && onPress()
        }}
      >
        {children}
      </TouchableOpacity>
    )
  },
}))

describe("ExploreByCategoryCard", () => {
  const mockCard: MarketingCollectionCategory = {
    category: "Medium",
    title: "Medium",
    imageUrl: "https://example.com/image.jpg",
  }

  const defaultProps = {
    card: mockCard,
    imageWidth: 150,
    index: 0,
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it("renders the card title", () => {
    renderWithWrappers(<ExploreByCategoryCard {...defaultProps} />)

    expect(screen.getByText("Medium")).toBeOnTheScreen()
  })

  it("renders with correct RouterLink href", () => {
    renderWithWrappers(<ExploreByCategoryCard {...defaultProps} />)

    expect(mockRouterLinkProps.to).toBe("/collections-by-category/Medium")
  })

  it("sets correct prefetch variables", () => {
    renderWithWrappers(<ExploreByCategoryCard {...defaultProps} />)

    expect(mockRouterLinkProps.prefetchVariables).toEqual({ category: "Medium" })
  })

  it("tracks card press event", () => {
    renderWithWrappers(<ExploreByCategoryCard {...defaultProps} />)

    const routerLink = screen.getByTestId("router-link")
    fireEvent.press(routerLink)

    expect(mockTrackEvent).toHaveBeenCalledTimes(1)
    expect(mockTrackEvent).toHaveBeenCalledWith({
      action: "tappedCardGroup",
      context_module: "exploreBy",
      context_screen_owner_type: "search",
      destination_screen_owner_type: "collectionsCategory",
      destination_path: "/collections-by-category/Medium",
      destination_screen_owner_id: "Medium",
      horizontal_slide_position: 0,
      type: "thumbnail",
    })
  })

  it("handles different card categories", () => {
    const colorCard: MarketingCollectionCategory = {
      category: "Collect by Color",
      title: "Color",
      imageUrl: "https://example.com/color.png",
    }

    renderWithWrappers(<ExploreByCategoryCard {...defaultProps} card={colorCard} index={2} />)

    expect(screen.getByText("Color")).toBeOnTheScreen()
    expect(mockRouterLinkProps.to).toBe("/collections-by-category/Collect by Color")
    expect(mockRouterLinkProps.prefetchVariables).toEqual({ category: "Collect by Color" })
  })

  it("tracks with correct index position", () => {
    renderWithWrappers(<ExploreByCategoryCard {...defaultProps} index={3} />)

    const routerLink = screen.getByTestId("router-link")
    fireEvent.press(routerLink)

    expect(mockTrackEvent).toHaveBeenCalledWith(
      expect.objectContaining({
        horizontal_slide_position: 3,
      })
    )
  })
})
