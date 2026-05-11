import { ContextModule, OwnerType } from "@artsy/cohesion"
import { fireEvent, screen } from "@testing-library/react-native"
import { ArtworkCardTestsQuery } from "__generated__/ArtworkCardTestsQuery.graphql"
import { ArtworkCard } from "app/Components/ArtworkCard/ArtworkCard"
import { mockTrackEvent } from "app/utils/tests/globallyMockedStuff"
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
    defaultProps = {
      supportMultipleImages: false,
      showPager: false,
    }
    mockTrackEvent.mockClear()
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

  it("tracks save with artwork entity id, slug, and context", () => {
    defaultProps = {
      ...defaultProps,
      contextModule: ContextModule.infiniteDiscoveryArtworkCard,
      ownerType: OwnerType.infiniteDiscoveryArtwork,
    }

    const { mockResolveLastOperation } = renderWithRelay({
      Artwork: () => ({
        id: "test-artwork-relay-id",
        internalID: "test-artwork-id",
        slug: "test-artwork-slug",
        isSaved: false,
      }),
      CollectionsConnection: () => ({
        totalCount: 0,
      }),
    })

    fireEvent.press(screen.getByTestId("save-artwork-icon"))

    mockResolveLastOperation({
      SaveArtworkPayload: () => ({
        artwork: {
          id: "test-artwork-id",
          isSaved: true,
          collectorSignals: null,
        },
        me: null,
      }),
    })

    expect(mockTrackEvent.mock.calls[0]).toMatchInlineSnapshot(`
      [
        {
          "action": "success",
          "action_name": "artworkSave",
          "action_type": "success",
          "context_module": "infiniteDiscoveryArtworkCard",
          "context_screen_owner_type": "infiniteDiscoveryArtwork",
          "item_id": "test-artwork-id",
          "item_slug": "test-artwork-slug",
        },
      ]
    `)
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

  it("renders thumbnails for multiple images", () => {
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
            width: 900,
            height: 700,
            aspectRatio: 1.29,
            blurhash: "test-blurhash-2",
          },
          {
            url: "https://example.com/image3.jpg",
            width: 1000,
            height: 800,
            aspectRatio: 1.25,
            blurhash: "test-blurhash-3",
          },
        ],
        isSaved: false,
      }),
    })

    // Should render 3 thumbnail images for the 3 provided images
    const images = screen.getAllByTestId("thumbnail-image")
    expect(images.length).toBe(3)
  })
})
