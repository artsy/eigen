import { ContextModule, ScreenOwnerType } from "@artsy/cohesion"
import {
  Flex,
  FlexProps,
  Join,
  Skeleton,
  SkeletonBox,
  SkeletonText,
  Spacer,
  Touchable,
} from "@artsy/palette-mobile"
import { HomeViewSectionMarketingCollectionsQuery } from "__generated__/HomeViewSectionMarketingCollectionsQuery.graphql"
import {
  HomeViewSectionMarketingCollections_section$data,
  HomeViewSectionMarketingCollections_section$key,
} from "__generated__/HomeViewSectionMarketingCollections_section.graphql"
import { CardRailFlatList } from "app/Components/CardRail/CardRailFlatList"
import {
  DEFAULT_HORIZONTAL_IMAGE_DIMENSIONS,
  DEFAULT_LARGE_IMAGE_DIMENSIONS,
  DEFAULT_SMALL_IMAGE_DIMENSIONS,
  GAP,
} from "app/Components/FiveUpImageLayout"
import { SectionTitle } from "app/Components/SectionTitle"
import { HomeViewSectionSentinel } from "app/Scenes/HomeView/Components/HomeViewSectionSentinel"
import { HomeViewSectionMarketingCollectionsItem } from "app/Scenes/HomeView/Sections/HomeViewSectionMarketingCollectionsItem"
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
import { memo } from "react"
import { graphql, useFragment, useLazyLoadQuery } from "react-relay"

interface HomeViewSectionMarketingCollectionsProps {
  section: HomeViewSectionMarketingCollections_section$key
  index: number
}

export const HomeViewSectionMarketingCollections: React.FC<
  HomeViewSectionMarketingCollectionsProps
> = ({ section: sectionProp, index, ...flexProps }) => {
  const tracking = useHomeViewTracking()

  const section = useFragment(fragment, sectionProp)
  const component = section.component

  const marketingCollections = extractNodes(section.marketingCollectionsConnection)
  const viewAll = component?.behaviors?.viewAll
  const href = getHomeViewSectionHref(viewAll?.href, section)

  const onSectionViewAll = () => {
    tracking.tappedMarketingCollectionGroupViewAll(
      section.contextModule as ContextModule,
      (viewAll?.ownerType || section.ownerType) as ScreenOwnerType
    )
  }

  if (!component) return null
  if (!marketingCollections || marketingCollections.length === 0) return null

  return (
    <Flex {...flexProps}>
      <SectionTitle
        href={href}
        mx={2}
        onPress={href ? onSectionViewAll : undefined}
        title={component.title}
      />

      <CardRailFlatList<
        ExtractNodeType<
          HomeViewSectionMarketingCollections_section$data["marketingCollectionsConnection"]
        >
      >
        data={marketingCollections}
        initialNumToRender={HORIZONTAL_FLATLIST_INTIAL_NUMBER_TO_RENDER_DEFAULT}
        windowSize={HORIZONTAL_FLATLIST_WINDOW_SIZE}
        renderItem={({ item, index }) => {
          return (
            <HomeViewSectionMarketingCollectionsItem
              key={item.internalID}
              marketingCollection={item}
              onPress={(collection) => {
                tracking.tappedMarketingCollectionGroup(
                  collection.internalID,
                  collection.slug,
                  section.contextModule as ContextModule,
                  index
                )
              }}
            />
          )
        }}
      />

      <HomeViewSectionSentinel
        contextModule={section.contextModule as ContextModule}
        index={index}
      />
    </Flex>
  )
}

const fragment = graphql`
  fragment HomeViewSectionMarketingCollections_section on HomeViewSectionMarketingCollections {
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

    marketingCollectionsConnection(first: 10) {
      edges {
        node {
          internalID
          ...HomeViewSectionMarketingCollectionsItem_marketingCollection
        }
      }
    }
  }
`

const HomeViewSectionMarketingCollectionsPlaceholder: React.FC<FlexProps> = (flexProps) => {
  const randomValue = useMemoizedRandom()
  return (
    <Skeleton>
      <Flex {...flexProps}>
        <Flex mx={2}>
          <SkeletonText>Collections</SkeletonText>

          <Spacer y={1} />

          <Flex flexDirection="row">
            <Join separator={<Spacer x="15px" />}>
              {times(2 + randomValue * 10).map((index) => (
                <Touchable key={index}>
                  <Flex>
                    <Flex flexDirection="row">
                      <SkeletonBox
                        height={DEFAULT_LARGE_IMAGE_DIMENSIONS.height}
                        width={DEFAULT_LARGE_IMAGE_DIMENSIONS.width}
                        borderBottomWidth={GAP}
                        borderColor="mono0"
                      />
                      <Flex>
                        <SkeletonBox
                          height={DEFAULT_SMALL_IMAGE_DIMENSIONS.height}
                          width={DEFAULT_SMALL_IMAGE_DIMENSIONS.width}
                          borderLeftWidth={GAP}
                          borderColor="mono0"
                          borderBottomWidth={GAP}
                        />
                        <SkeletonBox
                          height={DEFAULT_SMALL_IMAGE_DIMENSIONS.height}
                          width={DEFAULT_SMALL_IMAGE_DIMENSIONS.width}
                          borderLeftWidth={GAP}
                          borderColor="mono0"
                          borderBottomWidth={GAP}
                        />
                      </Flex>
                    </Flex>
                    <Flex flexDirection="row">
                      <SkeletonBox
                        height={DEFAULT_SMALL_IMAGE_DIMENSIONS.height}
                        width={DEFAULT_SMALL_IMAGE_DIMENSIONS.width}
                        borderColor="mono0"
                      />
                      <SkeletonBox
                        height={DEFAULT_HORIZONTAL_IMAGE_DIMENSIONS.height}
                        width={DEFAULT_HORIZONTAL_IMAGE_DIMENSIONS.width}
                        borderLeftWidth={GAP}
                        borderColor="mono0"
                      />
                    </Flex>

                    <Spacer y={1} />

                    <Flex>
                      <SkeletonText>New this week</SkeletonText>
                      <SkeletonText>21 works</SkeletonText>
                    </Flex>
                  </Flex>
                </Touchable>
              ))}
            </Join>
          </Flex>
        </Flex>
      </Flex>
    </Skeleton>
  )
}

const homeViewSectionMarketingCollectionsQuery = graphql`
  query HomeViewSectionMarketingCollectionsQuery($id: String!) @cacheable {
    homeView {
      section(id: $id) {
        ...HomeViewSectionMarketingCollections_section
      }
    }
  }
`

export const HomeViewSectionMarketingCollectionsQueryRenderer: React.FC<SectionSharedProps> = memo(
  withSuspense({
    Component: ({ sectionID, index, ...flexProps }) => {
      const data = useLazyLoadQuery<HomeViewSectionMarketingCollectionsQuery>(
        homeViewSectionMarketingCollectionsQuery,
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
        <HomeViewSectionMarketingCollections
          section={data.homeView.section}
          index={index}
          {...flexProps}
        />
      )
    },
    LoadingFallback: HomeViewSectionMarketingCollectionsPlaceholder,
    ErrorFallback: NoFallback,
  })
)
