import { Flex, Spacer, useSpace } from "@artsy/palette-mobile"
import { FlashList } from "@shopify/flash-list"
import { NotificationArtworkList_artworksConnection$key } from "__generated__/NotificationArtworkList_artworksConnection.graphql"
import { ArtworkRailCard } from "app/Components/ArtworkRail/ArtworkRailCard"
import { navigate } from "app/system/navigation/navigate"
import { extractNodes } from "app/utils/extractNodes"
import { FC } from "react"
import { Animated } from "react-native"
import { useFragment, graphql } from "react-relay"

interface NotificationArtworkListProps {
  artworksConnection?: NotificationArtworkList_artworksConnection$key | null
  showOnlyFirstArtwork?: boolean
}

export const NotificationArtworkList: FC<NotificationArtworkListProps> = (props) => {
  const { artworksConnection, showOnlyFirstArtwork } = props
  const space = useSpace()

  const artworksConnectionData = useFragment(notificationArtworkListFragment, artworksConnection)

  const artworks = !!showOnlyFirstArtwork
    ? extractNodes(artworksConnectionData).splice(0)
    : extractNodes(artworksConnectionData)

  return (
    <Flex minHeight={400}>
      <AnimatedFlashList
        estimatedItemSize={800}
        data={artworks}
        keyExtractor={(item) => item.internalID}
        ItemSeparatorComponent={() => <Spacer y={4} />}
        renderItem={({ item }) => {
          return (
            <ArtworkRailCard
              testID={`artwork-${item.slug}`}
              artwork={item}
              showPartnerName
              onPress={() => {
                // TODO: Add tracking

                if (item.href) {
                  navigate(item.href)
                }
              }}
              showSaveIcon
              size="fullWidth"
              metaContainerStyles={{
                paddingHorizontal: space(2),
              }}
            />
          )
        }}
      />
    </Flex>
  )
}

const AnimatedFlashList = Animated.createAnimatedComponent(FlashList) as unknown as typeof FlashList

export const notificationArtworkListFragment = graphql`
  fragment NotificationArtworkList_artworksConnection on ArtworkConnection {
    edges {
      node {
        internalID
        slug
        href
        ...ArtworkRailCard_artwork @arguments(width: 590)
      }
    }
  }
`
