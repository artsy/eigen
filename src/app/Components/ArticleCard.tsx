import { Spacer, Flex, useTheme, Text } from "@artsy/palette-mobile"
import { ArticleCard_article$data } from "__generated__/ArticleCard_article.graphql"
import { OpaqueImageView } from "app/Components/OpaqueImageView2"
import { navigate } from "app/system/navigation/navigate"
import { DateTime } from "luxon"
import {
  GestureResponderEvent,
  TouchableWithoutFeedback,
  useWindowDimensions,
  View,
  ViewProps,
} from "react-native"
import { createFragmentContainer, graphql } from "react-relay"

const WIDTH = 295
const HEIGHT = 230

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

  return (
    <Flex width={isFluid ? "100%" : WIDTH}>
      <TouchableWithoutFeedback onPress={onTap} testID="article-card">
        <Flex width={isFluid ? "100%" : WIDTH} overflow="hidden">
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
              <OpaqueImageView imageURL={imageURL} width={WIDTH} height={HEIGHT} />
            ))}
          <Spacer y={1} />
          <Text variant="xs">{article.vertical || " "}</Text>
          <Text numberOfLines={3} ellipsizeMode="tail" variant="lg-display">
            {article.thumbnailTitle}
          </Text>
          {!!article.byline && (
            <Text color="black100" variant="xs" mt={0.5}>
              {article.byline}
            </Text>
          )}
          {!!article.publishedAt && (
            <Text color="black60" variant="xs" mt={0.5}>
              {DateTime.fromISO(article.publishedAt).toFormat("MMM d, yyyy")}
            </Text>
          )}
        </Flex>
      </TouchableWithoutFeedback>
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
