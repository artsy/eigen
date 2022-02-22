import { NewWorksForYouTestsQuery } from "__generated__/NewWorksForYouTestsQuery.graphql"
import { Artwork } from "app/Components/ArtworkGrids/ArtworkGridItem"
import { renderWithWrappers } from "app/tests/renderWithWrappers"
import React from "react"
import { graphql, QueryRenderer } from "react-relay"
import { createMockEnvironment, MockPayloadGenerator } from "relay-test-utils"
import { NewWorksForYouFragmentContainer } from "./NewWorksForYou"

jest.unmock("react-relay")

describe("NewWorksForYou", () => {
  let mockEnvironment: ReturnType<typeof createMockEnvironment>

  const TestRenderer = () => (
    <QueryRenderer<NewWorksForYouTestsQuery>
      query={graphql`
        query NewWorksForYouTestsQuery {
          me {
            ...NewWorksForYou_me
          }
        }
      `}
      render={({ props }) => {
        return props?.me && <NewWorksForYouFragmentContainer me={props.me} />
      }}
      variables={{}}
      environment={mockEnvironment}
    />
  )

  beforeEach(() => {
    mockEnvironment = createMockEnvironment()
  })

  it("renders NewWorksForYou", () => {
    const tree = renderWithWrappers(<TestRenderer />)

    mockEnvironment.mock.resolveMostRecentOperation((operation) =>
      MockPayloadGenerator.generate(operation, {
        Query: () => mockResponse,
      })
    )

    expect(tree.root.findAllByType(Artwork).length).toEqual(2)
  })
})

const mockResponse = {
  me: {
    artworks: {
      edges: [
        {
          node: {
            slug: "ai-weiwei-sunflower-seeds-exhibition",
            id: "QXJ0d29yazo2MTNhMzhkNjYxMTI5NzAwMGQ3Y2NjMWQ=",
            image: {
              aspectRatio: 1.27,
              url: "https://d32dm0rphc51dk.cloudfront.net/ZRMpZo7ikbEdx3yqBNlDVA/large.jpg",
            },
            title: "Sunflower Seeds Exhibition ",
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
