import { OwnerType } from "@artsy/cohesion"
import { Flex, Screen } from "@artsy/palette-mobile"
import { NotificationArtworkList_artworksConnection$key } from "__generated__/NotificationArtworkList_artworksConnection.graphql"
import { PriceOfferMessage } from "app/Components/ArtworkGrids/ArtworkGridItem"
import { MasonryInfiniteScrollArtworkGrid } from "app/Components/ArtworkGrids/MasonryInfiniteScrollArtworkGrid"
import { CommercialButtonsQueryRenderer } from "app/Scenes/Activity/components/NotificationCommercialButtons"
import { extractNodes } from "app/utils/extractNodes"
import { FC } from "react"
import { useFragment, graphql } from "react-relay"

export interface PartnerOffer {
  endAt: string
  isAvailable: boolean
  targetHref: string
}

interface NotificationArtworkListProps {
  artworksConnection?: NotificationArtworkList_artworksConnection$key | null
  priceOfferMessage?: PriceOfferMessage
  showArtworkCommercialButtons?: boolean
  partnerOffer?: PartnerOffer
}

export const NotificationArtworkList: FC<NotificationArtworkListProps> = (props) => {
  const { artworksConnection, priceOfferMessage, showArtworkCommercialButtons, partnerOffer } =
    props
  const { scrollHandler } = Screen.useListenForScreenScroll()

  const artworksConnectionData = useFragment(notificationArtworkListFragment, artworksConnection)

  const artworks = extractNodes(artworksConnectionData)

  return (
    <Flex minHeight={400}>
      <MasonryInfiniteScrollArtworkGrid
        animated
        artworks={artworks}
        numColumns={1}
        disableAutoLayout
        contextScreenOwnerType={OwnerType.newWorksForYou}
        contextScreen={OwnerType.newWorksForYou}
        hasMore={false}
        onScroll={scrollHandler}
        priceOfferMessage={priceOfferMessage}
        style={{ paddingBottom: 120 }}
      />
      {!!showArtworkCommercialButtons && (
        <CommercialButtonsQueryRenderer
          artworkID={artworks[0].internalID}
          partnerOffer={partnerOffer}
        />
      )}
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
