import { screen } from "@testing-library/react-native"
import { LiveAuctionEventFeedRow } from "app/Scenes/LiveSale/components/LiveAuctionEventFeed/LiveAuctionEventFeedRow"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"
import type { LiveAuctionFeedEvent } from "app/Scenes/LiveSale/types/liveAuction"

const makeEvent = (overrides: Partial<LiveAuctionFeedEvent> = {}): LiveAuctionFeedEvent => ({
  id: "e1",
  kind: "bid",
  title: "YOU",
  subtitle: "$1,000",
  isMine: true,
  isTopBid: true,
  isCancelled: false,
  isPending: false,
  createdAt: "2024-01-01T00:00:00Z",
  ...overrides,
})

describe("LiveAuctionEventFeedRow", () => {
  it("renders title and subtitle", () => {
    renderWithWrappers(<LiveAuctionEventFeedRow event={makeEvent()} />)
    expect(screen.getByText("YOU")).toBeOnTheScreen()
    expect(screen.getByText("$1,000")).toBeOnTheScreen()
  })

  it("does not render subtitle when null", () => {
    renderWithWrappers(<LiveAuctionEventFeedRow event={makeEvent({ subtitle: null })} />)
    expect(screen.queryByText("$1,000")).not.toBeOnTheScreen()
  })

  it("renders lotOpen event title", () => {
    renderWithWrappers(
      <LiveAuctionEventFeedRow
        event={makeEvent({ kind: "lotOpen", title: "LOT OPEN FOR BIDDING", subtitle: null })}
      />
    )
    expect(screen.getByText("LOT OPEN FOR BIDDING")).toBeOnTheScreen()
  })

  it("renders finalCall event title", () => {
    renderWithWrappers(
      <LiveAuctionEventFeedRow
        event={makeEvent({ kind: "finalCall", title: "FINAL CALL", subtitle: null })}
      />
    )
    expect(screen.getByText("FINAL CALL")).toBeOnTheScreen()
  })

  it("renders warning event title", () => {
    renderWithWrappers(
      <LiveAuctionEventFeedRow
        event={makeEvent({ kind: "warning", title: "WARNING", subtitle: null })}
      />
    )
    expect(screen.getByText("WARNING")).toBeOnTheScreen()
  })

  it("renders closed event title", () => {
    renderWithWrappers(
      <LiveAuctionEventFeedRow
        event={makeEvent({ kind: "closed", title: "SOLD", subtitle: null })}
      />
    )
    expect(screen.getByText("SOLD")).toBeOnTheScreen()
  })

  it("renders cancelled event with line-through text decoration", () => {
    renderWithWrappers(<LiveAuctionEventFeedRow event={makeEvent({ isCancelled: true })} />)
    const title = screen.getByText("YOU")
    expect(title.props.style).toEqual(
      expect.arrayContaining([expect.objectContaining({ textDecorationLine: "line-through" })])
    )
  })

  it("does not apply line-through for non-cancelled event", () => {
    renderWithWrappers(<LiveAuctionEventFeedRow event={makeEvent({ isCancelled: false })} />)
    const title = screen.getByText("YOU")
    const flatStyle = [title.props.style].flat()
    expect(flatStyle).not.toEqual(
      expect.arrayContaining([expect.objectContaining({ textDecorationLine: "line-through" })])
    )
  })

  describe("bid row colors match Swift colorForBidStatus", () => {
    // useColor() resolves palette tokens to hex in the test environment
    const GRAY = "#707070" // mono60
    const RED = "#D71023" // red100

    it("my winning bid is gray (mono60), not black", () => {
      renderWithWrappers(
        <LiveAuctionEventFeedRow event={makeEvent({ isMine: true, isTopBid: true })} />
      )
      expect(screen.getByText("YOU").props.color).toBe(GRAY)
    })

    it("my outbid row is red", () => {
      renderWithWrappers(
        <LiveAuctionEventFeedRow event={makeEvent({ isMine: true, isTopBid: false })} />
      )
      expect(screen.getByText("YOU").props.color).toBe(RED)
    })

    it("cancelled bid is gray regardless of top-bid status", () => {
      renderWithWrappers(
        <LiveAuctionEventFeedRow event={makeEvent({ isCancelled: true, isTopBid: true })} />
      )
      expect(screen.getByText("YOU").props.color).toBe(GRAY)
    })

    it("pending bid is gray", () => {
      renderWithWrappers(
        <LiveAuctionEventFeedRow event={makeEvent({ isPending: true, isTopBid: true })} />
      )
      expect(screen.getByText("YOU").props.color).toBe(GRAY)
    })
  })

  describe("non-bid event colors are unaffected by cancelled state", () => {
    const YELLOW = "#E2B929" // yellow100
    const ORANGE = "#DA6722" // orange100

    it("cancelled warning row keeps yellow color", () => {
      renderWithWrappers(
        <LiveAuctionEventFeedRow
          event={makeEvent({
            kind: "warning",
            title: "WARNING",
            subtitle: null,
            isCancelled: true,
          })}
        />
      )
      expect(screen.getByText("WARNING").props.color).toBe(YELLOW)
    })

    it("cancelled finalCall row keeps orange color", () => {
      renderWithWrappers(
        <LiveAuctionEventFeedRow
          event={makeEvent({
            kind: "finalCall",
            title: "FINAL CALL",
            subtitle: null,
            isCancelled: true,
          })}
        />
      )
      expect(screen.getByText("FINAL CALL").props.color).toBe(ORANGE)
    })

    it("cancelled lotOpen row keeps blue color", () => {
      renderWithWrappers(
        <LiveAuctionEventFeedRow
          event={makeEvent({
            kind: "lotOpen",
            title: "LOT OPEN FOR BIDDING",
            subtitle: null,
            isCancelled: true,
          })}
        />
      )
      expect(screen.getByText("LOT OPEN FOR BIDDING").props.color).toBe("#1023D7")
    })
  })
})
