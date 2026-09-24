import { ActionType, ContextModule, OwnerType } from "@artsy/cohesion"
import { NoArtIcon } from "@artsy/icons/native"
import { Flex, Image, Text } from "@artsy/palette-mobile"
import { CityGuideArticleRow_article$key } from "__generated__/CityGuideArticleRow_article.graphql"
import { cityGuideArticleRowFragment } from "app/Scenes/CityGuide/utils/CityGuideArticle"
import { RouterLink } from "app/system/navigation/RouterLink"
import { useFragment } from "react-relay"
import { useTracking } from "react-tracking"

const IMAGE_SIZE = 80
const NO_ICON_SIZE = 20

export const CityArticleListItem: React.FC<{
  article: CityGuideArticleRow_article$key
  citySlug: string
  contextModule?: ContextModule
}> = ({ article: articleRef, citySlug, contextModule = ContextModule.articles }) => {
  const { trackEvent } = useTracking()
  const article = useFragment(cityGuideArticleRowFragment, articleRef)

  // `thumbnailTitle` is what Positron wants shown on a link to the article; `title` is
  // the in-article headline, which can be longer.
  const title = article.thumbnailTitle ?? article.title ?? ""
  const imageUrl = article.thumbnailImage?.url

  return (
    // No `hasChildTouchable`: that mode clones onPress onto the child instead of rendering a
    // Touchable, and the child here is a styled View, which ignores it — the row would not be
    // pressable at all. Same reasoning as CityGuideEventGuides' guide rows.
    <RouterLink
      testID="event-article-row"
      to={article.href}
      onPress={() =>
        trackEvent(
          tracks.tappedArticle(citySlug, article.internalID, article.slug ?? "", contextModule)
        )
      }
    >
      <Flex flexDirection="row" gap={1}>
        {imageUrl ? (
          <Image
            testID="event-article-image"
            src={imageUrl}
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
          <Text variant="sm-display">{title}</Text>

          {!!article.byline && (
            <Text variant="xs" color="mono60">
              By {article.byline}
            </Text>
          )}

          {!!article.publishedAt && (
            <Text variant="xs" color="mono60">
              {article.publishedAt}
            </Text>
          )}
        </Flex>
      </Flex>
    </RouterLink>
  )
}

const tracks = {
  tappedArticle: (
    citySlug: string,
    articleId: string,
    slug: string,
    contextModule: ContextModule
  ) => ({
    action: ActionType.tappedArticleGroup,
    context_module: contextModule,
    context_screen_owner_type: OwnerType.cityGuide,
    context_screen_owner_slug: citySlug,
    destination_screen_owner_type: OwnerType.article,
    destination_screen_owner_id: articleId,
    destination_screen_owner_slug: slug,
  }),
}
