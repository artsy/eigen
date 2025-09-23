import { ActionType, ContextModule, OwnerType, TappedShowMore } from "@artsy/cohesion"
import { Box, Flex, Separator, Spacer, Text } from "@artsy/palette-mobile"
import { MyCollectionArtworkArtistArticles_artwork$data } from "__generated__/MyCollectionArtworkArtistArticles_artwork.graphql"
import { CaretButton } from "app/Components/Buttons/CaretButton"
import { ScreenMargin } from "app/Scenes/MyCollection/Components/ScreenMargin"
import { RouterLink } from "app/system/navigation/RouterLink"
import { extractNodes } from "app/utils/extractNodes"
import { Image } from "react-native"
import { createFragmentContainer, graphql } from "react-relay"
import { useTracking } from "react-tracking"

interface MyCollectionArtworkArtistArticlesProps {
  artwork: MyCollectionArtworkArtistArticles_artwork$data
}

const MyCollectionArtworkArtistArticles: React.FC<MyCollectionArtworkArtistArticlesProps> = (
  props
) => {
  const artist = props?.artwork?.artist
  const articleEdges = extractNodes(artist?.articlesConnection)
  const { trackEvent } = useTracking()

  if (!articleEdges.length) {
    return null
  }

  return (
    <ScreenMargin>
      <Separator mb={4} />

      <Text variant="sm" mb={2}>
        Latest Articles featuring {artist?.name}
      </Text>

      {articleEdges.map(({ thumbnailTitle, slug, publishedAt, internalID, thumbnailImage }) => {
        return (
          <RouterLink to={`/article/${slug}`} key={internalID}>
            <Box my={0.5}>
              <Flex flexDirection="row">
                <Box pr={1} style={{ flex: 1 }}>
                  <Flex flexDirection="row">
                    <Text style={{ flex: 1 }}>{thumbnailTitle}</Text>
                  </Flex>
                  <Text color="mono60" my={0.5}>
                    {publishedAt}
                  </Text>
                </Box>
                <Image
                  testID="article-thumbnail-image"
                  style={{ flexShrink: 1, width: 80, height: 60 }}
                  source={{ uri: thumbnailImage?.url ?? undefined }}
                />
              </Flex>
            </Box>
          </RouterLink>
        )
      })}

      <Spacer y={1} />

      <Box mb={2}>
        <RouterLink
          hasChildTouchable
          to={`/artist/${artist?.slug}/articles`}
          onPress={() => {
            trackEvent(
              tracks.tappedShowMore(
                props.artwork.internalID,
                props.artwork.slug,
                "See all articles"
              )
            )
          }}
        >
          <CaretButton text="See all articles" />
        </RouterLink>
      </Box>
    </ScreenMargin>
  )
}

export const MyCollectionArtworkArtistArticlesFragmentContainer = createFragmentContainer(
  MyCollectionArtworkArtistArticles,
  {
    artwork: graphql`
      fragment MyCollectionArtworkArtistArticles_artwork on Artwork {
        internalID
        slug
        artist {
          slug
          name
          internalID
          articlesConnection(first: 3, sort: PUBLISHED_AT_DESC) {
            edges {
              node {
                slug
                internalID
                href
                thumbnailTitle
                author {
                  name
                }
                publishedAt(format: "MMM Do, YYYY")
                thumbnailImage {
                  url
                }
                href
              }
            }
          }
        }
      }
    `,
  }
)

const tracks = {
  tappedShowMore: (internalID: string, slug: string, subject: string) => {
    const tappedShowMore: TappedShowMore = {
      action: ActionType.tappedShowMore,
      context_module: ContextModule.relatedArticles,
      context_screen_owner_type: OwnerType.myCollectionArtwork,
      context_screen_owner_id: internalID,
      context_screen_owner_slug: slug,
      subject,
    }
    return tappedShowMore
  },
}
