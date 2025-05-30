import { ContextModule, ScreenOwnerType } from "@artsy/cohesion"
import { Flex, FlexProps, Join, Skeleton, SkeletonText, Spacer } from "@artsy/palette-mobile"
import { HomeViewSectionArticlesQuery } from "__generated__/HomeViewSectionArticlesQuery.graphql"
import { HomeViewSectionArticles_section$key } from "__generated__/HomeViewSectionArticles_section.graphql"
import { CardWithMetaDataSkeleton as SkeletonArticleCard } from "app/Components/Cards/CardWithMetaData"
import { ArticlesRail } from "app/Scenes/HomeView/Components/ArticlesRail"
import { HomeViewSectionSentinel } from "app/Scenes/HomeView/Components/HomeViewSectionSentinel"
import { SectionSharedProps } from "app/Scenes/HomeView/Sections/Section"
import { useHomeViewTracking } from "app/Scenes/HomeView/hooks/useHomeViewTracking"
import { NoFallback, withSuspense } from "app/utils/hooks/withSuspense"
import { useMemoizedRandom } from "app/utils/placeholders"
import { times } from "lodash"
import { memo } from "react"
import { graphql, useFragment, useLazyLoadQuery } from "react-relay"

interface HomeViewSectionArticlesProps {
  section: HomeViewSectionArticles_section$key
  index: number
}

export const HomeViewSectionArticles: React.FC<HomeViewSectionArticlesProps> = ({
  section: sectionProp,
  index,
  ...flexProps
}) => {
  const section = useFragment(sectionFragment, sectionProp)
  const tracking = useHomeViewTracking()
  const viewAll = section.component?.behaviors?.viewAll

  if (!section.articlesConnection) {
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
      <ArticlesRail
        articlesConnection={section.articlesConnection}
        onTitlePress={handleTitlePress}
        onPress={(article, index) => {
          tracking.tappedArticleGroup(
            article.internalID,
            article.slug,
            section.contextModule as ContextModule,
            index
          )
        }}
        title={section.component?.title ?? ""}
        subtitle={section.component?.description ?? ""}
        titleHref={viewAll?.href}
      />

      <HomeViewSectionSentinel
        contextModule={section.contextModule as ContextModule}
        index={index}
      />
    </Flex>
  )
}

const sectionFragment = graphql`
  fragment HomeViewSectionArticles_section on HomeViewSectionArticles {
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
    articlesConnection(first: 10) {
      ...ArticlesRail_articlesConnection
    }
  }
`

const homeViewSectionArticlesQuery = graphql`
  query HomeViewSectionArticlesQuery($id: String!) @cacheable {
    homeView {
      section(id: $id) {
        ...HomeViewSectionArticles_section
      }
    }
  }
`

const HomeViewSectionArticlesPlaceholder: React.FC<FlexProps> = (flexProps) => {
  const randomValue = useMemoizedRandom()
  return (
    <Skeleton>
      <Flex {...flexProps} mx={2}>
        <SkeletonText variant="sm-display">Artsy Editorial</SkeletonText>

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

export const HomeViewSectionArticlesQueryRenderer: React.FC<SectionSharedProps> = memo(
  withSuspense({
    Component: ({ sectionID, index, ...flexProps }) => {
      const data = useLazyLoadQuery<HomeViewSectionArticlesQuery>(
        homeViewSectionArticlesQuery,
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
        <HomeViewSectionArticles section={data.homeView.section} index={index} {...flexProps} />
      )
    },
    LoadingFallback: HomeViewSectionArticlesPlaceholder,
    ErrorFallback: NoFallback,
  })
)
