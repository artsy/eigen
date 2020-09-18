import { MyCollectionArtworkArtistArticles_artwork } from "__generated__/MyCollectionArtworkArtistArticles_artwork.graphql"
import { CaretButton } from "lib/Components/Buttons/CaretButton"
import OpaqueImageView from "lib/Components/OpaqueImageView/OpaqueImageView"
import { ScreenMargin } from "lib/Scenes/MyCollection/Components/ScreenMargin"
import { extractNodes } from "lib/utils/extractNodes"
import { Box, Flex, Spacer, Text } from "palette"
import React from "react"
import { createFragmentContainer, graphql } from "react-relay"

interface MyCollectionArtworkArtistArticlesProps {
  artwork: MyCollectionArtworkArtistArticles_artwork
}

const MyCollectionArtworkArtistArticles: React.FC<MyCollectionArtworkArtistArticlesProps> = (props) => {
  const articleEdges = extractNodes(props?.artwork?.artist?.articlesConnection)

  if (!articleEdges.length) {
    return null
  }

  return (
    <ScreenMargin>
      <Text variant="mediumText">Latest Articles</Text>

      {articleEdges.map(({ thumbnailTitle, publishedAt, internalID, thumbnailImage }) => {
        return (
          <Box my={0.5} key={internalID}>
            <Flex flexDirection="row" justifyContent="space-between">
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
        )
      })}

      <Spacer my={1} />

      <Box>
        <CaretButton
          // TODO: Wire up navigation to webview
          // onPress={() => navActions.navigateToViewAllArtworkDetails({ passProps: artwork })}
          text="See all articles"
        />
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
          articlesConnection(first: 3, sort: PUBLISHED_AT_DESC, inEditorialFeed: true) {
            edges {
              node {
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
