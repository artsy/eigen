import { ContextModule, OwnerType, tappedEntityGroup, TappedEntityGroupArgs } from "@artsy/cohesion"
import { SellWithArtsyCustomRecentlySold_recentlySoldArtworkTypeConnection$key } from "__generated__/SellWithArtsyCustomRecentlySold_recentlySoldArtworkTypeConnection.graphql"
import { RecentlySoldArtworksRail } from "app/Components/ArtworkRail/ArtworkRail"
import { navigate } from "app/navigation/navigate"
import { Flex, Spacer, Text } from "palette"
import { useFragment } from "react-relay"
import { useTracking } from "react-tracking"
import { graphql } from "relay-runtime"
import { extractNodes } from "../../../utils/extractNodes"

interface SellWithArtsyCustomRecentlySoldProps {
  recentlySoldArtworks: SellWithArtsyCustomRecentlySold_recentlySoldArtworkTypeConnection$key
}

const trackingArgs: TappedEntityGroupArgs = {
  contextModule: ContextModule.artworkRecentlySoldGrid,
  contextScreenOwnerType: OwnerType.sell,
  destinationScreenOwnerType: OwnerType.artwork,
  type: "thumbnail",
}

export const SellWithArtsyCustomRecentlySold: React.FC<SellWithArtsyCustomRecentlySoldProps> = ({
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
        Sold Recently on Artsy
      </Text>

      <Spacer mb={2} />

      <RecentlySoldArtworksRail
        recentlySoldArtworks={recentlySoldArtworksNodes}
        onPress={(recentlySoldArtwork) => {
          tracking.trackEvent(
            tappedEntityGroup({
              ...trackingArgs,
              destinationScreenOwnerId: recentlySoldArtwork!.artwork?.internalID,
              destinationScreenOwnerSlug: recentlySoldArtwork!.artwork?.slug,
            })
          )
          navigate(recentlySoldArtwork?.artwork?.href!)
        }}
        size="large"
      />
    </Flex>
  )
}

const customRecentlySoldArtworksFragment = graphql`
  fragment SellWithArtsyCustomRecentlySold_recentlySoldArtworkTypeConnection on RecentlySoldArtworkTypeConnection {
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
      }
    }
  }
`
