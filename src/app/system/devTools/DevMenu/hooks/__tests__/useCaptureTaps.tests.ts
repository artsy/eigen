import { renderHook } from "@testing-library/react-native"
import { internal_navigationRef } from "app/Navigation/Navigation"
import { GlobalStore } from "app/store/GlobalStore"
import { useCaptureTaps } from "app/system/devTools/DevMenu/hooks/useCaptureTaps"

jest.mock("app/store/GlobalStore", () => ({
  GlobalStore: {
    useAppState: jest.fn(),
  },
}))

jest.mock("app/Navigation/Navigation", () => ({
  internal_navigationRef: {
    current: {
      navigate: jest.fn(),
    },
  },
}))

const MAX_DURATION_BETWEEN_TAPS = 300
const MIN_DURATION_BETWEEN_TAPS = 70

describe("useCaptureTaps", () => {
  const mockUseAppState = GlobalStore.useAppState as jest.Mock
  const mockNavigate = internal_navigationRef.current?.navigate as jest.Mock

  let mockNow: number

  beforeEach(() => {
    jest.clearAllMocks()

    mockNow = 1000
    jest.spyOn(Date, "now").mockImplementation(() => mockNow)

    // Default: deep zoom modal not visible
    mockUseAppState.mockImplementation((selector: (state: any) => any) => {
      const mockState = {
        auth: { userAccessToken: "test-token" },
        devicePrefs: { sessionState: { isDeepZoomModalVisible: false } },
      }
      return selector(mockState)
    })
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  const advanceTime = (ms: number) => {
    mockNow += ms
  }

  describe("when tapping too fast", () => {
    it("should reset tap count when taps are faster than MIN_DURATION_BETWEEN_TAPS", () => {
      const { result } = renderHook(() => useCaptureTaps())

      // First tap
      result.current.handleStartShouldSetResponderCapture()

      // Subsequent taps too fast (< 70ms apart)
      for (let i = 0; i < 10; i++) {
        advanceTime(MIN_DURATION_BETWEEN_TAPS - 10) // 60ms, too fast
        result.current.handleStartShouldSetResponderCapture()
      }

      expect(mockNavigate).not.toHaveBeenCalled()
    })

    it("should treat taps faster than 70ms as separate tap sequences", () => {
      const { result } = renderHook(() => useCaptureTaps())

      // First tap
      result.current.handleStartShouldSetResponderCapture()

      // 3 taps at valid speed (total 4 taps)
      for (let i = 0; i < 3; i++) {
        advanceTime(100) // valid speed
        result.current.handleStartShouldSetResponderCapture()
      }

      // This would be the 5th tap, but it's too fast - resets counter to 1
      advanceTime(50) // too fast
      result.current.handleStartShouldSetResponderCapture()

      // Should not navigate because the fast tap reset the counter
      expect(mockNavigate).not.toHaveBeenCalled()
    })
  })

  describe("when tapping too slow", () => {
    it("should reset tap count when taps are slower than MAX_DURATION_BETWEEN_TAPS", () => {
      const { result } = renderHook(() => useCaptureTaps())

      // First tap
      result.current.handleStartShouldSetResponderCapture()

      // Subsequent taps too slow (> 300ms apart)
      for (let i = 0; i < 10; i++) {
        advanceTime(MAX_DURATION_BETWEEN_TAPS + 100) // 400ms, too slow
        result.current.handleStartShouldSetResponderCapture()
      }

      expect(mockNavigate).not.toHaveBeenCalled()
    })

    it("should treat taps slower than 300ms as new tap sequences", () => {
      const { result } = renderHook(() => useCaptureTaps())

      // First tap
      result.current.handleStartShouldSetResponderCapture()

      // 3 taps at valid speed (total 4 taps)
      for (let i = 0; i < 3; i++) {
        advanceTime(100) // valid speed
        result.current.handleStartShouldSetResponderCapture()
      }

      // This would be the 5th tap, but it's too slow - resets counter to 1
      advanceTime(350) // too slow
      result.current.handleStartShouldSetResponderCapture()

      // Should not navigate because the slow tap reset the counter
      expect(mockNavigate).not.toHaveBeenCalled()
    })
  })

  describe("when tapping at the correct speed", () => {
    it("should navigate to dev menu after 5 valid taps", () => {
      const { result } = renderHook(() => useCaptureTaps())

      // First tap
      result.current.handleStartShouldSetResponderCapture()

      // 4 more taps at valid speed (total 5)
      for (let i = 0; i < 4; i++) {
        advanceTime(150) // valid speed (between 70ms and 300ms)
        result.current.handleStartShouldSetResponderCapture()
      }

      expect(mockNavigate).toHaveBeenCalledTimes(1)
      expect(mockNavigate).toHaveBeenCalledWith("DevMenu")
    })

    it("should not navigate with only 4 valid taps", () => {
      const { result } = renderHook(() => useCaptureTaps())

      // First tap
      result.current.handleStartShouldSetResponderCapture()

      // 3 more taps at valid speed (total 4)
      for (let i = 0; i < 3; i++) {
        advanceTime(150)
        result.current.handleStartShouldSetResponderCapture()
      }

      expect(mockNavigate).not.toHaveBeenCalled()
    })

    it("should navigate with taps at minimum valid duration (exactly 70ms)", () => {
      const { result } = renderHook(() => useCaptureTaps())

      result.current.handleStartShouldSetResponderCapture()

      for (let i = 0; i < 4; i++) {
        advanceTime(MIN_DURATION_BETWEEN_TAPS + 1) // 71ms, just above minimum
        result.current.handleStartShouldSetResponderCapture()
      }

      expect(mockNavigate).toHaveBeenCalledTimes(1)
    })

    it("should navigate with taps at maximum valid duration (just under 300ms)", () => {
      const { result } = renderHook(() => useCaptureTaps())

      result.current.handleStartShouldSetResponderCapture()

      for (let i = 0; i < 4; i++) {
        advanceTime(MAX_DURATION_BETWEEN_TAPS - 1) // 299ms, just under maximum
        result.current.handleStartShouldSetResponderCapture()
      }

      expect(mockNavigate).toHaveBeenCalledTimes(1)
    })

    it("should reset tap count after navigating", () => {
      const { result } = renderHook(() => useCaptureTaps())

      // First successful sequence
      result.current.handleStartShouldSetResponderCapture()
      for (let i = 0; i < 4; i++) {
        advanceTime(150)
        result.current.handleStartShouldSetResponderCapture()
      }
      expect(mockNavigate).toHaveBeenCalledTimes(1)

      // Second sequence should require another 5 taps
      for (let i = 0; i < 4; i++) {
        advanceTime(150)
        result.current.handleStartShouldSetResponderCapture()
      }
      // Only 4 taps since last navigation, should not navigate again
      expect(mockNavigate).toHaveBeenCalledTimes(1)

      // 5th tap of second sequence
      advanceTime(150)
      result.current.handleStartShouldSetResponderCapture()
      expect(mockNavigate).toHaveBeenCalledTimes(2)
    })
  })
})
