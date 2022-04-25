import { ArticleCard_article } from "__generated__/ArticleCard_article.graphql"
import ImageView from "app/Components/OpaqueImageView/OpaqueImageView"
import { navigate } from "app/navigation/navigate"
import { Flex, Spacer, Text } from "palette"
import { GestureResponderEvent, TouchableWithoutFeedback, View, ViewProps } from "react-native"
import { createFragmentContainer, graphql } from "react-relay"

const WIDTH = 295
const HEIGHT = 230

interface ArticleCardProps extends ViewProps {
  article: ArticleCard_article
  isFluid?: boolean
  onPress?(event: GestureResponderEvent): void
}

export const ArticleCard: React.FC<ArticleCardProps> = ({ article, onPress, isFluid }) => {
  const imageURL = article.thumbnailImage?.url

  const onTap = (event: GestureResponderEvent) => {
    onPress?.(event)
    navigate(article.href!)
  }

  return (
    <Flex width={isFluid ? "100%" : WIDTH}>
      <TouchableWithoutFeedback onPress={onTap}>
        <Flex width={isFluid ? "100%" : WIDTH} overflow="hidden">
          {!!imageURL &&
            (isFluid ? (
              <View style={{ width: "100%", aspectRatio: 1.33, flexDirection: "row" }}>
                <ImageView imageURL={article.thumbnailImage?.url} style={{ flex: 1 }} />
              </View>
            ) : (
              <ImageView imageURL={article.thumbnailImage?.url} width={WIDTH} height={HEIGHT} />
            ))}
          <Spacer mb={1} />
          <Text variant="xs">{article.vertical || " "}</Text>
          <Text numberOfLines={3} ellipsizeMode="tail" variant="lg">
            {article.thumbnailTitle}
          </Text>
          {!!article.author && (
            <Text color="black60" variant="xs">
              {article.author.name}
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
      author {
        name
      }
      href
      thumbnailImage {
        url(version: "large")
      }
      thumbnailTitle
      vertical
    }
  `,
})
