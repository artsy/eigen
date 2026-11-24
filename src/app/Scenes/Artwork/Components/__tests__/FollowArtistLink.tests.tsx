import { fireEvent, screen } from "@testing-library/react-native"
import { FollowArtistLinkTestsQuery } from "__generated__/FollowArtistLinkTestsQuery.graphql"
import { FollowArtistLinkFragmentContainer } from "app/Scenes/Artwork/Components/FollowArtistLink"
import { rejectMostRecentRelayOperation } from "app/utils/tests/rejectMostRecentRelayOperation"
import { resolveMostRecentRelayOperation } from "app/utils/tests/resolveMostRecentRelayOperation"
import { setupTestWrapper } from "app/utils/tests/setupTestWrapper"
import { graphql } from "react-relay"

describe("FollowArtistLink", () => {
  const { renderWithRelay } = setupTestWrapper<FollowArtistLinkTestsQuery>({
    Component: (props) => {
      if (props?.artist) {
        return <FollowArtistLinkFragmentContainer artist={props.artist} />
      }

      return null
    },
    query: graphql`
      query FollowArtistLinkTestsQuery @relay_test_operation {
        artist(id: "artistID") {
          ...FollowArtistLink_artist
        }
      }
    `,
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it("renders button text correctly", async () => {
    await renderWithRelay({
      Artist: () => followArtistLinkArtist,
    })

    expect(screen.getByText("Follow")).toBeTruthy()
  })

  describe("Following an artist", () => {
    it("correctly displays when the artist is already followed, and allows unfollowing", async () => {
      const followArtistLinkArtistFollowed = {
        ...followArtistLinkArtist,
        is_followed: true,
      }

      const { env } = await renderWithRelay({
        Artist: () => followArtistLinkArtistFollowed,
      })

      expect(screen.queryByText("Follow")).toBeFalsy()
      expect(screen.getByText("Following")).toBeTruthy()

      await fireEvent.press(screen.getByText("Following"))

      await resolveMostRecentRelayOperation(env, {
        Artist: () => ({
          id: followArtistLinkArtist.id,
          is_followed: false,
        }),
      })

      expect(screen.getByText("Follow")).toBeTruthy()
      expect(screen.queryByText("Following")).toBeFalsy()
    })

    it("correctly displays when the artist is not followed, and allows following", async () => {
      const { env } = await renderWithRelay({
        Artist: () => followArtistLinkArtist,
      })

      expect(screen.getByText("Follow")).toBeTruthy()
      expect(screen.queryByText("Following")).toBeFalsy()

      await fireEvent.press(screen.getByText("Follow"))

      await resolveMostRecentRelayOperation(env, {
        Artist: () => ({
          id: followArtistLinkArtist.id,
          is_followed: true,
        }),
      })

      expect(screen.getByText("Following")).toBeTruthy()
      expect(screen.queryByText("Follow")).toBeFalsy()
    })

    it("handles errors in saving gracefully", async () => {
      const { env } = await renderWithRelay({
        Artist: () => followArtistLinkArtist,
      })

      await fireEvent.press(screen.getByText("Follow"))

      await rejectMostRecentRelayOperation(env, new Error())

      expect(screen.getByText("Follow")).toBeTruthy()
    })
  })
})

const followArtistLinkArtist = {
  id: "12345",
  slug: "andy-warhol",
  internalID: "12345",
  gravityID: "andy-warhol",
  is_followed: false,
}
