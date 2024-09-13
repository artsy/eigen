import { Flex, Join, Skeleton, SkeletonBox, SkeletonText, Spacer } from "@artsy/palette-mobile"
import { HomeViewSectionFairsQuery } from "__generated__/HomeViewSectionFairsQuery.graphql"
import { HomeViewSectionFairs_section$key } from "__generated__/HomeViewSectionFairs_section.graphql"
import { CardRailCard, CardRailMetadataContainer } from "app/Components/Home/CardRailCard"
import { CardRailFlatList } from "app/Components/Home/CardRailFlatList"
import { SectionTitle } from "app/Components/SectionTitle"
import { LARGE_IMAGE_SIZE, SMALL_IMAGE_SIZE } from "app/Components/ThreeUpImageLayout"
import { HOME_VIEW_SECTIONS_SEPARATOR_HEIGHT } from "app/Scenes/HomeView/HomeView"
import { HomeViewSectionFairsFairItem } from "app/Scenes/HomeView/Sections/HomeViewSectionFairsFairItem"
import { useHomeViewTracking } from "app/Scenes/HomeView/useHomeViewTracking"
import { navigate } from "app/system/navigation/navigate"
import { extractNodes } from "app/utils/extractNodes"
import { withSuspense } from "app/utils/hooks/withSuspense"
import { useMemoizedRandom } from "app/utils/placeholders"
import { times } from "lodash"
import { graphql, useFragment, useLazyLoadQuery } from "react-relay"

interface HomeViewSectionFairsProps {
  section: HomeViewSectionFairs_section$key
}

export const HomeViewSectionFairs: React.FC<HomeViewSectionFairsProps> = ({ section }) => {
  const tracking = useHomeViewTracking()

  const data = useFragment(fragment, section)
  const component = data.component
  const componentHref = component?.behaviors?.viewAll?.href

  if (!component) return null

  const fairs = extractNodes(data.fairsConnection)
  if (!fairs || fairs.length === 0) return null

  return (
    <Flex my={HOME_VIEW_SECTIONS_SEPARATOR_HEIGHT}>
      <Flex pl={2} pr={2}>
        <SectionTitle
          title={component.title}
          subtitle={component.description}
          onPress={
            componentHref
              ? () => {
                  navigate(componentHref)
                }
              : undefined
          }
        />
      </Flex>

      <CardRailFlatList<any>
        data={fairs}
        initialNumToRender={3}
        renderItem={({ item, index }) => {
          return (
            <HomeViewSectionFairsFairItem
              key={item.internalID}
              fair={item}
              onPress={(fair) => {
                tracking.tappedFairGroup(fair.internalID, fair.slug, data.internalID, index)
              }}
            />
          )
        }}
      />
    </Flex>
  )
}

const fragment = graphql`
  fragment HomeViewSectionFairs_section on HomeViewSectionFairs {
    internalID
    component {
      title
      description
      behaviors {
        viewAll {
          href
        }
      }
    }

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

const HomeViewSectionFairsPlaceholder: React.FC = () => {
  const randomValue = useMemoizedRandom()
  return (
    <Skeleton>
      <Flex mx={2} my={HOME_VIEW_SECTIONS_SEPARATOR_HEIGHT}>
        <SkeletonText>Featured Fairs</SkeletonText>
        <SkeletonText>See Wroks in Top Art Fairs</SkeletonText>
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
                    <SkeletonText numberOfLines={1}>Art on Paper 2024, New York</SkeletonText>
                  </CardRailMetadataContainer>
                </Flex>
              </CardRailCard>
            ))}
          </Join>
        </Flex>
      </Flex>
    </Skeleton>
  )
}

const homeViewSectionFairsQuery = graphql`
  query HomeViewSectionFairsQuery($id: String!) {
    homeView {
      section(id: $id) {
        ...HomeViewSectionFairs_section
      }
    }
  }
`

export const HomeViewSectionFairsQueryRenderer: React.FC<{
  sectionID: string
}> = withSuspense((props) => {
  const data = useLazyLoadQuery<HomeViewSectionFairsQuery>(homeViewSectionFairsQuery, {
    id: props.sectionID,
  })

  if (!data.homeView.section) {
    return null
  }

  return <HomeViewSectionFairs section={data.homeView.section} />
}, HomeViewSectionFairsPlaceholder)
