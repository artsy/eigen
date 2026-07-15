import { ActionType, ContextModule, OwnerType } from "@artsy/cohesion"
import { Separator } from "@artsy/palette-mobile"
import { fireEvent, screen, waitForElementToBeRemoved } from "@testing-library/react-native"
import { FollowArtistsOrderedSetScreen } from "app/Scenes/Onboarding/Screens/Onboarding/Components/FollowArtistsOrderedSet"
import { mockTrackEvent } from "app/utils/tests/globallyMockedStuff"
import { setupTestWrapper } from "app/utils/tests/setupTestWrapper"

describe("FollowArtistsOrderedSet", () => {
  const { renderWithRelay } = setupTestWrapper({
    Component: FollowArtistsOrderedSetScreen,
  })

  it("tracks the artist's slug when followed", async () => {
    const { mockResolveLastOperation } = renderWithRelay(
      {
        Artist: () => ({
          internalID: "artist-internal-id",
          slug: "banksy",
          isFollowed: false,
        }),
      },
      { id: "onboarding:suggested-artists" }
    )

    await waitForElementToBeRemoved(() =>
      screen.queryByTestId("FollowArtistsOrderedSetPlaceholder")
    )

    fireEvent.press(screen.getAllByText("Follow")[0])

    mockResolveLastOperation({})

    expect(mockTrackEvent).toHaveBeenCalledWith({
      action: ActionType.followedArtist,
      context_module: ContextModule.onboardingFlow,
      context_owner_type: OwnerType.savesAndFollows,
      owner_id: "artist-internal-id",
      owner_slug: "banksy",
      owner_type: OwnerType.artist,
    })
  })

  describe("the 'Leading artists on Artsy' section", () => {
    it("shows the heading and separator when there are followed artists and artists left to follow", async () => {
      renderWithRelay(
        {
          Artist: () => ({
            internalID: "artist-internal-id",
            slug: "banksy",
            isFollowed: false,
          }),
        },
        { id: "onboarding:suggested-artists", hasFollowedArtists: true, hideFollowedArtists: true }
      )

      await waitForElementToBeRemoved(() =>
        screen.queryByTestId("FollowArtistsOrderedSetPlaceholder")
      )

      expect(screen.getByText("Leading artists on Artsy")).toBeOnTheScreen()
      expect(screen.UNSAFE_queryAllByType(Separator)).toHaveLength(1)
    })

    it("shows the heading but not the separator when there are no followed artists yet", async () => {
      renderWithRelay(
        {
          Artist: () => ({
            internalID: "artist-internal-id",
            slug: "banksy",
            isFollowed: false,
          }),
        },
        { id: "onboarding:suggested-artists", hideFollowedArtists: true }
      )

      await waitForElementToBeRemoved(() =>
        screen.queryByTestId("FollowArtistsOrderedSetPlaceholder")
      )

      expect(screen.getByText("Leading artists on Artsy")).toBeOnTheScreen()
      expect(screen.UNSAFE_queryAllByType(Separator)).toHaveLength(0)
    })

    it("hides the heading and separator when every artist in the set has already been followed", async () => {
      renderWithRelay(
        {
          Artist: () => ({
            internalID: "artist-internal-id",
            slug: "banksy",
            isFollowed: true,
          }),
        },
        { id: "onboarding:suggested-artists", hasFollowedArtists: true, hideFollowedArtists: true }
      )

      await waitForElementToBeRemoved(() =>
        screen.queryByTestId("FollowArtistsOrderedSetPlaceholder")
      )

      expect(screen.queryByText("Leading artists on Artsy")).not.toBeOnTheScreen()
      expect(screen.UNSAFE_queryAllByType(Separator)).toHaveLength(0)
    })
  })
})
