import { ContextModule, OwnerType, ScreenOwnerType } from "@artsy/cohesion"
import { renderHook, waitFor } from "@testing-library/react-native"
import { useItineraryShare } from "app/Scenes/CityGuide/hooks/useItineraryShare"
import { mockTrackEvent } from "app/utils/tests/globallyMockedStuff"
import RNShare from "react-native-share"
import { RelayEnvironmentProvider } from "react-relay"
import { createMockEnvironment, MockPayloadGenerator } from "relay-test-utils"

jest.mock("react-native-share", () => ({ open: jest.fn() }))

describe("useItineraryShare", () => {
  let env: ReturnType<typeof createMockEnvironment>

  const wrapper = ({ children }: any) => (
    <RelayEnvironmentProvider environment={env}>{children}</RelayEnvironmentProvider>
  )

  const tracking = {
    contextModule: ContextModule.cityGuideItineraryHeader,
    contextScreenOwnerType: OwnerType.cityGuideItinerary as ScreenOwnerType,
    contextScreenOwnerId: "itinerary-1",
  }

  beforeEach(() => {
    env = createMockEnvironment()
    jest.clearAllMocks()
    ;(RNShare.open as jest.Mock).mockResolvedValue({
      success: true,
      message: "com.apple.UIKit.activity.CopyToPasteboard",
    })
  })

  it("shares a curated guide's own slug with no token and no mutation", async () => {
    const { result } = renderHook(
      () =>
        useItineraryShare({
          internalID: "guide-1",
          slug: "london-art-week",
          citySlug: "london-united-kingdom",
          title: "London Art Week",
          isCurated: true,
          ...tracking,
          contextScreenOwnerType: OwnerType.cityGuideGuide,
        }),
      { wrapper }
    )

    await result.current.share()

    expect(env.mock.getAllOperations()).toHaveLength(0)
    expect(RNShare.open).toHaveBeenCalledWith({
      title: "London Art Week",
      message:
        "London Art Week on Artsy\nhttps://staging.artsy.net/city-guide/london-united-kingdom/itinerary/london-art-week",
      failOnCancel: false,
    })
    expect(mockTrackEvent).toHaveBeenCalledWith(
      expect.objectContaining({
        action_name: "share",
        action_type: "tap",
        owner_type: "CityGuide",
        owner_id: "guide-1",
        owner_slug: "london-art-week",
      })
    )
  })

  it("mints a share token for a personal itinerary that has none, and includes it in the link", async () => {
    const { result } = renderHook(
      () =>
        useItineraryShare({
          internalID: "itinerary-1",
          slug: null,
          citySlug: "london-united-kingdom",
          title: "My London Trip",
          isCurated: false,
          shareToken: null,
          ...tracking,
        }),
      { wrapper }
    )

    const sharing = result.current.share()

    await waitFor(() => {
      const op = env.mock.getMostRecentOperation()
      expect(op.request.node.params.name).toBe("useItineraryShareMintTokenMutation")
    })

    const mintOperation = env.mock.getMostRecentOperation()

    expect(mintOperation.request.variables.input).toEqual({
      id: "itinerary-1",
      generateShareToken: true,
    })

    env.mock.resolveMostRecentOperation((operation) =>
      MockPayloadGenerator.generate(operation, {
        Mutation: () => ({
          updateItinerary: {
            responseOrError: {
              __typename: "ItineraryMutationSuccess",
              itinerary: { internalID: "itinerary-1", shareToken: "abc123" },
            },
          },
        }),
      })
    )

    await sharing

    expect(RNShare.open).toHaveBeenCalledWith({
      title: "My London Trip",
      message:
        "My London Trip on Artsy\nhttps://staging.artsy.net/city-guide/london-united-kingdom/itinerary/itinerary-1?shareToken=abc123",
      failOnCancel: false,
    })
  })

  it("reuses an already-minted share token instead of minting a new one", async () => {
    const { result } = renderHook(
      () =>
        useItineraryShare({
          internalID: "itinerary-1",
          slug: null,
          citySlug: "london-united-kingdom",
          title: "My London Trip",
          isCurated: false,
          shareToken: "existing-token",
          ...tracking,
        }),
      { wrapper }
    )

    await result.current.share()

    expect(env.mock.getAllOperations()).toHaveLength(0)
    expect(RNShare.open).toHaveBeenCalledWith({
      title: "My London Trip",
      message:
        "My London Trip on Artsy\nhttps://staging.artsy.net/city-guide/london-united-kingdom/itinerary/itinerary-1?shareToken=existing-token",
      failOnCancel: false,
    })
  })

  it("tracks the tap, then the share with the activity the user picked", async () => {
    const { result } = renderHook(
      () =>
        useItineraryShare({
          internalID: "itinerary-1",
          slug: null,
          citySlug: "london-united-kingdom",
          title: "My London Trip",
          isCurated: false,
          shareToken: "existing-token",
          ...tracking,
        }),
      { wrapper }
    )

    await result.current.share()

    expect(mockTrackEvent).toHaveBeenCalledWith({
      action: "tappedShare",
      context_module: "cityGuideItineraryHeader",
      context_screen_owner_type: "cityGuideItinerary",
      context_screen_owner_id: "itinerary-1",
      context_screen_owner_slug: undefined,
    })
    expect(mockTrackEvent).toHaveBeenCalledWith({
      action: "share",
      context_module: "cityGuideItineraryHeader",
      context_owner_type: "cityGuideItinerary",
      context_owner_id: "itinerary-1",
      context_owner_slug: undefined,
      service: "com.apple.UIKit.activity.CopyToPasteboard",
    })
  })

  it("does not track a share when the user closes the share sheet", async () => {
    ;(RNShare.open as jest.Mock).mockResolvedValue({ success: false, dismissedAction: true })

    const { result } = renderHook(
      () =>
        useItineraryShare({
          internalID: "itinerary-1",
          slug: null,
          citySlug: "london-united-kingdom",
          title: "My London Trip",
          isCurated: false,
          shareToken: "existing-token",
          ...tracking,
        }),
      { wrapper }
    )

    await result.current.share()

    expect(mockTrackEvent).toHaveBeenCalledWith(expect.objectContaining({ action: "tappedShare" }))
    expect(mockTrackEvent).not.toHaveBeenCalledWith(expect.objectContaining({ action: "share" }))
  })
})
