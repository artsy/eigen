import { render } from "@testing-library/react-native"
import { WrappedFlagProvider } from "app/system/flags/Components/WrappedFlagProvider"
import { useUnleashEnvironment } from "app/system/flags/hooks/useUnleashEnvironment"
import { useUnleashInitializer } from "app/system/flags/hooks/useUnleashInitializer"
import { useUnleashListener } from "app/system/flags/hooks/useUnleashListener"
import { getAppVersion } from "app/utils/appVersion"
import { Platform } from "react-native"
import Keys from "react-native-keys"

jest.mock("@unleash/proxy-client-react", () => ({
  __esModule: true,
  default: ({ children, config }: any) => {
    // Expose config for testing
    ;(global as any).__unleashConfig = config
    return children
  },
}))

jest.mock("app/system/flags/hooks/useUnleashEnvironment")
jest.mock("app/system/flags/hooks/useUnleashInitializer")
jest.mock("app/system/flags/hooks/useUnleashListener")
jest.mock("app/utils/appVersion")
jest.mock("react-native-keys", () => ({
  secureFor: jest.fn(),
}))
jest.mock("react-native", () => ({
  Platform: { OS: "ios" },
  NativeModules: {
    ArtsyNativeModule: {
      gitCommitShortHash: "abc123",
      isBetaOrDev: false,
      clearCache: jest.fn(),
    },
  },
  Text: "Text",
}))

const mockUseUnleashEnvironment = useUnleashEnvironment as jest.MockedFunction<
  typeof useUnleashEnvironment
>
const mockUseUnleashInitializer = useUnleashInitializer as jest.MockedFunction<
  typeof useUnleashInitializer
>
const mockUseUnleashListener = useUnleashListener as jest.MockedFunction<typeof useUnleashListener>
const mockGetAppVersion = getAppVersion as jest.MockedFunction<typeof getAppVersion>
const mockKeys = Keys as { secureFor: jest.MockedFunction<any> }

describe("WrappedFlagProvider", () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockUseUnleashEnvironment.mockReturnValue({ unleashEnv: "staging" })
    mockUseUnleashInitializer.mockReturnValue()
    mockUseUnleashListener.mockReturnValue()
    mockKeys.secureFor.mockReturnValue("mock-unleash-url")
    mockGetAppVersion.mockReturnValue("1.2.3")
    // Clear the global config
    ;(global as any).__unleashConfig = undefined
  })

  it("provides app version and platform OS in context", () => {
    render(
      <WrappedFlagProvider>
        <div>Test Child</div>
      </WrappedFlagProvider>
    )

    const config = (global as any).__unleashConfig
    expect(config).toBeDefined()
    expect(config.context.properties.appVersion).toBe("1.2.3")
    expect(config.context.properties.appPlatformOS).toBe("ios")
    expect(mockGetAppVersion).toHaveBeenCalled()
  })

  it("uses Android platform when Platform.OS is android", () => {
    // Mock Platform.OS for this test
    const originalPlatform = Platform.OS
    Object.defineProperty(Platform, "OS", {
      value: "android",
      configurable: true,
    })

    render(
      <WrappedFlagProvider>
        <div>Test Child</div>
      </WrappedFlagProvider>
    )

    const config = (global as any).__unleashConfig
    expect(config.context.properties.appPlatformOS).toBe("android")

    // Restore original platform
    Object.defineProperty(Platform, "OS", {
      value: originalPlatform,
      configurable: true,
    })
  })

  it("calls required hooks", () => {
    render(
      <WrappedFlagProvider>
        <div>Test Child</div>
      </WrappedFlagProvider>
    )

    expect(mockUseUnleashEnvironment).toHaveBeenCalled()
    expect(mockUseUnleashInitializer).toHaveBeenCalled()
    expect(mockUseUnleashListener).toHaveBeenCalled()
  })

  it("configures production URL when environment is production", () => {
    mockUseUnleashEnvironment.mockReturnValue({ unleashEnv: "production" })
    mockKeys.secureFor.mockImplementation((key: string) => {
      if (key === "UNLEASH_PROXY_URL_PRODUCTION") return "prod-url"
      if (key === "UNLEASH_PROXY_CLIENT_KEY_PRODUCTION") return "prod-secret"
      return "fallback"
    })

    render(
      <WrappedFlagProvider>
        <div>Test Child</div>
      </WrappedFlagProvider>
    )

    const config = (global as any).__unleashConfig
    expect(config.url).toBe("prod-url")
    expect(config.clientKey).toBe("prod-secret")
  })

  it("configures staging URL when environment is staging", () => {
    mockUseUnleashEnvironment.mockReturnValue({ unleashEnv: "staging" })
    mockKeys.secureFor.mockImplementation((key: string) => {
      if (key === "UNLEASH_PROXY_URL_STAGING") return "staging-url"
      if (key === "UNLEASH_PROXY_CLIENT_KEY_STAGING") return "staging-secret"
      return "fallback"
    })

    render(
      <WrappedFlagProvider>
        <div>Test Child</div>
      </WrappedFlagProvider>
    )

    const config = (global as any).__unleashConfig
    expect(config.url).toBe("staging-url")
    expect(config.clientKey).toBe("staging-secret")
  })
})
