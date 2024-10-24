import { screen } from "@testing-library/react-native"
import { CollectionRailHomeViewSectionCardsTestQuery } from "__generated__/CollectionRailHomeViewSectionCardsTestQuery.graphql"
import { CollectionRail } from "app/Scenes/CollectionsByCategory/CollectionRail"
import { setupTestWrapper } from "app/utils/tests/setupTestWrapper"
import { graphql } from "react-relay"

jest.mock("app/Components/ArtworkRail/ArtworkRail", () => ({
  ArtworkRail: () => null,
  ArtworkRailPlaceholder: () => null,
}))

describe("CollectionRail", () => {
  const { renderWithRelay } = setupTestWrapper<CollectionRailHomeViewSectionCardsTestQuery>({
    Component: ({ marketingCollection }) => <CollectionRail collection={marketingCollection} />,
    query: graphql`
      query CollectionRailHomeViewSectionCardsTestQuery {
        marketingCollection(slug: "marketing-slug") @required(action: NONE) {
          ...CollectionRail_marketingCollection
        }
      }
    `,
  })

  it("renders", () => {
    renderWithRelay()

    expect(screen.getByText(/mock-Value-for-Field-"Title"/)).toBeOnTheScreen()
  })
})
