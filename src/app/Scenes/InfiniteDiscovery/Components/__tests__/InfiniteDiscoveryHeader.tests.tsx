import { fireEvent, screen } from "@testing-library/react-native"
import { InfiniteDiscoveryHeader } from "app/Scenes/InfiniteDiscovery/Components/InfiniteDiscoveryHeader"
import { InfiniteDiscoveryArtwork } from "app/Scenes/InfiniteDiscovery/InfiniteDiscovery"
import { GlobalStore, __globalStoreTestUtils__ } from "app/store/GlobalStore"
import { goBack, navigate } from "app/system/navigation/navigate"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"
import RNShare from "react-native-share"

jest.mock("app/system/navigation/navigate", () => ({
  goBack: jest.fn(),
  navigate: jest.fn(),
}))

jest.mock("react-native-share", () => ({
  open: jest.fn(),
}))

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
    GlobalStore.actions.infiniteDiscovery.resetSavedArtworksCount()
    __globalStoreTestUtils__?.injectFeatureFlags({ AREnabledDiscoverDailyNegativeSignals: false })
    ;(RNShare.open as jest.Mock).mockResolvedValue({ success: true, message: "shared" })
  })

  it("renders the header with correct title", () => {
    renderWithWrappers(<InfiniteDiscoveryHeader topArtwork={mockTopArtwork} />)

    expect(screen.getByText("Discover Daily")).toBeOnTheScreen()
  })

  it("renders close button with correct accessibility properties", () => {
    renderWithWrappers(<InfiniteDiscoveryHeader topArtwork={mockTopArtwork} />)

    const closeButton = screen.getByTestId("close-icon")
    expect(closeButton).toBeOnTheScreen()
    expect(closeButton).toHaveAccessibleName("Exit Discover Daily")
  })

  it("renders more button when topArtwork has required data", () => {
    renderWithWrappers(<InfiniteDiscoveryHeader topArtwork={mockTopArtwork} />)

    const moreButton = screen.getByTestId("share-icon")
    expect(moreButton).toBeOnTheScreen()
    expect(moreButton).toHaveAccessibleName("More information")
  })

  it("hides more button when topArtwork is undefined", () => {
    renderWithWrappers(<InfiniteDiscoveryHeader topArtwork={undefined} />)

    expect(screen.queryByTestId("share-icon")).not.toBeOnTheScreen()
  })

  it("hides more button when topArtwork lacks slug", () => {
    const artworkWithoutSlug = { ...mockTopArtwork, slug: undefined }
    renderWithWrappers(<InfiniteDiscoveryHeader topArtwork={artworkWithoutSlug as any} />)

    expect(screen.queryByTestId("share-icon")).not.toBeOnTheScreen()
  })

  it("hides more button when topArtwork lacks title", () => {
    const artworkWithoutTitle = { ...mockTopArtwork, title: undefined }
    renderWithWrappers(<InfiniteDiscoveryHeader topArtwork={artworkWithoutTitle} />)

    expect(screen.queryByTestId("share-icon")).not.toBeOnTheScreen()
  })

  it("calls goBack and tracks exit when close button is pressed", () => {
    renderWithWrappers(<InfiniteDiscoveryHeader topArtwork={mockTopArtwork} />)

    const closeButton = screen.getByTestId("close-icon")
    fireEvent.press(closeButton)

    expect(mockTrack.tappedExit).toHaveBeenCalled()
    expect(goBack).toHaveBeenCalled()
  })

  it("shows toast when exiting with saved artworks", () => {
    GlobalStore.actions.infiniteDiscovery.incrementSavedArtworksCount()
    GlobalStore.actions.infiniteDiscovery.incrementSavedArtworksCount()
    GlobalStore.actions.infiniteDiscovery.incrementSavedArtworksCount()
    renderWithWrappers(<InfiniteDiscoveryHeader topArtwork={mockTopArtwork} />)

    const closeButton = screen.getByTestId("close-icon")
    fireEvent.press(closeButton)

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

  it("uses singular form for toast when only one artwork is saved", () => {
    GlobalStore.actions.infiniteDiscovery.incrementSavedArtworksCount()
    renderWithWrappers(<InfiniteDiscoveryHeader topArtwork={mockTopArtwork} />)

    const closeButton = screen.getByTestId("close-icon")
    fireEvent.press(closeButton)

    expect(mockUseToast.show).toHaveBeenCalledWith(
      "Nice! You saved 1 artwork.",
      "bottom",
      expect.any(Object)
    )
  })

  it("navigates to favorites when toast is pressed", () => {
    GlobalStore.actions.infiniteDiscovery.incrementSavedArtworksCount()
    GlobalStore.actions.infiniteDiscovery.incrementSavedArtworksCount()
    renderWithWrappers(<InfiniteDiscoveryHeader topArtwork={mockTopArtwork} />)

    const closeButton = screen.getByTestId("close-icon")
    fireEvent.press(closeButton)

    const toastCall = mockUseToast.show.mock.calls[0]
    const toastConfig = toastCall[2]
    toastConfig.onPress()

    expect(mockTrack.tappedSummary).toHaveBeenCalled()
    expect(navigate).toHaveBeenCalledWith("/favorites/saves")
  })

  it("does not show toast when exiting with no saved artworks", () => {
    renderWithWrappers(<InfiniteDiscoveryHeader topArtwork={mockTopArtwork} />)

    const closeButton = screen.getByTestId("close-icon")
    fireEvent.press(closeButton)

    expect(mockUseToast.show).not.toHaveBeenCalled()
  })

  describe("when negative signals feature flag is enabled", () => {
    beforeEach(() => {
      __globalStoreTestUtils__?.injectFeatureFlags({ AREnabledDiscoverDailyNegativeSignals: true })
    })

    it("renders more icon and sets more info sheet visible when right button is pressed", () => {
      const setMoreInfoSheetVisibleSpy = jest.spyOn(
        GlobalStore.actions.infiniteDiscovery,
        "setMoreInfoSheetVisible"
      )

      renderWithWrappers(<InfiniteDiscoveryHeader topArtwork={mockTopArtwork} />)

      const rightButton = screen.getByTestId("share-icon")
      fireEvent.press(rightButton)

      expect(setMoreInfoSheetVisibleSpy).toHaveBeenCalledWith(true)
    })

    it("renders more icon when feature flag is enabled", () => {
      renderWithWrappers(<InfiniteDiscoveryHeader topArtwork={mockTopArtwork} />)

      const rightButton = screen.getByTestId("share-icon")
      expect(rightButton).toBeOnTheScreen()
    })
  })

  describe("when negative signals feature flag is disabled", () => {
    beforeEach(() => {
      __globalStoreTestUtils__?.injectFeatureFlags({ AREnabledDiscoverDailyNegativeSignals: false })
    })

    it("renders share icon and calls share function when right button is pressed", () => {
      renderWithWrappers(<InfiniteDiscoveryHeader topArtwork={mockTopArtwork} />)

      const rightButton = screen.getByTestId("share-icon")
      fireEvent.press(rightButton)

      expect(mockTrack.tappedShare).toHaveBeenCalledWith("artwork-id", "test-artwork")
      expect(RNShare.open).toHaveBeenCalledWith({
        title: "Test Artwork",
        message:
          "View Test Artwork on Artsy\nhttps://staging.artsy.net/artwork/test-artwork?utm_content=discover-daily-share&utm_medium=product-share",
        failOnCancel: false,
      })
    })

    it("calls share tracking when share is successful", async () => {
      renderWithWrappers(<InfiniteDiscoveryHeader topArtwork={mockTopArtwork} />)

      const rightButton = screen.getByTestId("share-icon")
      fireEvent.press(rightButton)

      await new Promise((resolve) => setTimeout(resolve, 0))

      expect(mockTrack.share).toHaveBeenCalledWith("artwork-id", "test-artwork", "shared")
    })

    it("does not call share when topArtwork is missing required data", () => {
      const incompleteArtwork = { ...mockTopArtwork, slug: undefined }
      renderWithWrappers(<InfiniteDiscoveryHeader topArtwork={incompleteArtwork as any} />)

      const rightButton = screen.queryByTestId("share-icon")
      expect(rightButton).not.toBeOnTheScreen()
    })

    it("renders share icon when feature flag is disabled", () => {
      renderWithWrappers(<InfiniteDiscoveryHeader topArtwork={mockTopArtwork} />)

      const rightButton = screen.getByTestId("share-icon")
      expect(rightButton).toBeOnTheScreen()
    })
  })
})
