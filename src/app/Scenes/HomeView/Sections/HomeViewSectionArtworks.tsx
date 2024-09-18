import { ContextModule, ScreenOwnerType } from "@artsy/cohesion"
import { Flex, Join, Skeleton, SkeletonBox, SkeletonText, Spacer } from "@artsy/palette-mobile"
import { ArtworkRail_artworks$data } from "__generated__/ArtworkRail_artworks.graphql"
import { HomeViewSectionArtworksQuery } from "__generated__/HomeViewSectionArtworksQuery.graphql"
import { HomeViewSectionArtworks_section$key } from "__generated__/HomeViewSectionArtworks_section.graphql"
import { ARTWORK_RAIL_IMAGE_WIDTH, ArtworkRail } from "app/Components/ArtworkRail/ArtworkRail"
import { ARTWORK_RAIL_CARD_IMAGE_HEIGHT } from "app/Components/ArtworkRail/LegacyArtworkRailCardImage"
import { SectionTitle } from "app/Components/SectionTitle"
import { HOME_VIEW_SECTIONS_SEPARATOR_HEIGHT } from "app/Scenes/HomeView/HomeView"
import { useHomeViewTracking } from "app/Scenes/HomeView/useHomeViewTracking"
import { navigate } from "app/system/navigation/navigate"
import { extractNodes } from "app/utils/extractNodes"
import { withSuspense } from "app/utils/hooks/withSuspense"
import { useMemoizedRandom } from "app/utils/placeholders"
import { times } from "lodash"
import { View } from "react-native"
import { graphql, useFragment, useLazyLoadQuery } from "react-relay"

interface HomeViewSectionArtworksProps {
  section: HomeViewSectionArtworks_section$key
}

export const HomeViewSectionArtworks: React.FC<HomeViewSectionArtworksProps> = (props) => {
  const tracking = useHomeViewTracking()

  const section = useFragment(fragment, props.section)
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
    <Flex my={HOME_VIEW_SECTIONS_SEPARATOR_HEIGHT}>
      <View>
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
      </View>
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

const HomeViewSectionArtworksPlaceholder: React.FC = () => {
  const randomValue = useMemoizedRandom()
  return (
    <Skeleton>
      <Flex mx={2} my={HOME_VIEW_SECTIONS_SEPARATOR_HEIGHT}>
        <SkeletonText variant="lg-display">Arwtworks Rail</SkeletonText>
        <Spacer y={2} />

        <Flex flexDirection="row">
          <Join separator={<Spacer x="15px" />}>
            {times(2 + randomValue * 10).map((index) => (
              <Flex key={index}>
                <SkeletonBox
                  height={ARTWORK_RAIL_CARD_IMAGE_HEIGHT}
                  width={ARTWORK_RAIL_IMAGE_WIDTH}
                />
                <Spacer y={2} />
                <SkeletonText>Andy Warhol</SkeletonText>
                <SkeletonText>A creative name for a work</SkeletonText>
                <SkeletonText>Gallery or Partner</SkeletonText>
                <SkeletonText>1000 €</SkeletonText>
              </Flex>
            ))}
          </Join>
        </Flex>
      </Flex>
    </Skeleton>
  )
}

export const HomeViewSectionArtworksQueryRenderer: React.FC<{
  sectionID: string
}> = withSuspense((props) => {
  const data = useLazyLoadQuery<HomeViewSectionArtworksQuery>(homeViewSectionArtworksQuery, {
    id: props.sectionID,
  })

  if (!data.homeView.section) {
    return null
  }

  return <HomeViewSectionArtworks section={data.homeView.section} />
}, HomeViewSectionArtworksPlaceholder)
