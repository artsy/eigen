import { CityGuideArticleRow_article$key } from "__generated__/CityGuideArticleRow_article.graphql"
import {
  CityGuideArticle_articles$data,
  CityGuideArticle_articles$key,
} from "__generated__/CityGuideArticle_articles.graphql"
import { graphql } from "react-relay"

/**
 * The fields `CityArticleListItem` renders for a row, shared by the curated rows (via
 * `CityArticle.article`) and the recommended rows (an `Article` directly).
 */
export const cityGuideArticleRowFragment = graphql`
  fragment CityGuideArticleRow_article on Article {
    internalID
    slug
    title
    thumbnailTitle
    byline
    href
    publishedAt(format: "MMMM D, YYYY")
    thumbnailImage {
      url
    }
  }
`

/**
 * Shared shape for an article row across the City Guide home section and its full-list
 * screen. Spread on `cityArticles`, then unmask the array with
 * `useFragment(cityGuideArticleFragment, city.cityArticles)`.
 */
export const cityGuideArticleFragment = graphql`
  fragment CityGuideArticle_articles on CityArticle @relay(plural: true) {
    internalID
    position
    article {
      internalID
      ...CityGuideArticleRow_article
    }
  }
`

/** A typed stand-in for `cityArticles` when the parent fragment/query hasn't resolved a city. */
export const NO_CITY_ARTICLES: CityGuideArticle_articles$key = []

export interface CityArticleRow {
  /** The attachment's own id, which is what makes a row unique when one article is attached twice. */
  id: string
  /** The article's own id, used to tell curated apart from recommended rows in the connection. */
  articleInternalID: string
  article: CityGuideArticleRow_article$key & { internalID: string }
}

/**
 * The join row's own position, not the order the field happened to return — the attachments
 * are reorderable in Forque, so this can't be assumed stable. Same as the itinerary
 * attachments in CityGuideEventGuides.
 */
export const toArticleRows = (attachments: CityGuideArticle_articles$data): CityArticleRow[] =>
  [...attachments]
    .sort((a, b) => a.position - b.position)
    .map((attachment) => ({
      id: attachment.internalID,
      articleInternalID: attachment.article.internalID,
      article: attachment.article,
    }))
