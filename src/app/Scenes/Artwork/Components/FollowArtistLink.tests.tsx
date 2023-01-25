import { fireEvent } from "@testing-library/react-native"
import { FollowArtistLinkTestsQuery } from "__generated__/FollowArtistLinkTestsQuery.graphql"
import { rejectMostRecentRelayOperation } from "app/utils/tests/rejectMostRecentRelayOperation"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"
import { resolveMostRecentRelayOperation } from "app/utils/tests/resolveMostRecentRelayOperation"
import { graphql, QueryRenderer } from "react-relay"
import { createMockEnvironment } from "relay-test-utils"
import { FollowArtistLinkFragmentContainer } from "./FollowArtistLink"


describe("FollowArtistLink", () => {
  let mockEnvironment: ReturnType<typeof createMockEnvironment>

  const TestWrapper = () => {
    return (
      <QueryRenderer<FollowArtistLinkTestsQuery>
        environment={mockEnvironment}
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

  beforeEach(() => {
    mockEnvironment = createMockEnvironment()
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it("renders button text correctly", () => {
    const { getByText } = renderWithWrappers(<TestWrapper />)

    resolveMostRecentRelayOperation(mockEnvironment, {
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

      resolveMostRecentRelayOperation(mockEnvironment, {
        Artist: () => followArtistLinkArtistFollowed,
      })

      expect(queryByText("Follow")).toBeFalsy()
      expect(getByText("Following")).toBeTruthy()

      fireEvent.press(getByText("Following"))

      resolveMostRecentRelayOperation(mockEnvironment, {
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

      resolveMostRecentRelayOperation(mockEnvironment, {
        Artist: () => followArtistLinkArtist,
      })

      expect(getByText("Follow")).toBeTruthy()
      expect(queryByText("Following")).toBeFalsy()

      fireEvent.press(getByText("Follow"))

      resolveMostRecentRelayOperation(mockEnvironment, {
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

      resolveMostRecentRelayOperation(mockEnvironment, {
        Artist: () => followArtistLinkArtist,
      })

      fireEvent.press(getByText("Follow"))

      rejectMostRecentRelayOperation(mockEnvironment, new Error())

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
