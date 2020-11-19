import { MyCollectionArtworkArtistArticles_artwork } from "__generated__/MyCollectionArtworkArtistArticles_artwork.graphql"
import { CaretButton } from "lib/Components/Buttons/CaretButton"
import OpaqueImageView from "lib/Components/OpaqueImageView/OpaqueImageView"
import { navigate } from "lib/navigation/navigate"
import { ScreenMargin } from "lib/Scenes/MyCollection/Components/ScreenMargin"
import { extractNodes } from "lib/utils/extractNodes"
import { Box, Flex, Spacer, Text } from "palette"
import React from "react"
import { TouchableOpacity } from "react-native"
import { createFragmentContainer, graphql } from "react-relay"

interface MyCollectionArtworkArtistArticlesProps {
  artwork: MyCollectionArtworkArtistArticles_artwork
}

const MyCollectionArtworkArtistArticles: React.FC<MyCollectionArtworkArtistArticlesProps> = (props) => {
  const artist = props?.artwork?.artist!
  const articleEdges = extractNodes(artist?.articlesConnection)

  if (!articleEdges.length) {
    return null
  }

  return (
    <ScreenMargin>
      <Text variant="mediumText" mb="1">
        Latest Articles
      </Text>

      {articleEdges.map(({ thumbnailTitle, slug, publishedAt, internalID, thumbnailImage }) => {
        return (
          <TouchableOpacity onPress={() => navigate(`/article/${slug}`)} key={internalID}>
            <Box my={0.5}>
              <Flex flexDirection="row">
                <Box pr={1} maxWidth="80%">
                  <Flex flexDirection="row">
                    <Text style={{ flexShrink: 1 }}>{thumbnailTitle}</Text>
                  </Flex>
                  <Text color="black60" my={0.5}>
                    {publishedAt}
                  </Text>
                </Box>
                <OpaqueImageView imageURL={thumbnailImage?.url} width={80} height={60} />
              </Flex>
            </Box>
          </TouchableOpacity>
        )
      })}

      <Spacer my={1} />

      <Box>
        <CaretButton onPress={() => navigate(`/artist/${artist?.slug}/articles`)} text="See all articles" />
      </Box>
    </ScreenMargin>
  )
}

export const MyCollectionArtworkArtistArticlesFragmentContainer = createFragmentContainer(
  MyCollectionArtworkArtistArticles,
  {
    artwork: graphql`
      fragment MyCollectionArtworkArtistArticles_artwork on Artwork {
        artist {
          slug
          articlesConnection(first: 3, sort: PUBLISHED_AT_DESC, inEditorialFeed: true) {
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
