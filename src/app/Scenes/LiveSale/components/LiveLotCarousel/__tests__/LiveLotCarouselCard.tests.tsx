import { fireEvent, screen } from "@testing-library/react-native"
import { LiveLotCarouselCard } from "app/Scenes/LiveSale/components/LiveLotCarousel/LiveLotCarouselCard"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"
import type { LotState } from "app/Scenes/LiveSale/types/liveAuction"

// Mock the animation hooks
jest.mock("../../../hooks/useSpringValue", () => ({
  useSpringValue: (value: number) => {
    const { Value } = require("react-native").Animated
    return new Value(value)
  },
}))

describe("LiveLotCarouselCard", () => {
  const mockOnBidPress = jest.fn()

  const createMockLot = (overrides?: Partial<LotState>): LotState => ({
    lotId: "lot-1",
    events: new Map(),
    eventHistory: [],
    processedEventIds: new Set(),
    derivedState: {
      reserveStatus: "NoReserve",
      askingPriceCents: 100000,
      biddingStatus: "Open",
      soldStatus: "ForSale",
      onlineBidCount: 5,
    },
    ...overrides,
  })

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it("renders lot placeholder image with lot ID", () => {
    const lot = createMockLot()

    renderWithWrappers(
      <LiveLotCarouselCard lot={lot} isFocused={true} onBidPress={mockOnBidPress} />
    )

    // "Lot lot-1" appears in both the placeholder and the lot info section
    expect(screen.getAllByText("Lot lot-1").length).toBeGreaterThan(0)
    expect(screen.getByText("No image available")).toBeOnTheScreen()
  })

  it("renders lot info when focused", () => {
    const lot = createMockLot()

    renderWithWrappers(
      <LiveLotCarouselCard lot={lot} isFocused={true} onBidPress={mockOnBidPress} />
    )

    expect(screen.getByText("Current Ask")).toBeOnTheScreen()
    expect(screen.getByText("$1,000")).toBeOnTheScreen()
    expect(screen.getByText("Open")).toBeOnTheScreen()
    expect(screen.getByText("Reserve: NoReserve")).toBeOnTheScreen()
    expect(screen.getByText("5 online bids")).toBeOnTheScreen()
  })

  it("does not render lot info when not focused", () => {
    const lot = createMockLot()

    renderWithWrappers(
      <LiveLotCarouselCard lot={lot} isFocused={false} onBidPress={mockOnBidPress} />
    )

    expect(screen.queryByText("Current Ask")).not.toBeOnTheScreen()
    expect(screen.queryByText("$1,000")).not.toBeOnTheScreen()
  })

  it("displays 'Place Bid' button when bidding is open", () => {
    const lot = createMockLot()

    renderWithWrappers(
      <LiveLotCarouselCard lot={lot} isFocused={true} onBidPress={mockOnBidPress} />
    )

    const button = screen.getByText("Place Bid")
    expect(button).toBeOnTheScreen()
  })

  it("displays 'Sold' button when lot is sold", () => {
    const lot = createMockLot({
      derivedState: {
        reserveStatus: "ReserveMet",
        askingPriceCents: 100000,
        biddingStatus: "Complete",
        soldStatus: "Sold",
        onlineBidCount: 10,
      },
    })

    renderWithWrappers(
      <LiveLotCarouselCard lot={lot} isFocused={true} onBidPress={mockOnBidPress} />
    )

    // "Sold" appears in both the button and status badge
    expect(screen.getAllByText("Sold").length).toBeGreaterThan(0)
  })

  it("displays 'Passed' button when lot is passed", () => {
    const lot = createMockLot({
      derivedState: {
        reserveStatus: "ReserveNotMet",
        askingPriceCents: 100000,
        biddingStatus: "Complete",
        soldStatus: "Passed",
        onlineBidCount: 2,
      },
    })

    renderWithWrappers(
      <LiveLotCarouselCard lot={lot} isFocused={true} onBidPress={mockOnBidPress} />
    )

    // "Passed" appears in both the button and status badge
    expect(screen.getAllByText("Passed").length).toBeGreaterThan(0)
  })

  it("calls onBidPress when bid button is pressed", () => {
    const lot = createMockLot()

    renderWithWrappers(
      <LiveLotCarouselCard lot={lot} isFocused={true} onBidPress={mockOnBidPress} />
    )

    fireEvent.press(screen.getByText("Place Bid"))

    expect(mockOnBidPress).toHaveBeenCalledWith("lot-1")
  })

  it("disables bid button when bidding is complete", () => {
    const lot = createMockLot({
      derivedState: {
        reserveStatus: "ReserveMet",
        askingPriceCents: 100000,
        biddingStatus: "Complete",
        soldStatus: "Sold",
        onlineBidCount: 10,
      },
    })

    renderWithWrappers(
      <LiveLotCarouselCard lot={lot} isFocused={true} onBidPress={mockOnBidPress} />
    )

    // The button should be disabled when bidding is complete
    const button = screen.getByRole("button")
    expect(button).toBeDisabled()
  })

  it("formats price correctly", () => {
    const lot = createMockLot({
      derivedState: {
        reserveStatus: "NoReserve",
        askingPriceCents: 1234567,
        biddingStatus: "Open",
        soldStatus: "ForSale",
        onlineBidCount: 5,
      },
    })

    renderWithWrappers(
      <LiveLotCarouselCard lot={lot} isFocused={true} onBidPress={mockOnBidPress} />
    )

    expect(screen.getByText("$12,345.67")).toBeOnTheScreen()
  })

  it("shows singular 'bid' for one online bid", () => {
    const lot = createMockLot({
      derivedState: {
        reserveStatus: "NoReserve",
        askingPriceCents: 100000,
        biddingStatus: "Open",
        soldStatus: "ForSale",
        onlineBidCount: 1,
      },
    })

    renderWithWrappers(
      <LiveLotCarouselCard lot={lot} isFocused={true} onBidPress={mockOnBidPress} />
    )

    expect(screen.getByText("1 online bid")).toBeOnTheScreen()
  })

  it("shows plural 'bids' for multiple online bids", () => {
    const lot = createMockLot({
      derivedState: {
        reserveStatus: "NoReserve",
        askingPriceCents: 100000,
        biddingStatus: "Open",
        soldStatus: "ForSale",
        onlineBidCount: 5,
      },
    })

    renderWithWrappers(
      <LiveLotCarouselCard lot={lot} isFocused={true} onBidPress={mockOnBidPress} />
    )

    expect(screen.getByText("5 online bids")).toBeOnTheScreen()
  })

  it("displays sold status badge with correct styling", () => {
    const lot = createMockLot({
      derivedState: {
        reserveStatus: "ReserveMet",
        askingPriceCents: 100000,
        biddingStatus: "Complete",
        soldStatus: "Sold",
        onlineBidCount: 10,
      },
    })

    renderWithWrappers(
      <LiveLotCarouselCard lot={lot} isFocused={true} onBidPress={mockOnBidPress} />
    )

    // Verify the status badge and button are both present
    const soldElements = screen.getAllByText("Sold")
    expect(soldElements.length).toBe(2) // One in badge, one in button
  })

  it("displays passed status badge with correct styling", () => {
    const lot = createMockLot({
      derivedState: {
        reserveStatus: "ReserveNotMet",
        askingPriceCents: 100000,
        biddingStatus: "Complete",
        soldStatus: "Passed",
        onlineBidCount: 2,
      },
    })

    renderWithWrappers(
      <LiveLotCarouselCard lot={lot} isFocused={true} onBidPress={mockOnBidPress} />
    )

    // Verify the status badge and button are both present
    const passedElements = screen.getAllByText("Passed")
    expect(passedElements.length).toBe(2) // One in badge, one in button
  })
})
