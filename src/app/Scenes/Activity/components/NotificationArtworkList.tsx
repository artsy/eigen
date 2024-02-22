import { OwnerType } from "@artsy/cohesion"
import { Flex, Screen } from "@artsy/palette-mobile"
import { NotificationArtworkList_artworksConnection$key } from "__generated__/NotificationArtworkList_artworksConnection.graphql"
import { PriceOfferMessage } from "app/Components/ArtworkGrids/ArtworkGridItem"
import { MasonryInfiniteScrollArtworkGrid } from "app/Components/ArtworkGrids/MasonryInfiniteScrollArtworkGrid"
import { extractNodes } from "app/utils/extractNodes"
import { FC } from "react"
import { useFragment, graphql } from "react-relay"

interface NotificationArtworkListProps {
  artworksConnection?: NotificationArtworkList_artworksConnection$key | null
  priceOfferMessage?: PriceOfferMessage
}

export const NotificationArtworkList: FC<NotificationArtworkListProps> = (props) => {
  const { artworksConnection, priceOfferMessage } = props
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
        contextScreenOwnerType={OwnerType.activity}
        contextScreen={OwnerType.activity}
        hasMore={false}
        onScroll={scrollHandler}
        priceOfferMessage={priceOfferMessage}
        style={{ paddingBottom: 120 }}
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
