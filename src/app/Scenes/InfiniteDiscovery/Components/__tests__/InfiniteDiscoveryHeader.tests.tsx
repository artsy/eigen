import { fireEvent, screen } from "@testing-library/react-native"
import { InfiniteDiscoveryHeader } from "app/Scenes/InfiniteDiscovery/Components/InfiniteDiscoveryHeader"
import { InfiniteDiscoveryArtwork } from "app/Scenes/InfiniteDiscovery/InfiniteDiscovery"
import { GlobalStore, __globalStoreTestUtils__ } from "app/store/GlobalStore"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"
import RNShare from "react-native-share"

const mockGoBack = jest.fn()
const mockNavigate = jest.fn()

jest.mock("app/system/navigation/navigate", () => ({
  goBack: mockGoBack,
  navigate: mockNavigate,
}))

jest.mock("react-native-share", () => ({
  open: jest.fn(),
}))

const mockAddListener = jest.fn((event, callback) => {
  if (event === "beforeRemove") {
    ;(mockAddListener as any).beforeRemoveCallback = callback
  }
  return jest.fn()
})

jest.mock("@react-navigation/native", () => {
  const actualNav = jest.requireActual("@react-navigation/native")
  return {
    ...actualNav,
    useNavigation: () => ({
      addListener: mockAddListener,
    }),
  }
})

const mockUseToast = {
  show: jest.fn(),
}

jest.mock("app/Components/Toast/toastHook", () => ({
  useToast: () => mockUseToast,
}))

const mockTrack = {
  tappedExit: jest.fn(),
  tappedSummary: jest.fn(),
  tappedShare: jest.fn(),
  tappedMore: jest.fn(),
  share: jest.fn(),
}

jest.mock("app/Scenes/InfiniteDiscovery/hooks/useInfiniteDiscoveryTracking", () => ({
  useInfiniteDiscoveryTracking: () => mockTrack,
}))

describe("InfiniteDiscoveryHeader", () => {
  const mockTopArtwork: InfiniteDiscoveryArtwork = {
    slug: "test-artwork",
    title: "Test Artwork",
    internalID: "artwork-id",
    href: "/artwork/test-artwork",
    artistNames: "Test Artist",
    date: "2023",
    saleMessage: "$1,000",
    image: {
      url: "https://example.com/image.jpg",
      aspectRatio: 1.33,
      width: 800,
      height: 600,
      blurhash: "LGFFaS%2IV00%MRjMxRj",
    },
    artists: [{ internalID: "artist-id" }],
  } as any

  beforeEach(() => {
    jest.clearAllMocks()
    ;(mockAddListener as any).beforeRemoveCallback = undefined
    GlobalStore.actions.infiniteDiscovery.resetSavedArtworksCount()
    __globalStoreTestUtils__?.injectFeatureFlags({ AREnabledDiscoverDailyNegativeSignals: false })
    ;(RNShare.open as jest.Mock).mockResolvedValue({ success: true, message: "shared" })
  })

  it("renders more button when topArtwork has required data", () => {
    renderWithWrappers(<InfiniteDiscoveryHeader topArtwork={mockTopArtwork} />)

    const moreButton = screen.getByTestId("top-right-icon")
    expect(moreButton).toBeOnTheScreen()
    expect(moreButton).toHaveAccessibleName("Share Artwork")
  })

  it("shows toast when exiting with saved artworks", () => {
    GlobalStore.actions.infiniteDiscovery.incrementSavedArtworksCount()
    GlobalStore.actions.infiniteDiscovery.incrementSavedArtworksCount()
    GlobalStore.actions.infiniteDiscovery.incrementSavedArtworksCount()
    renderWithWrappers(<InfiniteDiscoveryHeader topArtwork={mockTopArtwork} />)

    // Simulate the navigation beforeRemove event that triggers the toast
    ;(mockAddListener as any).beforeRemoveCallback()

    expect(mockUseToast.show).toHaveBeenCalledWith(
      "Nice! You saved 3 artworks.",
      "bottom",
      expect.objectContaining({
        backgroundColor: "green100",
        duration: "long",
        onPress: expect.any(Function),
        description: expect.anything(),
      })
    )
  })

  describe("when negative signals feature flag is enabled", () => {
    it("renders more icon and sets more info sheet visible when right button is pressed", () => {
      __globalStoreTestUtils__?.injectFeatureFlags({ AREnabledDiscoverDailyNegativeSignals: true })
      const setMoreInfoSheetVisibleSpy = jest.spyOn(
        GlobalStore.actions.infiniteDiscovery,
        "setMoreInfoSheetVisible"
      )

      renderWithWrappers(<InfiniteDiscoveryHeader topArtwork={mockTopArtwork} />)

      const rightButton = screen.getByTestId("top-right-icon")
      fireEvent.press(rightButton)

      expect(mockTrack.tappedMore).toHaveBeenCalledWith("artwork-id", "test-artwork")
      expect(setMoreInfoSheetVisibleSpy).toHaveBeenCalledWith(true)
    })

    it("renders more icon when feature flag is enabled", () => {
      renderWithWrappers(<InfiniteDiscoveryHeader topArtwork={mockTopArtwork} />)

      const rightButton = screen.getByTestId("top-right-icon")
      expect(rightButton).toBeOnTheScreen()
    })
  })

  describe("when negative signals feature flag is disabled", () => {
    it("renders share icon and calls share function when right button is pressed", () => {
      __globalStoreTestUtils__?.injectFeatureFlags({ AREnabledDiscoverDailyNegativeSignals: false })

      renderWithWrappers(<InfiniteDiscoveryHeader topArtwork={mockTopArtwork} />)

      const rightButton = screen.getByTestId("top-right-icon")
      fireEvent.press(rightButton)

      expect(mockTrack.tappedShare).toHaveBeenCalledWith("artwork-id", "test-artwork", "artwork")
      expect(RNShare.open).toHaveBeenCalledWith({
        title: "Test Artwork",
        message:
          "View Test Artwork on Artsy\nhttps://staging.artsy.net/artwork/test-artwork?utm_content=discover-daily-share&utm_medium=product-share",
        failOnCancel: false,
      })
    })
  })
})
