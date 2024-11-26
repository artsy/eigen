import { renderHook } from "@testing-library/react-hooks"
import { matchRoute } from "app/routes"
import { useIsDeepLink } from "app/utils/hooks/useIsDeepLink"
import { Linking } from "react-native"

const mockUseIsFocusedMock = jest.fn()
jest.mock("@react-navigation/native", () => ({
  useIsFocused: () => mockUseIsFocusedMock(),
}))

jest.mock("react-native", () => ({
  Linking: {
    getInitialURL: jest.fn(),
  },
}))

jest.mock("app/routes", () => ({
  matchRoute: jest.fn(),
}))

describe("useIsDeepLink", () => {
  const mockLinkingGetInitialURL = Linking.getInitialURL as jest.Mock
  const mockMatchRoute = matchRoute as jest.Mock

  it("should return true if opened from a deep link", async () => {
    // Setup the mock to return the specific URL
    mockLinkingGetInitialURL.mockResolvedValue("artsy:///artwork/foo")
    mockMatchRoute.mockReturnValue({ type: "match", module: "Artwork" })
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
    expect(mockMatchRoute).toHaveBeenCalled()
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
    expect(mockMatchRoute).toHaveBeenCalled()
  })

  it("should return false if opened from a link to /", async () => {
    // Setup the mock to return null
    mockLinkingGetInitialURL.mockResolvedValue("artsy:///")
    mockMatchRoute.mockReturnValue({ type: "match", module: "Home" })
    mockUseIsFocusedMock.mockReturnValue(true)

    // Render the hook under test
    const { result, waitForNextUpdate } = renderHook(() => useIsDeepLink())

    // Wait for async effects to resolve
    await waitForNextUpdate()

    expect(result.current.isDeepLink).toEqual(false)
    expect(mockUseIsFocusedMock).toHaveBeenCalled()
    expect(mockLinkingGetInitialURL).toHaveBeenCalled()
    expect(mockMatchRoute).toHaveBeenCalled()
  })
})
