import { renderHook } from "@testing-library/react-native"
import { useUnleashClient, useFlags } from "@unleash/proxy-client-react"
import { GlobalStore } from "app/store/GlobalStore"
import { useUnleashInitializer } from "app/system/flags/hooks/useUnleashInitializer"
import { jwtDecode } from "jwt-decode"

jest.mock("@unleash/proxy-client-react")
jest.mock("app/store/GlobalStore")
jest.mock("jwt-decode")

jest.mock("react-native", () => ({
  Platform: { OS: "ios" },
  NativeModules: {
    ArtsyNativeModule: {
      gitCommitShortHash: "abc123",
      isBetaOrDev: false,
      clearCache: jest.fn(),
    },
  },
}))

const mockUseUnleashClient = useUnleashClient as jest.MockedFunction<typeof useUnleashClient>
const mockUseFlags = useFlags as jest.MockedFunction<typeof useFlags>
const mockJwtDecode = jwtDecode as jest.MockedFunction<typeof jwtDecode>

const mockClient = {
  getContext: jest.fn(),
  setContextField: jest.fn(),
  start: jest.fn(),
  stop: jest.fn(),
}

const mockGlobalStore = {
  useAppState: jest.fn(),
}

const mockSetUnleashVariants = jest.fn()

describe("useUnleashInitializer", () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockUseUnleashClient.mockReturnValue(mockClient as any)
    ;(GlobalStore as any).useAppState = mockGlobalStore.useAppState
    ;(GlobalStore as any).actions = {
      artsyPrefs: { experiments: { setUnleashVariants: mockSetUnleashVariants } },
    }
    mockClient.getContext.mockReturnValue({ userId: undefined })
    mockUseFlags.mockReturnValue([] as any)
  })

  it("does not start client when userID is not available", () => {
    mockGlobalStore.useAppState.mockImplementation((selector) => {
      const state = { auth: { userID: null, userAccessToken: null } }
      return selector(state)
    })

    renderHook(() => useUnleashInitializer())

    expect(mockClient.start).not.toHaveBeenCalled()
    expect(mockClient.setContextField).not.toHaveBeenCalled()
  })

  it("starts client when userID becomes available", () => {
    mockGlobalStore.useAppState.mockImplementation((selector) => {
      const state = { auth: { userID: "user123", userAccessToken: null } }
      return selector(state)
    })

    renderHook(() => useUnleashInitializer())

    expect(mockClient.setContextField).toHaveBeenCalledWith("userId", "user123")
    expect(mockClient.start).toHaveBeenCalled()
  })

  it("sets user roles from JWT token when userAccessToken is available", () => {
    const mockToken = "<token>"
    mockGlobalStore.useAppState.mockImplementation((selector) => {
      const state = { auth: { userID: "user123", userAccessToken: mockToken } }
      return selector(state)
    })

    mockJwtDecode.mockReturnValue({ roles: "admin,user" })

    renderHook(() => useUnleashInitializer())

    expect(mockJwtDecode).toHaveBeenCalledWith(mockToken)
    expect(mockClient.setContextField).toHaveBeenCalledWith("userId", "user123")
    expect(mockClient.setContextField).toHaveBeenCalledWith("userRoles", "admin,user")
    expect(mockClient.start).toHaveBeenCalled()
  })

  it("handles missing roles in JWT token", () => {
    const mockToken = "<token>"
    mockGlobalStore.useAppState.mockImplementation((selector) => {
      const state = { auth: { userID: "user123", userAccessToken: mockToken } }
      return selector(state)
    })

    mockJwtDecode.mockReturnValue({}) // No roles field

    renderHook(() => useUnleashInitializer())

    expect(mockClient.setContextField).toHaveBeenCalledWith("userRoles", "")
  })

  it("does not update context if userId is already set", () => {
    mockGlobalStore.useAppState.mockImplementation((selector) => {
      const state = { auth: { userID: "user123", userAccessToken: null } }
      return selector(state)
    })
    mockClient.getContext.mockReturnValue({ userId: "user123" })

    renderHook(() => useUnleashInitializer())

    expect(mockClient.setContextField).not.toHaveBeenCalled()
    expect(mockClient.start).toHaveBeenCalled()
  })

  it("stops client on cleanup", () => {
    mockGlobalStore.useAppState.mockImplementation((selector) => {
      const state = { auth: { userID: "user123", userAccessToken: null } }
      return selector(state)
    })

    const { unmount } = renderHook(() => useUnleashInitializer())

    unmount()

    expect(mockClient.stop).toHaveBeenCalled()
  })

  it("re-initializes when userID or userAccessToken changes", () => {
    let authState: { userID: string; userAccessToken: null | string } = {
      userID: "user123",
      userAccessToken: null,
    }

    mockGlobalStore.useAppState.mockImplementation((selector) => {
      const state = { auth: authState }
      return selector(state)
    })

    const { rerender } = renderHook(() => useUnleashInitializer())

    expect(mockClient.setContextField).toHaveBeenCalledTimes(1)
    expect(mockClient.start).toHaveBeenCalledTimes(1)

    // Change userAccessToken
    authState = { userID: "user123", userAccessToken: "new-token" }
    mockJwtDecode.mockReturnValue({ roles: "user" })

    rerender(() => {})

    expect(mockClient.setContextField).toHaveBeenCalledTimes(3) // userId + userRoles on second call
    expect(mockClient.start).toHaveBeenCalledTimes(2)
  })

  it("populates GlobalStore.unleashVariants from flags", () => {
    mockGlobalStore.useAppState.mockImplementation((selector) => {
      const state = { auth: { userID: "user123", userAccessToken: null } }
      return selector(state)
    })

    const flags = [
      {
        name: "onyx_internal-testing-experiment",
        variant: { name: "experiment-a", enabled: true, payload: { type: "string", value: "p" } },
      },
      { name: "some_other_flag", variant: { name: "control", enabled: false } },
    ]

    mockUseFlags.mockReturnValue(flags as any)

    renderHook(() => useUnleashInitializer())

    expect(mockSetUnleashVariants).toHaveBeenCalled()
    const calledWith = mockSetUnleashVariants.mock.calls[0][0]
    expect(calledWith).toHaveProperty("unleashVariants")
    expect(calledWith.unleashVariants["onyx_internal-testing-experiment"].name).toEqual(
      "experiment-a"
    )
  })

  it("writes an empty map when no flags are present", () => {
    mockGlobalStore.useAppState.mockImplementation((selector) => {
      const state = { auth: { userID: "user123", userAccessToken: null } }
      return selector(state)
    })

    mockUseFlags.mockReturnValue([] as any)

    renderHook(() => useUnleashInitializer())

    expect(mockSetUnleashVariants).toHaveBeenCalled()
    const calledWith = mockSetUnleashVariants.mock.calls[0][0]
    expect(calledWith).toEqual({})
  })
})
