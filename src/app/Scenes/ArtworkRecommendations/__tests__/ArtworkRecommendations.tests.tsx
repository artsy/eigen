import { screen } from "@testing-library/react-native"
import { ArtworkRecommendationsTestsQuery } from "__generated__/ArtworkRecommendationsTestsQuery.graphql"
import { ArtworkRecommendations } from "app/Scenes/ArtworkRecommendations/ArtworkRecommendations"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"
import { resolveMostRecentRelayOperation } from "app/utils/tests/resolveMostRecentRelayOperation"
import { Suspense } from "react"
import { graphql, QueryRenderer } from "react-relay"
import { createMockEnvironment } from "relay-test-utils"

describe("ArtworkRecommendations", () => {
  let mockEnvironment: ReturnType<typeof createMockEnvironment>

  const TestRenderer = () => (
    <QueryRenderer<ArtworkRecommendationsTestsQuery>
      query={graphql`
        query ArtworkRecommendationsTestsQuery {
          me {
            ...ArtworkRecommendations_me @arguments(count: 10)
          }
        }
      `}
      render={() => {
        return (
          <Suspense fallback={null}>
            <ArtworkRecommendations />
          </Suspense>
        )
      }}
      variables={{}}
      environment={mockEnvironment}
    />
  )

  beforeEach(() => {
    mockEnvironment = createMockEnvironment()
  })

  it("renders ArtworkRecommendations", async () => {
    await renderWithWrappers(<TestRenderer />)

    // `ArtworkRecommendations` fetches its own query, which is the most recent operation.
    expect(mockEnvironment.mock.getMostRecentOperation().request.node.operation.name).toBe(
      "ArtworkRecommendationsQuery"
    )
    await resolveMostRecentRelayOperation(mockEnvironment, {
      Me: () => mockResponse.me,
    })

    expect(await screen.findByText(/Sunflower Seeds Exhibition/)).toBeOnTheScreen()
    expect(
      screen.getByText(/JEAN-MICHEL BASQUIAT- HOLLYWOOD AFRICANS TRIPTYCH SKATE DECKS/)
    ).toBeOnTheScreen()
  })
})

const mockResponse = {
  me: {
    artworkRecommendations: {
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
