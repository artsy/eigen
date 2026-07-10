import { ContextModule, ScreenOwnerType } from "@artsy/cohesion"
import { Flex, FlexProps, Join, Skeleton, SkeletonText, Spacer } from "@artsy/palette-mobile"
import { HomeViewSectionArtnetNewsQuery } from "__generated__/HomeViewSectionArtnetNewsQuery.graphql"
import {
  HomeViewSectionArtnetNews_section$data,
  HomeViewSectionArtnetNews_section$key,
} from "__generated__/HomeViewSectionArtnetNews_section.graphql"
import {
  CardWithMetaData,
  CardWithMetaDataSkeleton as SkeletonArticleCard,
} from "app/Components/Cards/CardWithMetaData"
import { SectionTitle } from "app/Components/SectionTitle"
import { HomeViewSectionSentinel } from "app/Scenes/HomeView/Components/HomeViewSectionSentinel"
import { SectionSharedProps } from "app/Scenes/HomeView/Sections/Section"
import {
  HORIZONTAL_FLATLIST_INTIAL_NUMBER_TO_RENDER_DEFAULT,
  HORIZONTAL_FLATLIST_WINDOW_SIZE,
} from "app/Scenes/HomeView/helpers/constants"
import { useHomeViewTracking } from "app/Scenes/HomeView/hooks/useHomeViewTracking"
import { extractNodes } from "app/utils/extractNodes"
import { NoFallback, withSuspense } from "app/utils/hooks/withSuspense"
import { useMemoizedRandom } from "app/utils/placeholders"
import { ExtractNodeType } from "app/utils/relayHelpers"
import { times } from "lodash"
import { memo, useCallback } from "react"
import { FlatList, ListRenderItem } from "react-native"
import { graphql, useFragment, useLazyLoadQuery } from "react-relay"

interface HomeViewSectionArtnetNewsProps {
  section: HomeViewSectionArtnetNews_section$key
  index: number
}

type ArtnetNewsArticle = ExtractNodeType<
  HomeViewSectionArtnetNews_section$data["artnetNewsArticlesConnection"]
>

export const HomeViewSectionArtnetNews: React.FC<HomeViewSectionArtnetNewsProps> = memo(
  ({ section: sectionProp, index, ...flexProps }) => {
    const section = useFragment(sectionFragment, sectionProp)
    const tracking = useHomeViewTracking()
    const viewAll = section.component?.behaviors?.viewAll

    const articles = extractNodes(section.artnetNewsArticlesConnection)

    const renderItem: ListRenderItem<ArtnetNewsArticle> = useCallback(
      ({ item, index: itemIndex }) => (
        <CardWithMetaData
          href={item.url}
          imageURL={item.image?.url}
          title={item.title}
          subtitle={item.publishedAt}
          tag={item.category?.name}
          onPress={() => {
            tracking.tappedArticleGroup(
              item.internalID,
              null,
              section.contextModule as ContextModule,
              itemIndex
            )
          }}
        />
      ),
      [section.contextModule, tracking]
    )

    if (!articles.length) {
      return null
    }

    const handleTitlePress = () => {
      if (viewAll?.href) {
        tracking.tappedArticleGroupViewAll(
          section.contextModule as ContextModule,
          viewAll?.ownerType as ScreenOwnerType
        )
      }
    }

    return (
      <Flex {...flexProps}>
        <SectionTitle
          capitalized={false}
          href={viewAll?.href}
          mx={2}
          onPress={handleTitlePress}
          title={section.component?.title ?? ""}
          subtitle={section.component?.description ?? ""}
        />

        <Flex>
          <FlatList
            horizontal
            showsHorizontalScrollIndicator={false}
            ListHeaderComponent={() => <Spacer x={2} />}
            ListFooterComponent={() => <Spacer x={2} />}
            ItemSeparatorComponent={() => <Spacer x={2} />}
            initialNumToRender={HORIZONTAL_FLATLIST_INTIAL_NUMBER_TO_RENDER_DEFAULT}
            windowSize={HORIZONTAL_FLATLIST_WINDOW_SIZE}
            data={articles}
            keyExtractor={(item) => `${item.internalID}`}
            renderItem={renderItem}
          />
        </Flex>

        <HomeViewSectionSentinel
          contextModule={section.contextModule as ContextModule}
          index={index}
        />
      </Flex>
    )
  }
)

const sectionFragment = graphql`
  fragment HomeViewSectionArtnetNews_section on HomeViewSectionArtnetNews {
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
    artnetNewsArticlesConnection(first: 10) {
      edges {
        node {
          internalID
          title
          url
          publishedAt(format: "MMM D, YYYY")
          category {
            name
          }
          image {
            url
          }
        }
      }
    }
  }
`

const homeViewSectionArtnetNewsQuery = graphql`
  query HomeViewSectionArtnetNewsQuery($id: String!) @cacheable {
    homeView {
      section(id: $id) {
        ...HomeViewSectionArtnetNews_section
      }
    }
  }
`

const HomeViewSectionArtnetNewsPlaceholder: React.FC<FlexProps> = (flexProps) => {
  const randomValue = useMemoizedRandom()
  return (
    <Skeleton>
      <Flex {...flexProps} mx={2}>
        <SkeletonText variant="sm-display">artnet News</SkeletonText>

        <Spacer y={2} />

        <Flex flexDirection="row">
          <Join separator={<Spacer x="15px" />}>
            {times(3 + randomValue * 10).map((index) => (
              <SkeletonArticleCard key={index} />
            ))}
          </Join>
        </Flex>
      </Flex>
    </Skeleton>
  )
}

export const HomeViewSectionArtnetNewsQueryRenderer: React.FC<SectionSharedProps> = withSuspense({
  Component: ({ sectionID, index, ...flexProps }) => {
    const data = useLazyLoadQuery<HomeViewSectionArtnetNewsQuery>(
      homeViewSectionArtnetNewsQuery,
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
      <HomeViewSectionArtnetNews section={data.homeView.section} index={index} {...flexProps} />
    )
  },
  LoadingFallback: HomeViewSectionArtnetNewsPlaceholder,
  ErrorFallback: NoFallback,
})
