import { ContextModule, ScreenOwnerType } from "@artsy/cohesion"
import { Flex, FlexProps, Join, Skeleton, SkeletonBox, Spacer } from "@artsy/palette-mobile"
import { HomeViewSectionFairsQuery } from "__generated__/HomeViewSectionFairsQuery.graphql"
import { HomeViewSectionFairs_section$key } from "__generated__/HomeViewSectionFairs_section.graphql"
import { CardRailCard, CardRailMetadataContainer } from "app/Components/Home/CardRailCard"
import { CardRailFlatList } from "app/Components/Home/CardRailFlatList"
import { SectionTitle } from "app/Components/SectionTitle"
import { LARGE_IMAGE_SIZE, SMALL_IMAGE_SIZE } from "app/Components/ThreeUpImageLayout"
import { HomeViewSectionSentinel } from "app/Scenes/HomeView/Components/HomeViewSectionSentinel"
import { HomeViewSectionFairsFairItem } from "app/Scenes/HomeView/Sections/HomeViewSectionFairsFairItem"
import { SectionSharedProps } from "app/Scenes/HomeView/Sections/Section"
import {
  HORIZONTAL_FLATLIST_INTIAL_NUMBER_TO_RENDER_DEFAULT,
  HORIZONTAL_FLATLIST_WINDOW_SIZE,
} from "app/Scenes/HomeView/helpers/constants"
import { useHomeViewTracking } from "app/Scenes/HomeView/useHomeViewTracking"
import { navigate } from "app/system/navigation/navigate"
import { extractNodes } from "app/utils/extractNodes"
import { NoFallback, withSuspense } from "app/utils/hooks/withSuspense"
import { useMemoizedRandom } from "app/utils/placeholders"
import { times } from "lodash"
import { graphql, useFragment, useLazyLoadQuery } from "react-relay"

interface HomeViewSectionFairsProps {
  section: HomeViewSectionFairs_section$key
  index: number
}

export const HomeViewSectionFairs: React.FC<HomeViewSectionFairsProps> = ({
  section: sectionProp,
  index,
  ...flexProps
}) => {
  const tracking = useHomeViewTracking()

  const section = useFragment(fragment, sectionProp)
  const viewAll = section.component?.behaviors?.viewAll

  const fairs = extractNodes(section.fairsConnection)
  if (!fairs || fairs.length === 0) return null

  const onSectionViewAll = () => {
    if (viewAll?.href) {
      tracking.tappedFairGroupViewAll(
        section.contextModule as ContextModule,
        viewAll?.ownerType as ScreenOwnerType
      )

      navigate(viewAll.href)
    } else {
      tracking.tappedFairGroupViewAll(
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
          subtitle={section.component?.description}
          onPress={viewAll ? onSectionViewAll : undefined}
        />
      </Flex>

      <CardRailFlatList<any>
        data={fairs}
        initialNumToRender={HORIZONTAL_FLATLIST_INTIAL_NUMBER_TO_RENDER_DEFAULT}
        windowSize={HORIZONTAL_FLATLIST_WINDOW_SIZE}
        renderItem={({ item, index }) => {
          return (
            <HomeViewSectionFairsFairItem
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
    ownerType

    fairsConnection(first: 10) {
      edges {
        node {
          internalID
          ...HomeViewSectionFairsFairItem_fair
        }
      }
    }
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
                          borderColor="white100"
                          borderBottomWidth={1}
                        />
                        <SkeletonBox
                          height={SMALL_IMAGE_SIZE}
                          width={SMALL_IMAGE_SIZE}
                          borderLeftWidth={2}
                          borderColor="white100"
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
