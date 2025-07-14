import { fireEvent, screen } from "@testing-library/react-native"
import { InfiniteDiscoveryNegativeSignals } from "app/Scenes/InfiniteDiscovery/Components/InfiniteDiscoveryNegativeSignals"
import { setupTestWrapper } from "app/utils/tests/setupTestWrapper"
import { Alert } from "react-native"
import RNShare from "react-native-share"
import { graphql } from "react-relay"

jest.mock("react-native-share", () => ({
  open: jest.fn(),
}))

const mockCommitMutation = jest.fn()

jest.mock("app/Scenes/InfiniteDiscovery/hooks/useExcludeArtistFromDiscovery", () => ({
  useExcludeArtistFromDiscovery: () => [mockCommitMutation, false],
}))

// Mock Alert.alert
jest.spyOn(Alert, "alert").mockImplementation(jest.fn())

describe("InfiniteDiscoveryNegativeSignals", () => {
  const { renderWithRelay } = setupTestWrapper({
    Component: InfiniteDiscoveryNegativeSignals,
    query: graphql`
      query InfiniteDiscoveryNegativeSignalsTestQuery @relay_test_operation {
        artwork(id: "artwork-id") {
          ...InfiniteDiscoveryNegativeSignals_artwork
        }
      }
    `,
  })

  beforeEach(() => {
    jest.clearAllMocks()
    ;(RNShare.open as jest.Mock).mockResolvedValue({ success: true, message: "shared" })
  })

  it("renders artwork information", () => {
    renderWithRelay({
      Artwork: () => ({
        artistNames: "Test Artist",
        date: "2023",
        title: "Test Artwork",
        saleMessage: "$1,000",
        href: "/artwork/test-artwork",
        internalID: "artwork-id",
        slug: "test-artwork",
        artists: [{ internalID: "artist-id" }],
        image: {
          url: "https://example.com/image.jpg",
          aspectRatio: 1.33,
          width: 800,
          height: 600,
          blurhash: "LGFFaS%2IV00%MRjMxRj",
        },
      }),
    })

    expect(screen.getByText("Test Artist")).toBeOnTheScreen()
    expect(screen.getByText("Test Artwork, 2023")).toBeOnTheScreen()
    expect(screen.getByText("$1,000")).toBeOnTheScreen()
    expect(screen.getByText("Share Artist")).toBeOnTheScreen()
    expect(screen.getByText("See fewer artworks by this artist")).toBeOnTheScreen()
  })

  it("opens share sheet when share button is pressed", async () => {
    renderWithRelay({
      Artwork: () => ({
        artistNames: "Test Artist",
        date: "2023",
        title: "Test Artwork",
        saleMessage: "$1,000",
        href: "/artwork/test-artwork",
        internalID: "artwork-id",
        slug: "test-artwork",
        artists: [{ internalID: "artist-id" }],
        image: {
          url: "https://example.com/image.jpg",
          aspectRatio: 1.33,
        },
      }),
    })

    const shareButtons = screen.getAllByLabelText("Share artwork")
    fireEvent.press(shareButtons[0])

    expect(RNShare.open).toHaveBeenCalledWith({
      title: "Test Artwork",
      message:
        "View Test Artwork on Artsy\nhttps://staging.artsy.net/artwork/test-artwork?utm_content=discover-daily-share&utm_medium=product-share",
      failOnCancel: false,
    })
  })

  it("shows alert when 'See fewer artworks by this artist' is pressed", () => {
    renderWithRelay({
      Artwork: () => ({
        artistNames: "Test Artist",
        date: "2023",
        title: "Test Artwork",
        saleMessage: "$1,000",
        href: "/artwork/test-artwork",
        internalID: "artwork-id",
        slug: "test-artwork",
        artists: [{ internalID: "artist-id" }],
        image: null,
      }),
    })

    const excludeButton = screen.getByText("See fewer artworks by this artist")
    fireEvent.press(excludeButton)

    expect(Alert.alert).toHaveBeenCalledWith(
      "Do you want to stop seeing works from this artist entirely?",
      undefined,
      expect.arrayContaining([
        expect.objectContaining({ text: "Yes" }),
        expect.objectContaining({ text: "No" }),
      ])
    )
  })

  it("executes mutation when user confirms exclusion", () => {
    renderWithRelay({
      Artwork: () => ({
        artistNames: "Test Artist",
        date: "2023",
        title: "Test Artwork",
        saleMessage: "$1,000",
        href: "/artwork/test-artwork",
        internalID: "artwork-id",
        slug: "test-artwork",
        artists: [{ internalID: "artist-id" }],
        image: null,
      }),
    })

    const excludeButton = screen.getByText("See fewer artworks by this artist")
    fireEvent.press(excludeButton)

    // Simulate user pressing "Yes"
    const alertCall = (Alert.alert as jest.Mock).mock.calls[0]
    const yesButton = alertCall[2]?.find((button: any) => button.text === "Yes")
    yesButton?.onPress()

    expect(mockCommitMutation).toHaveBeenCalledWith({
      variables: { input: { artistId: "artist-id" } },
      onError: expect.any(Function),
    })
  })

  it("renders with missing optional data", () => {
    renderWithRelay({
      Artwork: () => ({
        artistNames: "Test Artist",
        date: "",
        title: "Test Artwork",
        saleMessage: "Contact for price",
        href: "/artwork/test-artwork",
        internalID: "artwork-id",
        slug: "test-artwork",
        artists: [{ internalID: "artist-id" }],
        image: null,
      }),
    })

    expect(screen.getByText("Test Artist")).toBeOnTheScreen()
    expect(screen.getByText("Test Artwork, ")).toBeOnTheScreen()
    expect(screen.getByText("Contact for price")).toBeOnTheScreen()
  })

  it("renders with null image", () => {
    renderWithRelay({
      Artwork: () => ({
        artistNames: "Test Artist",
        date: "2023",
        title: "Test Artwork",
        saleMessage: "$1,000",
        href: "/artwork/test-artwork",
        internalID: "artwork-id",
        slug: "test-artwork",
        artists: [{ internalID: "artist-id" }],
        image: null,
      }),
    })

    expect(screen.getByText("Test Artist")).toBeOnTheScreen()
    expect(screen.getByText("Test Artwork, 2023")).toBeOnTheScreen()
  })
})
