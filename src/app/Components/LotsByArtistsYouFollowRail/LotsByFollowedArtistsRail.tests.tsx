import { LotsByFollowedArtistsRailTestsQuery } from "__generated__/LotsByFollowedArtistsRailTestsQuery.graphql"
import { SaleArtworkTileRailCardContainer } from "app/Components/SaleArtworkTileRailCard"
import { SectionTitle } from "app/Components/SectionTitle"
import { getRelayEnvironment } from "app/relay/defaultEnvironment"
import { flushPromiseQueue } from "app/tests/flushPromiseQueue"
import { renderWithWrappersLEGACY } from "app/tests/renderWithWrappers"
import { resolveMostRecentRelayOperation } from "app/tests/resolveMostRecentRelayOperation"
import { graphql, QueryRenderer } from "react-relay"
import { LotsByFollowedArtistsRailContainer, PAGE_SIZE } from "./LotsByFollowedArtistsRail"

describe("LotsByFollowedArtistsRail", () => {
  const TestRenderer = () => (
    <QueryRenderer<LotsByFollowedArtistsRailTestsQuery>
      environment={getRelayEnvironment()}
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

  it("Renders list of sale artworks without throwing an error", async () => {
    const tree = renderWithWrappersLEGACY(<TestRenderer />)

    resolveMostRecentRelayOperation(mockProps)
    await flushPromiseQueue()

    expect(tree.root.findAllByType(SectionTitle)[0].props.title).toEqual("Auctions")
    expect(tree.root.findAllByType(SaleArtworkTileRailCardContainer)).toHaveLength(PAGE_SIZE)
  })

  it("returns null if there are no artworks", async () => {
    const tree = renderWithWrappersLEGACY(<TestRenderer />)

    const noArtworksProps = {
      Me: () => ({
        lotsByFollowedArtistsConnection: {
          edges: [],
        },
      }),
    }
    resolveMostRecentRelayOperation(noArtworksProps)
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
