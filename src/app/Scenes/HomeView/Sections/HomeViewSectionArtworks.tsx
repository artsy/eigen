import { ContextModule, ScreenOwnerType } from "@artsy/cohesion"
import {
  Flex,
  FlexProps,
  Join,
  Skeleton,
  SkeletonBox,
  SkeletonText,
  Spacer,
} from "@artsy/palette-mobile"
import { ArtworkRail_artworks$data } from "__generated__/ArtworkRail_artworks.graphql"
import { HomeViewSectionArtworksQuery } from "__generated__/HomeViewSectionArtworksQuery.graphql"
import { HomeViewSectionArtworks_section$key } from "__generated__/HomeViewSectionArtworks_section.graphql"
import { ARTWORK_RAIL_IMAGE_WIDTH, ArtworkRail } from "app/Components/ArtworkRail/ArtworkRail"
import {
  ARTWORK_RAIL_CARD_IMAGE_HEIGHT,
  ARTWORK_RAIL_MIN_IMAGE_WIDTH,
} from "app/Components/ArtworkRail/ArtworkRailCardImage"
import { LEGACY_ARTWORK_RAIL_CARD_IMAGE_HEIGHT } from "app/Components/ArtworkRail/LegacyArtworkRailCardImage"
import { SectionTitle } from "app/Components/SectionTitle"
import { HomeViewSectionSentinel } from "app/Scenes/HomeView/Components/HomeViewSectionSentinel"
import { SectionSharedProps } from "app/Scenes/HomeView/Sections/Section"
import { useHomeViewTracking } from "app/Scenes/HomeView/useHomeViewTracking"
import { navigate } from "app/system/navigation/navigate"
import { extractNodes } from "app/utils/extractNodes"
import { useFeatureFlag } from "app/utils/hooks/useFeatureFlag"
import { withSuspense } from "app/utils/hooks/withSuspense"
import { useMemoizedRandom } from "app/utils/placeholders"
import { times } from "lodash"
import { graphql, useFragment, useLazyLoadQuery } from "react-relay"

interface HomeViewSectionArtworksProps extends FlexProps {
  section: HomeViewSectionArtworks_section$key
  index: number
}

export const HomeViewSectionArtworks: React.FC<HomeViewSectionArtworksProps> = ({
  section: sectionProp,
  index,
  ...flexProps
}) => {
  const tracking = useHomeViewTracking()

  const section = useFragment(fragment, sectionProp)
  const artworks = extractNodes(section.artworksConnection)
  const viewAll = section.component?.behaviors?.viewAll

  if (!artworks || artworks.length === 0) {
    return null
  }

  const handleOnArtworkPress = (
    artwork: ArtworkRail_artworks$data[0] | ArtworkRail_artworks$data[0],
    position: number
  ) => {
    tracking.tappedArtworkGroup(
      artwork.internalID,
      artwork.slug,
      artwork.collectorSignals,
      section.contextModule as ContextModule,
      position
    )

    if (artwork.href) {
      navigate(artwork.href)
    }
  }

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

  return (
    <Flex {...flexProps}>
      <Flex pl={2} pr={2}>
        <SectionTitle
          title={section.component?.title}
          onPress={viewAll ? onSectionViewAll : undefined}
        />
      </Flex>
      <ArtworkRail
        contextModule={section.contextModule as ContextModule}
        artworks={artworks}
        onPress={handleOnArtworkPress}
        showSaveIcon
        onMorePress={viewAll ? onSectionViewAll : undefined}
      />

      <HomeViewSectionSentinel
        contextModule={section.contextModule as ContextModule}
        index={index}
      />
    </Flex>
  )
}

const fragment = graphql`
  fragment HomeViewSectionArtworks_section on HomeViewSectionArtworks {
    __typename
    internalID
    contextModule
    component {
      title
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

const homeViewSectionArtworksQuery = graphql`
  query HomeViewSectionArtworksQuery($id: String!) {
    homeView {
      section(id: $id) {
        ...HomeViewSectionArtworks_section
      }
    }
  }
`

const HomeViewSectionArtworksPlaceholder: React.FC<FlexProps> = (flexProps) => {
  const randomValue = useMemoizedRandom()
  const enableArtworkRailRedesignImageAspectRatio = useFeatureFlag(
    "AREnableArtworkRailRedesignImageAspectRatio"
  )

  return (
    <Skeleton>
      <Flex {...flexProps}>
        <Flex mx={2}>
          <SkeletonText variant="sm-display">Arwtworks Rail</SkeletonText>
          <Spacer y={2} />

          <Flex flexDirection="row">
            <Join separator={<Spacer x={2} />}>
              {times(2 + randomValue * 10).map((index) => (
                <Flex key={index}>
                  {enableArtworkRailRedesignImageAspectRatio ? (
                    <SkeletonBox
                      height={ARTWORK_RAIL_CARD_IMAGE_HEIGHT}
                      width={ARTWORK_RAIL_MIN_IMAGE_WIDTH * 2}
                    />
                  ) : (
                    <SkeletonBox
                      height={LEGACY_ARTWORK_RAIL_CARD_IMAGE_HEIGHT}
                      width={ARTWORK_RAIL_IMAGE_WIDTH}
                    />
                  )}
                  <Spacer y={1} />

                  <Join separator={<Spacer y={0.5} />}>
                    <SkeletonBox height={15} width={60} />
                    <SkeletonBox height={15} width={100} />
                    <SkeletonBox height={15} width={120} />
                    <SkeletonBox height={15} width={80} />
                    <SkeletonBox height={15} width={110} />
                  </Join>
                </Flex>
              ))}
            </Join>
          </Flex>
        </Flex>
      </Flex>
    </Skeleton>
  )
}

export const HomeViewSectionArtworksQueryRenderer: React.FC<SectionSharedProps> = withSuspense(
  ({ sectionID, index, ...flexProps }) => {
    const data = useLazyLoadQuery<HomeViewSectionArtworksQuery>(homeViewSectionArtworksQuery, {
      id: sectionID,
    })

    if (!data.homeView.section) {
      return null
    }

    return <HomeViewSectionArtworks section={data.homeView.section} index={index} {...flexProps} />
  },
  HomeViewSectionArtworksPlaceholder
)
