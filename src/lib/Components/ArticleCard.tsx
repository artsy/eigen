import { ArticleCard_article } from "__generated__/ArticleCard_article.graphql"
import ImageView from "lib/Components/OpaqueImageView/OpaqueImageView"
import { navigate } from "lib/navigation/navigate"
import { Flex, Spacer, Text } from "palette"
import React from "react"
import { GestureResponderEvent, TouchableWithoutFeedback, View, ViewProps } from "react-native"
import { createFragmentContainer, graphql } from "react-relay"

interface ArticleCardProps extends ViewProps {
  article: ArticleCard_article
  isRailCard?: boolean
  onPress?(event: GestureResponderEvent): void
}

export const ArticleCard: React.FC<ArticleCardProps> = ({ article, onPress, isRailCard = false }) => {
  const imageURL = article.thumbnailImage?.url

  const onTap = (event: GestureResponderEvent) => {
    console.log(article.href)
    onPress?.(event)
    navigate(article.href!)
  }

  return (
    <Flex width={isRailCard ? 320 : "100%"}>
      <TouchableWithoutFeedback onPress={onTap}>
        <Flex width={isRailCard ? 300 : "100%"} overflow="hidden">
          {!!imageURL &&
            (isRailCard ? (
              <ImageView imageURL={article.thumbnailImage?.url} width={295} height={230} />
            ) : (
              <View style={{ width: "100%", aspectRatio: 1.33, flexDirection: "row" }}>
                <ImageView imageURL={article.thumbnailImage?.url} style={{ flex: 1 }} />
              </View>
            ))}
          <Spacer mb={1} />
          <Text variant={"small"}>{article.vertical || " "}</Text>
          <Text numberOfLines={3} ellipsizeMode="tail" variant={"title"}>
            {article.thumbnailTitle}
          </Text>
          {!!article.author && (
            <Text color="black60" variant={"small"}>
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
