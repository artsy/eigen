import { screen } from "@testing-library/react-native"
import { DiscoverSomethingNewQuery } from "__generated__/DiscoverSomethingNewQuery.graphql"
import { DiscoverSomethingNew } from "app/Scenes/Search/components/DiscoverSomethingNew/DiscoverSomethingNew"
import { setupTestWrapper } from "app/utils/tests/setupTestWrapper"
import { graphql } from "react-relay"

describe("DiscoverSomethingNew", () => {
  const { renderWithRelay } = setupTestWrapper<DiscoverSomethingNewQuery>({
    Component: () => <DiscoverSomethingNew />,
    query: graphql`
      query DiscoverSomethingNewTestQuery @relay_test_operation {
        collections: marketingCollections(
          slugs: [
            "most-loved"
            "understated"
            "art-gifts-under-1000-dollars"
            "transcendent"
            "best-bids"
            "statement-pieces"
            "little-gems"
            "feast-for-the-eyes"
            "street-art-edit"
            "icons"
            "bleeding-edge"
            "flora-and-fauna"
          ]
          size: 12
        ) {
          ...DiscoverSomethingNewChips_collection
        }
      }
    `,
  })

  it("renders section title when collections exist", () => {
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

  it("renders nothing when no collections", () => {
    renderWithRelay({
      Query: () => ({
        collections: [],
      }),
    })

    expect(screen.queryByText("Discover Something New")).not.toBeOnTheScreen()
  })
})
