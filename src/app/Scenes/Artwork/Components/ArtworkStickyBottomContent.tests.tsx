import { ArtworkStickyBottomContent_Test_Query } from "__generated__/ArtworkStickyBottomContent_Test_Query.graphql"
import { AuctionTimerState } from "app/Components/Bidding/Components/Timer"
import {
  ArtworkStoreModel,
  ArtworkStoreProvider,
  artworkModel,
} from "app/Scenes/Artwork/ArtworkStore"
import { flushPromiseQueue } from "app/utils/tests/flushPromiseQueue"
import { renderWithHookWrappersTL } from "app/utils/tests/renderWithWrappers"
import { resolveMostRecentRelayOperation } from "app/utils/tests/resolveMostRecentRelayOperation"
import { DateTime } from "luxon"
import { graphql, useLazyLoadQuery } from "react-relay"
import { createMockEnvironment } from "relay-test-utils"
import { ArtworkStickyBottomContent } from "./ArtworkStickyBottomContent"

interface TestRendererProps {
  initialData?: Partial<ArtworkStoreModel>
}

describe("ArtworkStickyBottomContent", () => {
  let mockEnvironment: ReturnType<typeof createMockEnvironment>

  beforeEach(() => {
    mockEnvironment = createMockEnvironment()
  })

  const TestRenderer = (props: TestRendererProps) => {
    const data = useLazyLoadQuery<ArtworkStickyBottomContent_Test_Query>(
      graphql`
        query ArtworkStickyBottomContent_Test_Query {
          artwork(id: "artworkID") {
            ...ArtworkStickyBottomContent_artwork
          }
          me {
            ...ArtworkStickyBottomContent_me
          }
        }
      `,
      {}
    )

    if (data.artwork && data.me) {
      return (
        <ArtworkStoreProvider
          runtimeModel={{
            ...artworkModel,
            ...props.initialData,
          }}
        >
          <ArtworkStickyBottomContent artwork={data.artwork} me={data.me} />
        </ArtworkStoreProvider>
      )
    }

    return null
  }

  it("should NOT be rendered when artwork is NOT for sale", async () => {
    const { queryByLabelText } = renderWithHookWrappersTL(<TestRenderer />, mockEnvironment)

    resolveMostRecentRelayOperation(mockEnvironment, {
      Artwork: () => ({
        ...artwork,
        isForSale: false,
      }),
    })
    await flushPromiseQueue()

    expect(queryByLabelText("Sticky bottom commercial section")).toBeNull()
  })

  it("should NOT be rendered when artwork is sold", async () => {
    const { queryByLabelText } = renderWithHookWrappersTL(<TestRenderer />, mockEnvironment)

    resolveMostRecentRelayOperation(mockEnvironment, {
      Artwork: () => ({
        ...artwork,
        isSold: true,
      }),
    })
    await flushPromiseQueue()

    expect(queryByLabelText("Sticky bottom commercial section")).toBeNull()
  })

  it("should NOT be rendered when auction is closed", async () => {
    const { queryByLabelText } = renderWithHookWrappersTL(
      <TestRenderer initialData={{ auctionState: AuctionTimerState.CLOSED }} />,
      mockEnvironment
    )

    resolveMostRecentRelayOperation(mockEnvironment, {
      Artwork: () => artwork,
    })
    await flushPromiseQueue()

    expect(queryByLabelText("Sticky bottom commercial section")).toBeNull()
  })

  it("should NOT be rendered when lot is ended", async () => {
    const { queryByLabelText } = renderWithHookWrappersTL(
      <TestRenderer initialData={{ auctionState: AuctionTimerState.CLOSING }} />,
      mockEnvironment
    )

    resolveMostRecentRelayOperation(mockEnvironment, {
      Artwork: () => ({
        ...artwork,
        saleArtwork: {
          ...artwork.saleArtwork,
          endAt: DateTime.now().minus({ day: 1 }).toISO(),
        },
      }),
    })
    await flushPromiseQueue()

    expect(queryByLabelText("Sticky bottom commercial section")).toBeNull()
  })

  it("should NOT be rendered when extended lot is ended", async () => {
    const { queryByLabelText } = renderWithHookWrappersTL(
      <TestRenderer initialData={{ auctionState: AuctionTimerState.CLOSING }} />,
      mockEnvironment
    )

    resolveMostRecentRelayOperation(mockEnvironment, {
      Artwork: () => ({
        ...artwork,
        saleArtwork: {
          ...artwork.saleArtwork,
          endAt: DateTime.now().minus({ minutes: 20 }).toISO(),
          extendedBiddingEndAt: DateTime.now().minus({ minutes: 5 }).toISO(),
        },
      }),
    })
    await flushPromiseQueue()

    expect(queryByLabelText("Sticky bottom commercial section")).toBeNull()
  })

  it("should be rendered", async () => {
    const { queryByLabelText } = renderWithHookWrappersTL(<TestRenderer />, mockEnvironment)

    resolveMostRecentRelayOperation(mockEnvironment, {
      Artwork: () => artwork,
    })
    await flushPromiseQueue()

    expect(queryByLabelText("Sticky bottom commercial section")).toBeTruthy()
  })
})

const artwork = {
  isForSale: true,
  isSold: false,
  saleArtwork: {
    extendedBiddingEndAt: null,
    endAt: null,
  },
}
