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
import { HomeViewSectionMarketingCollectionsQuery } from "__generated__/HomeViewSectionMarketingCollectionsQuery.graphql"
import {
  HomeViewSectionMarketingCollections_section$data,
  HomeViewSectionMarketingCollections_section$key,
} from "__generated__/HomeViewSectionMarketingCollections_section.graphql"
import {
  DEFAULT_HORIZONTAL_IMAGE_DIMENSIONS,
  DEFAULT_LARGE_IMAGE_DIMENSIONS,
  DEFAULT_SMALL_IMAGE_DIMENSIONS,
  GAP,
} from "app/Components/FiveUpImageLayout"
import { CardRailFlatList } from "app/Components/Home/CardRailFlatList"
import { SectionTitle } from "app/Components/SectionTitle"
import {
  CollectionCard,
  HomeViewSectionMarketingCollectionsItem,
} from "app/Scenes/HomeView/Sections/HomeViewSectionMarketingCollectionsItem"
import {
  HORIZONTAL_FLATLIST_INTIAL_NUMBER_TO_RENDER_DEFAULT,
  HORIZONTAL_FLATLIST_WINDOW_SIZE,
} from "app/Scenes/HomeView/helpers/constants"
import { useHomeViewTracking } from "app/Scenes/HomeView/useHomeViewTracking"
import { navigate } from "app/system/navigation/navigate"
import { extractNodes } from "app/utils/extractNodes"
import { withSuspense } from "app/utils/hooks/withSuspense"
import { useMemoizedRandom } from "app/utils/placeholders"
import { ExtractNodeType } from "app/utils/relayHelpers"
import { times } from "lodash"
import { graphql, useFragment, useLazyLoadQuery } from "react-relay"

interface HomeViewSectionMarketingCollectionsProps {
  section: HomeViewSectionMarketingCollections_section$key
}

export const HomeViewSectionMarketingCollections: React.FC<
  HomeViewSectionMarketingCollectionsProps
> = ({ section: sectionProp, ...flexProps }) => {
  const tracking = useHomeViewTracking()

  const section = useFragment(fragment, sectionProp)
  const component = section.component

  if (!component) return null

  const marketingCollections = extractNodes(section.marketingCollectionsConnection)
  if (!marketingCollections || marketingCollections.length === 0) return null
  const viewAll = section.component.behaviors?.viewAll

  const onSectionViewAll = () => {
    if (viewAll?.href) {
      tracking.tappedMarketingCollectionGroupViewAll(
        section.contextModule as ContextModule,
        viewAll?.ownerType as ScreenOwnerType
      )

      navigate(viewAll.href)
    } else {
      tracking.tappedMarketingCollectionGroupViewAll(
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
        <SectionTitle title={component.title} onPress={viewAll ? onSectionViewAll : undefined} />
      </Flex>

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
                <CollectionCard key={index}>
                  <Flex>
                    <Flex flexDirection="row">
                      <SkeletonBox
                        height={DEFAULT_LARGE_IMAGE_DIMENSIONS.height}
                        width={DEFAULT_LARGE_IMAGE_DIMENSIONS.width}
                        borderBottomWidth={GAP}
                        borderColor="white100"
                      />
                      <Flex>
                        <SkeletonBox
                          height={DEFAULT_SMALL_IMAGE_DIMENSIONS.height}
                          width={DEFAULT_SMALL_IMAGE_DIMENSIONS.width}
                          borderLeftWidth={GAP}
                          borderColor="white100"
                          borderBottomWidth={GAP}
                        />
                        <SkeletonBox
                          height={DEFAULT_SMALL_IMAGE_DIMENSIONS.height}
                          width={DEFAULT_SMALL_IMAGE_DIMENSIONS.width}
                          borderLeftWidth={GAP}
                          borderColor="white100"
                          borderBottomWidth={GAP}
                        />
                      </Flex>
                    </Flex>
                    <Flex flexDirection="row">
                      <SkeletonBox
                        height={DEFAULT_SMALL_IMAGE_DIMENSIONS.height}
                        width={DEFAULT_SMALL_IMAGE_DIMENSIONS.width}
                        borderColor="white100"
                      />
                      <SkeletonBox
                        height={DEFAULT_HORIZONTAL_IMAGE_DIMENSIONS.height}
                        width={DEFAULT_HORIZONTAL_IMAGE_DIMENSIONS.width}
                        borderLeftWidth={GAP}
                        borderColor="white100"
                      />
                    </Flex>

                    <Spacer y={1} />

                    <Flex>
                      <SkeletonText>New this week</SkeletonText>
                      <SkeletonText>21 works</SkeletonText>
                    </Flex>
                  </Flex>
                </CollectionCard>
              ))}
            </Join>
          </Flex>
        </Flex>
      </Flex>
    </Skeleton>
  )
}

const homeViewSectionMarketingCollectionsQuery = graphql`
  query HomeViewSectionMarketingCollectionsQuery($id: String!) {
    homeView {
      section(id: $id) {
        ...HomeViewSectionMarketingCollections_section
      }
    }
  }
`

interface HomeViewSectionMarketingCollectionsQueryRendererProps extends FlexProps {
  sectionID: string
}

export const HomeViewSectionMarketingCollectionsQueryRenderer: React.FC<HomeViewSectionMarketingCollectionsQueryRendererProps> =
  withSuspense(({ sectionID, ...flexProps }) => {
    const data = useLazyLoadQuery<HomeViewSectionMarketingCollectionsQuery>(
      homeViewSectionMarketingCollectionsQuery,
      {
        id: sectionID,
      }
    )

    if (!data.homeView.section) {
      return null
    }

    return <HomeViewSectionMarketingCollections section={data.homeView.section} {...flexProps} />
  }, HomeViewSectionMarketingCollectionsPlaceholder)
