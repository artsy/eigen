import { MyCollectionArtworkArtistArticles_artwork } from "__generated__/MyCollectionArtworkArtistArticles_artwork.graphql"
import { CaretButton } from "lib/Components/Buttons/CaretButton"
import { ScreenMargin } from "lib/Scenes/MyCollection/Components/ScreenMargin"
import { Box, Flex, Spacer, Text } from "palette"
import React from "react"
import { createFragmentContainer, graphql } from "react-relay"

interface MyCollectionArtworkArtistArticlesProps {
  artwork: MyCollectionArtworkArtistArticles_artwork
}

const MyCollectionArtworkArtistArticles: React.FC<MyCollectionArtworkArtistArticlesProps> = (props) => {
  return (
    <ScreenMargin>
      <Text variant="mediumText">Latest Articles</Text>
      <Box my={0.5}>
        <Flex flexDirection="row" justifyContent="space-between">
          <Box pr={1} maxWidth="80%">
            <Flex flexDirection="row">
              <Text style={{ flexShrink: 1 }}>
                This Artwork Changed My Life: Cindy Sherman’s “Untitled Film Stills”
              </Text>
            </Flex>
            <Text color="black60" my={0.5}>
              Feb 4, 2020
            </Text>
          </Box>
          <Box width={80} height={60} bg="black60" />
        </Flex>
      </Box>
      <Box my={0.5}>
        <Flex flexDirection="row" justifyContent="space-between">
          <Box pr={1} maxWidth="80%">
            <Flex flexDirection="row">
              <Text style={{ flexShrink: 1 }}>
                This Artwork Changed My Life: Cindy Sherman’s “Untitled Film Stills”
              </Text>
            </Flex>
            <Text color="black60" my={0.5}>
              Feb 4, 2020
            </Text>
          </Box>
          <Box width={80} height={60} bg="black60" />
        </Flex>
      </Box>
      <Box my={0.5}>
        <Flex flexDirection="row" justifyContent="space-between">
          <Box pr={1} maxWidth="80%">
            <Flex flexDirection="row">
              <Text style={{ flexShrink: 1 }}>
                This Artwork Changed My Life: Cindy Sherman’s “Untitled Film Stills”
              </Text>
            </Flex>
            <Text color="black60" my={0.5}>
              Feb 4, 2020
            </Text>
          </Box>
          <Box width={80} height={60} bg="black60" />
        </Flex>
      </Box>

      <Spacer my={1} />

      <Box>
        <CaretButton
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
        id
      }
    `,
  }
)
