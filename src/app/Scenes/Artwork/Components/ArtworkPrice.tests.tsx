import { ArtworkPrice_Test_Query } from "__generated__/ArtworkPrice_Test_Query.graphql"
import { AuctionTimerState } from "app/Components/Bidding/Components/Timer"
import { flushPromiseQueue } from "app/tests/flushPromiseQueue"
import { renderWithHookWrappersTL } from "app/tests/renderWithWrappers"
import { resolveMostRecentRelayOperation } from "app/tests/resolveMostRecentRelayOperation"
import { graphql, useLazyLoadQuery } from "react-relay"
import { createMockEnvironment } from "relay-test-utils"
import { ArtworkStoreModel, ArtworkStoreProvider } from "../ArtworkStore"
import { ArtworkPrice } from "./ArtworkPrice"

jest.unmock("react-relay")

interface TestRendererProps {
  initialData?: Partial<ArtworkStoreModel>
}

describe("ArtworkPrice", () => {
  let mockEnvironment: ReturnType<typeof createMockEnvironment>

  beforeEach(() => {
    mockEnvironment = createMockEnvironment()
  })

  const TestRenderer = (props?: TestRendererProps) => {
    const data = useLazyLoadQuery<ArtworkPrice_Test_Query>(
      graphql`
        query ArtworkPrice_Test_Query {
          artwork(id: "artworkID") {
            ...ArtworkPrice_artwork
          }
        }
      `,
      {}
    )

    if (data.artwork) {
      return (
        <ArtworkStoreProvider initialData={props?.initialData}>
          <ArtworkPrice artwork={data.artwork} />
        </ArtworkStoreProvider>
      )
    }

    return null
  }

  describe("Auction bid info", () => {
    it("should be displayed", async () => {
      const { getByLabelText } = renderWithHookWrappersTL(<TestRenderer />, mockEnvironment)

      resolveMostRecentRelayOperation(mockEnvironment, {
        Artwork: () => ({
          isInAuction: true,
        }),
      })
      await flushPromiseQueue()

      expect(getByLabelText("Auction Bid Info")).toBeTruthy()
    })

    it("should NOT be displayed for live sale in progress", async () => {
      const { queryByLabelText } = renderWithHookWrappersTL(
        <TestRenderer initialData={{ auctionState: AuctionTimerState.LIVE_INTEGRATION_ONGOING }} />,
        mockEnvironment
      )

      resolveMostRecentRelayOperation(mockEnvironment, {
        Artwork: () => ({
          isInAuction: true,
        }),
      })
      await flushPromiseQueue()

      expect(queryByLabelText("Auction Bid Info")).toBeNull()
    })
  })

  describe("Exclude shipping and taxes label", () => {
    it("should NOT be displayed", async () => {
      const { queryByText } = renderWithHookWrappersTL(<TestRenderer />, mockEnvironment)

      resolveMostRecentRelayOperation(mockEnvironment, {
        Artwork: () => ({
          isEligibleForOnPlatformTransaction: false,
          isInAuction: false,
          isPriceHidden: false,
        }),
      })
      await flushPromiseQueue()

      expect(queryByText("excl. Shipping and Taxes")).toBeNull()
    })

    it("should NOT be displayed when artworks is in auction", async () => {
      const { queryByText } = renderWithHookWrappersTL(<TestRenderer />, mockEnvironment)

      resolveMostRecentRelayOperation(mockEnvironment, {
        Artwork: () => ({
          isEligibleForOnPlatformTransaction: true,
          isInAuction: true,
          isPriceHidden: false,
        }),
      })
      await flushPromiseQueue()

      expect(queryByText("excl. Shipping and Taxes")).toBeNull()
    })

    it("should NOT be displayed when price is hidden for artwork", async () => {
      const { queryByText } = renderWithHookWrappersTL(<TestRenderer />, mockEnvironment)

      resolveMostRecentRelayOperation(mockEnvironment, {
        Artwork: () => ({
          isEligibleForOnPlatformTransaction: true,
          isInAuction: false,
          isPriceHidden: true,
        }),
      })
      await flushPromiseQueue()

      expect(queryByText("excl. Shipping and Taxes")).toBeNull()
    })

    it("should be displayed when artworks is eligible for on-platform transaction", async () => {
      const { queryByText } = renderWithHookWrappersTL(<TestRenderer />, mockEnvironment)

      resolveMostRecentRelayOperation(mockEnvironment, {
        Artwork: () => ({
          isEligibleForOnPlatformTransaction: true,
          isInAuction: false,
          isPriceHidden: false,
        }),
      })
      await flushPromiseQueue()

      expect(queryByText("excl. Shipping and Taxes")).toBeTruthy()
    })
  })

  it("should render the sale message of the selected edition set", async () => {
    const { queryByText } = renderWithHookWrappersTL(
      <TestRenderer initialData={{ selectedEditionId: "edition-set-one" }} />,
      mockEnvironment
    )

    resolveMostRecentRelayOperation(mockEnvironment, {
      Artwork: () => ({
        isInAuction: false,
        editionSets: [
          {
            internalID: "edition-set-one",
            saleMessage: "$1000",
          },
          {
            internalID: "edition-set-two",
            saleMessage: "$2000",
          },
        ],
      }),
    })
    await flushPromiseQueue()

    expect(queryByText("$1000")).toBeTruthy()
  })

  it("should render the sale message", async () => {
    const { getByText } = renderWithHookWrappersTL(<TestRenderer />, mockEnvironment)

    resolveMostRecentRelayOperation(mockEnvironment, {
      Artwork: () => ({
        isInAuction: false,
        saleMessage: "$1000",
      }),
    })
    await flushPromiseQueue()

    expect(getByText("$1000")).toBeTruthy()
  })

  it("should render availability if the sale message is not available", async () => {
    const { getByText } = renderWithHookWrappersTL(<TestRenderer />, mockEnvironment)

    resolveMostRecentRelayOperation(mockEnvironment, {
      Artwork: () => ({
        isInAuction: false,
        saleMessage: null,
        availability: "for sale",
      }),
    })
    await flushPromiseQueue()

    expect(getByText("For sale")).toBeTruthy()
  })
})
