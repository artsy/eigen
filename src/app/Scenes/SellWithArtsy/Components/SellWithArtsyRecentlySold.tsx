import { ContextModule, OwnerType, tappedEntityGroup, TappedEntityGroupArgs } from "@artsy/cohesion"
import { Spacer, Flex, Text } from "@artsy/palette-mobile"
import { SellWithArtsyRecentlySold_recentlySoldArtworkTypeConnection$key } from "__generated__/SellWithArtsyRecentlySold_recentlySoldArtworkTypeConnection.graphql"
import { RecentlySoldArtworksRail } from "app/Components/ArtworkRail/ArtworkRail"
import { useFeatureFlag } from "app/store/GlobalStore"
import { navigate } from "app/system/navigation/navigate"
import { extractNodes } from "app/utils/extractNodes"
import { useFragment } from "react-relay"
import { useTracking } from "react-tracking"
import { graphql } from "relay-runtime"

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

  const enableNewSWALandingPage = useFeatureFlag("AREnableNewSWALandingPage")
  const recentlySoldArtworksNodes = extractNodes(recentlySoldArtworksData)

  return (
    <Flex>
      <Text px={2} variant="lg-display">
        Sold Recently on Artsy
      </Text>

      <Spacer y={2} />

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
        size={enableNewSWALandingPage ? "extraLarge" : "large"}
        showPartnerName={!enableNewSWALandingPage}
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
