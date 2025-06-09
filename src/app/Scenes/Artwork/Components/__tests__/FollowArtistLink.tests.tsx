import { fireEvent } from "@testing-library/react-native"
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

  it("renders button text correctly", () => {
    const { getByText } = renderWithRelay({
      Artist: () => followArtistLinkArtist,
    })

    expect(getByText("Follow")).toBeTruthy()
  })

  describe("Following an artist", () => {
    it("correctly displays when the artist is already followed, and allows unfollowing", () => {
      const followArtistLinkArtistFollowed = {
        ...followArtistLinkArtist,
        is_followed: true,
      }

      const { getByText, queryByText, env } = renderWithRelay({
        Artist: () => followArtistLinkArtistFollowed,
      })

      expect(queryByText("Follow")).toBeFalsy()
      expect(getByText("Following")).toBeTruthy()

      fireEvent.press(getByText("Following"))

      resolveMostRecentRelayOperation(env, {
        Artist: () => ({
          id: followArtistLinkArtist.id,
          is_followed: false,
        }),
      })

      expect(getByText("Follow")).toBeTruthy()
      expect(queryByText("Following")).toBeFalsy()
    })

    it("correctly displays when the artist is not followed, and allows following", () => {
      const { getByText, queryByText, env } = renderWithRelay({
        Artist: () => followArtistLinkArtist,
      })

      expect(getByText("Follow")).toBeTruthy()
      expect(queryByText("Following")).toBeFalsy()

      fireEvent.press(getByText("Follow"))

      resolveMostRecentRelayOperation(env, {
        Artist: () => ({
          id: followArtistLinkArtist.id,
          is_followed: true,
        }),
      })

      expect(getByText("Following")).toBeTruthy()
      expect(queryByText("Follow")).toBeFalsy()
    })

    it("handles errors in saving gracefully", async () => {
      const { getByText, env } = renderWithRelay({
        Artist: () => followArtistLinkArtist,
      })

      fireEvent.press(getByText("Follow"))

      rejectMostRecentRelayOperation(env, new Error())

      expect(getByText("Follow")).toBeTruthy()
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
