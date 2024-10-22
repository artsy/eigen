import { screen } from "@testing-library/react-native"
import { BodyHomeViewSectionCardsTestQuery } from "__generated__/BodyHomeViewSectionCardsTestQuery.graphql"
import { Body } from "app/Scenes/CollectionsByCategory/Body"
import { setupTestWrapper } from "app/utils/tests/setupTestWrapper"
import { graphql } from "react-relay"

jest.mock("@react-navigation/native", () => ({
  useRoute: () => ({
    params: {
      props: { category: "mock-category" },
    },
  }),
}))

jest.mock("app/Scenes/CollectionsByCategory/CollectionRail", () => ({
  CollectionRailWithSuspense: () => null,
  CollectionRailPlaceholder: () => null,
}))

describe("Body", () => {
  const { renderWithRelay } = setupTestWrapper<BodyHomeViewSectionCardsTestQuery>({
    Component: ({ marketingCollections }) => <Body marketingCollections={marketingCollections} />,
    query: graphql`
      query BodyHomeViewSectionCardsTestQuery {
        marketingCollections(category: "category", first: 20) @required(action: NONE) {
          ...BodyCollectionsByCategory_marketingCollection
          ...CollectionsChips_marketingCollections
        }
      }
    `,
  })

  it("renders", () => {
    renderWithRelay()

    expect(screen.getByText(/Explore collections with mock-category/)).toBeOnTheScreen()
    expect(screen.getByText(/<mock-value-for-field-"title">/)).toBeOnTheScreen()
  })
})
