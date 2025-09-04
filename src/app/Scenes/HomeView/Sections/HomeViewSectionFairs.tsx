import { ContextModule, ScreenOwnerType } from "@artsy/cohesion"
import { Flex, FlexProps, Join, Skeleton, SkeletonBox, Spacer } from "@artsy/palette-mobile"
import { HomeViewSectionFairsQuery } from "__generated__/HomeViewSectionFairsQuery.graphql"
import {
  HomeViewSectionFairs_section$data,
  HomeViewSectionFairs_section$key,
} from "__generated__/HomeViewSectionFairs_section.graphql"
import { CardRailCard, CardRailMetadataContainer } from "app/Components/CardRail/CardRailCard"
import { CardRailFlatList } from "app/Components/CardRail/CardRailFlatList"
import { SectionTitle } from "app/Components/SectionTitle"
import { LARGE_IMAGE_SIZE, SMALL_IMAGE_SIZE } from "app/Components/ThreeUpImageLayout"
import { HomeViewSectionSentinel } from "app/Scenes/HomeView/Components/HomeViewSectionSentinel"
import { FairCard } from "app/Scenes/HomeView/Sections/FairCard"
import { SectionSharedProps } from "app/Scenes/HomeView/Sections/Section"
import {
  HORIZONTAL_FLATLIST_INTIAL_NUMBER_TO_RENDER_DEFAULT,
  HORIZONTAL_FLATLIST_WINDOW_SIZE,
} from "app/Scenes/HomeView/helpers/constants"
import { getHomeViewSectionHref } from "app/Scenes/HomeView/helpers/getHomeViewSectionHref"
import { useHomeViewTracking } from "app/Scenes/HomeView/hooks/useHomeViewTracking"
import { extractNodes } from "app/utils/extractNodes"
import { NoFallback, withSuspense } from "app/utils/hooks/withSuspense"
import { useMemoizedRandom } from "app/utils/placeholders"
import { ExtractNodeType } from "app/utils/relayHelpers"
import { times } from "lodash"
import { memo, useCallback } from "react"
import { ListRenderItem } from "react-native"
import { graphql, useFragment, useLazyLoadQuery } from "react-relay"

interface HomeViewSectionFairsProps {
  section: HomeViewSectionFairs_section$key
  index: number
}

type FairItem = ExtractNodeType<HomeViewSectionFairs_section$data["fairsConnection"]>

export const HomeViewSectionFairs: React.FC<HomeViewSectionFairsProps> = memo(
  ({ section: sectionProp, index, ...flexProps }) => {
    const tracking = useHomeViewTracking()

    const section = useFragment(fragment, sectionProp)
    const viewAll = section.component?.behaviors?.viewAll

    const fairs = extractNodes(section.fairsConnection)

    let href = viewAll && getHomeViewSectionHref(viewAll?.href, section)

    // Only apply the "Featured Fairs" href to the specific "Featured Fairs" section instance.
    if (!href && section.internalID === "home-view-section-featured-fairs") {
      href = "/featured-fairs"
    }

    const onViewAllPress = () => {
      tracking.tappedFairGroupViewAll(
        section.contextModule as ContextModule,
        (viewAll?.ownerType || section.ownerType) as ScreenOwnerType
      )
    }

    const renderItem: ListRenderItem<FairItem> = useCallback(
      ({ item, index }) => {
        return (
          <FairCard
            key={item.internalID}
            fair={item}
            onPress={(fair) => {
              tracking.tappedFairGroup(
                fair.internalID,
                fair.slug,
                section.contextModule as ContextModule,
                index
              )
            }}
          />
        )
      },
      [section.contextModule, tracking]
    )

    if (!fairs?.length) return null

    return (
      <Flex {...flexProps}>
        <SectionTitle
          href={href}
          title={section.component?.title}
          subtitle={section.component?.description}
          onPress={href ? onViewAllPress : undefined}
          mx={2}
        />

        <CardRailFlatList<FairItem>
          data={fairs}
          initialNumToRender={HORIZONTAL_FLATLIST_INTIAL_NUMBER_TO_RENDER_DEFAULT}
          renderItem={renderItem}
          disableVirtualization
          windowSize={HORIZONTAL_FLATLIST_WINDOW_SIZE}
        />

        <HomeViewSectionSentinel
          contextModule={section.contextModule as ContextModule}
          index={index}
        />
      </Flex>
    )
  }
)

const fragment = graphql`
  fragment HomeViewSectionFairs_section on HomeViewSectionFairs {
    __typename
    internalID
    contextModule
    component {
      title
      description
      behaviors {
        viewAll {
          href
          ownerType
        }
      }
    }
    fairsConnection(first: 10) {
      edges {
        node {
          href
          internalID
          slug
          ...FairCard_fair
        }
      }
    }
    ownerType
  }
`

const HomeViewSectionFairsPlaceholder: React.FC<FlexProps> = (flexProps) => {
  const randomValue = useMemoizedRandom()

  return (
    <Skeleton>
      <Flex {...flexProps}>
        <Flex mx={2}>
          <SkeletonBox width={100} height={18} mb={0.5} />
          <SkeletonBox width={200} height={18} />
          <Spacer y={1} />

          <Flex flexDirection="row">
            <Join separator={<Spacer x="15px" />}>
              {times(2 + randomValue * 10).map((index) => (
                <CardRailCard key={index}>
                  <Flex>
                    <Flex flexDirection="row">
                      <SkeletonBox height={LARGE_IMAGE_SIZE} width={LARGE_IMAGE_SIZE} />
                      <Flex>
                        <SkeletonBox
                          height={SMALL_IMAGE_SIZE}
                          width={SMALL_IMAGE_SIZE}
                          borderLeftWidth={2}
                          borderColor="mono0"
                          borderBottomWidth={1}
                        />
                        <SkeletonBox
                          height={SMALL_IMAGE_SIZE}
                          width={SMALL_IMAGE_SIZE}
                          borderLeftWidth={2}
                          borderColor="mono0"
                          borderTopWidth={1}
                        />
                      </Flex>
                    </Flex>

                    <CardRailMetadataContainer>
                      <SkeletonBox width={180} height={18} mb={0.5} />
                      <SkeletonBox width={130} height={18} />
                    </CardRailMetadataContainer>
                  </Flex>
                </CardRailCard>
              ))}
            </Join>
          </Flex>
        </Flex>
      </Flex>
    </Skeleton>
  )
}

const homeViewSectionFairsQuery = graphql`
  query HomeViewSectionFairsQuery($id: String!) @cacheable {
    homeView {
      section(id: $id) {
        ...HomeViewSectionFairs_section
      }
    }
  }
`

export const HomeViewSectionFairsQueryRenderer: React.FC<SectionSharedProps> = withSuspense({
  Component: ({ sectionID, index, ...flexProps }) => {
    const data = useLazyLoadQuery<HomeViewSectionFairsQuery>(
      homeViewSectionFairsQuery,
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

    return <HomeViewSectionFairs section={data.homeView.section} index={index} {...flexProps} />
  },
  LoadingFallback: HomeViewSectionFairsPlaceholder,
  ErrorFallback: NoFallback,
})
