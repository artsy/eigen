import { screen } from "@testing-library/react-native"
import { HomeViewSectionMarketingCollectionsItemTestsQuery } from "__generated__/HomeViewSectionMarketingCollectionsItemTestsQuery.graphql"
import { HomeViewSectionMarketingCollectionsItem } from "app/Scenes/HomeView/Sections/HomeViewSectionMarketingCollectionsItem"
import { setupTestWrapper } from "app/utils/tests/setupTestWrapper"
import { graphql } from "react-relay"

describe("HomeViewSectionMarketingCollectionsItem", () => {
  const { renderWithRelay } = setupTestWrapper<HomeViewSectionMarketingCollectionsItemTestsQuery>({
    Component: ({ marketingCollection }) => (
      <HomeViewSectionMarketingCollectionsItem marketingCollection={marketingCollection!} />
    ),
    query: graphql`
      query HomeViewSectionMarketingCollectionsItemTestsQuery @relay_test_operation {
        marketingCollection(slug: "collection-slug") {
          ...HomeViewSectionMarketingCollectionsItem_marketingCollection
        }
      }
    `,
  })

  it("renders the collection meta", () => {
    renderWithRelay({ MarketingCollection: () => mockCollection })

    expect(screen.getByText("Trending Now")).toBeOnTheScreen()
  })

  it("renders images sourced from representative artworks", () => {
    renderWithRelay({ MarketingCollection: () => mockCollection })

    const uris = screen.getAllByTestId("five-up-image").map((image) => image.props.source.uri)
    expect(uris.slice(0, 3)).toEqual([
      "https://example.com/image-1.jpg",
      "https://example.com/image-2.jpg",
      "https://example.com/image-3.jpg",
    ])
  })

  it("renders without image URLs when there are no representative artworks", () => {
    renderWithRelay({
      MarketingCollection: () => ({ ...mockCollection, representativeArtworks: [] }),
    })

    const uris = screen.getAllByTestId("five-up-image").map((image) => image.props.source.uri)
    expect(uris.every((uri) => uri === undefined)).toBe(true)
  })
})

const representativeArtworks = (count: number) =>
  Array.from({ length: count }, (_, i) => ({
    image: { url: `https://example.com/image-${i + 1}.jpg` },
  }))

const mockCollection = {
  title: "Trending Now",
  slug: "trending-now",
  artworksConnection: { counts: { total: 42 } },
  representativeArtworks: representativeArtworks(3),
}
