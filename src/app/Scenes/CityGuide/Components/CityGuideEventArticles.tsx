import { ActionType, ContextModule, OwnerType } from "@artsy/cohesion"
import { NoArtIcon } from "@artsy/icons/native"
import { Flex, Image, Join, Separator, Text } from "@artsy/palette-mobile"
import { CityGuideEventArticles_city$key } from "__generated__/CityGuideEventArticles_city.graphql"
import { SectionTitle } from "app/Components/SectionTitle"
import { RouterLink } from "app/system/navigation/RouterLink"
import { graphql, useFragment } from "react-relay"
import { useTracking } from "react-tracking"

const IMAGE_SIZE = 50
const NO_ICON_SIZE = 20

interface ArticleRow {
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

const ArticleListItem = ({ item, citySlug }: { item: ArticleRow; citySlug: string }) => {
  const { trackEvent } = useTracking()

  return (
    // No `hasChildTouchable`: that mode clones onPress onto the child instead of rendering a
    // Touchable, and the child here is a styled View, which ignores it — the row would not be
    // pressable at all. Same reasoning as CityGuideEventGuides' guide rows.
    <RouterLink
      testID="event-article-row"
      to={item.href}
      onPress={() => trackEvent(tracks.tappedArticle(citySlug, item.articleId, item.slug))}
    >
      <Flex flexDirection="row" gap={1}>
        {item.imageUrl ? (
          <Image
            testID="event-article-image"
            src={item.imageUrl}
            width={IMAGE_SIZE}
            height={IMAGE_SIZE}
            resizeMode="cover"
          />
        ) : (
          <Flex
            testID="event-article-no-image"
            width={IMAGE_SIZE}
            height={IMAGE_SIZE}
            backgroundColor="mono10"
            alignItems="center"
            justifyContent="center"
          >
            <NoArtIcon width={NO_ICON_SIZE} height={NO_ICON_SIZE} fill="mono60" />
          </Flex>
        )}

        <Flex flex={1}>
          <Text variant="sm-display">{item.title}</Text>

          {!!item.byline && (
            <Text variant="xs" color="mono60">
              By {item.byline}
            </Text>
          )}

          {!!item.publishedAt && (
            <Text variant="xs" color="mono60">
              {item.publishedAt}
            </Text>
          )}
        </Flex>
      </Flex>
    </RouterLink>
  )
}

interface Props {
  citySlug: string
  city: CityGuideEventArticles_city$key | null | undefined
}

export const CityGuideEventArticles: React.FC<Props> = ({ citySlug, city: cityRef }) => {
  const city = useFragment(fragment, cityRef)

  // The join row's own position, not the order the field happened to return — the
  // attachments are reorderable in Forque, so this can't be assumed stable. Same as the
  // itinerary attachments in CityGuideEventGuides.
  const rows: ArticleRow[] = [...(city?.cityArticles ?? [])]
    .sort((a, b) => a.position - b.position)
    .map((attachment) => ({
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

  // Metaphysics already drops attachments whose article is unpublished or deleted, so a city
  // with articles attached can still arrive here with none to show. Hide the heading too.
  if (!rows.length) {
    return null
  }

  return (
    <Flex testID="city-guide-event-articles" px={2}>
      {/* Text, not a tap target: the designs give this section no chevron. */}
      <SectionTitle variant="large" title="Artsy Editorial" />

      <Join separator={<Separator my={2} />}>
        {rows.map((item) => (
          <ArticleListItem key={item.id} item={item} citySlug={citySlug} />
        ))}
      </Join>
    </Flex>
  )
}

const fragment = graphql`
  fragment CityGuideEventArticles_city on City {
    cityArticles {
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
        thumbnailImage {
          url
        }
      }
    }
  }
`

const tracks = {
  tappedArticle: (citySlug: string, articleId: string, slug: string) => ({
    action: ActionType.tappedArticleGroup,
    context_module: ContextModule.articles,
    context_screen_owner_type: OwnerType.cityGuide,
    context_screen_owner_slug: citySlug,
    destination_screen_owner_type: OwnerType.article,
    destination_screen_owner_id: articleId,
    destination_screen_owner_slug: slug,
  }),
}
