import { Flex, SpacingUnit, Text } from "@artsy/palette-mobile"
import { MarketingCollectionRail_viewer$key } from "__generated__/MarketingCollectionRail_viewer.graphql"
import { LargeArtworkRail } from "app/Components/ArtworkRail/LargeArtworkRail"
import HomeAnalytics from "app/Scenes/Home/homeAnalytics"
import { navigate } from "app/system/navigation/navigate"
import { extractNodes } from "app/utils/extractNodes"
import { Schema } from "app/utils/track"
import { Image } from "react-native"
import { useFragment } from "react-relay"
import { useTracking } from "react-tracking"
import { graphql } from "relay-runtime"

interface MarketingCollectionRailProps {
  viewer: MarketingCollectionRail_viewer$key
  mb?: SpacingUnit
  title: string
  subtitle?: string
  contextModuleKey: string
}

export const MarketingCollectionRail: React.FC<MarketingCollectionRailProps> = ({
  mb,
  title,
  subtitle,
  contextModuleKey,
  ...restProps
}) => {
  const { trackEvent } = useTracking()
  const contextModule = HomeAnalytics.artworkRailContextModule(contextModuleKey)

  const viewer = useFragment(artworksFragment, restProps.viewer)
  const artworks = extractNodes(viewer.artworksConnection)

  const handleOnArtworkPress = (artwork: any, position: any) => {
    if (contextModule) {
      trackEvent(
        HomeAnalytics.artworkThumbnailTapEvent(
          contextModule,
          artwork.slug,
          artwork.internalID,
          position,
          "single"
        )
      )
    }

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
  fragment MarketingCollectionRail_viewer on Viewer
  @argumentDefinitions(marketingCollectionID: { type: "String" }) {
    artworksConnection(first: 12, marketingCollectionID: $marketingCollectionID) {
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
