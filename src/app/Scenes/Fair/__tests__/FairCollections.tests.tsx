import { screen, fireEvent } from "@testing-library/react-native"
import { FairCollectionsTestsQuery } from "__generated__/FairCollectionsTestsQuery.graphql"
import { FairCollectionsFragmentContainer } from "app/Scenes/Fair/Components/FairCollections"
import { mockTrackEvent } from "app/utils/tests/globallyMockedStuff"
import { setupTestWrapper } from "app/utils/tests/setupTestWrapper"
import { graphql } from "react-relay"

jest.mock("@d11/react-native-fast-image", () => {
  const React = require("react")
  const { View } = require("react-native")
  const FastImage = (props: any) => React.createElement(View, { testID: "fast-image", ...props })
  FastImage.resizeMode = { cover: "cover", contain: "contain" }
  return FastImage
})

describe("FairCollections", () => {
  const { renderWithRelay } = setupTestWrapper<FairCollectionsTestsQuery>({
    Component: ({ fair }) => <FairCollectionsFragmentContainer fair={fair!} />,
    query: graphql`
      query FairCollectionsTestsQuery($fairID: String!) @relay_test_operation {
        fair(id: $fairID) {
          ...FairCollections_fair
        }
      }
    `,
  })

  it("renders the 2 collections", () => {
    renderWithRelay({
      Fair: () => ({
        marketingCollections: [
          {
            title: "Big Artists, Small Sculptures",
            category: "Collectible Sculptures",
          },
          {
            title: "Example Collection 2",
            category: "Subtitle 2",
          },
        ],
      }),
    })

    expect(screen.getByText("Big Artists, Small Sculptures")).toBeOnTheScreen()
    expect(screen.getByText("Collectible Sculptures")).toBeOnTheScreen()
    expect(screen.getByText("Example Collection 2")).toBeOnTheScreen()
    expect(screen.getByText("Subtitle 2")).toBeOnTheScreen()
  })

  it("tracks taps on collections", () => {
    renderWithRelay({
      Fair: () => ({
        internalID: "abc123",
        slug: "art-basel-hong-kong-2020",
        marketingCollections: [
          {
            slug: "collectible-sculptures",
            title: "Big Artists, Small Sculptures",
          },
        ],
      }),
    })

    const collection = screen.getByText("Big Artists, Small Sculptures")
    fireEvent.press(collection)

    expect(mockTrackEvent).toHaveBeenCalledWith({
      action: "tappedCollectionGroup",
      context_module: "curatedHighlightsRail",
      context_screen_owner_type: "fair",
      context_screen_owner_id: "abc123",
      context_screen_owner_slug: "art-basel-hong-kong-2020",
      destination_screen_owner_type: "collection",
      destination_screen_owner_id: "collectible-sculptures",
      destination_screen_owner_slug: "collectible-sculptures",
      type: "thumbnail",
    })
  })

  it("renders images sourced from representative artworks", () => {
    renderWithRelay({
      Fair: () => ({
        marketingCollections: [
          {
            title: "Big Artists, Small Sculptures",
            representativeArtworks: [
              { image: { url: "https://example.com/image-1.jpg" } },
              { image: { url: "https://example.com/image-2.jpg" } },
              { image: { url: "https://example.com/image-3.jpg" } },
            ],
          },
        ],
      }),
    })

    const uris = screen.getAllByTestId("fast-image").map((image) => image.props.source.uri)
    expect(uris).toEqual([
      "https://example.com/image-1.jpg",
      "https://example.com/image-2.jpg",
      "https://example.com/image-3.jpg",
    ])
  })

  it("renders without image URLs when a collection has no representative artworks", () => {
    renderWithRelay({
      Fair: () => ({
        marketingCollections: [
          { title: "Big Artists, Small Sculptures", representativeArtworks: [] },
        ],
      }),
    })

    expect(screen.getByText("Big Artists, Small Sculptures")).toBeOnTheScreen()
    const uris = screen.getAllByTestId("fast-image").map((image) => image.props.source.uri)
    expect(uris.every((uri) => uri === undefined)).toBe(true)
  })

  it("renders null if there are no collections", () => {
    renderWithRelay({
      Fair: () => ({
        marketingCollections: [],
      }),
    })

    expect(screen.queryByText("Curated Highlights")).not.toBeOnTheScreen()
  })
})
