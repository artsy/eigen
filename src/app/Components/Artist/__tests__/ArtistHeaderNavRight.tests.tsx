import { fireEvent, screen } from "@testing-library/react-native"
import { ArtistHeaderNavRightTestsQuery } from "__generated__/ArtistHeaderNavRightTestsQuery.graphql"
import { ArtistHeaderNavRight } from "app/Components/Artist/ArtistHeaderNavRight"
import { setupTestWrapper } from "app/utils/tests/setupTestWrapper"
import { graphql } from "react-relay"

// Mock the useScreenScrollContext hook
jest.mock("@artsy/palette-mobile/dist/elements/Screen/ScreenScrollContext", () => ({
  useScreenScrollContext: () => ({
    currentScrollY: 0,
    currentScrollYAnimated: {
      value: 0,
    },
    scrollYOffsetAnimated: {
      value: 0,
    },
    scrollYOffset: 0,
  }),
}))

// Mock the useFollowArtist hook
jest.mock("app/Components/Artist/useFollowArtist", () => ({
  useFollowArtist: () => ({
    handleFollowToggle: jest.fn(),
  }),
}))

const mockShowShareSheet = jest.fn()
jest.mock("app/Components/ShareSheet/ShareSheetContext", () => ({
  useShareSheet: () => ({
    showShareSheet: mockShowShareSheet,
  }),
}))

describe("ArtistHeaderNavRight", () => {
  const { renderWithRelay } = setupTestWrapper<ArtistHeaderNavRightTestsQuery>({
    Component: ({ artist }) => <ArtistHeaderNavRight artist={artist!} />,
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

  it("renders the share button", async () => {
    await renderWithRelay({
      Artist: () => mockArtist,
    })

    const shareButton = screen.getByLabelText("Share")
    expect(shareButton).toBeOnTheScreen()
  })

  it("calls onSharePress when share button is pressed", async () => {
    await renderWithRelay({
      Artist: () => mockArtist,
    })

    const shareButton = screen.getByLabelText("Share")
    await fireEvent.press(shareButton)

    expect(mockShowShareSheet).toHaveBeenCalledTimes(1)
  })

  it("renders the follow button when artist is not followed", async () => {
    await renderWithRelay({
      Artist: () => ({
        ...mockArtist,
        isFollowed: false,
      }),
    })

    expect(screen.getByText("Follow 100")).toBeOnTheScreen()
  })

  it("renders the follow button when artist is followed", async () => {
    await renderWithRelay({
      Artist: () => ({
        ...mockArtist,
        isFollowed: true,
      }),
    })

    expect(screen.getByText("Following 100")).toBeOnTheScreen()
  })

  it("displays the follow count when available", async () => {
    await renderWithRelay({
      Artist: () => ({
        ...mockArtist,
        isFollowed: false,
        counts: {
          follows: 1234,
        },
      }),
    })

    expect(screen.getByText("Follow 1.2K")).toBeOnTheScreen()
  })

  it("labels the follow button with the artist's name instead of the follower count", async () => {
    await renderWithRelay({
      Artist: () => ({
        ...mockArtist,
        name: "Test Artist",
        isFollowed: false,
      }),
    })

    // Palette's Button repeats the label on an inner view, so match the button role
    await fireEvent.press(screen.getByRole("button", { name: "Follow Test Artist" }))

    expect(screen.getByRole("button", { name: "Following Test Artist" })).toBeOnTheScreen()
  })

  it("handles follow/follow button press", async () => {
    await renderWithRelay({
      Artist: () => ({
        ...mockArtist,
        isFollowed: false,
      }),
    })

    const followButton = screen.getByText("Follow 100")
    await fireEvent.press(followButton)

    expect(screen.getByText("Following 100")).toBeOnTheScreen()

    const followButton2 = screen.getByText("Following 100")
    await fireEvent.press(followButton2)
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
