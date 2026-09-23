import {
  CityGuideArticle_articles$data,
  CityGuideArticle_articles$key,
} from "__generated__/CityGuideArticle_articles.graphql"
import { graphql } from "react-relay"

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
      slug
      title
      thumbnailTitle
      byline
      href
      publishedAt(format: "MMMM D, YYYY")
      publishedAtISO: publishedAt
      thumbnailImage {
        url
      }
    }
  }
`

/** A typed stand-in for `cityArticles` when the parent fragment/query hasn't resolved a city. */
export const NO_CITY_ARTICLES: CityGuideArticle_articles$key = []

export interface ArticleRow {
  /** The attachment's own id, which is what makes a row unique when one article is attached twice. */
  id: string
  articleId: string
  slug: string
  title: string
  byline: string
  publishedAt: string
  href: string
  imageUrl: string
}

/**
 * Newest published article first. `position` is just Gravity's attach-order counter — Forque
 * has no reorder UI, so it never reflects curator intent — it's only used to keep ties (equal
 * or missing `publishedAt`) in a stable order instead of Gravity's own row order.
 */
const compareByPublishedAtThenPosition = (
  a: CityGuideArticle_articles$data[number],
  b: CityGuideArticle_articles$data[number]
): number => {
  const aDate = a.article.publishedAtISO
  const bDate = b.article.publishedAtISO

  if (aDate && bDate && aDate !== bDate) {
    return aDate > bDate ? -1 : 1
  }

  if (!aDate !== !bDate) {
    return aDate ? -1 : 1
  }

  return a.position - b.position
}

export const toArticleRows = (attachments: CityGuideArticle_articles$data): ArticleRow[] =>
  [...attachments].sort(compareByPublishedAtThenPosition).map((attachment) => ({
    id: attachment.internalID,
    articleId: attachment.article.internalID,
    slug: attachment.article.slug ?? "",
    // `thumbnailTitle` is what Positron wants shown on a link to the article; `title` is
    // the in-article headline, which can be longer.
    title: attachment.article.thumbnailTitle ?? attachment.article.title ?? "",
    byline: attachment.article.byline ?? "",
    publishedAt: attachment.article.publishedAt ?? "",
    href: attachment.article.href ?? "",
    imageUrl: attachment.article.thumbnailImage?.url ?? "",
  }))
