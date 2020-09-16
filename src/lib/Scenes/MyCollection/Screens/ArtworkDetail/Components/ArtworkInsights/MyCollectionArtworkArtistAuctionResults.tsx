import { CaretButton } from "lib/Components/Buttons/CaretButton"
import { ScreenMargin } from "lib/Scenes/MyCollection/Components/ScreenMargin"
import { Box, Flex, InfoCircleIcon, Spacer, Text } from "palette"
import React from "react"
import { createFragmentContainer, graphql } from "react-relay"

interface MyCollectionArtworkArtistAuctionResultsProps {}

const MyCollectionArtworkArtistAuctionResults: React.FC<MyCollectionArtworkArtistAuctionResultsProps> = (props) => {
  return (
    <ScreenMargin>
      <Flex flexDirection="row">
        <Text variant="mediumText" mr={0.5}>
          Recent auction results
        </Text>
        <InfoCircleIcon />
      </Flex>

      <Spacer my={0.5} />

      <Box my={0.5}>
        <Flex flexDirection="row" justifyContent="space-between" width="100%">
          <Flex flexDirection="row">
            <Box width={45} height={45} bg="black60" mr={0.5} />
            <Flex flexDirection="column">
              <Text numberOfLines={1}>Untitled (Doctor and Nu...</Text>
              <Text>Sold Aug 3, 2020</Text>
            </Flex>
          </Flex>
          <Box>
            <Text>$10,625</Text>
          </Box>
        </Flex>
      </Box>
      <Box my={0.5}>
        <Flex flexDirection="row" justifyContent="space-between" width="100%">
          <Flex flexDirection="row">
            <Box width={45} height={45} bg="black60" mr={0.5} />
            <Flex flexDirection="column">
              <Text numberOfLines={1}>Untitled (Doctor and Nu...</Text>
              <Text>Sold Aug 3, 2020</Text>
            </Flex>
          </Flex>
          <Box>
            <Text>$10,625</Text>
          </Box>
        </Flex>
      </Box>
      <Box my={0.5}>
        <Flex flexDirection="row" justifyContent="space-between" width="100%">
          <Flex flexDirection="row">
            <Box width={45} height={45} bg="black60" mr={0.5} />
            <Flex flexDirection="column">
              <Text numberOfLines={1}>Untitled (Doctor and Nu...</Text>
              <Text>Sold Aug 3, 2020</Text>
            </Flex>
          </Flex>
          <Box>
            <Text>$10,625</Text>
          </Box>
        </Flex>
      </Box>

      <Spacer my={1} />

      <Box>
        <CaretButton
          // onPress={() => navActions.navigateToViewAllArtworkDetails({ passProps: artwork })}
          text="Explore auction results"
        />
      </Box>
    </ScreenMargin>
  )
}

export const MyCollectionArtworkArtistAuctionResultsFragmentContainer = createFragmentContainer(
  MyCollectionArtworkArtistAuctionResults,
  {
    artwork: graphql`
      fragment MyCollectionArtworkArtistAuctionResults_artwork on Artwork {
        id
      }
    `,
  }
)
