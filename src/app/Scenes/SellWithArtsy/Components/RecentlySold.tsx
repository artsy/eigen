import { ContextModule, OwnerType, tappedEntityGroup, TappedEntityGroupArgs } from "@artsy/cohesion"
import { RecentlySold_targetSupply$data } from "__generated__/RecentlySold_targetSupply.graphql"
import {
  SmallArtworkRail,
  SmallArtworkRailPlaceholder,
} from "app/Components/ArtworkRail/SmallArtworkRail"
import { SectionTitle } from "app/Components/SectionTitle"
import { navigate } from "app/navigation/navigate"
import { PlaceholderText } from "app/utils/placeholders"
import { compact, shuffle } from "lodash"
import { Box, Flex, Spacer } from "palette"
import React from "react"
import { createFragmentContainer, graphql } from "react-relay"
import { useTracking } from "react-tracking"

interface RecentlySoldProps {
  isLoading?: boolean
  targetSupply: RecentlySold_targetSupply$data
}

const trackingArgs: TappedEntityGroupArgs = {
  contextModule: ContextModule.artworkRecentlySoldGrid,
  contextScreenOwnerType: OwnerType.sell,
  destinationScreenOwnerType: OwnerType.artwork,
  type: "thumbnail",
}

export const RecentlySold: React.FC<RecentlySoldProps> = ({ targetSupply, isLoading }) => {
  if (isLoading) {
    return <RecentlySoldPlaceholder />
  }

  const tracking = useTracking()

  const microfunnelItems = targetSupply.microfunnel || []
  if (microfunnelItems.length === 0) {
    return null
  }

  const recentlySoldArtworks = shuffle(
    microfunnelItems.map((x) => x?.artworksConnection?.edges?.[0]?.node)
  )

  return (
    <Box>
      <Flex mx={2}>
        <SectionTitle title="Recently sold on Artsy" />
      </Flex>
      <SmallArtworkRail
        artworks={compact(recentlySoldArtworks)}
        onPress={(artwork) => {
          tracking.trackEvent(
            tappedEntityGroup({
              ...trackingArgs,
              destinationScreenOwnerId: artwork!.internalID,
              destinationScreenOwnerSlug: artwork!.slug,
            })
          )
          navigate(artwork?.href!)
        }}
      />
    </Box>
  )
}

export const RecentlySoldFragmentContainer = createFragmentContainer(RecentlySold, {
  targetSupply: graphql`
    fragment RecentlySold_targetSupply on TargetSupply {
      microfunnel {
        artworksConnection(first: 1) {
          edges {
            node {
              ...SmallArtworkRail_artworks
            }
          }
        }
      }
    }
  `,
})

const RecentlySoldPlaceholder: React.FC = () => {
  return (
    <Box>
      <Box px={2} py={0.5}>
        <PlaceholderText width={200} />
      </Box>

      <Spacer mb={2} />

      <Flex flexDirection="row" pl={2}>
        <SmallArtworkRailPlaceholder />
      </Flex>
    </Box>
  )
}
