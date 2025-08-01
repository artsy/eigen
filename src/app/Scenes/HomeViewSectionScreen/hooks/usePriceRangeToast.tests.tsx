import { render } from "@testing-library/react-native"
import {
  fetchPriceRange,
  PROGRESSIVE_ONBOARDING_PRICE_RANGE_CONTENT,
  PROGRESSIVE_ONBOARDING_PRICE_RANGE_TITLE,
} from "app/Components/ProgressiveOnboarding/ProgressiveOnboardingPriceRangeHome"
import { usePriceRangeToast } from "app/Scenes/HomeViewSectionScreen/hooks/usePriceRangeToast"

jest.mock("@react-native-async-storage/async-storage", () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
}))

jest.mock("app/Components/ProgressiveOnboarding/ProgressiveOnboardingPriceRangeHome", () => ({
  fetchPriceRange: jest.fn(),
}))

const mockUseToast = {
  show: jest.fn(),
}

jest.mock("app/Components/Toast/toastHook", () => ({
  useToast: () => mockUseToast,
}))

jest.mock("app/system/navigation/navigate", () => ({
  navigate: jest.fn(),
}))

jest.mock("react-native/Libraries/Interaction/InteractionManager", () => ({
  ...jest.requireActual("react-native/Libraries/Interaction/InteractionManager"),
  runAfterInteractions: jest.fn((callback) => callback()),
}))

const TestComponent = (props: any) => {
  usePriceRangeToast(props)
  return null
}

describe("usePriceRangeToast", () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it("shows toast when all conditions are met", async () => {
    ;(fetchPriceRange as jest.Mock).mockResolvedValue(mockHasStaleArtworkBudget)

    render(
      <TestComponent
        artworksLength={6}
        totalCount={10}
        sectionInternalID="home-view-section-recommended-artworks"
      />
    )

    await new Promise((res) => setTimeout(res, 10))

    // expect(AsyncStorage.setItem).toHaveBeenCalled()
    expect(mockUseToast.show).toHaveBeenCalledWith(
      PROGRESSIVE_ONBOARDING_PRICE_RANGE_TITLE,
      "bottom",
      {
        description: PROGRESSIVE_ONBOARDING_PRICE_RANGE_CONTENT,
        duration: "long",
        onPress: expect.any(Function),
        hideOnPress: true,
      }
    )
  })

  it("does not show toast if sectionInternalID is incorrect", async () => {
    ;(fetchPriceRange as jest.Mock).mockResolvedValue(mockHasStaleArtworkBudget)

    render(<TestComponent artworksLength={6} totalCount={10} sectionInternalID="other-section" />)

    expect(mockUseToast.show).not.toHaveBeenCalledWith(
      PROGRESSIVE_ONBOARDING_PRICE_RANGE_TITLE,
      "bottom",
      {
        description: PROGRESSIVE_ONBOARDING_PRICE_RANGE_CONTENT,
        duration: "long",
        onPress: expect.any(Function),
        hideOnPress: true,
      }
    )
  })

  it("does not show toast if user hasn't scrolled enough", async () => {
    ;(fetchPriceRange as jest.Mock).mockResolvedValue(mockHasStaleArtworkBudget)

    render(
      <TestComponent
        artworksLength={2}
        totalCount={10}
        sectionInternalID="home-view-section-recommended-artworks"
      />
    )

    expect(mockUseToast.show).not.toHaveBeenCalledWith(
      PROGRESSIVE_ONBOARDING_PRICE_RANGE_TITLE,
      "bottom",
      {
        description: PROGRESSIVE_ONBOARDING_PRICE_RANGE_CONTENT,
        duration: "long",
        onPress: expect.any(Function),
        hideOnPress: true,
      }
    )
  })

  it("does not show toast if 3 months haven't passed", async () => {
    ;(fetchPriceRange as jest.Mock).mockResolvedValue(mockResentlyUpdatedArtworkBudget)

    render(
      <TestComponent
        artworksLength={6}
        totalCount={10}
        sectionInternalID="home-view-section-recommended-artworks"
      />
    )

    expect(mockUseToast.show).not.toHaveBeenCalledWith(
      PROGRESSIVE_ONBOARDING_PRICE_RANGE_TITLE,
      "bottom",
      {
        description: PROGRESSIVE_ONBOARDING_PRICE_RANGE_CONTENT,
        duration: "long",
        onPress: expect.any(Function),
        hideOnPress: true,
      }
    )
  })

  it("does not show toast if hasPriceRange is false", async () => {
    ;(fetchPriceRange as jest.Mock).mockResolvedValue(mockNoPriceRange)

    render(
      <TestComponent
        artworksLength={10}
        totalCount={10}
        sectionInternalID="home-view-section-recommended-artworks"
      />
    )

    expect(mockUseToast.show).not.toHaveBeenCalledWith(
      PROGRESSIVE_ONBOARDING_PRICE_RANGE_TITLE,
      "bottom",
      {
        description: PROGRESSIVE_ONBOARDING_PRICE_RANGE_CONTENT,
        duration: "long",
        onPress: expect.any(Function),
        hideOnPress: true,
      }
    )
  })

  it("does not show toast if price range has not been updated", async () => {
    ;(fetchPriceRange as jest.Mock).mockResolvedValue(mockPriceRangeNotUpdated)

    render(
      <TestComponent
        artworksLength={10}
        totalCount={10}
        sectionInternalID="home-view-section-recommended-artworks"
      />
    )

    expect(mockUseToast.show).not.toHaveBeenCalledWith(
      PROGRESSIVE_ONBOARDING_PRICE_RANGE_TITLE,
      "bottom",
      {
        description: PROGRESSIVE_ONBOARDING_PRICE_RANGE_CONTENT,
        duration: "long",
        onPress: expect.any(Function),
        hideOnPress: true,
      }
    )
  })
})

const mockNoPriceRange = {
  hasPriceRange: false,
}

const mockPriceRangeNotUpdated = {
  hasPriceRange: true,
}

const mockResentlyUpdatedArtworkBudget = {
  hasPriceRange: true,
  hasStaleArtworkBudget: false,
}

const mockHasStaleArtworkBudget = {
  hasPriceRange: true,
  hasStaleArtworkBudget: true,
}
