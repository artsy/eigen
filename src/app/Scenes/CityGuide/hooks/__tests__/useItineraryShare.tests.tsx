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

  beforeEach(() => {
    env = createMockEnvironment()
    jest.clearAllMocks()
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
})
