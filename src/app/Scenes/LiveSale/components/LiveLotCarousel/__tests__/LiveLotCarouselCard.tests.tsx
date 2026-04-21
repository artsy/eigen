import { fireEvent, screen } from "@testing-library/react-native"
import { LiveLotCarouselCard } from "app/Scenes/LiveSale/components/LiveLotCarousel/LiveLotCarouselCard"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"
import type {
  ArtworkMetadata,
  DerivedLotState,
  LiveAuctionState,
  LotState,
} from "app/Scenes/LiveSale/types/liveAuction"

jest.mock("../../../hooks/useSpringValue", () => ({
  useSpringValue: (value: number) => {
    const { Value } = require("react-native").Animated
    return new Value(value)
  },
}))

const mockUseLiveAuction = jest.fn()
jest.mock("../../../hooks/useLiveAuction", () => ({
  useLiveAuction: () => mockUseLiveAuction(),
}))

const createMockLot = (derivedOverrides?: Partial<DerivedLotState>): LotState => ({
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
    hasOpenedBidding: true,
    ...derivedOverrides,
  },
})

const createMockAuctionState = (lot: LotState, currentLotId = lot.lotId): LiveAuctionState => ({
  isConnected: true,
  showDisconnectWarning: false,
  currentLotId,
  lots: new Map([[lot.lotId, lot]]),
  isOnHold: false,
  onHoldMessage: null,
  operatorConnected: true,
  pendingBids: new Map(),
  saleName: "Test Sale",
  causalitySaleID: "sale-1",
  jwt: "jwt",
  credentials: { bidderId: "bidder-other", paddleNumber: "42" },
  artworkMetadata: new Map(),
  registrationStatus: "registered",
  currencySymbol: "$",
})

describe("LiveLotCarouselCard", () => {
  const mockOnBidPress = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it("renders lot placeholder when no image", () => {
    const lot = createMockLot()
    mockUseLiveAuction.mockReturnValue(createMockAuctionState(lot))

    renderWithWrappers(
      <LiveLotCarouselCard lot={lot} isFocused={true} onBidPress={mockOnBidPress} />
    )

    expect(screen.getByText("Lot lot-1")).toBeOnTheScreen()
    expect(screen.getByText("No image available")).toBeOnTheScreen()
  })

  it("renders artwork metadata when focused", () => {
    const lot = createMockLot()
    mockUseLiveAuction.mockReturnValue(createMockAuctionState(lot))

    const artworkMetadata: ArtworkMetadata = {
      internalID: "lot-1",
      lotLabel: "1",
      estimate: "$1,000–$2,000",
      lowEstimateCents: 100000,
      highEstimateCents: 200000,
      artwork: {
        title: "Untitled",
        artistNames: "Some Artist",
        image: null,
      },
    }

    renderWithWrappers(
      <LiveLotCarouselCard
        lot={lot}
        artworkMetadata={artworkMetadata}
        isFocused={true}
        onBidPress={mockOnBidPress}
      />
    )

    expect(screen.getByText("Some Artist")).toBeOnTheScreen()
    expect(screen.getByText("Untitled")).toBeOnTheScreen()
    expect(screen.getByText("Estimate: $1,000–$2,000")).toBeOnTheScreen()
  })

  it("does not render lot info when not focused", () => {
    const lot = createMockLot()
    mockUseLiveAuction.mockReturnValue(createMockAuctionState(lot))

    const artworkMetadata: ArtworkMetadata = {
      internalID: "lot-1",
      lotLabel: "1",
      estimate: "$1,000–$2,000",
      lowEstimateCents: 100000,
      highEstimateCents: 200000,
      artwork: { title: "Untitled", artistNames: "Some Artist", image: null },
    }

    renderWithWrappers(
      <LiveLotCarouselCard
        lot={lot}
        artworkMetadata={artworkMetadata}
        isFocused={false}
        onBidPress={mockOnBidPress}
      />
    )

    expect(screen.queryByText("Some Artist")).not.toBeOnTheScreen()
    expect(screen.queryByText("Untitled")).not.toBeOnTheScreen()
  })

  it("shows Bid button label for a biddable lot", () => {
    const lot = createMockLot()
    mockUseLiveAuction.mockReturnValue(createMockAuctionState(lot))

    renderWithWrappers(
      <LiveLotCarouselCard lot={lot} isFocused={true} onBidPress={mockOnBidPress} />
    )

    expect(screen.getByText("Bid $1,000")).toBeOnTheScreen()
  })

  it("shows Sold button label for a sold lot", () => {
    const lot = createMockLot({
      biddingStatus: "Complete",
      soldStatus: "Sold",
      hasOpenedBidding: false,
    })
    mockUseLiveAuction.mockReturnValue(createMockAuctionState(lot, "lot-2"))

    renderWithWrappers(
      <LiveLotCarouselCard lot={lot} isFocused={true} onBidPress={mockOnBidPress} />
    )

    expect(screen.getByText("Sold")).toBeOnTheScreen()
  })

  it("shows Lot Closed button label for a passed lot", () => {
    const lot = createMockLot({
      biddingStatus: "Complete",
      soldStatus: "Passed",
      hasOpenedBidding: false,
    })
    mockUseLiveAuction.mockReturnValue(createMockAuctionState(lot, "lot-2"))

    renderWithWrappers(
      <LiveLotCarouselCard lot={lot} isFocused={true} onBidPress={mockOnBidPress} />
    )

    expect(screen.getByText("Lot Closed")).toBeOnTheScreen()
  })

  it("calls onBidPress with lot ID when bid button is pressed", () => {
    const lot = createMockLot()
    mockUseLiveAuction.mockReturnValue(createMockAuctionState(lot))

    renderWithWrappers(
      <LiveLotCarouselCard lot={lot} isFocused={true} onBidPress={mockOnBidPress} />
    )

    fireEvent.press(screen.getByRole("button"))
    expect(mockOnBidPress).toHaveBeenCalledWith("lot-1")
  })

  it("renders a disabled button for a sold lot", () => {
    const lot = createMockLot({
      biddingStatus: "Complete",
      soldStatus: "Sold",
      hasOpenedBidding: false,
    })
    mockUseLiveAuction.mockReturnValue(createMockAuctionState(lot, "lot-2"))

    renderWithWrappers(
      <LiveLotCarouselCard lot={lot} isFocused={true} onBidPress={mockOnBidPress} />
    )

    expect(screen.getByRole("button")).toBeDisabled()
  })
})
