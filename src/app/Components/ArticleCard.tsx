import { ArticleCard_article$data } from "__generated__/ArticleCard_article.graphql"
import { CardWithMetaData } from "app/Components/Cards/CardWithMetaData"
import { compact } from "lodash"
import { DateTime } from "luxon"
import { memo } from "react"
import { GestureResponderEvent, ViewProps } from "react-native"
import { createFragmentContainer, graphql } from "react-relay"

export const ARTICLE_CARD_IMAGE_WIDTH = 295
export const ARTICLE_CARD_IMAGE_HEIGHT = 230

interface ArticleCardProps extends ViewProps {
  article: ArticleCard_article$data
  isFluid?: boolean
  onPress?(event: GestureResponderEvent): void
}

export const ArticleCard: React.FC<ArticleCardProps> = memo(({ article, onPress, isFluid }) => {
  const imageURL = article.thumbnailImage?.url

  const formattedPublishedAt =
    article.publishedAt && DateTime.fromISO(article.publishedAt).toFormat("MMM d, yyyy")

  const formattedVerticalAndDate = compact([article.vertical, formattedPublishedAt]).join(" • ")

  return (
    <CardWithMetaData
      testId="article-card"
      isFluid={isFluid}
      href={article.href}
      imageURL={imageURL}
      title={article.thumbnailTitle}
      subtitle={article.byline}
      tag={formattedVerticalAndDate}
      onPress={onPress}
    />
  )
})

export const ArticleCardContainer = createFragmentContainer(ArticleCard, {
  article: graphql`
    fragment ArticleCard_article on Article {
      internalID
      slug
      href
      publishedAt
      thumbnailImage {
        url(version: "large")
      }
      thumbnailTitle
      vertical
      byline
    }
  `,
})
