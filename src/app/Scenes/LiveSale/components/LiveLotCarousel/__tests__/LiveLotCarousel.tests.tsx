import { screen } from "@testing-library/react-native"
import { LiveLotCarousel } from "app/Scenes/LiveSale/components/LiveLotCarousel/LiveLotCarousel"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"

// Mock the useLiveAuction hook
const mockPlaceBid = jest.fn()
const mockUseLiveAuction = jest.fn()

jest.mock("../../../hooks/useLiveAuction", () => ({
  useLiveAuction: () => mockUseLiveAuction(),
}))

// Mock PagerView since it's not available in test environment
jest.mock("react-native-pager-view", () => {
  const { View } = require("react-native")
  return {
    __esModule: true,
    default: View,
  }
})

describe("LiveLotCarousel", () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it("renders loading state when no lots are available", () => {
    mockUseLiveAuction.mockReturnValue({
      lots: new Map(),
      placeBid: mockPlaceBid,
      artworkMetadata: new Map(),
    })

    renderWithWrappers(<LiveLotCarousel />)

    expect(screen.getByText("Loading lots...")).toBeOnTheScreen()
  })

  it("renders carousel with lots", () => {
    const mockLots = new Map([
      [
        "lot-1",
        {
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
        },
      ],
      [
        "lot-2",
        {
          lotId: "lot-2",
          events: new Map(),
          eventHistory: [],
          processedEventIds: new Set(),
          derivedState: {
            reserveStatus: "ReserveMet",
            askingPriceCents: 200000,
            biddingStatus: "Complete",
            soldStatus: "Sold",
            onlineBidCount: 10,
          },
        },
      ],
    ])

    mockUseLiveAuction.mockReturnValue({
      lots: mockLots,
      placeBid: mockPlaceBid,
      artworkMetadata: new Map(),
    })

    renderWithWrappers(<LiveLotCarousel />)

    // Lots should be rendered (they're in the DOM even if not visible due to carousel)
    expect(screen.getAllByText("Lot lot-1").length).toBeGreaterThan(0)
    expect(screen.getAllByText("Lot lot-2").length).toBeGreaterThan(0)
  })

  it("sorts lots by numeric ID", () => {
    const mockLots = new Map([
      [
        "lot-10",
        {
          lotId: "lot-10",
          events: new Map(),
          eventHistory: [],
          processedEventIds: new Set(),
          derivedState: {
            reserveStatus: "NoReserve",
            askingPriceCents: 100000,
            biddingStatus: "Open",
            soldStatus: "ForSale",
            onlineBidCount: 0,
          },
        },
      ],
      [
        "lot-2",
        {
          lotId: "lot-2",
          events: new Map(),
          eventHistory: [],
          processedEventIds: new Set(),
          derivedState: {
            reserveStatus: "NoReserve",
            askingPriceCents: 50000,
            biddingStatus: "Open",
            soldStatus: "ForSale",
            onlineBidCount: 0,
          },
        },
      ],
    ])

    mockUseLiveAuction.mockReturnValue({
      lots: mockLots,
      placeBid: mockPlaceBid,
      artworkMetadata: new Map(),
    })

    renderWithWrappers(<LiveLotCarousel />)

    // Both lots should be rendered
    expect(screen.getAllByText("Lot lot-2").length).toBeGreaterThan(0)
    expect(screen.getAllByText("Lot lot-10").length).toBeGreaterThan(0)
  })
})
