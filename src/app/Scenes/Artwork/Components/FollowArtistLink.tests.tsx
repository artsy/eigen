import { fireEvent } from "@testing-library/react-native"
import { FollowArtistLinkTestsQuery } from "__generated__/FollowArtistLinkTestsQuery.graphql"
import { getRelayEnvironment } from "app/relay/defaultEnvironment"
import { renderWithWrappers } from "app/tests/renderWithWrappers"
import {
  rejectMostRecentRelayOperation,
  resolveMostRecentRelayOperation,
} from "app/tests/resolveMostRecentRelayOperation"
import { graphql, QueryRenderer } from "react-relay"
import { FollowArtistLinkFragmentContainer } from "./FollowArtistLink"

describe("FollowArtistLink", () => {
  const TestWrapper = () => {
    return (
      <QueryRenderer<FollowArtistLinkTestsQuery>
        environment={getRelayEnvironment()}
        query={graphql`
          query FollowArtistLinkTestsQuery @relay_test_operation {
            artist(id: "artistID") {
              ...FollowArtistLink_artist
            }
          }
        `}
        variables={{}}
        render={({ props }) => {
          if (props?.artist) {
            return <FollowArtistLinkFragmentContainer artist={props.artist} />
          }

          return null
        }}
      />
    )
  }

  afterEach(() => {
    jest.clearAllMocks()
  })

  it("renders button text correctly", () => {
    const { getByText } = renderWithWrappers(<TestWrapper />)

    resolveMostRecentRelayOperation({
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

      const { getByText, queryByText } = renderWithWrappers(<TestWrapper />)

      resolveMostRecentRelayOperation({
        Artist: () => followArtistLinkArtistFollowed,
      })

      expect(queryByText("Follow")).toBeFalsy()
      expect(getByText("Following")).toBeTruthy()

      fireEvent.press(getByText("Following"))

      resolveMostRecentRelayOperation({
        Artist: () => ({
          id: followArtistLinkArtist.id,
          is_followed: false,
        }),
      })

      expect(getByText("Follow")).toBeTruthy()
      expect(queryByText("Following")).toBeFalsy()
    })

    it("correctly displays when the artist is not followed, and allows following", () => {
      const { getByText, queryByText } = renderWithWrappers(<TestWrapper />)

      resolveMostRecentRelayOperation({
        Artist: () => followArtistLinkArtist,
      })

      expect(getByText("Follow")).toBeTruthy()
      expect(queryByText("Following")).toBeFalsy()

      fireEvent.press(getByText("Follow"))

      resolveMostRecentRelayOperation({
        Artist: () => ({
          id: followArtistLinkArtist.id,
          is_followed: true,
        }),
      })

      expect(getByText("Following")).toBeTruthy()
      expect(queryByText("Follow")).toBeFalsy()
    })

    it("handles errors in saving gracefully", async () => {
      const { getByText } = renderWithWrappers(<TestWrapper />)

      resolveMostRecentRelayOperation({
        Artist: () => followArtistLinkArtist,
      })

      fireEvent.press(getByText("Follow"))

      rejectMostRecentRelayOperation(new Error())

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
