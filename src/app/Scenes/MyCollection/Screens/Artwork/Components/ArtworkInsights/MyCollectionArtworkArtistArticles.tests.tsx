import { ActionType, ContextModule, OwnerType } from "@artsy/cohesion"
import { MyCollectionArtworkArtistArticlesTestsQuery } from "__generated__/MyCollectionArtworkArtistArticlesTestsQuery.graphql"
import { CaretButton } from "app/Components/Buttons/CaretButton"
import { navigate } from "app/navigation/navigate"
import { extractText } from "app/tests/extractText"
import { mockTrackEvent } from "app/tests/globallyMockedStuff"
import { renderWithWrappersLEGACY } from "app/tests/renderWithWrappers"
import { Image, TouchableOpacity } from "react-native"
import { graphql, QueryRenderer } from "react-relay"

import { getMockRelayEnvironment } from "app/relay/defaultEnvironment"
import { resolveMostRecentRelayOperation } from "app/tests/resolveMostRecentRelayOperation"
import { MyCollectionArtworkArtistArticlesFragmentContainer } from "./MyCollectionArtworkArtistArticles"

describe("MyCollectionArtworkArtistArticles", () => {
  const TestRenderer = () => (
    <QueryRenderer<MyCollectionArtworkArtistArticlesTestsQuery>
      environment={getMockRelayEnvironment()}
      query={graphql`
        query MyCollectionArtworkArtistArticlesTestsQuery @relay_test_operation {
          artwork(id: "some-slug") {
            ...MyCollectionArtworkArtistArticles_artwork
          }
        }
      `}
      variables={{}}
      render={({ props }) => {
        if (props?.artwork) {
          return <MyCollectionArtworkArtistArticlesFragmentContainer artwork={props.artwork} />
        }
        return null
      }}
    />
  )

  afterEach(() => {
    jest.clearAllMocks()
  })

  it("renders without throwing an error", () => {
    const wrapper = renderWithWrappersLEGACY(<TestRenderer />)
    resolveMostRecentRelayOperation({
      Artwork: () => ({
        artist: {
          name: "Banksy",
        },
      }),
    })
    expect(wrapper.root.findByType(Image)).toBeDefined()
    const text = extractText(wrapper.root)
    expect(text).toContain("Latest Articles featuring Banksy")
    expect(text).toContain("thumbnailTitle")
    expect(text).toContain("publishedAt")
  })

  it("navigates to correct article on click", () => {
    const wrapper = renderWithWrappersLEGACY(<TestRenderer />)
    resolveMostRecentRelayOperation({
      Artwork: () => ({
        artist: {
          articlesConnection: {
            edges: [
              {
                node: {
                  slug: "some-slug",
                },
              },
            ],
          },
        },
      }),
    })
    wrapper.root.findAllByType(TouchableOpacity)[0].props.onPress()
    expect(navigate).toHaveBeenCalledWith("/article/some-slug")
  })

  it("navigates to all articles on click", () => {
    const wrapper = renderWithWrappersLEGACY(<TestRenderer />)
    resolveMostRecentRelayOperation({
      Artist: () => ({
        slug: "artist-slug",
      }),
    })
    wrapper.root.findAllByType(CaretButton)[0].props.onPress()
    expect(navigate).toHaveBeenCalledWith("/artist/artist-slug/articles")
  })

  it("tracks taps on all articles button", () => {
    const wrapper = renderWithWrappersLEGACY(<TestRenderer />)
    resolveMostRecentRelayOperation({
      Artwork: () => ({
        internalID: "some-id",
        slug: "some-slug",
      }),
      Artist: () => ({
        slug: "artist-slug",
      }),
    })
    wrapper.root.findAllByType(CaretButton)[0].props.onPress()
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
