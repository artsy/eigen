import { ContextModule } from "@artsy/cohesion"
import { Flex, SpacingUnit, Text } from "@artsy/palette-mobile"
import { HomeEmergingPicksArtworksRail_viewer$key } from "__generated__/HomeEmergingPicksArtworksRail_viewer.graphql"
import { LargeArtworkRail } from "app/Components/ArtworkRail/LargeArtworkRail"
import HomeAnalytics from "app/Scenes/Home/homeAnalytics"
import { navigate } from "app/system/navigation/navigate"
import { extractNodes } from "app/utils/extractNodes"
import { Schema } from "app/utils/track"
import { Image } from "react-native"
import { useFragment } from "react-relay"
import { useTracking } from "react-tracking"
import { graphql } from "relay-runtime"

interface HomeEmergingPicksArtworksRailProps {
  viewer: HomeEmergingPicksArtworksRail_viewer$key
  mb?: SpacingUnit
  title: string
  subtitle?: string
}

export const HomeEmergingPicksArtworksRail: React.FC<HomeEmergingPicksArtworksRailProps> = ({
  mb,
  title,
  subtitle,
  ...restProps
}) => {
  const { trackEvent } = useTracking()

  const viewer = useFragment(artworksFragment, restProps.viewer)
  const artworks = extractNodes(viewer.artworksConnection)

  const handleOnArtworkPress = (artwork: any, position: any) => {
    // TODO: Adjust tracking
    trackEvent(
      HomeAnalytics.artworkThumbnailTapEvent(
        ContextModule.newWorksForYouRail,
        artwork.slug,
        artwork.internalID,
        position,
        "single"
      )
    )
    navigate(artwork.href!)
  }

  return (
    <Flex mb={mb} py={2} backgroundColor="black100">
      <Image
        style={{ width: "100%", height: 80 }}
        resizeMode="cover"
        source={require("images/curators-picks-header.jpg")}
      />
      <Flex mx={2} mt={2} mb={4}>
        <Text color="white100" variant="lg-display" mb={0.5}>
          {title}
        </Text>
        <Text color="white100" variant="xs">
          {subtitle}
        </Text>
      </Flex>

      <LargeArtworkRail
        artworks={artworks}
        onPress={handleOnArtworkPress}
        trackingContextScreenOwnerType={Schema.OwnerEntityTypes.Home}
        dark
        showPartnerName
        // TODO: Add view more card
      />
    </Flex>
  )
}

const artworksFragment = graphql`
  fragment HomeEmergingPicksArtworksRail_viewer on Viewer {
    artworksConnection(first: 12, marketingCollectionID: "curators-picks-emerging") {
      edges {
        node {
          internalID
          slug
          href
          ...LargeArtworkRail_artworks
        }
      }
    }
  }
`
