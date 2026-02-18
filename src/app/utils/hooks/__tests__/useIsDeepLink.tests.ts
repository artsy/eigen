import { renderHook, waitFor } from "@testing-library/react-native"
import { matchRoute } from "app/system/navigation/utils/matchRoute"
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

jest.mock("app/system/navigation/utils/matchRoute", () => ({
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
    const { result } = renderHook(() => useIsDeepLink())

    await waitFor(() =>
      expect(result.current).toEqual({
        isDeepLink: true,
      })
    )
    expect(mockUseIsFocusedMock).toHaveBeenCalled()
    expect(mockLinkingGetInitialURL).toHaveBeenCalled()
    expect(mockMatchRoute).toHaveBeenCalled()
  })

  it("should return false if not opened from a deep link", async () => {
    // Setup the mock to return null
    mockLinkingGetInitialURL.mockResolvedValue(null)
    mockUseIsFocusedMock.mockReturnValue(true)

    // Render the hook under test
    const { result } = renderHook(() => useIsDeepLink())

    // Wait for async effects to resolve
    await waitFor(() =>
      expect(result.current).toEqual({
        isDeepLink: false,
      })
    )
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
    const { result } = renderHook(() => useIsDeepLink())

    await waitFor(() =>
      expect(result.current).toEqual({
        isDeepLink: false,
      })
    )
    expect(mockUseIsFocusedMock).toHaveBeenCalled()
    expect(mockLinkingGetInitialURL).toHaveBeenCalled()
    expect(mockMatchRoute).toHaveBeenCalled()
  })

  it("should return true if opened from a valid marketing url", async () => {
    // Setup the mock to return null
    mockLinkingGetInitialURL.mockResolvedValue("https://click.artsy.net/track/123")
    mockMatchRoute.mockReturnValue({ type: "match", module: "Artwork" })
    mockUseIsFocusedMock.mockReturnValue(true)

    // Render the hook under test
    const { result } = renderHook(() => useIsDeepLink())

    await waitFor(() =>
      expect(result.current).toEqual({
        isDeepLink: true,
      })
    )
    expect(mockUseIsFocusedMock).toHaveBeenCalled()
    expect(mockLinkingGetInitialURL).toHaveBeenCalled()
    expect(mockMatchRoute).toHaveBeenCalled()
  })

  it("should return false if opened from a marketing url that returns an error", async () => {
    // Setup the mock to return null
    mockLinkingGetInitialURL.mockResolvedValue("https://click.artsy.net/track/invalid")
    // Mock fetch to return error
    fetchMock.mockRejectedValue(new Error("Invalid link"))

    mockMatchRoute.mockReturnValue({ type: "match", module: "Home" })
    mockUseIsFocusedMock.mockReturnValue(true)

    // Render the hook under test
    const { result } = renderHook(() => useIsDeepLink())

    await waitFor(() =>
      expect(result.current).toEqual({
        isDeepLink: false,
      })
    )

    expect(mockMatchRoute).toHaveBeenCalledWith("/")

    expect(result.current.isDeepLink).toEqual(false)
    expect(mockUseIsFocusedMock).toHaveBeenCalled()
    expect(mockLinkingGetInitialURL).toHaveBeenCalled()
    expect(mockMatchRoute).toHaveBeenCalled()
  })
})
