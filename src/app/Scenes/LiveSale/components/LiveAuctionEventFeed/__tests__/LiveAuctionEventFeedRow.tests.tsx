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
})
