import {
  ActionType,
  ContextModule,
  OwnerType,
  TappedInfoBubble,
  TappedShowMore,
} from "@artsy/cohesion"
import { OldMyCollectionArtworkArtistAuctionResults_artwork } from "__generated__/OldMyCollectionArtworkArtistAuctionResults_artwork.graphql"
import { CaretButton } from "lib/Components/Buttons/CaretButton"
import { InfoButton } from "lib/Components/Buttons/InfoButton"
import { AuctionResultListItemFragmentContainer } from "lib/Components/Lists/AuctionResultListItem"
import { navigate } from "lib/navigation/navigate"
import { extractNodes } from "lib/utils/extractNodes"
import { useScreenDimensions } from "lib/utils/useScreenDimensions"
import { Box, Flex, Separator, Spacer, Text } from "palette"
import React from "react"
import { FlatList, View } from "react-native"
import { createFragmentContainer, graphql } from "react-relay"
import { useTracking } from "react-tracking"

interface OldMyCollectionArtworkArtistAuctionResultsProps {
  artwork: OldMyCollectionArtworkArtistAuctionResults_artwork
}

const OldMyCollectionArtworkArtistAuctionResults: React.FC<
  OldMyCollectionArtworkArtistAuctionResultsProps
> = (props) => {
  const { trackEvent } = useTracking()
  const auctionResults = extractNodes(props?.artwork?.artist?.auctionResultsConnection)

  if (!auctionResults.length) {
    return null
  }

  return (
    <View>
      <InfoButton
        title={`Auction Results for ${props?.artwork?.artist?.name}`}
        modalContent={
          <>
            <Spacer my={1} />
            <Text>
              This data set includes the latest lots from auction sales at top commercial auction
              houses. Lots are updated daily.
            </Text>
          </>
        }
        onPress={() =>
          trackEvent(tracks.tappedInfoBubble(props?.artwork?.internalID, props?.artwork?.slug))
        }
      />

      <Spacer my={0.5} />

      <FlatList
        data={auctionResults}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <>
            <AuctionResultListItemFragmentContainer
              auctionResult={item}
              onPress={() =>
                navigate(
                  `/artist/${props?.artwork?.artist?.slug!}/auction-result/${item.internalID}`
                )
              }
            />
          </>
        )}
        ListHeaderComponent={() => (
          <Flex px={2}>
            <Text variant="md">Auction results</Text>
            <Text variant="xs" color="black60">
              Sorted by most recent sale date
            </Text>
            <Separator mt="2" />
          </Flex>
        )}
        ItemSeparatorComponent={() => (
          <Flex px={2}>
            <Separator />
          </Flex>
        )}
        style={{ width: useScreenDimensions().width, left: -20 }}
      />
      <Separator />
      <Box pt={3}>
        <CaretButton
          testID="AuctionsResultsButton"
          onPress={() => {
            trackEvent(
              tracks.tappedShowMore(
                props.artwork?.internalID,
                props.artwork?.slug,
                "Explore auction results"
              )
            )
            navigate(`/artist/${props?.artwork?.artist?.slug!}/auction-results`)
          }}
          text="Explore auction results"
        />
      </Box>
    </View>
  )
}

export const OldMyCollectionArtworkArtistAuctionResultsFragmentContainer = createFragmentContainer(
  OldMyCollectionArtworkArtistAuctionResults,
  {
    artwork: graphql`
      fragment OldMyCollectionArtworkArtistAuctionResults_artwork on Artwork {
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
                id
                internalID
                ...AuctionResultListItem_auctionResult
              }
            }
          }
        }
      }
    `,
  }
)

const tracks = {
  tappedInfoBubble: (internalID: string, slug: string): TappedInfoBubble => ({
    action: ActionType.tappedInfoBubble,
    context_module: ContextModule.auctionResults,
    context_screen_owner_type: OwnerType.myCollectionArtwork,
    context_screen_owner_id: internalID,
    context_screen_owner_slug: slug,
    subject: "auctionResults",
  }),
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
