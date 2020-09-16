import { MyCollectionArtworkArtistAuctionResults_artwork } from "__generated__/MyCollectionArtworkArtistAuctionResults_artwork.graphql"
import { CaretButton } from "lib/Components/Buttons/CaretButton"
import { ScreenMargin } from "lib/Scenes/MyCollection/Components/ScreenMargin"
import { extractNodes } from "lib/utils/extractNodes"
import { DateTime } from "luxon"
import { Box, Flex, InfoCircleIcon, Spacer, Text } from "palette"
import React from "react"
import { createFragmentContainer, graphql } from "react-relay"

interface MyCollectionArtworkArtistAuctionResultsProps {
  artwork: MyCollectionArtworkArtistAuctionResults_artwork
}

const MyCollectionArtworkArtistAuctionResults: React.FC<MyCollectionArtworkArtistAuctionResultsProps> = (props) => {
  const results = extractNodes(props?.artwork?.artist?.auctionResultsConnection)

  console.log(results)

  return (
    <ScreenMargin>
      <Flex flexDirection="row">
        <Text variant="mediumText" mr={0.5}>
          Recent auction results
        </Text>
        <InfoCircleIcon />
      </Flex>

      <Spacer my={0.5} />

      {results.map(({ title, saleDate, priceRealized }) => {
        const dateOfSale = DateTime.fromISO(saleDate as string).toLocaleString(DateTime.DATE_MED)
        const salePrice = priceRealized?.centsUSD === 0 ? null : priceRealized?.display

        return (
          <Box my={0.5}>
            <Flex flexDirection="row" justifyContent="space-between" width="100%">
              <Flex flexDirection="row">
                <Box width={45} height={45} bg="black60" mr={0.5} />
                <Flex flexDirection="column">
                  <Text numberOfLines={1}>{title}</Text>
                  <Text>Sold {dateOfSale}</Text>
                </Flex>
              </Flex>
              {!!salePrice && (
                <Box>
                  <Text>{salePrice}</Text>
                </Box>
              )}
            </Flex>
          </Box>
        )
      })}

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
        artist {
          auctionResultsConnection(
            first: 3
            sort: DATE_DESC # organizations: $organizations # categories: $categories # sizes: $sizes # earliestCreatedYear: $createdAfterYear # latestCreatedYear: $createdBeforeYear # allowEmptyCreatedDates: $allowEmptyCreatedDates
          ) {
            edges {
              node {
                title
                dimensionText
                images {
                  thumbnail {
                    url
                  }
                }
                description
                dateText
                saleDate
                priceRealized {
                  display
                  centsUSD
                }
              }
            }
          }
        }
      }
    `,
  }
)
