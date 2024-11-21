import { OwnerType } from "@artsy/cohesion"
import { Flex, Screen } from "@artsy/palette-mobile"
import { NotificationArtworkList_artworksConnection$key } from "__generated__/NotificationArtworkList_artworksConnection.graphql"
import { PriceOfferMessage } from "app/Components/ArtworkGrids/ArtworkGridItem"
import { MasonryInfiniteScrollArtworkGrid } from "app/Components/ArtworkGrids/MasonryInfiniteScrollArtworkGrid"
import { PartnerOffer } from "app/Scenes/Activity/components/PartnerOfferCreatedNotification"
import { extractNodes } from "app/utils/extractNodes"
import { FC } from "react"
import { graphql, useFragment } from "react-relay"

interface NotificationArtworkListProps {
  artworksConnection?: NotificationArtworkList_artworksConnection$key | null
  priceOfferMessage?: PriceOfferMessage
  partnerOffer?: PartnerOffer | null
}

export const NotificationArtworkList: FC<NotificationArtworkListProps> = ({
  artworksConnection,
  priceOfferMessage,
  partnerOffer,
}) => {
  const { scrollHandler } = Screen.useListenForScreenScroll()

  const artworksConnectionData = useFragment(notificationArtworkListFragment, artworksConnection)

  const artworks = extractNodes(artworksConnectionData)

  return (
    // Setting the min heiht here because Flashlist needs a container with a valid height.
    <Flex minHeight={1}>
      <MasonryInfiniteScrollArtworkGrid
        animated
        artworks={artworks}
        numColumns={1}
        disableAutoLayout
        contextScreenOwnerType={OwnerType.activity}
        contextScreen={OwnerType.activity}
        hasMore={false}
        onScroll={scrollHandler}
        partnerOffer={partnerOffer}
        priceOfferMessage={priceOfferMessage}
        hideFollowIcon
      />
    </Flex>
  )
}

export const notificationArtworkListFragment = graphql`
  fragment NotificationArtworkList_artworksConnection on ArtworkConnection {
    edges {
      node {
        internalID
        id
        slug
        href
        image(includeAll: false) {
          aspectRatio
        }
        ...ArtworkGridItem_artwork @arguments(includeAllImages: false)
      }
    }
  }
`
