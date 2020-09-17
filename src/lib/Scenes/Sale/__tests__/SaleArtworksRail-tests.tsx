import { SaleArtworksRailTestsQuery } from "__generated__/SaleArtworksRailTestsQuery.graphql"
import { renderWithWrappers } from "lib/tests/renderWithWrappers"
import { extractNodes } from "lib/utils/extractNodes"
import React from "react"
import { graphql, QueryRenderer } from "react-relay"
import { createMockEnvironment, MockPayloadGenerator } from "relay-test-utils"
import { SaleArtworksRailContainer } from "../Components/SaleArtworksRail"

jest.unmock("react-relay")

describe("SaleArtworksRail", () => {
  let mockEnvironment: ReturnType<typeof createMockEnvironment>
  const TestRenderer = () => (
    <QueryRenderer<SaleArtworksRailTestsQuery>
      environment={mockEnvironment}
      query={graphql`
        query SaleArtworksRailTestsQuery @relay_test_operation {
          sale(id: "the-sale") {
            saleArtworksConnection(first: 10) {
              edges {
                node {
                  ...SaleArtworksRail_saleArtworks
                }
              }
            }
          }
        }
      `}
      variables={{}}
      render={({ props }) => {
        if (props?.sale) {
          return <SaleArtworksRailContainer saleArtworks={extractNodes(props.sale.saleArtworksConnection)} />
        }
        return null
      }}
    />
  )

  beforeEach(() => {
    mockEnvironment = createMockEnvironment()
  })

  it("Renders list of sale artworks without throwing an error", () => {
    const tree = renderWithWrappers(<TestRenderer />)

    mockEnvironment.mock.resolveMostRecentOperation((operation) =>
      MockPayloadGenerator.generate(operation, {
        Sale: () => ({
          ...saleMock,
        }),
      })
    )

    expect(tree.root.findAllByType(SaleArtworksRailContainer)).toHaveLength(1)
  })
})

const saleArtworkNode = {
  artwork: {
    image: {
      url: "artworkImageUrl",
    },
    href: "/artwork/artwroks-href",
    saleMessage: "Contact For Price",
    artistNames: "Banksy",
    slug: "artwork-slug",
    internalID: Math.random(),
    sale: {
      isAuction: true,
      isClosed: false,
      displayTimelyAt: "register by\n5pm",
      endAt: null,
    },
    saleArtwork: {
      counts: "{bidderPositions: 0}",
      currentBid: '{display: "$650"}',
    },
    partner: {
      name: "Heritage Auctions",
    },
  },
  lotLabel: "1",
}

const saleArtworksConnectionEdges = new Array(10).fill({ node: saleArtworkNode })
const saleMock = {
  sale: {
    saleArtworksConnection: {
      edges: saleArtworksConnectionEdges,
    },
  },
}
