import { MyCollectionArtworkAboutTestsQuery } from "__generated__/MyCollectionArtworkAboutTestsQuery.graphql"
import { StickyTabPage } from "app/Components/StickyTabPage/StickyTabPage"
import { __globalStoreTestUtils__ } from "app/store/GlobalStore"
import { setupTestWrapper } from "app/utils/tests/setupTestWrapper"
import { graphql } from "react-relay"
import { MyCollectionArtworkAbout } from "./MyCollectionArtworkAbout"

describe("MyCollectionArtworkAbout", () => {
  const { renderWithRelay } = setupTestWrapper<MyCollectionArtworkAboutTestsQuery>({
    Component: (props) => {
      if (props?.artwork && props?.marketPriceInsights) {
        return (
          <StickyTabPage
            tabs={[
              {
                title: "test",
                content: (
                  <MyCollectionArtworkAbout
                    marketPriceInsights={props.marketPriceInsights}
                    artwork={props?.artwork}
                  />
                ),
              },
            ]}
          />
        )
      }
      return null
    },
    query: graphql`
      query MyCollectionArtworkAboutTestsQuery @relay_test_operation {
        artwork(id: "blue-chip-artwork") {
          ...MyCollectionArtworkAbout_artwork
        }
        marketPriceInsights(artistId: "artesian", medium: "Painting") {
          ...MyCollectionArtworkAbout_marketPriceInsights
        }
      }
    `,
  })

  describe("about the work section", () => {
    it("renders the lables and the data when the data is available", () => {
      __globalStoreTestUtils__?.injectFeatureFlags({
        AREnablePriceEstimateRange: true,
      })

      const { getByText } = renderWithRelay({
        Query: () => artworkDataAvailable,
      })

      expect(getByText("Estimate Range")).toBeTruthy()
      expect(getByText("$17,800 - $42,000")).toBeTruthy()
      expect(getByText("Medium")).toBeTruthy()
      expect(getByText("Oil on canvas")).toBeTruthy()
      expect(getByText("Materials")).toBeTruthy()
      expect(getByText("Painting")).toBeTruthy()
      expect(getByText("Rarity")).toBeTruthy()
      expect(getByText("Unique work")).toBeTruthy()
      expect(getByText("Dimensions")).toBeTruthy()
      expect(getByText("Location")).toBeTruthy()
      expect(getByText("Berlin")).toBeTruthy()
      expect(getByText("39 2/5 × 40 9/10 in")).toBeTruthy()
      expect(getByText("Year created")).toBeTruthy()
      expect(getByText("2007")).toBeTruthy()
      expect(getByText("Provenance")).toBeTruthy()
      expect(getByText("Signed, Sealed, Delivered!")).toBeTruthy()
      expect(getByText("Price Paid")).toBeTruthy()
      expect(getByText("$12,000")).toBeTruthy()
    })

    it("renders the edition information when the artwork is part of limited edition", () => {
      const { getByText } = renderWithRelay({
        Query: () => ({
          artwork: {
            ...artworkDataAvailable.artwork,
            attributionClass: { shortDescription: "Part of a limited edition set" },
            editionOf: "Edition 3/10",
          },
        }),
      })

      expect(getByText("Medium")).toBeTruthy()
      expect(getByText("Oil on canvas")).toBeTruthy()
      expect(getByText("Materials")).toBeTruthy()
      expect(getByText("Painting")).toBeTruthy()
      expect(getByText("Rarity")).toBeTruthy()
      expect(getByText("Part of a limited edition set\nEdition 3/10")).toBeTruthy()
      expect(getByText("Dimensions")).toBeTruthy()
      expect(getByText("Location")).toBeTruthy()
      expect(getByText("Berlin")).toBeTruthy()
      expect(getByText("39 2/5 × 40 9/10 in")).toBeTruthy()
      expect(getByText("Year created")).toBeTruthy()
      expect(getByText("2007")).toBeTruthy()
      expect(getByText("Provenance")).toBeTruthy()
      expect(getByText("Signed, Sealed, Delivered!")).toBeTruthy()
      expect(getByText("Price Paid")).toBeTruthy()
      expect(getByText("$12,000")).toBeTruthy()
    })

    it("renders the lables and the empty value when the data is not available", () => {
      const { getAllByText } = renderWithRelay({
        Query: () => artworkDataNotAvailable,
      })

      expect(getAllByText("----")).toHaveLength(8)
    })

    it("renders size in cm", () => {
      const { getByText } = renderWithRelay({
        Query: () => ({
          artwork: {
            metric: "cm",
            dimensions: {
              in: "39 2/5 × 40 9/10 in",
              cm: "100 × 104 cm",
            },
          },
        }),
      })

      expect(getByText("100 × 104 cm")).toBeTruthy()
    })
  })

  it("renders no estimate range when feature flag is disabled", async () => {
    __globalStoreTestUtils__?.injectFeatureFlags({
      AREnablePriceEstimateRange: false,
    })

    const { queryByText } = renderWithRelay({
      Query: () => ({
        marketPriceInsights: {
          lowRangeCents: 1780000,
          highRangeCents: 4200000,
        },
      }),
    })

    expect(await queryByText("Estimate Range")).toBeFalsy()
    expect(await queryByText("$17,800 - $42,000")).toBeFalsy()
  })

  it("renders articles section", () => {
    const { getByText, getByTestId } = renderWithRelay({
      Query: () => articles,
    })

    expect(getByText("Articles featuring Banksy")).toBeTruthy()
    expect(getByTestId("test-articles-flatlist")).toBeTruthy()
  })

  it("renders Submit for Sale section if P1 artist", () => {
    const { getByText } = renderWithRelay({
      Query: () => artworkDataAvailable,
    })
    expect(getByText("Interested in Selling This Work?")).toBeTruthy()
  })

  it("does not render Submit for Sale section if not P1 artist", () => {
    const { getByText } = renderWithRelay({
      Query: () => ({
        artwork: {
          artist: {
            targetSupply: {
              isP1: false,
            },
          },
        },
      }),
    })

    expect(() => getByText("Interested in Selling This Work?")).toThrow(
      "Unable to find an element with text: Interested in Selling This Work?"
    )
  })
  it("does not render Submit for Sale section if P1 artist and artwork was submited to sale", () => {
    const { getByText } = renderWithRelay({
      Query: () => ({
        artwork: {
          artist: {
            targetSupply: {
              isP1: false,
            },
          },
          submissionId: "someId",
        },
      }),
    })

    expect(() => getByText("Interested in Selling This Work?")).toThrow(
      "Unable to find an element with text: Interested in Selling This Work?"
    )
  })
})

// submissionId: "someId",
const artworkDataAvailable = {
  artwork: {
    category: "Oil on Canvas",
    medium: "Painting",
    date: "2007",
    provenance: "Signed, Sealed, Delivered!",
    metric: "in",
    dimensions: {
      in: "39 2/5 × 40 9/10 in",
      cm: "100 × 104 cm",
    },
    attributionClass: {
      shortDescription: "Unique work",
    },
    editionOf: null,
    artworkLocation: "Berlin",
    pricePaid: {
      display: "$12,000",
    },
    artist: {
      targetSupply: {
        isP1: true,
      },
    },
    submissionId: null,
  },
  marketPriceInsights: {
    lowRangeCents: 1780000,
    highRangeCents: 4200000,
  },
}

const artworkDataNotAvailable = {
  artwork: {
    category: "",
    medium: "",
    date: "",
    provenance: null,
    dimensions: {
      in: null,
      cm: null,
    },
    attributionClass: null,
    editionOf: null,
    artworkLocation: "",
    pricePaid: null,
  },
}

const articles = {
  artwork: {
    artistNames: "Banksy",
    articles: {
      edges: [
        {
          node: {
            id: "id1",
            internalID: "internalId1",
            slug: "article1",
            author: { name: "Artsy" },
            href: "/article/id1",
            thumbnailImage: { url: "https://article1/image" },
            thumbnailTitle: "article 1",
            vertical: "Art Market",
          },
        },
      ],
    },
  },
  marketPriceInsights: {},
}
