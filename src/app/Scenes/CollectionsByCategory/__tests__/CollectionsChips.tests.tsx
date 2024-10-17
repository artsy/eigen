import { screen } from "@testing-library/react-native"
import { CollectionsChipsTestQuery } from "__generated__/CollectionsChipsTestQuery.graphql"
import { CollectionsChips } from "app/Scenes/CollectionsByCategory/CollectionsChips"
import { setupTestWrapper } from "app/utils/tests/setupTestWrapper"
import { graphql } from "react-relay"

describe("CollectionsChips", () => {
  const { renderWithRelay } = setupTestWrapper<CollectionsChipsTestQuery>({
    Component: CollectionsChips,
    query: graphql`
      query CollectionsChipsTestQuery {
        marketingCollections(category: "test", size: 10) @required(action: NONE) {
          ...CollectionsChips_marketingCollections
        }
      }
    `,
  })

  it("renders", () => {
    renderWithRelay()

    expect(screen.getByText(/mock-value-for-field-"title"/)).toBeOnTheScreen()
  })
})
