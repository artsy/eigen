import { renderHook } from "@testing-library/react-hooks"
import { useIsDeepLink } from "app/utils/hooks/useIsDeepLink"
import { Linking } from "react-native"

// Existing mocks
const mockUseIsFocusedMock = jest.fn()
jest.mock("@react-navigation/native", () => ({
  useIsFocused: () => mockUseIsFocusedMock(),
}))

jest.mock("react-native", () => ({
  Linking: {
    getInitialURL: jest.fn(),
  },
}))

// Start of the new test case
describe("useIsDeepLink", () => {
  const mockLinkingGetInitialURL = Linking.getInitialURL as jest.Mock

  it("should return true if opened from a deep link", async () => {
    // Setup the mock to return the specific URL
    mockLinkingGetInitialURL.mockResolvedValue("artsy:///foo/bar")
    mockUseIsFocusedMock.mockReturnValue(true)

    // Render the hook under test
    const { result, waitForNextUpdate } = renderHook(() => useIsDeepLink())

    // Wait for async effects to resolve
    await waitForNextUpdate()

    expect(result.current).toEqual({
      isDeepLink: true,
    })
    expect(mockUseIsFocusedMock).toHaveBeenCalled()
    expect(mockLinkingGetInitialURL).toHaveBeenCalled()
  })

  it("should return false if not opened from a deep link", async () => {
    // Setup the mock to return null
    mockLinkingGetInitialURL.mockResolvedValue(null)
    mockUseIsFocusedMock.mockReturnValue(true)

    // Render the hook under test
    const { result, waitForNextUpdate } = renderHook(() => useIsDeepLink())

    // Wait for async effects to resolve
    await waitForNextUpdate()

    expect(result.current.isDeepLink).toEqual(false)
    expect(mockUseIsFocusedMock).toHaveBeenCalled()
    expect(mockLinkingGetInitialURL).toHaveBeenCalled()
  })

  it("should return false if opened from a link to /", async () => {
    // Setup the mock to return null
    mockLinkingGetInitialURL.mockResolvedValue("artsy:///")
    mockUseIsFocusedMock.mockReturnValue(true)

    // Render the hook under test
    const { result, waitForNextUpdate } = renderHook(() => useIsDeepLink())

    // Wait for async effects to resolve
    await waitForNextUpdate()

    expect(result.current.isDeepLink).toEqual(false)
    expect(mockUseIsFocusedMock).toHaveBeenCalled()
    expect(mockLinkingGetInitialURL).toHaveBeenCalled()
  })
})
