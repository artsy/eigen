import { ContextModule, OwnerType, tappedEntityGroup, TappedEntityGroupArgs } from "@artsy/cohesion"
import { Flex, Spacer, Text } from "@artsy/palette-mobile"
import { SellWithArtsyRecentlySold_recentlySoldArtworkTypeConnection$key } from "__generated__/SellWithArtsyRecentlySold_recentlySoldArtworkTypeConnection.graphql"
import { RecentlySoldArtworksRail } from "app/Components/ArtworkRail/ArtworkRail"
import { navigate } from "app/system/navigation/navigate"
import { extractNodes } from "app/utils/extractNodes"
import { graphql, useFragment } from "react-relay"
import { useTracking } from "react-tracking"

interface SellWithArtsyRecentlySoldProps {
  recentlySoldArtworks: SellWithArtsyRecentlySold_recentlySoldArtworkTypeConnection$key
}

const trackingArgs: TappedEntityGroupArgs = {
  contextModule: ContextModule.artworkRecentlySoldGrid,
  contextScreenOwnerType: OwnerType.sell,
  destinationScreenOwnerType: OwnerType.artwork,
  type: "thumbnail",
}

export const SellWithArtsyRecentlySold: React.FC<SellWithArtsyRecentlySoldProps> = ({
  recentlySoldArtworks,
}) => {
  const tracking = useTracking()
  const recentlySoldArtworksData = useFragment(
    customRecentlySoldArtworksFragment,
    recentlySoldArtworks
  )

  const recentlySoldArtworksNodes = extractNodes(recentlySoldArtworksData)

  return (
    <Flex>
      <Text px={2} variant="lg-display">
        Previously sold on Artsy
      </Text>

      <Spacer y={2} />

      <RecentlySoldArtworksRail
        recentlySoldArtworks={recentlySoldArtworksNodes}
        onPress={(recentlySoldArtwork) => {
          if (recentlySoldArtwork?.artwork?.href) {
            tracking.trackEvent(
              tappedEntityGroup({
                ...trackingArgs,
                destinationScreenOwnerId: recentlySoldArtwork?.artwork?.internalID,
                destinationScreenOwnerSlug: recentlySoldArtwork?.artwork?.slug,
              })
            )
            navigate(recentlySoldArtwork.artwork.href)
          }
        }}
        showPartnerName={false}
      />
    </Flex>
  )
}

const customRecentlySoldArtworksFragment = graphql`
  fragment SellWithArtsyRecentlySold_recentlySoldArtworkTypeConnection on RecentlySoldArtworkTypeConnection {
    edges {
      node {
        artwork {
          ...ArtworkRailCard_artwork @arguments(width: 250)
          internalID
          href
          slug
        }
        lowEstimate {
          display
        }
        highEstimate {
          display
        }
        priceRealized {
          display
        }
        performance {
          mid
        }
      }
    }
  }
`
