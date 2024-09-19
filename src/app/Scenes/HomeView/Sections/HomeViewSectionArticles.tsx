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
import { HomeViewSectionArticlesQuery } from "__generated__/HomeViewSectionArticlesQuery.graphql"
import { HomeViewSectionArticles_section$key } from "__generated__/HomeViewSectionArticles_section.graphql"
import { ARTICLE_CARD_IMAGE_HEIGHT, ARTICLE_CARD_IMAGE_WIDTH } from "app/Components/ArticleCard"
import { ArticlesRailFragmentContainer } from "app/Scenes/Home/Components/ArticlesRail"
import { HOME_VIEW_SECTIONS_SEPARATOR_HEIGHT } from "app/Scenes/HomeView/HomeView"
import { useHomeViewTracking } from "app/Scenes/HomeView/useHomeViewTracking"
import { navigate } from "app/system/navigation/navigate"
import { withSuspense } from "app/utils/hooks/withSuspense"
import { useMemoizedRandom } from "app/utils/placeholders"
import { times } from "lodash"
import { graphql, useFragment, useLazyLoadQuery } from "react-relay"

interface HomeViewSectionArticlesProps {
  section: HomeViewSectionArticles_section$key
}

export const HomeViewSectionArticles: React.FC<HomeViewSectionArticlesProps> = ({
  section: sectionProp,
  ...flexProps
}) => {
  const section = useFragment(sectionFragment, sectionProp)
  const tracking = useHomeViewTracking()
  const viewAll = section.component?.behaviors?.viewAll

  if (!section.articlesConnection) {
    return null
  }

  const onSectionViewAll = () => {
    if (viewAll?.href) {
      tracking.tappedArticleGroupViewAll(
        section.contextModule as ContextModule,
        viewAll?.ownerType as ScreenOwnerType
      )

      navigate(viewAll.href)
    }
  }

  return (
    <Flex {...flexProps}>
      <ArticlesRailFragmentContainer
        title={section.component?.title ?? ""}
        articlesConnection={section.articlesConnection}
        onTrack={(article, index) => {
          tracking.tappedArticleGroup(
            article.internalID,
            article.slug,
            section.contextModule as ContextModule,
            index
          )
        }}
        onSectionTitlePress={viewAll ? onSectionViewAll : undefined}
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
  query HomeViewSectionArticlesQuery($id: String!) {
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
      <Flex {...flexProps}>
        <Flex mx={2} my={HOME_VIEW_SECTIONS_SEPARATOR_HEIGHT}>
          <SkeletonText variant="lg-display">Artsy Editorial</SkeletonText>

          <Spacer y={2} />

          <Flex flexDirection="row">
            <Join separator={<Spacer x="15px" />}>
              {times(3 + randomValue * 10).map((index) => (
                <Flex key={index} maxWidth={ARTICLE_CARD_IMAGE_WIDTH}>
                  <SkeletonBox
                    key={index}
                    height={ARTICLE_CARD_IMAGE_HEIGHT}
                    width={ARTICLE_CARD_IMAGE_WIDTH}
                  />
                  <Spacer y={1} />
                  <SkeletonText variant="xs">Art Market</SkeletonText>
                  <SkeletonText variant="lg-display" numberOfLines={3}>
                    10 Shows we suggest you don't miss during Berlin Art Week
                  </SkeletonText>
                  <SkeletonText variant="xs" numberOfLines={1} mt={0.5}>
                    Article Author
                  </SkeletonText>
                  <SkeletonText variant="xs" numberOfLines={1} mt={0.5}>
                    Sep 10, 2024
                  </SkeletonText>
                </Flex>
              ))}
            </Join>
          </Flex>
        </Flex>
      </Flex>
    </Skeleton>
  )
}

interface HomeViewSectionArticlesQueryRendererProps extends FlexProps {
  sectionID: string
}

export const HomeViewSectionArticlesQueryRenderer: React.FC<HomeViewSectionArticlesQueryRendererProps> =
  withSuspense(({ sectionID, ...flexProps }) => {
    const data = useLazyLoadQuery<HomeViewSectionArticlesQuery>(homeViewSectionArticlesQuery, {
      id: sectionID,
    })

    if (!data.homeView.section) {
      return null
    }

    return <HomeViewSectionArticles section={data.homeView.section} {...flexProps} />
  }, HomeViewSectionArticlesPlaceholder)
