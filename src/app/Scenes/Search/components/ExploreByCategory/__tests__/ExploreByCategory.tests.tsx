import { screen } from "@testing-library/react-native"
import { ExploreByCategory } from "app/Scenes/Search/components/ExploreByCategory/ExploreByCategory"
import { MARKETING_COLLECTION_CATEGORIES } from "app/Scenes/Search/components/ExploreByCategory/constants"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"

jest.mock("app/Scenes/Search/components/ExploreByCategory/ExploreByCategoryCard", () => ({
  ExploreByCategoryCard: ({ card, index }: { card: any; index: number }) => {
    const { Text } = require("@artsy/palette-mobile")
    return <Text testID={`category-card-${index}`}>{card.title}</Text>
  },
}))

describe("ExploreByCategory", () => {
  it("renders the title", () => {
    renderWithWrappers(<ExploreByCategory />)

    expect(screen.getByText("Explore by Category")).toBeOnTheScreen()
  })

  it("renders all category cards", () => {
    renderWithWrappers(<ExploreByCategory />)

    MARKETING_COLLECTION_CATEGORIES.forEach((category, index) => {
      expect(screen.getByTestId(`category-card-${index}`)).toBeOnTheScreen()
      expect(screen.getByText(category.title)).toBeOnTheScreen()
    })
  })

  it("renders the correct number of category cards", () => {
    renderWithWrappers(<ExploreByCategory />)

    const categoryCards = screen.getAllByTestId(/category-card-/)
    expect(categoryCards).toHaveLength(MARKETING_COLLECTION_CATEGORIES.length)
  })
})
