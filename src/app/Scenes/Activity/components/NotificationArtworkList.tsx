import { OwnerType } from "@artsy/cohesion"
import { Flex, Screen, Text, useColor } from "@artsy/palette-mobile"
import { NotificationArtworkList_artworksConnection$key } from "__generated__/NotificationArtworkList_artworksConnection.graphql"
import { PriceOfferMessage } from "app/Components/ArtworkGrids/ArtworkGridItem"
import { MasonryInfiniteScrollArtworkGrid } from "app/Components/ArtworkGrids/MasonryInfiniteScrollArtworkGrid"
import { CommercialButtonsQueryRenderer } from "app/Scenes/Activity/components/NotificationCommercialButtons"
import { extractNodes } from "app/utils/extractNodes"
import { FC } from "react"
import { ImageBackground, View } from "react-native"
import { useFragment, graphql } from "react-relay"

export interface PartnerOffer {
  endAt: string
  isAvailable: boolean
  targetHref: string
  note: string
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
  const note = partnerOffer?.note
  const partnerIcon = artworks[0].partner?.profile?.icon?.url
  const color = useColor()

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
      {!!showArtworkCommercialButtons && (
        <CommercialButtonsQueryRenderer
          artworkID={artworks[0].internalID}
          partnerOffer={partnerOffer}
        />
      )}
      {!!note && (
        <View
          style={{
            width: "100%",
            flexDirection: "row",
            padding: 20,
          }}
        >
          <View
            style={{
              backgroundColor: color("black5"),
              flexDirection: "row",
              width: "100%",
              padding: 10,
            }}
          >
            {!!partnerIcon && (
              <View style={{ marginRight: 10 }}>
                <ImageBackground
                  source={{ uri: partnerIcon }}
                  style={{ width: 30, height: 30 }}
                  imageStyle={{ borderRadius: 15, borderColor: color("black30"), borderWidth: 1 }}
                />
              </View>
            )}
            <View style={{ flex: 1 }}>
              <Text variant="sm" color="black100" fontWeight="bold">
                Note from the gallery
              </Text>
              <Text variant="sm" color="black100">
                "{note}"
              </Text>
            </View>
          </View>
        </View>
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
        partner {
          profile {
            icon {
              url(version: "square140")
            }
          }
        }
        image(includeAll: false) {
          aspectRatio
        }
        ...ArtworkGridItem_artwork @arguments(includeAllImages: false)
      }
    }
  }
`
