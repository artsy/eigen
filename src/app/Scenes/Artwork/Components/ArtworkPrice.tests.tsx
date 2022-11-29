import { screen } from "@testing-library/react-native"
import { AuctionTimerState } from "app/Components/Bidding/Components/Timer"
import { flushPromiseQueue } from "app/tests/flushPromiseQueue"
import { setupTestWrapperTL } from "app/tests/setupTestWrapper"
import { Theme } from "palette"
import { graphql } from "relay-runtime"
import { ArtworkStoreProvider, ArtworkStoreState } from "../ArtworkStore"
import { ArtworkPrice } from "./ArtworkPrice"

jest.unmock("react-relay")

interface WrapperProps {
  initialData?: Partial<ArtworkStoreState>
}

describe("ArtworkPrice", () => {
  const getWrapper = (props?: WrapperProps) => {
    const { initialData } = props ?? {}

    return setupTestWrapperTL({
      Component: (relayProps) => (
        <Theme>
          <ArtworkStoreProvider initialData={initialData}>
            <ArtworkPrice {...relayProps} />
          </ArtworkStoreProvider>
        </Theme>
      ),
      query: graphql`
        query ArtworkPrice_Test_Query {
          artwork(id: "test-artwork") {
            ...ArtworkPrice_artwork
          }
        }
      `,
    })
  }

  describe("Auction bid info", () => {
    it("should be displayed", async () => {
      const { renderWithRelay } = getWrapper()

      renderWithRelay({
        Artwork: () => ({
          isInAuction: true,
        }),
      })

      await flushPromiseQueue()

      expect(screen.getByLabelText("Auction Bid Info")).toBeTruthy()
    })

    it("should NOT be displayed for live sale in progress", async () => {
      const { renderWithRelay } = getWrapper({
        initialData: {
          auctionState: AuctionTimerState.LIVE_INTEGRATION_ONGOING,
        },
      })

      renderWithRelay({
        Artwork: () => ({
          isInAuction: true,
        }),
      })

      await flushPromiseQueue()

      expect(screen.queryByLabelText("Auction Bid Info")).toBeNull()
    })
  })

  describe("Exclude shipping and taxes label", () => {
    const { renderWithRelay } = getWrapper()

    it("should NOT be displayed", async () => {
      renderWithRelay({
        Artwork: () => ({
          isEligibleForOnPlatformTransaction: false,
          isInAuction: false,
          isPriceHidden: false,
        }),
      })

      await flushPromiseQueue()

      expect(screen.queryByText("excl. Shipping and Taxes")).toBeNull()
    })

    it("should NOT be displayed when artworks is in auction", async () => {
      renderWithRelay({
        Artwork: () => ({
          isEligibleForOnPlatformTransaction: true,
          isInAuction: true,
          isPriceHidden: false,
        }),
      })

      await flushPromiseQueue()

      expect(screen.queryByText("excl. Shipping and Taxes")).toBeNull()
    })

    it("should NOT be displayed when price is hidden for artwork", async () => {
      renderWithRelay({
        Artwork: () => ({
          isEligibleForOnPlatformTransaction: true,
          isInAuction: false,
          isPriceHidden: true,
        }),
      })

      await flushPromiseQueue()

      expect(screen.queryByText("excl. Shipping and Taxes")).toBeNull()
    })

    it("should be displayed when artworks is eligible for on-platform transaction", async () => {
      renderWithRelay({
        Artwork: () => ({
          isEligibleForOnPlatformTransaction: true,
          isInAuction: false,
          isPriceHidden: false,
        }),
      })

      await flushPromiseQueue()

      expect(screen.queryByText("excl. Shipping and Taxes")).toBeTruthy()
    })
  })

  it("should render the sale message of the selected edition set", async () => {
    const { renderWithRelay } = getWrapper({
      initialData: {
        selectedEditionId: "edition-set-one",
      },
    })

    renderWithRelay({
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

    expect(screen.getByText("$1000")).toBeTruthy()
  })

  it("should render the sale message", async () => {
    const { renderWithRelay } = getWrapper()

    renderWithRelay({
      Artwork: () => ({
        isInAuction: false,
        saleMessage: "$1000",
      }),
    })
    await flushPromiseQueue()

    expect(screen.getByText("$1000")).toBeTruthy()
  })

  it("should render availability if the sale message is not available", async () => {
    const { renderWithRelay } = getWrapper()

    renderWithRelay({
      Artwork: () => ({
        isInAuction: false,
        saleMessage: null,
        availability: "for sale",
      }),
    })
    await flushPromiseQueue()

    expect(screen.getByText("For sale")).toBeTruthy()
  })
})
