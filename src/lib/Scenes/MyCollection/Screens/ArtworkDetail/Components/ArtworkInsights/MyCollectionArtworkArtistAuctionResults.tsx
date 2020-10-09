import { MyCollectionArtworkArtistAuctionResults_artwork } from "__generated__/MyCollectionArtworkArtistAuctionResults_artwork.graphql"
import { Divider } from "lib/Components/Bidding/Components/Divider"
import { CaretButton } from "lib/Components/Buttons/CaretButton"
import OpaqueImageView from "lib/Components/OpaqueImageView/OpaqueImageView"
import { ScreenMargin } from "lib/Scenes/MyCollection/Components/ScreenMargin"
import { AppStore } from "lib/store/AppStore"
import { extractNodes } from "lib/utils/extractNodes"
import { DateTime } from "luxon"
import { Box, Flex, Spacer, Text } from "palette"
import React from "react"
import { View } from "react-native"
import { createFragmentContainer, graphql } from "react-relay"
import { InfoButton } from "./InfoButton"

interface MyCollectionArtworkArtistAuctionResultsProps {
  artwork: MyCollectionArtworkArtistAuctionResults_artwork
}

const MyCollectionArtworkArtistAuctionResults: React.FC<MyCollectionArtworkArtistAuctionResultsProps> = (props) => {
  const results = extractNodes(props?.artwork?.artist?.auctionResultsConnection)
  const navActions = AppStore.actions.myCollection.navigation

  if (!results.length) {
    return null
  }

  return (
    <View>
      <ScreenMargin>
        <InfoButton title="Recent auction results" onPress={() => navActions.showInfoModal("auctionResults")} />

        <Spacer my={0.5} />

        {results.map(({ title, saleDate, priceRealized, internalID, images }) => {
          const dateOfSale = DateTime.fromISO(saleDate as string).toLocaleString(DateTime.DATE_MED)
          const salePrice = priceRealized?.centsUSD === 0 ? null : priceRealized?.display

          return (
            <Box my={0.5} key={internalID}>
              <Box my={0.5}>
                <Flex flexDirection="row">
                  <Box pr={1}>
                    <OpaqueImageView imageURL={images?.thumbnail?.url} width={80} height={60} />
                  </Box>
                  <Box pr={1} maxWidth="80%">
                    <Flex flexDirection="row">
                      <Text style={{ flexShrink: 1 }}>{title}</Text>
                    </Flex>
                    <Text color="black60" my={0.5}>
                      Sold {dateOfSale}
                    </Text>

                    {!!salePrice && (
                      <Box>
                        <Text>{salePrice}</Text>
                      </Box>
                    )}
                  </Box>
                </Flex>
              </Box>
            </Box>
          )
        })}

        <Spacer my={1} />

        <Box>
          <CaretButton
            onPress={() => navActions.navigateToAllAuctions(props?.artwork?.artist?.slug!)}
            text="Explore auction results"
          />
        </Box>
      </ScreenMargin>

      <Box my={3}>
        <Divider />
      </Box>
    </View>
  )
}

export const MyCollectionArtworkArtistAuctionResultsFragmentContainer = createFragmentContainer(
  MyCollectionArtworkArtistAuctionResults,
  {
    artwork: graphql`
      fragment MyCollectionArtworkArtistAuctionResults_artwork on Artwork {
        artist {
          slug
          auctionResultsConnection(
            first: 3
            sort: DATE_DESC # organizations: $organizations # categories: $categories # sizes: $sizes # earliestCreatedYear: $createdAfterYear # latestCreatedYear: $createdBeforeYear # allowEmptyCreatedDates: $allowEmptyCreatedDates
          ) {
            edges {
              node {
                internalID
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
