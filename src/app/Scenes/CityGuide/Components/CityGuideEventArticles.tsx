import { ContextModule } from "@artsy/cohesion"
import { Flex, Join, Separator } from "@artsy/palette-mobile"
import { CityGuideArticle_articles$key } from "__generated__/CityGuideArticle_articles.graphql"
import { CityGuideEventArticles_city$key } from "__generated__/CityGuideEventArticles_city.graphql"
import { SectionTitle } from "app/Components/SectionTitle"
import { CityArticleListItem } from "app/Scenes/CityGuide/Components/CityArticleListItem"
import {
  cityGuideArticleFragment,
  NO_CITY_ARTICLES,
  toArticleRows,
} from "app/Scenes/CityGuide/utils/CityGuideArticle"
import { extractNodes } from "app/utils/extractNodes"
import { Schema } from "app/utils/track"
import { graphql, useFragment } from "react-relay"
import { useTracking } from "react-tracking"

const MAX_VISIBLE_ARTICLES = 4

interface Props {
  citySlug: string
  city: CityGuideEventArticles_city$key | null | undefined
}

export const CityGuideEventArticles: React.FC<Props> = ({ citySlug, city: cityRef }) => {
  const { trackEvent } = useTracking<Schema.Entity>()
  const city = useFragment(fragment, cityRef)
  const attachments = useFragment<CityGuideArticle_articles$key>(
    cityGuideArticleFragment,
    city?.cityArticles ?? NO_CITY_ARTICLES
  )
  const rows = toArticleRows(attachments)

  // The connection is only requested when the flag is on, so its presence tells us which
  // path we're on. When it's there, Metaphysics has already merged and sorted curated and
  // recommended articles into one list, capped to the section's 4 slots.
  const connection = city?.recommendedArticlesConnection
  const curatedIds = new Set(rows.map((row) => row.articleInternalID))

  const visible = connection
    ? extractNodes(connection).map((article) => ({
        key: article.internalID,
        article,
        contextModule: curatedIds.has(article.internalID)
          ? ContextModule.articles
          : ContextModule.relatedArticles,
      }))
    : rows.slice(0, MAX_VISIBLE_ARTICLES).map((row) => ({
        key: row.id,
        article: row.article,
        contextModule: undefined,
      }))

  // Metaphysics already drops attachments whose article is unpublished or deleted, so a city
  // with articles attached can still arrive here with none to show. Hide the heading too.
  if (!visible.length) {
    return null
  }

  const hasMore = connection
    ? !!connection.pageInfo.hasNextPage || (connection.totalCount ?? 0) > MAX_VISIBLE_ARTICLES
    : rows.length > MAX_VISIBLE_ARTICLES

  return (
    <Flex testID="city-guide-event-articles" px={2}>
      <SectionTitle
        variant="large"
        title="Artsy Editorial"
        href={hasMore ? `/city-guide/${citySlug}/articles` : undefined}
        onPress={
          hasMore
            ? () => {
                trackEvent({
                  action_name: Schema.ActionNames.ViewAll,
                  action_type: Schema.ActionTypes.Tap,
                  owner_type: Schema.OwnerEntityTypes.CityGuide,
                  owner_slug: citySlug,
                  context_module: "articles",
                })
              }
            : undefined
        }
      />

      <Join separator={<Separator my={2} />}>
        {visible.map(({ key, article, contextModule }) => (
          <CityArticleListItem
            key={key}
            article={article}
            citySlug={citySlug}
            contextModule={contextModule}
          />
        ))}
      </Join>
    </Flex>
  )
}

const fragment = graphql`
  fragment CityGuideEventArticles_city on City
  @argumentDefinitions(enableArticlesForYou: { type: "Boolean!", defaultValue: false }) {
    # Only used to tag which of the connection's rows are curated for tracking; Metaphysics
    # shares the loader with the connection below, so this doesn't cost an extra request.
    cityArticles {
      ...CityGuideArticle_articles
    }
    recommendedArticlesConnection(first: 4, includeFeatured: true)
      @include(if: $enableArticlesForYou) {
      totalCount
      pageInfo {
        hasNextPage
      }
      edges {
        node {
          internalID
          ...CityGuideArticleRow_article
        }
      }
    }
  }
`
