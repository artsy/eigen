import { fireEvent, screen } from "@testing-library/react-native"
import { ArtistHeaderNavRightTestsQuery } from "__generated__/ArtistHeaderNavRightTestsQuery.graphql"
import { ArtistHeaderNavRight } from "app/Components/Artist/ArtistHeaderNavRight"
import { setupTestWrapper } from "app/utils/tests/setupTestWrapper"
import { graphql } from "react-relay"

// Mock the useScreenScrollContext hook
jest.mock("@artsy/palette-mobile/dist/elements/Screen/ScreenScrollContext", () => ({
  useScreenScrollContext: () => ({
    currentScrollY: 0,
    scrollYOffset: 0,
  }),
}))

// Mock the useFollowArtist hook
jest.mock("app/Components/Artist/useFollowArtist", () => ({
  useFollowArtist: () => ({
    handleFollowToggle: jest.fn(),
  }),
}))

describe("ArtistHeaderNavRight", () => {
  const mockOnSharePress = jest.fn()

  const { renderWithRelay } = setupTestWrapper<ArtistHeaderNavRightTestsQuery>({
    Component: ({ artist }) => (
      <ArtistHeaderNavRight artist={artist!} onSharePress={mockOnSharePress} />
    ),
    query: graphql`
      query ArtistHeaderNavRightTestsQuery @relay_test_operation {
        artist(id: "artist-id") {
          ...ArtistHeaderNavRight_artist
        }
      }
    `,
  })

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it("renders the share button", () => {
    renderWithRelay({
      Artist: () => mockArtist,
    })

    const shareButton = screen.getByLabelText("Share")
    expect(shareButton).toBeOnTheScreen()
  })

  it("calls onSharePress when share button is pressed", () => {
    renderWithRelay({
      Artist: () => mockArtist,
    })

    const shareButton = screen.getByLabelText("Share")
    fireEvent.press(shareButton)

    expect(mockOnSharePress).toHaveBeenCalledTimes(1)
  })

  it("renders the follow button when artist is not followed", () => {
    renderWithRelay({
      Artist: () => ({
        ...mockArtist,
        isFollowed: false,
      }),
    })

    expect(screen.getByText("Follow")).toBeOnTheScreen()
  })

  it("renders the follow button when artist is followed", () => {
    renderWithRelay({
      Artist: () => ({
        ...mockArtist,
        isFollowed: true,
      }),
    })

    expect(screen.getByText("Following")).toBeOnTheScreen()
  })

  it("displays the follow count when available", () => {
    renderWithRelay({
      Artist: () => ({
        ...mockArtist,
        isFollowed: false,
        counts: {
          follows: 1234,
        },
      }),
    })

    expect(screen.getByText("Follow")).toBeOnTheScreen()
    expect(screen.getByText("1.2K")).toBeOnTheScreen()
    // The follow count should be displayed in the FollowButton component
  })

  it("handles follow/follow button press", () => {
    renderWithRelay({
      Artist: () => ({
        ...mockArtist,
        isFollowed: false,
      }),
    })

    const followButton = screen.getByText("Follow")
    fireEvent.press(followButton)

    expect(screen.getByText("Following")).toBeOnTheScreen()

    const followButton2 = screen.getByText("Following")
    fireEvent.press(followButton2)
  })
})

const mockArtist = {
  id: "artist-id",
  internalID: "artist-internal-id",
  slug: "artist-slug",
  isFollowed: false,
  counts: {
    follows: 100,
  },
}
