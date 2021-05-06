import { SaleArtworksHomeRailTestsQuery } from "__generated__/SaleArtworksHomeRailTestsQuery.graphql"
import { SaleArtworkTileRailCardContainer } from "lib/Components/SaleArtworkTileRailCard"
import { SectionTitle } from "lib/Components/SectionTitle"
import { mockEnvironmentPayload } from "lib/tests/mockEnvironmentPayload"
import { renderWithWrappers } from "lib/tests/renderWithWrappers"
import React from "react"
import { graphql, QueryRenderer } from "react-relay"
import { createMockEnvironment } from "relay-test-utils"
import { PAGE_SIZE, SaleArtworksHomeRailContainer } from "..//SaleArtworksHomeRail"

jest.unmock("react-relay")

describe("SaleArtworksHomeRail", () => {
  let mockEnvironment: ReturnType<typeof createMockEnvironment>

  const TestRenderer = () => (
    <QueryRenderer<SaleArtworksHomeRailTestsQuery>
      environment={mockEnvironment}
      query={graphql`
        query SaleArtworksHomeRailTestsQuery @relay_test_operation {
          me {
            ...SaleArtworksHomeRail_me
          }
        }
      `}
      variables={{}}
      render={({ props }) => {
        if (props?.me) {
          return <SaleArtworksHomeRailContainer me={props.me} />
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

    mockEnvironmentPayload(mockEnvironment, mockProps)

    expect(tree.root.findAllByType(SectionTitle)[0].props.title).toEqual("Lots by artists you follow")
    expect(tree.root.findAllByType(SaleArtworkTileRailCardContainer)).toHaveLength(PAGE_SIZE)
  })

  it("returns null if there are no artworks", () => {
    const tree = renderWithWrappers(<TestRenderer />)

    const noArtworksProps = {
      Me: () => ({
        lotsByFollowedArtistsConnection: {
          edges: [],
        },
      }),
    }
    mockEnvironmentPayload(mockEnvironment, noArtworksProps)
    // React-test-renderer has no isEmptyComponent or isNullComponent therefore I am testing for the container
    // expect(tree.root.findAllByType(Flex)).toHaveLength(0)
    expect(tree.toJSON()).toBeNull()
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
    internalID: "Internal-ID",
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

const saleArtworksConnectionEdges = new Array(10).fill({
  node: {
    saleArtwork: saleArtworkNode,
    id: saleArtworkNode.artwork.internalID,
    href: saleArtworkNode.artwork.href,
  },
})

const mockProps = {
  Me: () => ({
    lotsByFollowedArtistsConnection: {
      edges: saleArtworksConnectionEdges,
    },
  }),
}
