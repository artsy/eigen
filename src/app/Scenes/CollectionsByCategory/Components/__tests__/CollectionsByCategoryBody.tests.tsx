import { screen } from "@testing-library/react-native"
import { CollectionsByCategoryBodyTestQuery } from "__generated__/CollectionsByCategoryBodyTestQuery.graphql"
import { CollectionsByCategoryBody } from "app/Scenes/CollectionsByCategory/Components/CollectionsByCategoryBody"
import { setupTestWrapper } from "app/utils/tests/setupTestWrapper"
import { graphql } from "react-relay"

jest.mock("@react-navigation/native", () => ({
  ...jest.requireActual("@react-navigation/native"),
  useRoute: () => ({
    params: { category: "mock-category", title: "Contemporary" },
  }),
}))

jest.mock("app/Scenes/CollectionsByCategory/Components/CollectionRail", () => ({
  CollectionRailWithSuspense: ({ slug }: { slug: string }) => {
    const { Text } = require("@artsy/palette-mobile")
    return <Text testID={`collection-rail-${slug}`}>Collection Rail {slug}</Text>
  },
  CollectionRailPlaceholder: () => null,
}))

jest.mock(
  "app/Scenes/CollectionsByCategory/Components/CollectionsByCategoryArtworksWithFiltersRail",
  () => ({
    CollectionsByCategoryArtworksWithFiltersRailWithSuspense: ({
      filterSlug,
    }: {
      filterSlug: string
    }) => {
      const { Text } = require("@artsy/palette-mobile")
      return (
        <Text testID={`artwork-filter-rail-${filterSlug}`}>Artwork Filter Rail {filterSlug}</Text>
      )
    },
  })
)

describe("CollectionsByCategoryBody", () => {
  const { renderWithRelay } = setupTestWrapper<CollectionsByCategoryBodyTestQuery>({
    Component: ({ viewer }) => <CollectionsByCategoryBody viewer={viewer} />,
    query: graphql`
      query CollectionsByCategoryBodyTestQuery {
        viewer @required(action: NONE) {
          ...CollectionsByCategoryBody_viewer @arguments(categorySlug: "test-slug")
        }
      }
    `,
  })

  describe("given category type is DiscoveryMarketingCollection", () => {
    it("renders chips and collection rails", () => {
      renderWithRelay({
        DiscoveryMarketingCollection: () => ({
          __typename: "DiscoveryMarketingCollection",
          category: "Contemporary",
          marketingCollections: [
            { slug: "contemporary-art", title: "Contemporary Art" },
            { slug: "modern-art", title: "Modern Art" },
          ],
        }),
      })

      expect(screen.getByText("Contemporary")).toBeOnTheScreen()
      expect(screen.getByText("Explore collections by contemporary")).toBeOnTheScreen()

      expect(screen.getByText("Contemporary Art")).toBeOnTheScreen()
      expect(screen.getByText("Modern Art")).toBeOnTheScreen()

      expect(screen.getByTestId("collection-rail-contemporary-art")).toBeOnTheScreen()
      expect(screen.getByTestId("collection-rail-modern-art")).toBeOnTheScreen()
    })
  })

  describe("given category type is DiscoveryArtworksWithFiltersCollection", () => {
    it("renders chips and basic structure", () => {
      renderWithRelay({
        DiscoveryArtworksWithFiltersCollection: () => ({
          __typename: "DiscoveryArtworksWithFiltersCollection",
          category: "Contemporary",
          filtersForArtworksConnection: {
            edges: [
              {
                node: {
                  slug: "paintings",
                  title: "Paintings",
                  href: "/collect?medium=painting",
                },
              },
            ],
          },
        }),
      })

      expect(screen.getByText("Contemporary")).toBeOnTheScreen()
      expect(screen.getByText("Explore collections by contemporary")).toBeOnTheScreen()

      expect(screen.getByText(/mock-value-for-field-"title"/)).toBeOnTheScreen()
    })
  })
})
