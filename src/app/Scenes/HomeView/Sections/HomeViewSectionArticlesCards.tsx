import { ContextModule, ScreenOwnerType } from "@artsy/cohesion"
import {
  Flex,
  Separator,
  Skeleton,
  SkeletonBox,
  SkeletonText,
  Text,
  Touchable,
  useSpace,
} from "@artsy/palette-mobile"
import { HomeViewSectionArticlesCardsQuery } from "__generated__/HomeViewSectionArticlesCardsQuery.graphql"
import { HomeViewSectionArticlesCards_section$data, HomeViewSectionArticlesCards_section$key } from "__generated__/HomeViewSectionArticlesCards_section.graphql"
import { HOME_VIEW_SECTIONS_SEPARATOR_HEIGHT } from "app/Scenes/HomeView/HomeView"
import { useHomeViewTracking } from "app/Scenes/HomeView/useHomeViewTracking"
import { navigate } from "app/system/navigation/navigate"
import { extractNodes } from "app/utils/extractNodes"
import { withSuspense } from "app/utils/hooks/withSuspense"
import { ExtractNodeType } from "app/utils/relayHelpers"
import { times } from "lodash"
import { graphql, useFragment, useLazyLoadQuery } from "react-relay"

interface HomeViewSectionArticlesCardsProps {
  section: HomeViewSectionArticlesCards_section$key
}

type ArticleType = ExtractNodeType<
  HomeViewSectionArticlesCards_section$data["cardArticlesConnection"]
>

export const HomeViewSectionArticlesCards: React.FC<HomeViewSectionArticlesCardsProps> = (
  props
) => {
  const section = useFragment(fragment, props.section)
  const articles = extractNodes(section.cardArticlesConnection)
  const viewAll = section.component?.behaviors?.viewAll

  const tracking = useHomeViewTracking()

  const space = useSpace()

  const onItemPress = (article: ArticleType) => {
    if (article.href) {
      navigate(article.href)
    }
  }

  const onSectionTitlePress = (href: string | null | undefined) => {
    tracking.tappedArticleGroupViewAll(
      section.contextModule as ContextModule,
      "marketNews" as ScreenOwnerType
    )

    if (href) {
      navigate(href)
    }
  }

  return (
    <Flex
      my={HOME_VIEW_SECTIONS_SEPARATOR_HEIGHT}
      mx={2}
      p={2}
      border="1px solid"
      borderColor="black30"
      gap={space(2)}
    >
      <Flex flexDirection="row" justifyContent="space-between" alignItems="center">
        <Text variant="lg-display">{section.component?.title}</Text>
        <Text variant="lg-display">{date()}</Text>
      </Flex>
      {articles.map((article, index) => (
        <Flex key={index} gap={space(2)}>
          <Touchable onPress={() => onItemPress(article)}>
            <Flex flexDirection="row" alignItems="center">
              <Text variant="sm-display" numberOfLines={3}>
                {article.title}
              </Text>
            </Flex>
          </Touchable>
          {index !== articles.length - 1 && <Separator />}
        </Flex>
      ))}
      {!!viewAll && (
        <Touchable onPress={() => onSectionTitlePress(viewAll.href)}>
          <Flex flexDirection="row" justifyContent="flex-end">
            <Text variant="sm-display">{viewAll.buttonText}</Text>
          </Flex>
        </Touchable>
      )}
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
    contextModule
    component {
      title
      behaviors {
        viewAll {
          href
          buttonText
        }
      }
    }

    cardArticlesConnection: articlesConnection(first: 3) {
      edges {
        node {
          title
          href
        }
      }
    }
  }
`

const HomeViewSectionArticlesCardsPlaceholder: React.FC = () => {
  const space = useSpace()
  return (
    <Skeleton>
      <Flex
        my={HOME_VIEW_SECTIONS_SEPARATOR_HEIGHT}
        mx={2}
        p={2}
        border="1px solid"
        borderColor="black30"
        gap={space(2)}
      >
        <Flex flexDirection="row" justifyContent="space-between" alignItems="center">
          <SkeletonText variant="lg-display">title</SkeletonText>
          <SkeletonText variant="lg-display">2021-12-31</SkeletonText>
        </Flex>
        {times(3).map((_, index) => (
          <SkeletonBox key={index} gap={space(2)}>
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
    </Skeleton>
  )
}

const homeViewSectionArticlesCardsQuery = graphql`
  query HomeViewSectionArticlesCardsQuery($id: String!) {
    homeView {
      section(id: $id) {
        ...HomeViewSectionArticlesCards_section
      }
    }
  }
`

export const HomeViewSectionArticlesCardsQueryRenderer: React.FC<{
  sectionID: string
}> = withSuspense((props) => {
  const data = useLazyLoadQuery<HomeViewSectionArticlesCardsQuery>(
    homeViewSectionArticlesCardsQuery,
    {
      id: props.sectionID,
    }
  )

  if (!data.homeView.section) {
    return null
  }

  return <HomeViewSectionArticlesCards section={data.homeView.section} />
}, HomeViewSectionArticlesCardsPlaceholder)
