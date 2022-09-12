import { ContextModule, OwnerType, tappedEntityGroup, TappedEntityGroupArgs } from "@artsy/cohesion"
import { RecentlySold_recentlySoldArtworks$data } from "__generated__/RecentlySold_recentlySoldArtworks.graphql"
import {
  SmallArtworkRail,
  SmallArtworkRailPlaceholder,
} from "app/Components/ArtworkRail/SmallArtworkRail"
import { SectionTitle } from "app/Components/SectionTitle"
import { navigate } from "app/navigation/navigate"
import { extractNodes } from "app/utils/extractNodes"
import { PlaceholderText } from "app/utils/placeholders"
import { compact, shuffle } from "lodash"
import { Box, Flex, Spacer } from "palette"
import { createFragmentContainer, graphql } from "react-relay"
import { useTracking } from "react-tracking"

interface RecentlySoldProps {
  isLoading?: boolean
  recentlySoldArtworks: RecentlySold_recentlySoldArtworks$data
}

const trackingArgs: TappedEntityGroupArgs = {
  contextModule: ContextModule.artworkRecentlySoldGrid,
  contextScreenOwnerType: OwnerType.sell,
  destinationScreenOwnerType: OwnerType.artwork,
  type: "thumbnail",
}

export const RecentlySold: React.FC<RecentlySoldProps> = ({ recentlySoldArtworks, isLoading }) => {
  if (isLoading) {
    return <RecentlySoldPlaceholder />
  }

  const tracking = useTracking()

  if (!recentlySoldArtworks) {
    return null
  }

  const artworks = shuffle(extractNodes(recentlySoldArtworks)).map(({ artwork }) => artwork)

  return (
    <Box>
      <Flex mx={2}>
        <SectionTitle title="Recently sold on Artsy" />
      </Flex>
      <SmallArtworkRail
        artworks={compact(artworks)}
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
  recentlySoldArtworks: graphql`
    fragment RecentlySold_recentlySoldArtworks on RecentlySoldArtworkTypeConnection {
      edges {
        node {
          artwork {
            ...SmallArtworkRail_artworks
          }
          priceRealized {
            display
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
