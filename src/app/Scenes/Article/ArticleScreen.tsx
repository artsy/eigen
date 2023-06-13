import { Screen, ShareIcon, Spacer } from "@artsy/palette-mobile"
import { ArticleScreenQuery } from "__generated__/ArticleScreenQuery.graphql"
import { ArticleBody } from "app/Scenes/Article/Components/ArticleBody"
import { RelatedArticlesRail } from "app/Scenes/Article/Components/RelatedArticlesRail"
import { goBack } from "app/system/navigation/navigate"
import { PlaceholderGrid, ProvidePlaceholderContext } from "app/utils/placeholders"
import { Suspense } from "react"
import { TouchableWithoutFeedback } from "react-native"
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

  if (!data.article) {
    return null
  }

  const hasRelatedArticles = data.article.relatedArticles.length > 0

  return (
    <Screen>
      <Screen.AnimatedHeader
        title={data.article.title ?? ""}
        // FIXME: Why do right elements not appear?
        rightElements={ShareButton}
        onBack={goBack}
      />
      <Screen.Body pb={2}>
        <Screen.ScrollView>
          <ArticleBody article={data.article} />

          {!!hasRelatedArticles && (
            <>
              <Spacer y={2} />

              <RelatedArticlesRail relatedArticles={data.article} />
            </>
          )}
        </Screen.ScrollView>
      </Screen.Body>
    </Screen>
  )
}

const ShareButton = () => {
  // TODO: Implement share button
  const handleSharePress = () => {
    //
  }

  return (
    <TouchableWithoutFeedback onPress={() => handleSharePress} testID="share-button">
      <ShareIcon fill="black100" height="25px" width="100%" />
    </TouchableWithoutFeedback>
  )
}

export const articleScreenQuery = graphql`
  query ArticleScreenQuery($slug: String!) {
    article(id: $slug) {
      ...ArticleBody_article
      ...RelatedArticlesRail_articles
      title
      relatedArticles {
        internalID
      }
    }
  }
`

const Placeholder: React.FC = () => {
  return (
    <ProvidePlaceholderContext>
      <PlaceholderGrid />
    </ProvidePlaceholderContext>
  )
}
