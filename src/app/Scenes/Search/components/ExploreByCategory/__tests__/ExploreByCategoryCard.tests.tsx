import { fireEvent, screen } from "@testing-library/react-native"
import { ExploreByCategoryCardTestQuery } from "__generated__/ExploreByCategoryCardTestQuery.graphql"
import { ExploreByCategoryCard } from "app/Scenes/Search/components/ExploreByCategory/ExploreByCategoryCard"
import { mockTrackEvent } from "app/utils/tests/globallyMockedStuff"
import { setupTestWrapper } from "app/utils/tests/setupTestWrapper"
import { graphql } from "react-relay"

const mockRouterLinkProps = { to: "", prefetchVariables: {}, navigationProps: {} }

jest.mock("app/system/navigation/RouterLink", () => ({
  RouterLink: ({ children, to, navigationProps, onPress, prefetchVariables }: any) => {
    const { TouchableOpacity } = require("react-native")
    mockRouterLinkProps.to = to
    mockRouterLinkProps.prefetchVariables = prefetchVariables
    mockRouterLinkProps.navigationProps = navigationProps
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
  const mockCategory = {
    slug: "medium",
    title: "Medium",
    imageUrl: "https://example.com/image.jpg",
  }

  const { renderWithRelay } = setupTestWrapper<ExploreByCategoryCardTestQuery>({
    Component: ({ categories }) => {
      const category = categories?.edges?.[0]?.node
      if (!category) return null
      return <ExploreByCategoryCard category={category} index={0} />
    },
    query: graphql`
      query ExploreByCategoryCardTestQuery @relay_test_operation {
        categories: discoveryCategoriesConnection {
          edges {
            node {
              ...ExploreByCategoryCard_category
            }
          }
        }
      }
    `,
  })

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it("renders the card title", () => {
    renderWithRelay({
      DiscoveryCategoriesConnectionConnection: () => ({
        edges: [{ node: mockCategory }],
      }),
      DiscoveryCategory: () => mockCategory,
    })

    expect(screen.getByText("Medium")).toBeOnTheScreen()
  })

  it("renders with correct RouterLink href", () => {
    renderWithRelay({
      DiscoveryCategoriesConnectionConnection: () => ({
        edges: [{ node: mockCategory }],
      }),
      DiscoveryCategory: () => mockCategory,
    })

    expect(mockRouterLinkProps.to).toBe("/collections-by-category/medium")
  })

  it("sets correct prefetch variables", () => {
    renderWithRelay({
      DiscoveryCategoriesConnectionConnection: () => ({
        edges: [{ node: mockCategory }],
      }),
      DiscoveryCategory: () => mockCategory,
    })

    expect(mockRouterLinkProps.prefetchVariables).toEqual({ categorySlug: "medium" })
  })

  it("sets correct navigation props", () => {
    renderWithRelay({
      DiscoveryCategoriesConnectionConnection: () => ({
        edges: [{ node: mockCategory }],
      }),
      DiscoveryCategory: () => mockCategory,
    })

    expect(mockRouterLinkProps.navigationProps).toEqual({ title: "Medium" })
  })

  it("tracks card press event", () => {
    renderWithRelay({
      DiscoveryCategoriesConnectionConnection: () => ({
        edges: [{ node: mockCategory }],
      }),
      DiscoveryCategory: () => mockCategory,
    })

    const routerLink = screen.getByTestId("router-link")
    fireEvent.press(routerLink)

    expect(mockTrackEvent).toHaveBeenCalledTimes(1)
    expect(mockTrackEvent).toHaveBeenCalledWith({
      action: "tappedCardGroup",
      context_module: "exploreBy",
      context_screen_owner_type: "search",
      destination_screen_owner_type: "collectionsCategory",
      destination_path: "/collections-by-category/medium",
      destination_screen_owner_id: "medium",
      horizontal_slide_position: 0,
      type: "thumbnail",
    })
  })

  it("handles different card categories", () => {
    const colorCard = {
      slug: "collect-by-color",
      title: "Color",
      imageUrl: "https://example.com/color.png",
    }

    renderWithRelay({
      DiscoveryCategoriesConnectionConnection: () => ({
        edges: [{ node: colorCard }],
      }),
      DiscoveryCategory: () => colorCard,
    })

    expect(screen.getByText("Color")).toBeOnTheScreen()
    expect(mockRouterLinkProps.to).toBe("/collections-by-category/collect-by-color")
    expect(mockRouterLinkProps.prefetchVariables).toEqual({ categorySlug: "collect-by-color" })
    expect(mockRouterLinkProps.navigationProps).toEqual({ title: "Color" })
  })

  it("tracks with correct index position", () => {
    const { renderWithRelay: renderWithDifferentIndex } =
      setupTestWrapper<ExploreByCategoryCardTestQuery>({
        Component: ({ categories }) => {
          const category = categories?.edges?.[0]?.node
          if (!category) return null
          return <ExploreByCategoryCard category={category} index={3} />
        },
        query: graphql`
          query ExploreByCategoryCardIndexTestQuery @relay_test_operation {
            categories: discoveryCategoriesConnection {
              edges {
                node {
                  ...ExploreByCategoryCard_category
                }
              }
            }
          }
        `,
      })

    renderWithDifferentIndex({
      DiscoveryCategoriesConnectionConnection: () => ({
        edges: [{ node: mockCategory }],
      }),
      DiscoveryCategory: () => mockCategory,
    })

    const routerLink = screen.getByTestId("router-link")
    fireEvent.press(routerLink)

    expect(mockTrackEvent).toHaveBeenCalledWith(
      expect.objectContaining({
        horizontal_slide_position: 3,
      })
    )
  })
})
