import { ContextModule, ScreenOwnerType } from "@artsy/cohesion"
import {
  Flex,
  FlexProps,
  Separator,
  Skeleton,
  SkeletonBox,
  SkeletonText,
  Text,
} from "@artsy/palette-mobile"
import { HomeViewSectionArticlesCardsQuery } from "__generated__/HomeViewSectionArticlesCardsQuery.graphql"
import {
  HomeViewSectionArticlesCards_section$data,
  HomeViewSectionArticlesCards_section$key,
} from "__generated__/HomeViewSectionArticlesCards_section.graphql"
import { HomeViewSectionSentinel } from "app/Scenes/HomeView/Components/HomeViewSectionSentinel"
import { SectionSharedProps } from "app/Scenes/HomeView/Sections/Section"
import { useHomeViewTracking } from "app/Scenes/HomeView/hooks/useHomeViewTracking"
import { RouterLink } from "app/system/navigation/RouterLink"
import { extractNodes } from "app/utils/extractNodes"
import { NoFallback, withSuspense } from "app/utils/hooks/withSuspense"
import { ExtractNodeType } from "app/utils/relayHelpers"
import { times } from "lodash"
import { memo } from "react"
import { graphql, useFragment, useLazyLoadQuery } from "react-relay"

interface HomeViewSectionArticlesCardsProps {
  section: HomeViewSectionArticlesCards_section$key
  index: number
}

type ArticleType = ExtractNodeType<
  HomeViewSectionArticlesCards_section$data["cardArticlesConnection"]
>

export const HomeViewSectionArticlesCards: React.FC<HomeViewSectionArticlesCardsProps> = ({
  section: sectionProp,
  index,
  ...flexProps
}) => {
  const section = useFragment(fragment, sectionProp)
  const articles = extractNodes(section.cardArticlesConnection)
  const viewAll = section.component?.behaviors?.viewAll

  const tracking = useHomeViewTracking()

  const onItemPress = (article: ArticleType, index: number) => {
    if (article.href) {
      tracking.tappedArticleGroup(
        article.internalID,
        article.slug,
        section.contextModule as ContextModule,
        index
      )
    }
  }

  const onViewAllPress = () => {
    if (viewAll?.href) {
      tracking.tappedArticleGroupViewAll(
        section.contextModule as ContextModule,
        viewAll?.ownerType as ScreenOwnerType
      )
    }
  }

  return (
    <Flex {...flexProps}>
      <Flex mx={2} p={2} border="1px solid" borderColor="mono30" gap={2}>
        <Flex flexDirection="row" justifyContent="space-between" alignItems="center">
          <Text variant="lg-display">{section.component?.title}</Text>
          <Text variant="lg-display">{date()}</Text>
        </Flex>
        {articles.map((article, index) => (
          <Flex key={index} gap={2}>
            <RouterLink onPress={() => onItemPress(article, index)} to={article.href}>
              <Flex flexDirection="row" alignItems="center">
                <Text variant="sm-display" numberOfLines={3}>
                  {article.title}
                </Text>
              </Flex>
            </RouterLink>
            {index !== articles.length - 1 && <Separator />}
          </Flex>
        ))}
        {!!viewAll && (
          <RouterLink onPress={onViewAllPress} to={viewAll.href}>
            <Flex flexDirection="row" justifyContent="flex-end">
              <Text variant="sm-display">{viewAll.buttonText}</Text>
            </Flex>
          </RouterLink>
        )}
      </Flex>

      <HomeViewSectionSentinel
        contextModule={section.contextModule as ContextModule}
        index={index}
      />
    </Flex>
  )
}

const date = () =>
  new Date().toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  })

const fragment = graphql`
  fragment HomeViewSectionArticlesCards_section on HomeViewSectionArticles {
    internalID
    contextModule
    component {
      title
      behaviors {
        viewAll {
          buttonText
          href
          ownerType
        }
      }
    }

    cardArticlesConnection: articlesConnection(first: 3) {
      edges {
        node {
          href
          internalID
          slug
          title
        }
      }
    }
  }
`

const HomeViewSectionArticlesCardsPlaceholder: React.FC<FlexProps> = (flexProps) => {
  return (
    <Skeleton>
      <Flex {...flexProps} testID="HomeViewSectionArticlesCardsPlaceholder">
        <Flex mx={2} p={2} border="1px solid" borderColor="mono30" gap={2}>
          <Flex flexDirection="row" justifyContent="space-between" alignItems="center">
            <SkeletonText variant="lg-display">title</SkeletonText>
            <SkeletonText variant="lg-display">2021-12-31</SkeletonText>
          </Flex>
          {times(3).map((_, index) => (
            <SkeletonBox key={index} gap={2}>
              <Flex flexDirection="row" alignItems="center">
                <SkeletonText variant="sm-display" numberOfLines={3}>
                  Larry Gagosian and Peter Doig to collaborate on a new exhibition.
                </SkeletonText>
              </Flex>
              {index !== 2 && <Separator />}
            </SkeletonBox>
          ))}
          <Flex flexDirection="row" justifyContent="flex-end">
            <SkeletonText variant="sm-display">More News</SkeletonText>
          </Flex>
        </Flex>
      </Flex>
    </Skeleton>
  )
}

const homeViewSectionArticlesCardsQuery = graphql`
  query HomeViewSectionArticlesCardsQuery($id: String!) @cacheable {
    homeView {
      section(id: $id) {
        ...HomeViewSectionArticlesCards_section
      }
    }
  }
`

export const HomeViewSectionArticlesCardsQueryRenderer: React.FC<SectionSharedProps> = memo(
  withSuspense({
    Component: ({ sectionID, index, ...flexProps }) => {
      const data = useLazyLoadQuery<HomeViewSectionArticlesCardsQuery>(
        homeViewSectionArticlesCardsQuery,
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
        <HomeViewSectionArticlesCards
          section={data.homeView.section}
          index={index}
          {...flexProps}
        />
      )
    },
    LoadingFallback: HomeViewSectionArticlesCardsPlaceholder,
    ErrorFallback: NoFallback,
  })
)
