const mockClient = {
  add: jest.fn(),
  identify: jest.fn(),
  screen: jest.fn(),
  track: jest.fn(),
}

jest.mock("@segment/analytics-react-native", () => ({
  createClient: () => mockClient,
  Plugin: class Plugin {},
  PluginType: { enrichment: "enrichment" },
  SegmentClient: class SegmentClient {},
}))

jest.mock("@segment/analytics-react-native-plugin-braze", () => ({
  BrazePlugin: class BrazePlugin {},
}))

import { addBreadcrumb } from "@sentry/react-native"
import { SegmentTrackingProvider } from "app/utils/track/SegmentTrackingProvider"

const mockAddBreadcrumb = addBreadcrumb as jest.Mock

const breadcrumbPayload = () => JSON.parse(mockAddBreadcrumb.mock.calls[0][0].message)

describe("SegmentTrackingProvider", () => {
  beforeAll(() => {
    SegmentTrackingProvider.setup?.()
  })

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it("forwards the full event, prompt included, to Segment", () => {
    SegmentTrackingProvider.postEvent({
      action: "sentArtAssistantPrompt",
      prompt: "blue abstract painting",
    } as any)

    expect(mockClient.track).toHaveBeenCalledWith(
      "sentArtAssistantPrompt",
      expect.objectContaining({ prompt: "blue abstract painting" })
    )
  })

  // Breadcrumbs ride along on every Sentry crash report, which has broader
  // internal access and different retention than the warehouse. This is a
  // privacy guarantee, not a nicety — a refactor of the destructure in
  // `postEvent` must fail here rather than silently leak prompts.
  it("keeps the prompt out of the Sentry breadcrumb", () => {
    SegmentTrackingProvider.postEvent({
      action: "sentArtAssistantPrompt",
      prompt: "blue abstract painting",
    } as any)

    const breadcrumb = breadcrumbPayload()

    expect(breadcrumb).not.toHaveProperty("prompt")
    expect(JSON.stringify(breadcrumb)).not.toContain("blue abstract painting")
  })

  it("keeps the rest of the event in the breadcrumb", () => {
    SegmentTrackingProvider.postEvent({
      action: "sentArtAssistantPrompt",
      context_screen_owner_type: "artAssistant",
      conversation_id: "conversation-id",
      turn_index: 2,
      prompt: "blue abstract painting",
      prompt_length: 22,
    } as any)

    expect(breadcrumbPayload()).toEqual({
      action: "sentArtAssistantPrompt",
      context_screen_owner_type: "artAssistant",
      conversation_id: "conversation-id",
      turn_index: 2,
      prompt_length: 22,
    })
  })

  it("leaves events without a prompt untouched", () => {
    SegmentTrackingProvider.postEvent({
      action: "tappedArtAssistantSuggestion",
      conversation_id: "conversation-id",
      position: 1,
    } as any)

    expect(breadcrumbPayload()).toEqual({
      action: "tappedArtAssistantSuggestion",
      conversation_id: "conversation-id",
      position: 1,
    })
  })
})
