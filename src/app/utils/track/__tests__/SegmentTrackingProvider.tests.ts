import { captureMessage } from "@sentry/react-native"
import { SegmentTrackingProvider } from "app/utils/track/SegmentTrackingProvider"

// setupJest mocks the provider globally; test the real implementation here
jest.unmock("app/utils/track/SegmentTrackingProvider")

// The global Segment mock doesn't include the flush policy base classes, so add the real ones
jest.mock("@segment/analytics-react-native", () => ({
  ...jest.requireActual("@segment/analytics-react-native/lib/commonjs/flushPolicies"),
  Plugin: class Plugin {},
  PluginType: { enrichment: "enrichment" },
}))

describe("SegmentTrackingProvider.postEvent", () => {
  it("reports an unrecognised payload to Sentry instead of throwing", () => {
    const legacyPayload = { context_module: "artworkDetails", subject: "Gallery Name" }

    expect(() => SegmentTrackingProvider.postEvent(legacyPayload as any)).not.toThrow()
    expect(captureMessage).toHaveBeenCalledWith(
      `Untracked analytics event: ${JSON.stringify(legacyPayload)}`,
      "warning"
    )
  })
})
