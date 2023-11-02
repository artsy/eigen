import { renderHook } from "@testing-library/react-native"
import { GlobalStoreProvider, __globalStoreTestUtils__ } from "app/store/GlobalStore"
import { useEnableProgressiveOnboarding } from "./useEnableProgressiveOnboarding"

const mockUseIsFocusedMock = jest.fn()
jest.mock("@react-navigation/native", () => ({
  useIsFocused: () => mockUseIsFocusedMock(),
}))

describe("useEnableProgressiveOnboarding", () => {
  const wrapper = ({ children }: any) => <GlobalStoreProvider>{children}</GlobalStoreProvider>

  beforeEach(() => {
    mockUseIsFocusedMock.mockReturnValue(true)
  })

  it("sets isReady", () => {
    renderHook(() => useEnableProgressiveOnboarding(), { wrapper })
  })

  it("does not set isReady if is not focused", () => {
    mockUseIsFocusedMock.mockReturnValue(true)
    renderHook(() => useEnableProgressiveOnboarding(), { wrapper })
  })

  it("does not set isReady if isReady is true", () => {
    __globalStoreTestUtils__?.injectState({
      progressiveOnboarding: { sessionState: { isReady: true } },
    })
    renderHook(() => useEnableProgressiveOnboarding(), { wrapper })
  })
})
