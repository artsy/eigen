import { Flex, Image, Spacer, Text } from "@artsy/palette-mobile"
import { MarketingCollectionRail_home$key } from "__generated__/MarketingCollectionRail_home.graphql"
import { MarketingCollectionRail_marketingCollection$key } from "__generated__/MarketingCollectionRail_marketingCollection.graphql"
import { ArtworkRail2 } from "app/Components/ArtworkRail/ArtworkRail2"
import HomeAnalytics from "app/Scenes/Home/homeAnalytics"
import { navigate } from "app/system/navigation/navigate"
import { extractNodes } from "app/utils/extractNodes"
import {
  ArtworkActionTrackingProps,
  extractArtworkActionTrackingProps,
} from "app/utils/track/ArtworkActions"
import { memo } from "react"
import { TouchableOpacity, useWindowDimensions } from "react-native"
import { graphql, useFragment } from "react-relay"
import { useTracking } from "react-tracking"

interface MarketingCollectionRailProps extends ArtworkActionTrackingProps {
  home: MarketingCollectionRail_home$key | null | undefined
  contextModuleKey: string
  marketingCollection: MarketingCollectionRail_marketingCollection$key
  marketingCollectionSlug: string
}

export const MarketingCollectionRail: React.FC<MarketingCollectionRailProps> = memo(
  ({ contextModuleKey, marketingCollectionSlug, ...restProps }) => {
    const { trackEvent } = useTracking()
    const contextModule = HomeAnalytics.artworkRailContextModule(contextModuleKey)

    const trackingProps = extractArtworkActionTrackingProps(restProps)

    const marketingCollection = useFragment(
      marketingCollectionFragment,
      restProps.marketingCollection
    )
    const home = useFragment(homeFragment, restProps.home)
    const artworks = extractNodes(marketingCollection.artworksConnection)
    const { width } = useWindowDimensions()

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

      if (artwork.href) {
        navigate(artwork.href)
      } else {
        console.warn("Artwork href is missing for ", artwork.slug)
      }
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

    if (!artworks.length) {
      return null
    }

    return (
      <Flex pb={2} backgroundColor="black100">
        <TouchableOpacity onPress={handleHeaderPress} activeOpacity={0.7}>
          {!!heroUnit?.backgroundImageURL && (
            <Image
              width={width}
              height={80}
              resizeMode="cover"
              src={heroUnit?.backgroundImageURL}
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

        <ArtworkRail2
          {...trackingProps}
          artworks={artworks}
          onPress={handleArtworkPress}
          dark
          showPartnerName
          onMorePress={handleMorePress}
          hideCuratorsPickSignal
          hideIncreasedInterestSignal
        />
      </Flex>
    )
  }
)

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
  @argumentDefinitions(
    marketingCollectionID: { type: "String" }
    input: { type: "FilterArtworksInput" }
  ) {
    title
    headerImage
    slug
    artworksConnection(first: 20, marketingCollectionID: $marketingCollectionID, input: $input) {
      edges {
        node {
          internalID
          slug
          href
          ...ArtworkRail2_artworks
        }
      }
    }
  }
`
