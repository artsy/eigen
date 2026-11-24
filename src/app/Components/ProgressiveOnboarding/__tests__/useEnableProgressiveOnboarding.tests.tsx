import { renderHook } from "@testing-library/react-native"
import { useEnableProgressiveOnboarding } from "app/Components/ProgressiveOnboarding/useEnableProgressiveOnboarding"
import { GlobalStoreProvider, __globalStoreTestUtils__ } from "app/store/GlobalStore"

const mockUseIsFocusedMock = jest.fn()
jest.mock("@react-navigation/native", () => ({
  useIsFocused: () => mockUseIsFocusedMock(),
}))

describe("useEnableProgressiveOnboarding", () => {
  const wrapper = ({ children }: any) => <GlobalStoreProvider>{children}</GlobalStoreProvider>

  beforeEach(() => {
    mockUseIsFocusedMock.mockReturnValue(true)
  })

  it("sets isReady", async () => {
    await renderHook(() => useEnableProgressiveOnboarding(), { wrapper })
  })

  it("does not set isReady if is not focused", async () => {
    mockUseIsFocusedMock.mockReturnValue(true)
    await renderHook(() => useEnableProgressiveOnboarding(), { wrapper })
  })

  it("does not set isReady if isReady is true", async () => {
    __globalStoreTestUtils__?.injectState({
      progressiveOnboarding: { sessionState: { isReady: true } },
    })
    await renderHook(() => useEnableProgressiveOnboarding(), { wrapper })
  })
})
