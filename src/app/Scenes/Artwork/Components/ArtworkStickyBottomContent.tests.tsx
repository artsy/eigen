import { ArtworkStickyBottomContent_Test_Query } from "__generated__/ArtworkStickyBottomContent_Test_Query.graphql"
import { AuctionTimerState } from "app/Components/Bidding/Components/Timer"
import { flushPromiseQueue } from "app/tests/flushPromiseQueue"
import { renderWithHookWrappersTL } from "app/tests/renderWithWrappers"
import { resolveMostRecentRelayOperation } from "app/tests/resolveMostRecentRelayOperation"
import { graphql, useLazyLoadQuery } from "react-relay"
import { createMockEnvironment } from "relay-test-utils"
import { ArtworkStoreModel, ArtworkStoreProvider } from "../ArtworkStore"
import { ArtworkStickyBottomContent } from "./ArtworkStickyBottomContent"

jest.unmock("react-relay")

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
        <ArtworkStoreProvider initialData={props.initialData}>
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
}
