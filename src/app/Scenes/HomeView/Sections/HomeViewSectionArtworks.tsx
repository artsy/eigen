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
import { ArtworkRail } from "app/Components/ArtworkRail/ArtworkRail"
import {
  ARTWORK_RAIL_CARD_IMAGE_HEIGHT,
  ARTWORK_RAIL_CARD_MIN_WIDTH,
} from "app/Components/ArtworkRail/ArtworkRailCardImage"
import { SectionTitle } from "app/Components/SectionTitle"
import { HomeViewSectionSentinel } from "app/Scenes/HomeView/Components/HomeViewSectionSentinel"
import { SectionSharedProps } from "app/Scenes/HomeView/Sections/Section"
import { getHomeViewSectionHref } from "app/Scenes/HomeView/helpers/getHomeViewSectionHref"
import { useHomeViewTracking } from "app/Scenes/HomeView/hooks/useHomeViewTracking"
import { navigate } from "app/system/navigation/navigate"
import { extractNodes } from "app/utils/extractNodes"
import { NoFallback, withSuspense } from "app/utils/hooks/withSuspense"
import { useMemoizedRandom } from "app/utils/placeholders"
import { times } from "lodash"
import { memo } from "react"
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
  }

  const href = getHomeViewSectionHref(viewAll?.href, section)

  const onSectionViewAll = () => {
    tracking.tappedArtworkGroupViewAll(
      section.contextModule as ContextModule,
      (viewAll?.ownerType || section.ownerType) as ScreenOwnerType
    )
  }

  const onMorePress = () => {
    tracking.tappedArtworkGroupViewAll(
      section.contextModule as ContextModule,
      (viewAll?.ownerType || section.ownerType) as ScreenOwnerType
    )

    navigate(href)
  }

  return (
    <Flex {...flexProps}>
      <SectionTitle
        href={href}
        mx={2}
        title={section.component?.title}
        onPress={onSectionViewAll}
      />

      <ArtworkRail
        contextModule={section.contextModule as ContextModule}
        artworks={artworks}
        onPress={handleOnArtworkPress}
        showSaveIcon
        onMorePress={onMorePress}
      />

      <HomeViewSectionSentinel
        contextModule={section.contextModule as ContextModule}
        sectionType={section.__typename}
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
                  <SkeletonBox
                    height={ARTWORK_RAIL_CARD_IMAGE_HEIGHT}
                    width={ARTWORK_RAIL_CARD_MIN_WIDTH * 2}
                  />
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

export const HomeViewSectionArtworksQueryRenderer: React.FC<SectionSharedProps> = memo(
  withSuspense({
    Component: ({ sectionID, index, ...flexProps }) => {
      const data = useLazyLoadQuery<HomeViewSectionArtworksQuery>(homeViewSectionArtworksQuery, {
        id: sectionID,
      })

      if (!data.homeView.section) {
        return null
      }

      return (
        <HomeViewSectionArtworks section={data.homeView.section} index={index} {...flexProps} />
      )
    },
    LoadingFallback: HomeViewSectionArtworksPlaceholder,
    ErrorFallback: NoFallback,
  })
)
