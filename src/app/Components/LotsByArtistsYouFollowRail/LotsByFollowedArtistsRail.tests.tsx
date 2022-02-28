import { LotsByFollowedArtistsRailTestsQuery } from "__generated__/LotsByFollowedArtistsRailTestsQuery.graphql"
import { SaleArtworkTileRailCardContainer } from "app/Components/SaleArtworkTileRailCard"
import { SectionTitle } from "app/Components/SectionTitle"
import { flushPromiseQueue } from "app/tests/flushPromiseQueue"
import { mockEnvironmentPayload } from "app/tests/mockEnvironmentPayload"
import { renderWithWrappers } from "app/tests/renderWithWrappers"
import React from "react"
import { graphql, QueryRenderer } from "react-relay"
import { createMockEnvironment } from "relay-test-utils"
import { LotsByFollowedArtistsRailContainer, PAGE_SIZE } from "./LotsByFollowedArtistsRail"

jest.unmock("react-relay")

describe("LotsByFollowedArtistsRail", () => {
  let mockEnvironment: ReturnType<typeof createMockEnvironment>

  const TestRenderer = () => (
    <QueryRenderer<LotsByFollowedArtistsRailTestsQuery>
      environment={mockEnvironment}
      query={graphql`
        query LotsByFollowedArtistsRailTestsQuery @relay_test_operation {
          me {
            ...LotsByFollowedArtistsRail_me
          }
        }
      `}
      variables={{}}
      render={({ props }) => {
        if (props?.me) {
          return <LotsByFollowedArtistsRailContainer title="Auctions" me={props.me} />
        }
        return null
      }}
    />
  )

  beforeEach(() => {
    mockEnvironment = createMockEnvironment()
  })

  it("Renders list of sale artworks without throwing an error", async () => {
    const tree = renderWithWrappers(<TestRenderer />)

    mockEnvironmentPayload(mockEnvironment, mockProps)
    await flushPromiseQueue()

    expect(tree.root.findAllByType(SectionTitle)[0].props.title).toEqual("Auctions")
    expect(tree.root.findAllByType(SaleArtworkTileRailCardContainer)).toHaveLength(PAGE_SIZE)
  })

  it("returns null if there are no artworks", async () => {
    const tree = renderWithWrappers(<TestRenderer />)

    const noArtworksProps = {
      Me: () => ({
        lotsByFollowedArtistsConnection: {
          edges: [],
        },
      }),
    }
    mockEnvironmentPayload(mockEnvironment, noArtworksProps)
    await flushPromiseQueue()
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
