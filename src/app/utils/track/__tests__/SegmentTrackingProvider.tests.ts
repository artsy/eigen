import { createClient } from "@segment/analytics-react-native"
import { isRunningPreviewBundle } from "app/system/devTools/DevMenu/utils/previewPR"
import { SegmentTrackingProvider } from "app/utils/track/SegmentTrackingProvider"

// setupJest stubs the provider and its helpers, so unmock them to test the real thing
jest.unmock("app/utils/track/SegmentTrackingProvider")
jest.unmock("app/utils/track/providers")
jest.unmock("app/utils/track/providers.tsx")

jest.mock("@segment/analytics-react-native-plugin-braze", () => ({ BrazePlugin: class {} }))

jest.mock("@segment/analytics-react-native", () => ({
  createClient: jest.fn(),
  Plugin: class Plugin {},
  PluginType: { enrichment: "enrichment" },
}))

jest.mock("app/system/devTools/DevMenu/utils/previewPR", () => ({
  isRunningPreviewBundle: jest.fn(),
}))

jest.mock("react-native-keys", () => ({
  __esModule: true,
  default: { secureFor: jest.fn(() => "write-key") },
}))

describe("SegmentTrackingProvider", () => {
  const client = { add: jest.fn(), track: jest.fn(), screen: jest.fn(), identify: jest.fn() }

  beforeEach(() => {
    jest.clearAllMocks()
    ;(createClient as jest.Mock).mockReturnValue(client)
    jest.spyOn(console, "log").mockImplementation(() => undefined)
  })

  it("sends events when the app is not a preview bundle", () => {
    ;(isRunningPreviewBundle as jest.Mock).mockReturnValue(false)

    SegmentTrackingProvider.setup?.()
    SegmentTrackingProvider.postEvent({ action: "tappedBuyNow" } as any)

    expect(createClient).toHaveBeenCalledWith({ writeKey: "write-key" })
    expect(client.track).toHaveBeenCalledWith("tappedBuyNow", { action: "tappedBuyNow" })
  })

  it("is silent on a preview bundle and does not throw", () => {
    ;(isRunningPreviewBundle as jest.Mock).mockReturnValue(true)

    SegmentTrackingProvider.setup?.()

    expect(createClient).not.toHaveBeenCalled()
    expect(() => SegmentTrackingProvider.postEvent({ action: "tappedBuyNow" } as any)).not.toThrow()
    expect(() => SegmentTrackingProvider.identify?.("user-id", {})).not.toThrow()
  })
})
