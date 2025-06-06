import { SaleArtworkTileRailCardTestsQuery } from "__generated__/SaleArtworkTileRailCardTestsQuery.graphql"
import { extractText } from "app/utils/tests/extractText"
import { renderWithWrappersLEGACY } from "app/utils/tests/renderWithWrappers"
import { resolveMostRecentRelayOperation } from "app/utils/tests/resolveMostRecentRelayOperation"
import { graphql, QueryRenderer } from "react-relay"
import { createMockEnvironment } from "relay-test-utils"
import { CONTAINER_HEIGHT, SaleArtworkTileRailCardContainer } from ".."

interface TestRendererProps {
  useCustomSaleMessage?: boolean
  useSquareAspectRatio?: boolean
}

describe("SaleArtworkTileRailCard", () => {
  let mockEnvironment: ReturnType<typeof createMockEnvironment>
  const TestRenderer = ({
    useCustomSaleMessage = false,
    useSquareAspectRatio = false,
  }: TestRendererProps) => (
    <QueryRenderer<SaleArtworkTileRailCardTestsQuery>
      environment={mockEnvironment}
      query={graphql`
        query SaleArtworkTileRailCardTestsQuery @relay_test_operation {
          saleArtwork(id: "the-sale") {
            ...SaleArtworkTileRailCard_saleArtwork
          }
        }
      `}
      variables={{}}
      render={({ props }) => {
        if (props?.saleArtwork) {
          return (
            <SaleArtworkTileRailCardContainer
              saleArtwork={props.saleArtwork}
              onPress={() => {
                console.log("do something")
              }}
              useSquareAspectRatio={useSquareAspectRatio}
              useCustomSaleMessage={useCustomSaleMessage}
            />
          )
        }
        return null
      }}
    />
  )

  beforeEach(() => {
    mockEnvironment = createMockEnvironment()
  })

  it("renders sale artwork without throwing an error", () => {
    const tree = renderWithWrappersLEGACY(<TestRenderer />)

    resolveMostRecentRelayOperation(mockEnvironment, mockProps)

    // Render the sale artwork fields
    expect(extractText(tree.root)).toContain("Banksy")
    expect(extractText(tree.root)).toContain("Lot 66002")
    expect(extractText(tree.root)).toContain("Captain America")

    // Render the sale artwork image while mainting the correct aspect ratio
    const image = tree.root.findByProps({ testID: "sale-artwork-image" })
    expect(image.props.height).toBe(CONTAINER_HEIGHT)
    expect(image.props.width).toBe(CONTAINER_HEIGHT * 0.75) // The mock image aspect ratio is 0.75
  })

  it("renders custom sale artwork message when useCustomSaleMessage is set to true", () => {
    const tree = renderWithWrappersLEGACY(<TestRenderer useCustomSaleMessage />)

    resolveMostRecentRelayOperation(mockEnvironment, mockProps)
    expect(extractText(tree.root)).toContain("(14 bids)")
  })

  it("renders square image when useSquareAspectRatio is set to true ", () => {
    const tree = renderWithWrappersLEGACY(<TestRenderer useSquareAspectRatio />)

    resolveMostRecentRelayOperation(mockEnvironment, mockProps)

    const image = tree.root.findByProps({ testID: "sale-artwork-image" })
    expect(image.props.height).toBe(CONTAINER_HEIGHT)
    expect(image.props.width).toBe(CONTAINER_HEIGHT)
  })
})

const mockProps = {
  SaleArtwork: () => ({
    artwork: {
      artistNames: "Banksy",
      date: "2018",
      href: "/artwork/href",
      image: {
        imageURL: "imageURL",
        aspectRatio: 0.75,
      },
      internalID: "internalID",
      slug: "artwork slug",
      saleMessage: null,
      title: "Captain America",
      realizedPrice: null,
    },
    counts: {
      bidderPositions: 14,
    },
    currentBid: {
      display: "$1,100",
    },
    lotLabel: "66002",
    sale: {
      isAuction: true,
      isClosed: false,
      displayTimelyAt: null,
    },
  }),
}
