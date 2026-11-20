import { ActionType, ContextModule, OwnerType } from "@artsy/cohesion"
import { fireEvent, screen } from "@testing-library/react-native"
import { FollowArtistsOrderedSetScreen } from "app/Scenes/Onboarding/Screens/Onboarding/Components/FollowArtistsOrderedSet"
import { mockTrackEvent } from "app/utils/tests/globallyMockedStuff"
import { setupTestWrapper } from "app/utils/tests/setupTestWrapper"

jest.mock("@artsy/palette-mobile", () => {
  const { View } = jest.requireActual("react-native")
  return {
    ...jest.requireActual("@artsy/palette-mobile"),
    Separator: () => <View testID="separator" />,
  }
})

describe("FollowArtistsOrderedSet", () => {
  const { renderWithRelay } = setupTestWrapper({
    Component: FollowArtistsOrderedSetScreen,
  })

  it("tracks the artist's slug when followed", async () => {
    const { mockResolveLastOperation } = await renderWithRelay(
      {
        Artist: () => ({
          internalID: "artist-internal-id",
          slug: "banksy",
          isFollowed: false,
        }),
      },
      { id: "onboarding:suggested-artists" }
    )

    expect(screen.queryByTestId("FollowArtistsOrderedSetPlaceholder")).not.toBeOnTheScreen()

    await fireEvent.press(screen.getAllByText("Follow")[0])

    await mockResolveLastOperation({})

    expect(mockTrackEvent).toHaveBeenCalledWith({
      action: ActionType.followedArtist,
      context_module: ContextModule.onboardingFlow,
      context_owner_type: OwnerType.savesAndFollows,
      owner_id: "artist-internal-id",
      owner_slug: "banksy",
      owner_type: OwnerType.artist,
    })
  })

  describe("the 'Popular on Artsy' section", () => {
    it("shows the heading and separator when there are followed artists and artists left to follow", async () => {
      await renderWithRelay(
        {
          Artist: () => ({
            internalID: "artist-internal-id",
            slug: "banksy",
            isFollowed: false,
          }),
        },
        { id: "onboarding:suggested-artists", hasFollowedArtists: true, hideFollowedArtists: true }
      )

      expect(screen.queryByTestId("FollowArtistsOrderedSetPlaceholder")).not.toBeOnTheScreen()

      expect(screen.getByText("Popular on Artsy")).toBeOnTheScreen()
      expect(screen.getAllByTestId("separator")).toHaveLength(1)
    })

    it("shows the heading but not the separator when there are no followed artists yet", async () => {
      await renderWithRelay(
        {
          Artist: () => ({
            internalID: "artist-internal-id",
            slug: "banksy",
            isFollowed: false,
          }),
        },
        { id: "onboarding:suggested-artists", hideFollowedArtists: true }
      )

      expect(screen.queryByTestId("FollowArtistsOrderedSetPlaceholder")).not.toBeOnTheScreen()

      expect(screen.getByText("Popular on Artsy")).toBeOnTheScreen()
      expect(screen.queryAllByTestId("separator")).toHaveLength(0)
    })

    it("hides the heading and separator when every artist in the set has already been followed", async () => {
      await renderWithRelay(
        {
          Artist: () => ({
            internalID: "artist-internal-id",
            slug: "banksy",
            isFollowed: true,
          }),
        },
        { id: "onboarding:suggested-artists", hasFollowedArtists: true, hideFollowedArtists: true }
      )

      expect(screen.queryByTestId("FollowArtistsOrderedSetPlaceholder")).not.toBeOnTheScreen()

      expect(screen.queryByText("Popular on Artsy")).not.toBeOnTheScreen()
      expect(screen.queryAllByTestId("separator")).toHaveLength(0)
    })
  })
})
