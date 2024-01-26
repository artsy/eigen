import { screen, waitForElementToBeRemoved } from "@testing-library/react-native"
import { RecentlyViewedArtworksQR } from "app/Scenes/RecentlyViewed/Components/RecentlyViewedArtworks"
import { setupTestWrapper } from "app/utils/tests/setupTestWrapper"

describe("RecentlyViewed", () => {
  it("renders RecentlyViewed", async () => {
    const { renderWithRelay } = setupTestWrapper({
      Component: () => <RecentlyViewedArtworksQR />,
    })

    renderWithRelay({
      Query: () => mockResponse,
    })

    await waitForElementToBeRemoved(() => screen.queryByTestId("RecentlyViewedScreenPlaceholder"))

    expect(screen.getByText("Sunflower Seeds Exhibition")).toBeOnTheScreen()
    expect(
      screen.getByText("JEAN-MICHEL BASQUIAT- HOLLYWOOD AFRICANS TRIPTYCH SKATE DECKS")
    ).toBeOnTheScreen()
  })
})

const mockResponse = {
  me: {
    recentlyViewedArtworksConnection: {
      edges: [
        {
          node: {
            slug: "ai-weiwei-sunflower-seeds-exhibition",
            id: "QXJ0d29yazo2MTNhMzhkNjYxMTI5NzAwMGQ3Y2NjMWQ=",
            image: {
              aspectRatio: 1.27,
              url: "https://d32dm0rphc51dk.cloudfront.net/ZRMpZo7ikbEdx3yqBNlDVA/large.jpg",
            },
            title: "Sunflower Seeds Exhibition",
            date: "2010",
            saleMessage: "US$1,750",
            internalID: "613a38d6611297000d7ccc1d",
            artistNames: "Ai Weiwei",
            href: "/artwork/ai-weiwei-sunflower-seeds-exhibition",
            sale: null,
            saleArtwork: null,
            partner: {
              name: "West Chelsea Contemporary",
            },
          },
        },
        {
          node: {
            slug: "jean-michel-basquiat-jean-michel-basquiat-hollywood-africans-triptych-skate-decks-1",
            id: "QXJ0d29yazo2MTRlNDAwNmY4NTZhMDAwMGRmMTM5OWM=",
            image: {
              aspectRatio: 1,
              url: "https://d32dm0rphc51dk.cloudfront.net/fQkbGHRoxplWPRcIpGeAXw/large.jpg",
            },
            title: "JEAN-MICHEL BASQUIAT- HOLLYWOOD AFRICANS TRIPTYCH SKATE DECKS",
            date: "ca. 2014",
            saleMessage: "£1,095",
            internalID: "614e4006f856a0000df1399c",
            artistNames: "Jean-Michel Basquiat",
            href: "/artwork/jean-michel-basquiat-jean-michel-basquiat-hollywood-africans-triptych-skate-decks-1",
            sale: null,
            saleArtwork: null,
            partner: {
              name: "Arts Limited",
            },
          },
        },
      ],
    },
  },
}
