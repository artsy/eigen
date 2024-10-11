import { Spacer, Flex, useTheme, Text, Touchable, SkeletonBox, SkeletonText } from "@artsy/palette-mobile"
import { ArticleCard_article$data } from "__generated__/ArticleCard_article.graphql"
import { OpaqueImageView } from "app/Components/OpaqueImageView2"
import { navigate } from "app/system/navigation/navigate"
import { compact } from "lodash"
import { DateTime } from "luxon"
import { GestureResponderEvent, useWindowDimensions, View, ViewProps } from "react-native"
import { createFragmentContainer, graphql } from "react-relay"

export const ARTICLE_CARD_IMAGE_WIDTH = 295
export const ARTICLE_CARD_IMAGE_HEIGHT = 230

interface ArticleCardProps extends ViewProps {
  article: ArticleCard_article$data
  isFluid?: boolean
  onPress?(event: GestureResponderEvent): void
}

export const ArticleCard: React.FC<ArticleCardProps> = ({ article, onPress, isFluid }) => {
  const imageURL = article.thumbnailImage?.url

  const onTap = (event: GestureResponderEvent) => {
    onPress?.(event)
    if (article.href) {
      navigate(article.href)
    }
  }

  const { space } = useTheme()
  const { width } = useWindowDimensions()

  const formattedPublishedAt =
    article.publishedAt && DateTime.fromISO(article.publishedAt).toFormat("MMM d, yyyy")

  const formattedVerticalAndDate = compact([article.vertical, formattedPublishedAt]).join(" • ")

  return (
    <Flex width={isFluid ? "100%" : ARTICLE_CARD_IMAGE_WIDTH}>
      <Touchable onPress={onTap} testID="article-card">
        <Flex width={isFluid ? "100%" : ARTICLE_CARD_IMAGE_WIDTH} overflow="hidden">
          {!!imageURL &&
            (isFluid ? (
              <>
                <View style={{ width }}>
                  <OpaqueImageView
                    imageURL={imageURL}
                    // aspect ratio is fixed to 1.33 to match the old image aspect ratio
                    aspectRatio={1.33}
                    // 40 here comes from the mx={2} from the parent component
                    width={width - 2 * space(2)}
                  />
                </View>
              </>
            ) : (
              <OpaqueImageView
                imageURL={imageURL}
                width={ARTICLE_CARD_IMAGE_WIDTH}
                height={ARTICLE_CARD_IMAGE_HEIGHT}
              />
            ))}
          <Spacer y={1} />
          <Text numberOfLines={2} ellipsizeMode="tail" variant="sm-display" mb={0.5}>
            {article.thumbnailTitle}
          </Text>
          {!!article.byline && (
            <Text color="black60" variant="xs">
              {article.byline}
            </Text>
          )}
          {!!article.publishedAt && (
            <Text color="black100" variant="xs">
              {formattedVerticalAndDate}
            </Text>
          )}
        </Flex>
      </Touchable>
    </Flex>
  )
}

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

export const SkeletonArticleCard: React.FC = () => (
  <Flex maxWidth={ARTICLE_CARD_IMAGE_WIDTH}>
    <SkeletonBox
      height={ARTICLE_CARD_IMAGE_HEIGHT}
      width={ARTICLE_CARD_IMAGE_WIDTH}
    />
    <Spacer y={1} />
    <SkeletonText variant="lg-display" mb={0.5}>
      10 Shows we suggest you don't miss during Berlin Art Week
    </SkeletonText>

    <SkeletonText variant="xs" numberOfLines={1}>
      Article Author
    </SkeletonText>
    <SkeletonText variant="xs" numberOfLines={1}>
      Art • Sep 10, 2024
    </SkeletonText>
  </Flex>
)