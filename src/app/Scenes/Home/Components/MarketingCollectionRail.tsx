import { Flex, Spacer, SpacingUnit, Text } from "@artsy/palette-mobile"
import { MarketingCollectionRail_home$key } from "__generated__/MarketingCollectionRail_home.graphql"
import { MarketingCollectionRail_marketingCollection$key } from "__generated__/MarketingCollectionRail_marketingCollection.graphql"
import { LargeArtworkRail } from "app/Components/ArtworkRail/LargeArtworkRail"
import HomeAnalytics from "app/Scenes/Home/homeAnalytics"
import { navigate } from "app/system/navigation/navigate"
import { extractNodes } from "app/utils/extractNodes"
import { Schema } from "app/utils/track"
import { Image, TouchableOpacity } from "react-native"
import { useFragment } from "react-relay"
import { useTracking } from "react-tracking"
import { graphql } from "relay-runtime"

interface MarketingCollectionRailProps {
  home: MarketingCollectionRail_home$key | null
  contextModuleKey: string
  marketingCollection: MarketingCollectionRail_marketingCollection$key
  marketingCollectionSlug: string
  mb?: SpacingUnit
}

export const MarketingCollectionRail: React.FC<MarketingCollectionRailProps> = ({
  contextModuleKey,
  marketingCollectionSlug,
  mb,
  ...restProps
}) => {
  const { trackEvent } = useTracking()
  const contextModule = HomeAnalytics.artworkRailContextModule(contextModuleKey)

  const marketingCollection = useFragment(
    marketingCollectionFragment,
    restProps.marketingCollection
  )
  const home = useFragment(homeFragment, restProps.home)
  const artworks = extractNodes(marketingCollection.artworksConnection)

  const heroUnit = home?.heroUnits?.find((item) => item?.slug === marketingCollectionSlug)

  const handleArtworkPress = (artwork: any, position: any) => {
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

  const handleMorePress = () => {
    const tapEvent = HomeAnalytics.artworkShowMoreCardTapEvent(contextModuleKey)
    if (tapEvent) {
      trackEvent(tapEvent)
    }
    navigate(`/collection/${marketingCollection.slug}`)
  }

  const handleHeaderPress = () => {
    const tapEvent = HomeAnalytics.artworkHeaderTapEvent(contextModuleKey)
    if (tapEvent) {
      trackEvent(tapEvent)
    }
    navigate(`/collection/${marketingCollection.slug}`)
  }

  return (
    <Flex mb={mb} py={2} backgroundColor="black100">
      <TouchableOpacity onPress={handleHeaderPress} activeOpacity={0.7}>
        {!!heroUnit?.backgroundImageURL && (
          <Image
            style={{ width: "100%", height: 80 }}
            resizeMode="cover"
            source={{ uri: heroUnit?.backgroundImageURL }}
          />
        )}
        <Flex mx={2} mt={2}>
          <Text color="white100" variant="lg-display" mb={0.5}>
            {heroUnit?.title}
          </Text>
          <Text color="white100" variant="xs">
            {heroUnit?.subtitle}
          </Text>
        </Flex>
      </TouchableOpacity>

      <Spacer y={4} />

      <LargeArtworkRail
        artworks={artworks}
        onPress={handleArtworkPress}
        trackingContextScreenOwnerType={Schema.OwnerEntityTypes.Home}
        dark
        showPartnerName
        onMorePress={handleMorePress}
      />
    </Flex>
  )
}

export const homeFragment = graphql`
  fragment MarketingCollectionRail_home on HomePage
  @argumentDefinitions(heroImageVersion: { type: "HomePageHeroUnitImageVersion" }) {
    heroUnits(platform: MOBILE) {
      slug
      title
      subtitle
      backgroundImageURL(version: $heroImageVersion)
    }
  }
`

const marketingCollectionFragment = graphql`
  fragment MarketingCollectionRail_marketingCollection on MarketingCollection
  @argumentDefinitions(marketingCollectionID: { type: "String" }) {
    title
    headerImage
    slug
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
