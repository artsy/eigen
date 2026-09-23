import { ActionType, ContextModule, OwnerType } from "@artsy/cohesion"
import { NoArtIcon } from "@artsy/icons/native"
import { Flex, Image, Text } from "@artsy/palette-mobile"
import { ArticleRow } from "app/Scenes/CityGuide/utils/CityGuideArticle"
import { RouterLink } from "app/system/navigation/RouterLink"
import { useTracking } from "react-tracking"

const IMAGE_SIZE = 50
const NO_ICON_SIZE = 20

export const CityArticleListItem: React.FC<{ item: ArticleRow; citySlug: string }> = ({
  item,
  citySlug,
}) => {
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
