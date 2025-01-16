import { ContextModule, ScreenOwnerType } from "@artsy/cohesion"
import {
  Flex,
  FlexProps,
  Image,
  Join,
  Skeleton,
  SkeletonBox,
  SkeletonText,
  Spacer,
  Text,
} from "@artsy/palette-mobile"
import { ArtworkRail_artworks$data } from "__generated__/ArtworkRail_artworks.graphql"
import { HomeViewSectionFeaturedCollectionQuery } from "__generated__/HomeViewSectionFeaturedCollectionQuery.graphql"
import { HomeViewSectionFeaturedCollection_section$key } from "__generated__/HomeViewSectionFeaturedCollection_section.graphql"
import { ArtworkRail } from "app/Components/ArtworkRail/ArtworkRail"
import {
  ARTWORK_RAIL_CARD_IMAGE_HEIGHT,
  ARTWORK_RAIL_CARD_MIN_WIDTH,
} from "app/Components/ArtworkRail/ArtworkRailCardImage"
import { HomeViewSectionSentinel } from "app/Scenes/HomeView/Components/HomeViewSectionSentinel"
import { SectionSharedProps } from "app/Scenes/HomeView/Sections/Section"
import { useHomeViewTracking } from "app/Scenes/HomeView/hooks/useHomeViewTracking"
import { navigate } from "app/system/navigation/navigate"
import { extractNodes } from "app/utils/extractNodes"
import { NoFallback, withSuspense } from "app/utils/hooks/withSuspense"
import { memo } from "react"
import { TouchableOpacity, useWindowDimensions } from "react-native"
import { graphql, useFragment, useLazyLoadQuery } from "react-relay"

interface HomeViewSectionFeaturedCollectionProps {
  section: HomeViewSectionFeaturedCollection_section$key
  index: number
}

const HEADER_IMAGE_HEIGHT = 80

export const HomeViewSectionFeaturedCollection: React.FC<
  HomeViewSectionFeaturedCollectionProps
> = ({ section: sectionProp, index, ...flexProps }) => {
  const { width } = useWindowDimensions()
  const tracking = useHomeViewTracking()
  const section = useFragment(fragment, sectionProp)
  const component = section.component
  const viewAll = component?.behaviors?.viewAll

  if (!component) return null

  const artworks = extractNodes(section.artworksConnection)
  if (!artworks || artworks.length === 0) return null

  const onSectionViewAll = () => {
    if (viewAll?.href) {
      tracking.tappedArtworkGroupViewAll(
        section.contextModule as ContextModule,
        viewAll?.ownerType as ScreenOwnerType
      )

      navigate(viewAll.href)
    } else {
      tracking.tappedArtworkGroupViewAll(
        section.contextModule as ContextModule,
        section.ownerType as ScreenOwnerType
      )

      navigate(`/home-view/sections/${section.internalID}`, {
        passProps: {
          sectionType: section.__typename,
        },
      })
    }
  }

  const handleOnArtworkPress = (artwork: ArtworkRail_artworks$data[0], index: number) => {
    tracking.tappedArtworkGroup(
      artwork.internalID,
      artwork.slug,
      artwork.collectorSignals,
      section.contextModule as ContextModule,
      index
    )
  }

  return (
    <Flex {...flexProps}>
      <Flex pb={2} backgroundColor="black100">
        <TouchableOpacity onPress={onSectionViewAll} activeOpacity={0.7}>
          {!!component.backgroundImageURL && (
            <Image
              width={width}
              height={HEADER_IMAGE_HEIGHT}
              resizeMode="cover"
              src={component.backgroundImageURL}
            />
          )}
          <Flex mx={2} mt={2}>
            <Text color="white100" variant="lg-display" mb={0.5}>
              {component.title}
            </Text>
            <Text color="white100" variant="xs">
              {component.description}
            </Text>
          </Flex>
        </TouchableOpacity>

        <Spacer y={4} />

        <ArtworkRail
          dark
          showPartnerName
          artworks={artworks}
          onPress={handleOnArtworkPress}
          onMorePress={onSectionViewAll}
          hideCuratorsPickSignal
          hideIncreasedInterestSignal
          showSaveIcon
        />
      </Flex>

      <HomeViewSectionSentinel
        contextModule={section.contextModule as ContextModule}
        index={index}
      />
    </Flex>
  )
}

const fragment = graphql`
  fragment HomeViewSectionFeaturedCollection_section on HomeViewSectionArtworks {
    __typename
    internalID
    contextModule
    component {
      title
      description
      backgroundImageURL
      behaviors {
        viewAll {
          href
          ownerType
        }
      }
    }
    ownerType

    artworksConnection(first: 10) {
      edges {
        node {
          ...ArtworkRail_artworks
        }
      }
    }
  }
`

const HomeViewSectionFeaturedCollectionPlaceholder: React.FC<FlexProps> = () => {
  return (
    <Skeleton>
      <SkeletonBox>
        <SkeletonBox height={HEADER_IMAGE_HEIGHT} />

        <Flex mx={2} mt={2} testID="HomeViewSectionFeaturedCollectionPlaceholder">
          <SkeletonText color="white100" variant="lg-display" mb={0.5}>
            Section Title
          </SkeletonText>
          <SkeletonText color="white100" variant="xs">
            Description of the section
          </SkeletonText>
        </Flex>

        <Spacer y={4} />

        <Flex flexDirection="row">
          <Join separator={<Spacer x="15px" />}>
            <Flex>
              <SkeletonBox
                height={ARTWORK_RAIL_CARD_IMAGE_HEIGHT}
                width={ARTWORK_RAIL_CARD_MIN_WIDTH * 2}
              />
              <Spacer y={2} />
              <SkeletonText>Andy Warhol</SkeletonText>
              <SkeletonText>A creative name for a work</SkeletonText>
              <SkeletonText>Gallery or Partner</SkeletonText>
              <SkeletonText>1000 €</SkeletonText>
            </Flex>
          </Join>
        </Flex>
      </SkeletonBox>
    </Skeleton>
  )
}

const homeViewSectionFeaturedCollectionQuery = graphql`
  query HomeViewSectionFeaturedCollectionQuery($id: String!) @cacheable {
    homeView {
      section(id: $id) {
        ...HomeViewSectionFeaturedCollection_section
      }
    }
  }
`

export const HomeViewSectionFeaturedCollectionQueryRenderer: React.FC<SectionSharedProps> = memo(
  withSuspense({
    Component: ({ sectionID, index, ...flexProps }) => {
      const data = useLazyLoadQuery<HomeViewSectionFeaturedCollectionQuery>(
        homeViewSectionFeaturedCollectionQuery,
        {
          id: sectionID,
        },
        {
          networkCacheConfig: {
            force: false,
          },
        }
      )

      if (!data.homeView.section) {
        return null
      }

      return (
        <HomeViewSectionFeaturedCollection
          section={data.homeView.section}
          index={index}
          {...flexProps}
        />
      )
    },
    LoadingFallback: HomeViewSectionFeaturedCollectionPlaceholder,
    ErrorFallback: NoFallback,
  })
)
