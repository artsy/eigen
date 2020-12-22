import { ContextModule, OwnerType, tappedInfoBubble } from "@artsy/cohesion"
import { MyCollectionArtworkArtistAuctionResults_artwork } from "__generated__/MyCollectionArtworkArtistAuctionResults_artwork.graphql"
import { CaretButton } from "lib/Components/Buttons/CaretButton"
import OpaqueImageView from "lib/Components/OpaqueImageView/OpaqueImageView"
import { navigate } from "lib/navigation/navigate"
import { ScreenMargin } from "lib/Scenes/MyCollection/Components/ScreenMargin"
import { extractNodes } from "lib/utils/extractNodes"
import { DateTime } from "luxon"
import { Box, Flex, NoArtworkIcon, Separator, Spacer, Text } from "palette"
import React from "react"
import { TouchableWithoutFeedback, View } from "react-native"
import { createFragmentContainer, graphql } from "react-relay"
import { useTracking } from "react-tracking"
import { InfoButton } from "./InfoButton"

interface MyCollectionArtworkArtistAuctionResultsProps {
  artwork: MyCollectionArtworkArtistAuctionResults_artwork
}

const MyCollectionArtworkArtistAuctionResults: React.FC<MyCollectionArtworkArtistAuctionResultsProps> = (props) => {
  const { trackEvent } = useTracking()
  const results = extractNodes(props?.artwork?.artist?.auctionResultsConnection)

  if (!results.length) {
    return null
  }

  return (
    <View>
      <ScreenMargin>
        <Box my={3}>
          <Separator />
        </Box>
        <InfoButton
          title={`Auction Results for ${props?.artwork?.artist?.name}`}
          modalContent={
            <>
              <Text>
                This data set includes the latest lots from auction sales at top commercial auction houses. Lots are
                updated daily.
              </Text>
            </>
          }
          onPress={() => trackEvent(tracks.tappedInfoBubble(props?.artwork?.internalID, props?.artwork?.slug))}
        />

        <Spacer my={0.5} />

        <TouchableWithoutFeedback
          onPress={() => navigate(`/artist/${props?.artwork?.artist?.slug!}/auction-results`)}
          data-test-id="AuctionsResultsButton"
        >
          <Box>
            {results.map(({ title, saleDate, categoryText, location, priceRealized, internalID, images }, index) => {
              const dateOfSale = DateTime.fromISO(saleDate as string).toLocaleString(DateTime.DATE_MED)
              const salePrice = priceRealized?.centsUSD === 0 ? null : priceRealized?.display

              return (
                <>
                  {index > 0 && <Separator />}
                  <Box my={0.5} key={internalID}>
                    <Box my={2}>
                      <Flex flexDirection="row">
                        <Box pr={1.5}>
                          {images?.thumbnail?.url ? (
                            <OpaqueImageView imageURL={images?.thumbnail?.url} width={80} height={60} />
                          ) : (
                            <Flex
                              width={60}
                              height={60}
                              backgroundColor="black10"
                              alignItems="center"
                              justifyContent="center"
                            >
                              <NoArtworkIcon width={28} height={28} opacity={0.3} />
                            </Flex>
                          )}
                        </Box>
                        <Box pr={1} flexGrow={1} maxWidth="80%">
                          <Flex flexDirection="row">
                            <Text fontSize={16} style={{ flexShrink: 1 }}>
                              {title}
                            </Text>
                          </Flex>
                          <Text color="black60" mt={0.5}>
                            {categoryText}
                          </Text>
                          <Text color="black60">
                            {dateOfSale}
                            {!!location && <Text> • {location}</Text>}
                          </Text>
                        </Box>
                        <Box>
                          {!!salePrice && (
                            <Text fontSize={16} fontWeight="bold">
                              {salePrice}
                            </Text>
                          )}
                        </Box>
                      </Flex>
                    </Box>
                  </Box>
                </>
              )
            })}
          </Box>
        </TouchableWithoutFeedback>

        <Spacer my={1} />

        <Box>
          <CaretButton
            onPress={() => navigate(`/artist/${props?.artwork?.artist?.slug!}/auction-results`)}
            text="Explore auction results"
          />
        </Box>
      </ScreenMargin>
    </View>
  )
}

export const MyCollectionArtworkArtistAuctionResultsFragmentContainer = createFragmentContainer(
  MyCollectionArtworkArtistAuctionResults,
  {
    artwork: graphql`
      fragment MyCollectionArtworkArtistAuctionResults_artwork on Artwork {
        internalID
        slug
        artist {
          slug
          name
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
                categoryText
                description
                dateText
                location
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

const tracks = {
  tappedInfoBubble: (internalID: string, slug: string) => {
    return tappedInfoBubble({
      contextModule: ContextModule.myCollectionArtwork,
      contextScreenOwnerType: OwnerType.myCollectionArtwork,
      contextScreenOwnerId: internalID,
      contextScreenOwnerSlug: slug,
      subject: "auctionResults",
    })
  },
}
