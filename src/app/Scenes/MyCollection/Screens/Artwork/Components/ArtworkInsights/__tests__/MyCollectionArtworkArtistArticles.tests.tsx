import { ActionType, ContextModule, OwnerType } from "@artsy/cohesion"
import { fireEvent, screen } from "@testing-library/react-native"
import { MyCollectionArtworkArtistArticlesTestsQuery } from "__generated__/MyCollectionArtworkArtistArticlesTestsQuery.graphql"
import { MyCollectionArtworkArtistArticlesFragmentContainer } from "app/Scenes/MyCollection/Screens/Artwork/Components/ArtworkInsights/MyCollectionArtworkArtistArticles"
import { navigate } from "app/system/navigation/navigate"
import { mockTrackEvent } from "app/utils/tests/globallyMockedStuff"
import { setupTestWrapper } from "app/utils/tests/setupTestWrapper"
import { graphql } from "react-relay"

describe("MyCollectionArtworkArtistArticles", () => {
  const { renderWithRelay } = setupTestWrapper<MyCollectionArtworkArtistArticlesTestsQuery>({
    Component: ({ artwork }) => (
      <MyCollectionArtworkArtistArticlesFragmentContainer artwork={artwork!} />
    ),
    query: graphql`
      query MyCollectionArtworkArtistArticlesTestsQuery @relay_test_operation {
        artwork(id: "some-slug") {
          ...MyCollectionArtworkArtistArticles_artwork
        }
      }
    `,
  })

  it("renders without throwing an error", () => {
    renderWithRelay({
      Artwork: () => ({
        artist: {
          name: "Banksy",
        },
      }),
      Article: () => ({
        thumbnailTitle: "Some Article Title",
        publishedAt: "publishedAt",
      }),
    })

    expect(screen.getByTestId("article-thumbnail-image")).toBeOnTheScreen()

    expect(screen.getByText("Latest Articles featuring Banksy")).toBeOnTheScreen()
    expect(screen.getByText("Some Article Title")).toBeOnTheScreen()
    expect(screen.getByText("publishedAt")).toBeOnTheScreen()
  })

  it("navigates to correct article on click", () => {
    renderWithRelay({
      Article: () => ({
        slug: "article-slug",
        thumbnailTitle: "Some Article Title",
      }),
    })

    fireEvent.press(screen.getByText("Some Article Title"))

    expect(navigate).toHaveBeenCalledWith("/article/article-slug")
  })

  it("navigates to all articles on click", () => {
    renderWithRelay({
      Artwork: () => ({
        artist: {
          slug: "banksy",
        },
      }),
    })

    fireEvent.press(screen.getByText("See all articles"))

    expect(navigate).toHaveBeenCalledWith("/artist/banksy/articles")
  })

  it("tracks taps on all articles button", () => {
    renderWithRelay({
      Artwork: () => ({
        internalID: "some-id",
        slug: "some-slug",
      }),
      Artist: () => ({
        slug: "artist-slug",
      }),
    })

    fireEvent.press(screen.getByText("See all articles"))

    expect(mockTrackEvent).toHaveBeenCalledTimes(1)
    expect(mockTrackEvent).toHaveBeenCalledWith({
      action: ActionType.tappedShowMore,
      context_module: ContextModule.relatedArticles,
      context_screen_owner_type: OwnerType.myCollectionArtwork,
      context_screen_owner_id: "some-id",
      context_screen_owner_slug: "some-slug",
      subject: "See all articles",
    })
  })
})
