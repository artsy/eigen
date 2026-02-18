import { screen } from "@testing-library/react-native"
import { ExploreByCategoryCardsTestQuery } from "__generated__/ExploreByCategoryCardsTestQuery.graphql"
import { ExploreByCategoryCards } from "app/Scenes/Search/components/ExploreByCategory/ExploreByCategoryCards"
import { setupTestWrapper } from "app/utils/tests/setupTestWrapper"
import { graphql } from "react-relay"

jest.mock("app/Scenes/Search/components/ExploreByCategory/ExploreByCategoryCard", () => ({
  ExploreByCategoryCard: ({ index }: { index: number }) => {
    const { Flex } = require("@artsy/palette-mobile")
    return <Flex testID={`category-card-${index}`} />
  },
}))

const mockCategories = [
  {
    category: "Medium",
    title: "Medium",
    imageUrl: "https://example.com/medium.jpg",
  },
  {
    category: "Movement",
    title: "Movement",
    imageUrl: "https://example.com/movement.jpg",
  },
]

describe("ExploreByCategoryCards", () => {
  const { renderWithRelay } = setupTestWrapper<ExploreByCategoryCardsTestQuery>({
    Component: ({ categories }) => <ExploreByCategoryCards categories={categories!} />,
    query: graphql`
      query ExploreByCategoryCardsTestQuery @relay_test_operation {
        categories: discoveryCategoriesConnection {
          ...ExploreByCategoryCards_category
        }
      }
    `,
  })

  it("renders the title", () => {
    renderWithRelay({
      DiscoveryCategoriesConnectionConnection: () => ({
        edges: mockCategories.map((category) => ({ node: category })),
      }),
    })

    expect(screen.getByText("Explore by Category")).toBeOnTheScreen()
  })

  it("renders the correct number of category cards", () => {
    renderWithRelay({
      DiscoveryCategoriesConnectionConnection: () => ({
        edges: mockCategories.map((category) => ({ node: category })),
      }),
    })

    const categoryCards = screen.getAllByTestId(/category-card-/)
    expect(categoryCards).toHaveLength(mockCategories.length)
  })

  it("renders nothing when no categories", () => {
    renderWithRelay({
      DiscoveryCategoriesConnectionConnection: () => ({
        edges: [],
      }),
    })

    expect(screen.queryByText("Explore by Category")).not.toBeOnTheScreen()
  })
})
