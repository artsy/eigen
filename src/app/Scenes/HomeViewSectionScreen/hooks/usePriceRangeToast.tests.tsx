import AsyncStorage from "@react-native-async-storage/async-storage"
import { render } from "@testing-library/react-native"
import {
  fetchPriceRange,
  PROGRESSIVE_ONBOARDING_PRICE_RANGE_CONTENT,
  PROGRESSIVE_ONBOARDING_PRICE_RANGE_TITLE,
} from "app/Components/ProgressiveOnboarding/ProgressiveOnboardingPriceRangeHome"
import { THREE_MONTHS_MS, usePriceRangeToast } from "./usePriceRangeToast"

jest.mock("@react-native-async-storage/async-storage", () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
}))

jest.mock("app/Components/ProgressiveOnboarding/ProgressiveOnboardingPriceRangeHome", () => ({
  fetchPriceRange: jest.fn(),
}))

const mockShow = jest.fn()
jest.mock("app/Components/Toast/toastHook", () => ({
  useToast: () => ({
    show: mockShow,
  }),
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
    jest.setSystemTime(new Date("2025-01-01T00:00:00.000Z")) // Set a consistent reference point
  })

  afterAll(() => {
    jest.useRealTimers()
  })

  it("shows toast when all conditions are met", async () => {
    const now = new Date().getTime()
    ;(fetchPriceRange as jest.Mock).mockResolvedValue(false)
    await (AsyncStorage.getItem as jest.Mock).mockResolvedValue(String(now - THREE_MONTHS_MS))

    render(
      <TestComponent
        artworksLength={6}
        totalCount={10}
        sectionInternalID="home-view-section-recommended-artworks"
      />
    )

    await new Promise((res) => setTimeout(res, 10))

    expect(AsyncStorage.setItem).toHaveBeenCalled()
    expect(mockShow).toHaveBeenCalledWith(PROGRESSIVE_ONBOARDING_PRICE_RANGE_TITLE, "bottom", {
      description: PROGRESSIVE_ONBOARDING_PRICE_RANGE_CONTENT,
      duration: "long",
      onPress: expect.any(Function),
      hideOnPress: true,
    })
  })

  it("does not show toast if sectionInternalID is incorrect", async () => {
    ;(fetchPriceRange as jest.Mock).mockResolvedValue(false)

    render(<TestComponent artworksLength={6} totalCount={10} sectionInternalID="other-section" />)

    expect(mockShow).not.toHaveBeenCalled()
  })

  it("does not show toast if user hasn't scrolled enough", async () => {
    ;(fetchPriceRange as jest.Mock).mockResolvedValue(false)

    render(
      <TestComponent
        artworksLength={2}
        totalCount={10}
        sectionInternalID="home-view-section-recommended-artworks"
      />
    )

    expect(mockShow).not.toHaveBeenCalled()
  })

  it("does not show toast if 3 months haven't passed", async () => {
    const now = new Date().getTime()
    ;(fetchPriceRange as jest.Mock).mockResolvedValue(false)
    await (AsyncStorage.getItem as jest.Mock).mockResolvedValue(String(now - THREE_MONTHS_MS)) // 1 second ago

    render(
      <TestComponent
        artworksLength={6}
        totalCount={10}
        sectionInternalID="home-view-section-recommended-artworks"
      />
    )

    expect(mockShow).not.toHaveBeenCalled()
  })

  it("does not show toast if fetchPriceRange returns true", async () => {
    ;(fetchPriceRange as jest.Mock).mockResolvedValue(true)

    render(
      <TestComponent
        artworksLength={10}
        totalCount={10}
        sectionInternalID="home-view-section-recommended-artworks"
      />
    )

    expect(mockShow).not.toHaveBeenCalled()
  })
})
