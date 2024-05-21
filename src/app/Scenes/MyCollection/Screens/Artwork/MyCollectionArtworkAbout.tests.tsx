import { screen } from "@testing-library/react-native"
import { MyCollectionArtworkAboutTestsQuery } from "__generated__/MyCollectionArtworkAboutTestsQuery.graphql"
import { setupTestWrapper } from "app/utils/tests/setupTestWrapper"
import { graphql } from "react-relay"
import { MyCollectionArtworkAbout } from "./MyCollectionArtworkAbout"

describe("MyCollectionArtworkAbout", () => {
  const { renderWithRelay } = setupTestWrapper<MyCollectionArtworkAboutTestsQuery>({
    Component: (props) => {
      if (props?.artwork && props?.marketPriceInsights && props?.me) {
        return (
          <MyCollectionArtworkAbout
            marketPriceInsights={props.marketPriceInsights}
            artwork={props.artwork}
            me={props.me}
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
        me {
          ...MyCollectionArtworkAbout_me
        }
      }
    `,
  })

  describe("about the work section", () => {
    it("renders the lables and the data when the data is available", () => {
      renderWithRelay({
        Query: () => artworkDataAvailable,
      })

      expect(screen.getByText("Estimate Range")).toBeTruthy()
      expect(screen.getByText("$17,800 - $42,000")).toBeTruthy()
      expect(screen.getByText("Medium")).toBeTruthy()
      expect(screen.getByText("Oil on canvas")).toBeTruthy()
      expect(screen.getByText("Materials")).toBeTruthy()
      expect(screen.getByText("Painting")).toBeTruthy()
      expect(screen.getByText("Rarity")).toBeTruthy()
      expect(screen.getByText("Unique work")).toBeTruthy()
      expect(screen.getByText("Dimensions")).toBeTruthy()
      expect(screen.getByText("Location")).toBeTruthy()
      expect(screen.getByText("Berlin")).toBeTruthy()
      expect(screen.getByText("39 2/5 × 40 9/10 in")).toBeTruthy()
      expect(screen.getByText("Year created")).toBeTruthy()
      expect(screen.getByText("2007")).toBeTruthy()
      expect(screen.getByText("Provenance")).toBeTruthy()
      expect(screen.getByText("Signed, Sealed, Delivered!")).toBeTruthy()
      expect(screen.getByText("Price Paid")).toBeTruthy()
      expect(screen.getByText("$12,000")).toBeTruthy()
    })

    it("renders the edition information when the artwork is part of limited edition", () => {
      renderWithRelay({
        Query: () => ({
          artwork: {
            ...artworkDataAvailable.artwork,
            attributionClass: { shortDescription: "Part of a limited edition set" },
            editionOf: "Edition 3/10",
          },
        }),
      })

      expect(screen.getByText("Medium")).toBeTruthy()
      expect(screen.getByText("Oil on canvas")).toBeTruthy()
      expect(screen.getByText("Materials")).toBeTruthy()
      expect(screen.getByText("Painting")).toBeTruthy()
      expect(screen.getByText("Rarity")).toBeTruthy()
      expect(screen.getByText("Part of a limited edition set\nEdition 3/10")).toBeTruthy()
      expect(screen.getByText("Dimensions")).toBeTruthy()
      expect(screen.getByText("Location")).toBeTruthy()
      expect(screen.getByText("Berlin")).toBeTruthy()
      expect(screen.getByText("39 2/5 × 40 9/10 in")).toBeTruthy()
      expect(screen.getByText("Year created")).toBeTruthy()
      expect(screen.getByText("2007")).toBeTruthy()
      expect(screen.getByText("Provenance")).toBeTruthy()
      expect(screen.getByText("Signed, Sealed, Delivered!")).toBeTruthy()
      expect(screen.getByText("Price Paid")).toBeTruthy()
      expect(screen.getByText("$12,000")).toBeTruthy()
    })

    it("renders the lables and the empty value when the data is not available", () => {
      renderWithRelay({
        Query: () => artworkDataNotAvailable,
      })

      expect(screen.getAllByText("----")).toHaveLength(8)
    })

    it("renders size in cm", () => {
      renderWithRelay({
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

      expect(screen.getByText("100 × 104 cm")).toBeTruthy()
    })
  })

  it("renders articles section", () => {
    renderWithRelay({
      Query: () => articles,
    })

    expect(screen.getByText("Articles featuring Banksy")).toBeTruthy()
    expect(screen.getByTestId("test-articles-flatlist")).toBeTruthy()
  })

  it("renders Submit for Sale section if P1 artist", () => {
    renderWithRelay({
      Query: () => artworkDataAvailable,
    })
    expect(screen.getByText("Interested in Selling This Work?")).toBeTruthy()
  })

  it("does not render Submit for Sale section if not P1 artist", () => {
    renderWithRelay({
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

    expect(() => screen.getByText("Interested in Selling This Work?")).toThrow(
      "Unable to find an element with text: Interested in Selling This Work?"
    )
  })
  it("does not render Submit for Sale section if P1 artist and artwork was submited to sale", () => {
    renderWithRelay({
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

    expect(() => screen.getByText("Interested in Selling This Work?")).toThrow(
      "Unable to find an element with text: Interested in Selling This Work?"
    )
  })

  it("renders Submit for Sale button", () => {
    renderWithRelay({
      Query: () => artworkDataAvailable,
    })

    expect(screen.getByTestId("submitArtworkToSellButton")).toBeDefined()
  })

  it("renders Request for Price Estimate section", () => {
    renderWithRelay({
      Query: () => artworkDataAvailable,
    })

    expect(screen.getByTestId("request-price-estimate-button")).toBeDefined()
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
    collectorLocation: { city: "Berlin" },
    pricePaid: {
      display: "$12,000",
    },
    artist: {
      targetSupply: {
        isP1: true,
      },
    },
    submissionId: null,
    hasPriceEstimateRequest: false,
    isPriceEstimateRequestable: true,
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
    collectorLocation: null,
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
