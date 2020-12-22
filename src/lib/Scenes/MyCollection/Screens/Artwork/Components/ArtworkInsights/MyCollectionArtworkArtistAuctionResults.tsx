import { ActionType, ContextModule, OwnerType, tappedInfoBubble, TappedShowMore } from "@artsy/cohesion"
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
          <Box mr={2}>
            {results.map(({ title, saleDate, priceRealized, internalID, images }) => {
              const dateOfSale = DateTime.fromISO(saleDate as string).toLocaleString(DateTime.DATE_MED)
              const salePrice = priceRealized?.centsUSD === 0 ? null : priceRealized?.display

              return (
                <Box my={0.5} key={internalID}>
                  <Box my={0.5}>
                    <Flex flexDirection="row">
                      <Box pr={1}>
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
          </Box>
        </TouchableWithoutFeedback>

        <Spacer my={1} />

        <Box>
          <CaretButton
            onPress={() => {
              trackEvent(
                tracks.tappedShowMore(props.artwork?.internalID, props.artwork?.slug, "Explore auction results")
              )
              navigate(`/artist/${props?.artwork?.artist?.slug!}/auction-results`)
            }}
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

const tracks = {
  tappedInfoBubble: (internalID: string, slug: string) => {
    return tappedInfoBubble({
      contextModule: ContextModule.auctionResults,
      contextScreenOwnerType: OwnerType.myCollectionArtwork,
      contextScreenOwnerId: internalID,
      contextScreenOwnerSlug: slug,
      subject: "auctionResults",
    })
  },
  tappedShowMore: (internalID: string, slug: string, subject: string) => {
    const tappedShowMore: TappedShowMore = {
      action: ActionType.tappedShowMore,
      context_module: ContextModule.auctionResults,
      context_screen_owner_type: OwnerType.myCollectionArtwork,
      context_screen_owner_id: internalID,
      context_screen_owner_slug: slug,
      subject,
    }
    return tappedShowMore
  },
}
