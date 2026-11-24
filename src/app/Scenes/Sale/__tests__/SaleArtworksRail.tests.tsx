import { screen } from "@testing-library/react-native"
import { SaleArtworksRailTestsQuery } from "__generated__/SaleArtworksRailTestsQuery.graphql"
import {
  INITIAL_NUMBER_TO_RENDER,
  SaleArtworksRailContainer,
} from "app/Scenes/Sale/Components/SaleArtworksRail"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"
import { resolveMostRecentRelayOperation } from "app/utils/tests/resolveMostRecentRelayOperation"
import { graphql, QueryRenderer } from "react-relay"
import { createMockEnvironment } from "relay-test-utils"

describe("SaleArtworksRail", () => {
  let mockEnvironment: ReturnType<typeof createMockEnvironment>

  const TestRenderer = () => (
    <QueryRenderer<SaleArtworksRailTestsQuery>
      environment={mockEnvironment}
      query={graphql`
        query SaleArtworksRailTestsQuery($saleID: ID) @relay_test_operation {
          me {
            ...SaleArtworksRail_me @arguments(saleID: $saleID)
          }
        }
      `}
      variables={{ saleID: "sale-id" }}
      render={({ props }) => {
        if (props?.me) {
          return <SaleArtworksRailContainer me={props.me} />
        }
        return null
      }}
    />
  )

  beforeEach(() => {
    mockEnvironment = createMockEnvironment()
  })

  it("Renders list of sale artworks without throwing an error", async () => {
    await renderWithWrappers(<TestRenderer />)

    await resolveMostRecentRelayOperation(mockEnvironment, mockProps)

    expect(screen.getByText("Lots by Artists You Follow")).toBeOnTheScreen()
    // Each rendered SaleArtworkTileRailCard shows the artist name once
    expect(screen.getAllByText("Banksy")).toHaveLength(INITIAL_NUMBER_TO_RENDER)
  })

  it("returns null if there are no artworks", async () => {
    await renderWithWrappers(<TestRenderer />)

    const noArtworksProps = {
      Me: () => ({
        lotsByFollowedArtistsConnection: {
          edges: [],
        },
      }),
    }
    await resolveMostRecentRelayOperation(mockEnvironment, noArtworksProps)
    expect(screen.queryByText("Lots by Artists You Follow")).not.toBeOnTheScreen()
    expect(screen.queryAllByText("Banksy")).toHaveLength(0)
  })
})

const saleArtworkNode = {
  artwork: {
    image: {
      url: "artworkImageUrl",
    },
    href: "/artwork/artwroks-href",
    saleMessage: "Price on request",
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
