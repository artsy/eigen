import { ActionType, ContextModule, OwnerType } from "@artsy/cohesion"
import { MyCollectionArtworkArtistAuctionResults_artwork$key } from "__generated__/MyCollectionArtworkArtistAuctionResults_artwork.graphql"
import {
  AuctionResultListItemFragmentContainer,
  AuctionResultListSeparator,
} from "app/Components/Lists/AuctionResultListItem"
import { SectionTitle } from "app/Components/SectionTitle"
import { navigate } from "app/navigation/navigate"
import { extractNodes } from "app/utils/extractNodes"
import { Flex } from "palette"
import React from "react"
import { FlatList } from "react-native"
import { graphql, useFragment } from "react-relay"
import { useTracking } from "react-tracking"
import { useScreenDimensions } from "shared/hooks"

interface MyCollectionArtworkArtistAuctionResultsProps {
  artwork: MyCollectionArtworkArtistAuctionResults_artwork$key
}

export const MyCollectionArtworkArtistAuctionResults: React.FC<
  MyCollectionArtworkArtistAuctionResultsProps
> = (props) => {
  const { trackEvent } = useTracking()

  const artwork = useFragment(artworkFragment, props.artwork)

  const artist = artwork.artist
  const auctionResults = extractNodes(artist?.auctionResultsConnection)

  if (!auctionResults.length) {
    return null
  }

  return (
    <Flex mb={6}>
      <SectionTitle
        title={`Auction Results for ${artwork?.artist?.name}`}
        onPress={() => {
          trackEvent(tracks.tappedShowMore(artwork?.internalID, artwork?.slug))
          navigate(`/artist/${artwork?.artist?.slug!}/auction-results`)
        }}
      />

      <FlatList
        data={auctionResults}
        listKey="artist-auction-results"
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <>
            <AuctionResultListItemFragmentContainer
              auctionResult={item}
              onPress={() => {
                trackEvent(tracks.tappedAuctionResultGroup(artwork?.internalID, artwork?.slug))
                navigate(`/artist/${artist?.slug!}/auction-result/${item.internalID}`)
              }}
            />
          </>
        )}
        ItemSeparatorComponent={AuctionResultListSeparator}
        style={{ width: useScreenDimensions().width, left: -20 }}
      />
    </Flex>
  )
}

const artworkFragment = graphql`
  fragment MyCollectionArtworkArtistAuctionResults_artwork on Artwork {
    internalID
    slug
    artist {
      slug
      name
      auctionResultsConnection(first: 3, sort: DATE_DESC) {
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
`

const tracks = {
  tappedAuctionResultGroup: (internalID: string, slug: string) /* : TappedInfoBubble  */ => ({
    action: ActionType.tappedAuctionResultGroup,
    context_module: ContextModule.auctionResults,
    context_screen: OwnerType.myCollectionArtworkInsights,
    context_screen_owner_type: OwnerType.myCollectionArtwork,
    context_screen_owner_id: internalID,
    context_screen_owner_slug: slug,
    subject: "Auction Results for... [click on a specific result]",
  }),
  tappedShowMore: (internalID: string, slug: string) => ({
    action: ActionType.tappedShowMore,
    context_module: ContextModule.auctionResults,
    context_screen: OwnerType.myCollectionArtworkInsights,
    context_screen_owner_type: OwnerType.myCollectionArtwork,
    context_screen_owner_id: internalID,
    context_screen_owner_slug: slug,
    subject: "Explore auction results",
  }),
}
