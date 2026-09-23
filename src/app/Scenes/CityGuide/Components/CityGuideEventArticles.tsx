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

  // Metaphysics already drops attachments whose article is unpublished or deleted, so a city
  // with articles attached can still arrive here with none to show. Hide the heading too.
  if (!rows.length) {
    return null
  }

  const hasMore = rows.length > MAX_VISIBLE_ARTICLES

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
        {rows.slice(0, MAX_VISIBLE_ARTICLES).map((item) => (
          <CityArticleListItem key={item.id} item={item} citySlug={citySlug} />
        ))}
      </Join>
    </Flex>
  )
}

const fragment = graphql`
  fragment CityGuideEventArticles_city on City {
    cityArticles {
      ...CityGuideArticle_articles
    }
  }
`
