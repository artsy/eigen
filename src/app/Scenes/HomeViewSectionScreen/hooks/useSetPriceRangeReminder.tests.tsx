import { fetchPriceRange } from "app/Components/PriceRange/fetchPriceRange"
import {
  PROGRESSIVE_ONBOARDING_PRICE_RANGE_CONTENT,
  PROGRESSIVE_ONBOARDING_PRICE_RANGE_TITLE,
} from "app/Components/ProgressiveOnboarding/ProgressiveOnboardingPriceRangeHome"
import { useSetPriceRangeReminder } from "app/Scenes/HomeViewSectionScreen/hooks/useSetPriceRangeReminder"
import { __globalStoreTestUtils__ } from "app/store/GlobalStore"
import { navigate } from "app/system/navigation/navigate"
import { mockTrackEvent } from "app/utils/tests/globallyMockedStuff"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"

jest.mock("@react-native-async-storage/async-storage", () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
}))

jest.mock("app/Components/PriceRange/fetchPriceRange", () => ({
  fetchPriceRange: jest.fn(),
}))

const mockShow = jest.fn()
jest.mock("app/Components/Toast/toastHook", () => ({
  useToast: () => ({ show: mockShow }),
}))

jest.mock("app/system/navigation/navigate", () => ({
  navigate: jest.fn(),
}))

jest.mock("react-native/Libraries/Interaction/InteractionManager", () => ({
  ...jest.requireActual("react-native/Libraries/Interaction/InteractionManager"),
  runAfterInteractions: jest.fn((callback) => callback()),
}))

const TestComponent = (props: any) => {
  useSetPriceRangeReminder(props)
  return null
}

describe("useSetPriceRangeReminder", () => {
  beforeEach(() => {
    jest.clearAllMocks()
    __globalStoreTestUtils__?.injectFeatureFlags({ AREnablePriceRangeToast: true })
  })

  it("shows toast when all conditions are met", async () => {
    ;(fetchPriceRange as jest.Mock).mockResolvedValue(mockHasStaleArtworkBudget)

    renderWithWrappers(
      <TestComponent
        artworksLength={6}
        totalCount={10}
        sectionInternalID="home-view-section-recommended-artworks"
      />
    )

    await new Promise((res) => setTimeout(res, 10))

    expect(mockShow).toHaveBeenCalledWith(PROGRESSIVE_ONBOARDING_PRICE_RANGE_TITLE, "bottom", {
      description: PROGRESSIVE_ONBOARDING_PRICE_RANGE_CONTENT,
      duration: "superLong",
      onPress: expect.any(Function),
      hideOnPress: true,
    })
  })

  it("tracks toast viewed event", async () => {
    ;(fetchPriceRange as jest.Mock).mockResolvedValue(mockHasStaleArtworkBudget)

    renderWithWrappers(
      <TestComponent
        artworksLength={6}
        totalCount={10}
        sectionInternalID="home-view-section-recommended-artworks"
        contextScreenOwnerType="artworkRecommendations"
      />
    )

    await new Promise((res) => setTimeout(res, 10))

    expect(mockTrackEvent).toHaveBeenCalledWith({
      action: "viewedToast",
      context_screen_owner_type: "artworkRecommendations",
      subject: "price-range-toast",
    })
  })

  it("tracks toast tapped event and navigate", async () => {
    ;(fetchPriceRange as jest.Mock).mockResolvedValue(mockHasStaleArtworkBudget)

    renderWithWrappers(
      <TestComponent
        artworksLength={6}
        totalCount={10}
        sectionInternalID="home-view-section-recommended-artworks"
        contextScreenOwnerType="artworkRecommendations"
      />
    )

    await new Promise((res) => setTimeout(res, 10))

    expect(mockShow).toHaveBeenCalledWith(PROGRESSIVE_ONBOARDING_PRICE_RANGE_TITLE, "bottom", {
      description: PROGRESSIVE_ONBOARDING_PRICE_RANGE_CONTENT,
      duration: "superLong",
      onPress: expect.any(Function),
      hideOnPress: true,
    })

    // Since the toast is mocked and not rendered in the test environment,
    // we manually invoke the onPress handler from the mocked show() call
    // to simulate the user tapping the toast
    const toastCall = mockShow.mock.calls[0]
    const toastConfig = toastCall[2]
    toastConfig.onPress()

    expect(mockTrackEvent).toHaveBeenCalledWith({
      action: "tappedToast",
      context_screen_owner_type: "artworkRecommendations",
      subject: "price-range-toast",
    })

    expect(navigate).toHaveBeenCalledWith("my-account/edit-price-range")
  })

  it("does not show toast if sectionInternalID is incorrect", async () => {
    ;(fetchPriceRange as jest.Mock).mockResolvedValue(mockHasStaleArtworkBudget)

    renderWithWrappers(
      <TestComponent artworksLength={6} totalCount={10} sectionInternalID="other-section" />
    )

    expect(mockShow).not.toHaveBeenCalled()
  })

  it("does not show toast if user hasn't scrolled enough", async () => {
    ;(fetchPriceRange as jest.Mock).mockResolvedValue(mockHasStaleArtworkBudget)

    renderWithWrappers(
      <TestComponent
        artworksLength={2}
        totalCount={10}
        sectionInternalID="home-view-section-recommended-artworks"
      />
    )

    expect(mockShow).not.toHaveBeenCalled()
  })

  it("does not show toast if 3 months haven't passed", async () => {
    ;(fetchPriceRange as jest.Mock).mockResolvedValue(mockRecentlyUpdatedArtworkBudget)

    renderWithWrappers(
      <TestComponent
        artworksLength={6}
        totalCount={10}
        sectionInternalID="home-view-section-recommended-artworks"
      />
    )

    expect(mockShow).not.toHaveBeenCalled()
  })

  it("does not show toast if hasPriceRange is false", async () => {
    ;(fetchPriceRange as jest.Mock).mockResolvedValue(mockNoPriceRange)

    renderWithWrappers(
      <TestComponent
        artworksLength={10}
        totalCount={10}
        sectionInternalID="home-view-section-recommended-artworks"
      />
    )

    expect(mockShow).not.toHaveBeenCalled()
  })

  it("does not show toast if price range has not been updated", async () => {
    ;(fetchPriceRange as jest.Mock).mockResolvedValue(mockPriceRangeNotUpdated)

    renderWithWrappers(
      <TestComponent
        artworksLength={10}
        totalCount={10}
        sectionInternalID="home-view-section-recommended-artworks"
      />
    )

    expect(mockShow).not.toHaveBeenCalled()
  })
})

const mockNoPriceRange = {
  hasPriceRange: false,
}

const mockPriceRangeNotUpdated = {
  hasPriceRange: true,
}

const mockRecentlyUpdatedArtworkBudget = {
  hasPriceRange: true,
  hasStaleArtworkBudget: false,
}

const mockHasStaleArtworkBudget = {
  hasPriceRange: true,
  hasStaleArtworkBudget: true,
}
