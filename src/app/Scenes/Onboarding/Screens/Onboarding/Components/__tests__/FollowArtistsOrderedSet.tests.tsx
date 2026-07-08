import { ActionType, ContextModule, OwnerType } from "@artsy/cohesion"
import { fireEvent, screen, waitForElementToBeRemoved } from "@testing-library/react-native"
import { FollowArtistsOrderedSetScreen } from "app/Scenes/Onboarding/Screens/Onboarding/Components/FollowArtistsOrderedSet"
import { mockTrackEvent } from "app/utils/tests/globallyMockedStuff"
import { renderWithHookWrappersTL } from "app/utils/tests/renderWithWrappers"
import { resolveMostRecentRelayOperation } from "app/utils/tests/resolveMostRecentRelayOperation"
import { createMockEnvironment } from "relay-test-utils"

describe("FollowArtistsOrderedSet", () => {
  let env: ReturnType<typeof createMockEnvironment>

  beforeEach(() => {
    env = createMockEnvironment()
  })

  it("tracks the artist's slug when followed", async () => {
    renderWithHookWrappersTL(
      <FollowArtistsOrderedSetScreen id="onboarding:suggested-artists" />,
      env
    )

    resolveMostRecentRelayOperation(env, {
      Artist: () => ({
        internalID: "artist-internal-id",
        slug: "banksy",
        isFollowed: false,
      }),
    })

    await waitForElementToBeRemoved(() =>
      screen.queryByTestId("FollowArtistsOrderedSetPlaceholder")
    )

    fireEvent.press(screen.getAllByText("Follow")[0])

    resolveMostRecentRelayOperation(env)

    expect(mockTrackEvent).toHaveBeenCalledWith({
      action: ActionType.followedArtist,
      context_module: ContextModule.onboardingFlow,
      context_owner_type: OwnerType.savesAndFollows,
      owner_id: "artist-internal-id",
      owner_slug: "banksy",
      owner_type: OwnerType.artist,
    })
  })
})
