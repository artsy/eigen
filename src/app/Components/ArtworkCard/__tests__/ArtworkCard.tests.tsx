import { fireEvent, screen } from "@testing-library/react-native"
import { ArtworkCardTestsQuery } from "__generated__/ArtworkCardTestsQuery.graphql"
import { ArtworkCard } from "app/Components/ArtworkCard/ArtworkCard"
import { __globalStoreTestUtils__ } from "app/store/GlobalStore"
import { setupTestWrapper } from "app/utils/tests/setupTestWrapper"
import { graphql } from "react-relay"

describe("ArtworkCard", () => {
  let defaultProps: any

  const { renderWithRelay } = setupTestWrapper<ArtworkCardTestsQuery>({
    Component: (props) => {
      return <ArtworkCard artwork={props.artwork} index={0} {...defaultProps} />
    },
    query: graphql`
      query ArtworkCardTestsQuery @relay_test_operation {
        artwork(id: "test-artwork-id") {
          ...ArtworkCard_artwork
        }
      }
    `,
  })

  beforeEach(() => {
    __globalStoreTestUtils__?.injectFeatureFlags({
      AREnableArtworkSaveIconAnimation: false,
    })
    defaultProps = {
      supportMultipleImages: false,
      showPager: false,
    }
  })

  it("renders artwork card with basic information", () => {
    renderWithRelay({
      Artwork: () => ({
        internalID: "test-artwork-id",
        title: "Test Artwork",
        date: "2024",
        slug: "test-artwork-slug",
        artists: [
          {
            internalID: "artist-1",
            name: "Test Artist",
          },
        ],
        images: [
          {
            url: "https://example.com/image.jpg",
            width: 800,
            height: 600,
            aspectRatio: 1.33,
            blurhash: "test-blurhash",
          },
        ],
        isSaved: false,
      }),
    })

    expect(screen.getByText("Test Artist")).toBeOnTheScreen()
    expect(screen.getByText(/Test Artwork, 2024/)).toBeOnTheScreen()
    expect(screen.getByTestId("save-artwork-icon")).toBeOnTheScreen()
  })

  it("shows 'Saved' text when artwork is saved", () => {
    renderWithRelay({
      Artwork: () => ({
        internalID: "test-artwork-id",
        title: "Test Artwork",
        date: "2024",
        slug: "test-artwork-slug",
        artists: [
          {
            internalID: "artist-1",
            name: "Test Artist",
          },
        ],
        images: [
          {
            url: "https://example.com/image.jpg",
            width: 800,
            height: 600,
            aspectRatio: 1.33,
            blurhash: "test-blurhash",
          },
        ],
        isSaved: true,
      }),
    })

    expect(screen.getByText("Saved")).toBeOnTheScreen()
  })

  it("renders multiple images when supportMultipleImages is true", () => {
    defaultProps = {
      supportMultipleImages: true,
      showPager: true,
    }
    renderWithRelay({
      Artwork: () => ({
        internalID: "test-artwork-id",
        title: "Test Artwork",
        date: "2024",
        slug: "test-artwork-slug",
        artists: [
          {
            internalID: "artist-1",
            name: "Test Artist",
          },
        ],
        images: [
          {
            url: "https://example.com/image1.jpg",
            width: 800,
            height: 600,
            aspectRatio: 1.33,
            blurhash: "test-blurhash-1",
          },
          {
            url: "https://example.com/image2.jpg",
            width: 800,
            height: 600,
            aspectRatio: 1.33,
            blurhash: "test-blurhash-2",
          },
        ],
        isSaved: false,
      }),
    })

    expect(screen.getByText("Test Artist")).toBeOnTheScreen()
  })

  it("handles save button press", () => {
    renderWithRelay({
      Artwork: () => ({
        internalID: "test-artwork-id",
        title: "Test Artwork",
        date: "2024",
        slug: "test-artwork-slug",
        artists: [
          {
            internalID: "artist-1",
            name: "Test Artist",
          },
        ],
        images: [
          {
            url: "https://example.com/image.jpg",
            width: 800,
            height: 600,
            aspectRatio: 1.33,
            blurhash: "test-blurhash",
          },
        ],
        isSaved: false,
      }),
    })

    const saveButton = screen.getByTestId("save-artwork-icon")
    expect(saveButton).toBeOnTheScreen()

    fireEvent.press(saveButton)

    expect(screen.getByText("Saved")).toBeOnTheScreen()
  })

  it("renders sale message when available", () => {
    renderWithRelay({
      Artwork: () => ({
        internalID: "test-artwork-id",
        title: "Test Artwork",
        date: "2024",
        slug: "test-artwork-slug",
        saleMessage: "$5,000",
        artists: [
          {
            internalID: "artist-1",
            name: "Test Artist",
          },
        ],
        images: [
          {
            url: "https://example.com/image.jpg",
            width: 800,
            height: 600,
            aspectRatio: 1.33,
            blurhash: "test-blurhash",
          },
        ],
        isSaved: false,
      }),
    })

    expect(screen.getByText("$5,000")).toBeOnTheScreen()
  })

  it("does not render artist section when no artists", () => {
    renderWithRelay({
      Artwork: () => ({
        internalID: "test-artwork-id",
        title: "Test Artwork",
        date: "2024",
        slug: "test-artwork-slug",
        artists: [], // No artists
        images: [
          {
            url: "https://example.com/image.jpg",
            width: 800,
            height: 600,
            aspectRatio: 1.33,
            blurhash: "test-blurhash",
          },
        ],
        isSaved: false,
      }),
    })

    expect(screen.getByText(/Test Artwork, 2024/)).toBeOnTheScreen()
    expect(screen.getByTestId("save-artwork-icon")).toBeOnTheScreen()
    expect(screen.queryByText("Test Artist")).not.toBeOnTheScreen()
  })
})
