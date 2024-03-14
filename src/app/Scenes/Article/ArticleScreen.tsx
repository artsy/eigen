import { OwnerType } from "@artsy/cohesion"
import {
  Flex,
  Join,
  Screen,
  Skeleton,
  SkeletonBox,
  SkeletonText,
  Spacer,
} from "@artsy/palette-mobile"
import { ArticleScreenQuery } from "__generated__/ArticleScreenQuery.graphql"
import { ArticleBody } from "app/Scenes/Article/Components/ArticleBody"
import { ArticleRelatedArticlesRail } from "app/Scenes/Article/Components/ArticleRelatedArticlesRail"
import { ArticleShareButton } from "app/Scenes/Article/Components/ArticleShareButton"
import { ArticleWebViewScreen } from "app/Scenes/Article/Components/ArticleWebViewScreen"
import { useConditionalGoBack } from "app/system/newNavigation/useConditionalGoBack"
import { ProvideScreenTracking, Schema } from "app/utils/track"
import { Suspense } from "react"
import { graphql, useLazyLoadQuery } from "react-relay"

interface ArticleScreenProps {
  articleID: string
}

export const ArticleScreen: React.FC<ArticleScreenProps> = (props) => {
  return (
    <Suspense fallback={<Placeholder />}>
      <Article {...props} />
    </Suspense>
  )
}

const Article: React.FC<ArticleScreenProps> = (props) => {
  const data = useLazyLoadQuery<ArticleScreenQuery>(articleScreenQuery, {
    slug: props.articleID,
  })

  const goBack = useConditionalGoBack()

  if (!data.article) {
    return null
  }

  const NATIVE_LAYOUTS = ["STANDARD", "FEATURE"]

  const redirectToWebview = !NATIVE_LAYOUTS.includes(data.article.layout)

  if (redirectToWebview) {
    return <ArticleWebViewScreen article={data.article} />
  }

  const Header = data.article.layout === "FEATURE" ? Screen.FloatingHeader : Screen.AnimatedHeader

  return (
    <ProvideScreenTracking
      info={{
        context_screen: Schema.PageNames.ArticlePage,
        context_screen_owner_type: OwnerType.article,
        context_screen_owner_slug: data.article.slug ?? "",
        context_screen_owner_id: data.article.internalID,
      }}
    >
      <Screen>
        <Header
          rightElements={<ArticleShareButton article={data.article} />}
          onBack={goBack}
          top={0}
        />

        <Screen.Body fullwidth>
          <Screen.ScrollView>
            <ArticleBody article={data.article} />

            {data.article.relatedArticles.length > 0 && (
              <>
                <ArticleRelatedArticlesRail relatedArticles={data.article} my={2} />
              </>
            )}
          </Screen.ScrollView>
        </Screen.Body>
      </Screen>
    </ProvideScreenTracking>
  )
}

export const articleScreenQuery = graphql`
  query ArticleScreenQuery($slug: String!) {
    article(id: $slug) {
      ...ArticleShareButton_article
      ...ArticleWebViewScreen_article
      ...ArticleBody_article
      ...ArticleRelatedArticlesRail_article

      internalID
      href
      layout
      slug
      relatedArticles {
        internalID
      }
      title
    }
  }
`

const Placeholder: React.FC = () => {
  const goBack = useConditionalGoBack()
  return (
    <Screen testID="ArticleScreenPlaceholder">
      <Screen.Header rightElements={<ArticleShareButton article={null as any} />} onBack={goBack} />

      <Screen.Body fullwidth>
        <Skeleton>
          <Flex px={2}>
            <Join separator={<Spacer y={0.5} />}>
              <SkeletonText variant="xs">Art Vertical</SkeletonText>
              <SkeletonText variant="lg-display">Some Placeholder Title that wraps</SkeletonText>
              <SkeletonText variant="sm-display">Some Author</SkeletonText>
              <SkeletonText variant="xs" mt={1}>
                September 1st, 2021
              </SkeletonText>
            </Join>

            <Spacer y={2} />

            <SkeletonBox width="100%" height={400} />
          </Flex>
        </Skeleton>
      </Screen.Body>
    </Screen>
  )
}
